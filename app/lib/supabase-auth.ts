import { supabase } from './supabaseClient'
import type { User } from '@supabase/supabase-js'

export type SessionUser = {
  id: string
  email?: string
  name?: string
  company_id?: string
  company_name?: string
  role: 'user' | 'admin'
}

/**
 * Get the current session user from Supabase Auth
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    // Get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        company:companies(*)
      `)
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: profile.name || user.email,
      company_id: profile.company_id,
      company_name: profile.company?.name,
      role: profile.role || 'user'
    }
  } catch (error) {
    console.error('Session user error:', error)
    return null
  }
}

/**
 * Sign in with email (magic link)
 */
export async function signInWithEmail(email: string) {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Sign in error:', error)
    return { success: false, error: 'Sign in failed' }
  }
}

/**
 * Sign in with email and password (for admin users)
 */
export async function signInWithPassword(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, user: data.user }
  } catch (error) {
    console.error('Sign in error:', error)
    return { success: false, error: 'Sign in failed' }
  }
}

/**
 * Sign out
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Sign out error:', error)
    }
    return { success: !error }
  } catch (error) {
    console.error('Sign out error:', error)
    return { success: false }
  }
}

/**
 * Get all companies for company selection
 */
export async function getCompanies() {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select(`
        *,
        login_email:company_login_emails(email)
      `)
      .order('name')

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, companies: data }
  } catch (error) {
    console.error('Companies fetch error:', error)
    return { success: false, error: 'Failed to fetch companies' }
  }
}
