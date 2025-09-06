import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables in middleware')
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // Sync cookies to both request and response
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          // Remove cookie from both request and response
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Clear old legacy cookies that might interfere
  const allCookies = request.cookies.getAll()
  const hasOldSession = allCookies.find(c => c.name === 'neva-session')
  
  if (hasOldSession) {
    console.log('🧹 MIDDLEWARE - Clearing old neva-session cookie')
    response.cookies.set('neva-session', '', {
      expires: new Date(0),
      path: '/',
    })
  }

  // Refresh session for user authentication
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    // Enhanced debugging
    console.log('🍪 MIDDLEWARE - All cookies:', allCookies.length, allCookies.map(c => c.name))
    
    if (session) {
      console.log('✅ MIDDLEWARE - Session found:', session.user?.email)
    } else {
      console.log('❌ MIDDLEWARE - No session found')
    }
  } catch (error) {
    console.error('❌ MIDDLEWARE - Session error:', error)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
