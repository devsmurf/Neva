import { cookies } from 'next/headers'
import { supabaseAdmin } from './supabaseClient'

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
 * Get the current session user from HTTP-only cookie
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get('neva-session')?.value

    if (!sessionToken) {
      console.log('🔍 No session token found')
      return null
    }

    // Decode the session token (simplified - in production use proper JWT)
    const decoded = JSON.parse(Buffer.from(sessionToken, 'base64').toString())
    
    // Check if token is expired
    if (decoded.exp && Date.now() > decoded.exp) {
      console.log('⏰ Session expired:', {
        expiry: new Date(decoded.exp).toISOString(),
        now: new Date().toISOString()
      })
      return null
    }

    console.log('✅ Valid session found:', {
      role: decoded.role,
      email: decoded.email,
      expiresIn: Math.round((decoded.exp - Date.now()) / (1000 * 60)) + ' minutes'
    })

    return {
      id: decoded.user_id,
      email: decoded.email,
      name: decoded.name,
      company_id: decoded.company_id,
      company_name: decoded.company_name,
      role: decoded.role,
      is_first_login: decoded.is_first_login
    }
  } catch (error) {
    console.error('❌ Session decode error:', error)
    return null
  }
}

/**
 * Create a session token and set HTTP-only cookie
 */
export function createSession(user: SessionUser): string {
  const sessionToken = Buffer.from(JSON.stringify({
    user_id: user.id,
    email: user.email,
    name: user.name,
    company_id: user.company_id,
    company_name: user.company_name,
    role: user.role,
    is_first_login: user.is_first_login,
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days for development
  })).toString('base64')

  const cookieStore = cookies()
  cookieStore.set('neva-session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days for development
    path: '/'
  })

  return sessionToken
}

/**
 * Clear the session cookie
 */
export function clearSession(): void {
  const cookieStore = cookies()
  cookieStore.delete('neva-session')
}

/**
 * Verify contractor credentials and get company info
 */
export async function verifyContractorLogin(company_id: string, password: string) {
  try {
    // Verify company password
    const { data: isValid, error: verifyError } = await supabaseAdmin
      .rpc('verify_company_password', {
        company_uuid: company_id,
        password_input: password
      })

    if (verifyError || !isValid) {
      return { success: false, error: 'Invalid credentials' }
    }

    // Get company info
    const { data: company, error: companyError } = await supabaseAdmin
      .from('companies')
      .select('*')
      .eq('id', company_id)
      .single()

    if (companyError || !company) {
      return { success: false, error: 'Company not found' }
    }

    return {
      success: true,
      user: {
        id: `contractor-${company_id}`,
        company_id,
        company_name: company.name,
        role: 'user' as const
      }
    }
  } catch (error) {
    console.error('Contractor login error:', error)
    return { success: false, error: 'Login failed' }
  }
}

/**
 * Verify admin credentials and get admin info
 */
export async function verifyAdminLogin(email: string, password: string) {
  try {
    // Verify admin credentials
    const { data: adminId, error: verifyError } = await supabaseAdmin
      .rpc('verify_admin_credentials', {
        email_input: email,
        password_input: password
      })

    if (verifyError || !adminId) {
      return { success: false, error: 'Invalid credentials' }
    }

    // Get admin user info
    const { data: admin, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('id', adminId)
      .single()

    if (adminError || !admin) {
      return { success: false, error: 'Admin not found' }
    }

    return {
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: 'admin' as const,
        is_first_login: admin.is_first_login
      }
    }
  } catch (error) {
    console.error('Admin login error:', error)
    return { success: false, error: 'Login failed' }
  }
}
