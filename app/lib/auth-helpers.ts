import { cookies } from 'next/headers'
import { supabaseAdmin } from './supabaseAdmin'

export type SessionUser = {
  id: string
  email?: string
  name?: string
  company_id?: string
  company_name?: string
  role: 'user' | 'admin'
  is_first_login?: boolean
}

/**
 * Get the current session user from Supabase Auth (Server-side for API routes)
 */
export async function getSessionUser(request?: Request): Promise<SessionUser | null> {
  try {
    // For API routes, we need to get cookies from headers
    let cookieHeader = ''
    
    if (request) {
      // API route context - get from request headers
      cookieHeader = request.headers.get('cookie') || ''
    } else {
      // Server component context - use cookies() function
      try {
        const cookieStore = cookies()
        const allCookies = cookieStore.getAll()
        cookieHeader = allCookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ')
      } catch (err) {
        console.warn('Could not access cookies store:', err)
        return null
      }
    }

    console.log('🍪 Cookie header length:', cookieHeader.length > 0 ? 'Found' : 'Empty')

    // Create server client with cookies
    const { createServerClient } = await import('@supabase/ssr')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    // Parse cookies from header - better handling
    const parseCookies = (cookieHeader: string) => {
      const cookies: Record<string, string> = {}
      if (cookieHeader) {
        cookieHeader.split(';').forEach(cookie => {
          const equalIndex = cookie.indexOf('=')
          if (equalIndex > 0) {
            const name = cookie.slice(0, equalIndex).trim()
            const value = cookie.slice(equalIndex + 1).trim()
            if (name && value) {
              try {
                cookies[name] = decodeURIComponent(value)
              } catch (err) {
                // If decoding fails, use raw value
                cookies[name] = value
              }
            }
          }
        })
      }
      return cookies
    }

    const cookiesMap = parseCookies(cookieHeader)
    console.log('🍪 Parsed cookies count:', Object.keys(cookiesMap).length)
    
    // Log Supabase auth cookies specifically
    const authCookies = Object.keys(cookiesMap).filter(key => 
      key.includes('supabase') || key.includes('auth')
    )
    console.log('🔐 Auth cookies found:', authCookies.length, authCookies)
    
    const supabaseServer = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return cookiesMap[name]
          },
          set(name: string, value: string, options: any) {
            // Can't set cookies in API routes without response object
            console.log('Setting cookie (server):', name)
          },
          remove(name: string, options: any) {
            // Can't remove cookies in API routes without response object
            console.log('Removing cookie (server):', name)
          },
        },
      }
    )

    // Support Authorization: Bearer <token> header as a fallback to cookies
    let bearer: string | undefined
    if (request) {
      const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || ''
      if (authHeader.toLowerCase().startsWith('bearer ')) bearer = authHeader.slice(7)
    }
    const { data: { user }, error } = await supabaseServer.auth.getUser(bearer)

    if (error || !user) {
      console.log('❌ No authenticated user found (server-side):', error?.message)
      return null
    }

    console.log('✅ Server-side user found:', user.email)

    // Get user profile from database
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select(`
        *,
        company:companies(*)
      `)
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.warn('⚠️ Profile not found for user:', user.id, profileError.message)
      return {
        id: user.id,
        email: user.email || '',
        name: user.email || '',
        company_id: undefined,
        company_name: undefined,
        role: 'user'
      }
    }

    console.log('✅ Profile found with role:', profile.role)

    return {
      id: user.id,
      email: user.email || '',
      name: profile.name || user.email || '',
      company_id: profile.company_id,
      company_name: profile.company?.name,
      role: profile.role || 'user'
    }
  } catch (error) {
    console.error('❌ Server-side session user error:', error)
    return null
  }
}

/**
 * Create a session (handled by Supabase Auth automatically)
 */
export function createSession(user: SessionUser): void {
  // Supabase Auth handles session creation automatically
  console.log('✅ Session created for user:', user.email)
}

/**
 * Clear the session (use Supabase signOut)
 */
export function clearSession(): void {
  // Session clearing handled by Supabase Auth
  console.log('🚪 Session cleared')
}

/**
 * Verify contractor credentials using Supabase Auth
 */
export async function verifyContractorLogin(email: string, password: string) {
  try {
    // Use Supabase Auth for login
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    })

    if (error || !data.user) {
      return { success: false, error: 'Invalid credentials' }
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select(`
        *,
        company:companies(*)
      `)
      .eq('id', data.user.id)
      .single()

    if (profileError || !profile) {
      return { success: false, error: 'Profile not found' }
    }

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile.name,
        company_id: profile.company_id,
        company_name: profile.company?.name,
        role: profile.role as 'user' | 'admin'
      }
    }
  } catch (error) {
    console.error('Contractor login error:', error)
    return { success: false, error: 'Login failed' }
  }
}

/**
 * Verify admin credentials using Supabase Auth
 */
export async function verifyAdminLogin(email: string, password: string) {
  try {
    // Use Supabase Auth for login
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    })

    if (error || !data.user) {
      return { success: false, error: 'Invalid credentials' }
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError || !profile || profile.role !== 'admin') {
      return { success: false, error: 'Access denied' }
    }

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile.name,
        role: 'admin' as const
      }
    }
  } catch (error) {
    console.error('Admin login error:', error)
    return { success: false, error: 'Login failed' }
  }
}
