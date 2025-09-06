import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, type } = body

    console.log('🔐 LOGIN API - Request received:', { email, type })

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const cookieStore = cookies()
    
    // Create server client with proper cookie handling
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            console.warn('Could not set cookie:', name)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            console.warn('Could not remove cookie:', name)
          }
        },
      },
    })

    let authResult

    if (type === 'password' && password) {
      console.log('🔐 LOGIN API - Password login attempt')
      // Admin login with password
      authResult = await supabase.auth.signInWithPassword({
        email,
        password,
      })
    } else {
      console.log('🔐 LOGIN API - Magic link login attempt')
      // Magic link login for companies
      authResult = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${request.nextUrl.origin}/auth/callback`
        }
      })
    }

    if (authResult.error) {
      console.error('🔐 LOGIN API - Auth error:', authResult.error)
      return NextResponse.json(
        { error: authResult.error.message },
        { status: 401 }
      )
    }

    console.log('🔐 LOGIN API - Auth successful')

    // Create response with proper cookie headers
    const response = NextResponse.json({
      message: type === 'password' ? 'Login successful' : 'Magic link sent to your email',
      session: authResult.data.session ? 'created' : 'pending'
    })

    // If we have a session, ensure cookies are set properly
    if (authResult.data.session) {
      console.log('✅ LOGIN API - Session created, setting cookies')
      
      // Get all cookies that should be set
      const allCookies = cookieStore.getAll()
      allCookies.forEach(cookie => {
        if (cookie.name.startsWith('sb-')) {
          response.cookies.set(cookie.name, cookie.value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 days
          })
        }
      })
    }

    return response
  } catch (error) {
    console.error('❌ LOGIN API - Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
