import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export type SessionUser = {
  id: string
  email?: string
  name?: string
  company_id?: string
  company_name?: string
  role: 'user' | 'admin'
}

/**
 * Get the current session user from Supabase Auth (server-side)
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Missing Supabase environment variables')
      return null
    }

    const cookieStore = cookies()
    
    // Enhanced cookie debugging
    const allCookies = cookieStore.getAll()
    console.log('🍪 All cookies:', allCookies.map(c => `${c.name}=${c.value.substring(0, 20)}...`))
    
    const authCookies = allCookies.filter(cookie => 
      cookie.name.startsWith('sb-') || 
      cookie.name.includes('supabase') ||
      cookie.name.includes('auth')
    )
    console.log('🔐 Auth cookies found:', authCookies.length, authCookies.map(c => c.name))

    // Create server-side client with proper cookie handling
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            const cookie = cookieStore.get(name)
            return cookie?.value
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // Handle read-only cookie store in some contexts
              console.warn('Could not set cookie in server context:', name)
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // Handle read-only cookie store in some contexts
              console.warn('Could not remove cookie in server context:', name)
            }
          },
        },
      }
    )

    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError)
      return null
    }

    if (!session?.user) {
      console.log('❌ No authenticated user found (server-side): Auth session missing!')
      return null
    }

    console.log('✅ Authenticated user found (server-side):', session.user.email)

    // Get user profile from the database
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (profileError || !profiles) {
      console.warn('Profile not found, using basic auth data:', profileError?.message)
      return {
        id: session.user.id,
        email: session.user.email,
        role: 'user'
      }
    }

    return {
      id: profiles.id,
      email: profiles.email || session.user.email,
      name: profiles.full_name,
      company_id: profiles.company_id,
      company_name: profiles.company_name,
      role: profiles.role || 'user'
    }
  } catch (error) {
    console.error('❌ Server session error:', error)
    return null
  }
}
