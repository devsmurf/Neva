import { NextResponse } from 'next/server'
import { verifyAdminLogin, createSession } from '@/lib/auth-helpers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    const result = await verifyAdminLogin(email, password)

    if (!result.success || !result.user) {
      return NextResponse.json(
        { error: result.error || 'Login failed' },
        { status: 401 }
      )
    }

    // Session created automatically by Supabase Auth
    createSession(result.user)

    return NextResponse.json({
      user: result.user,
      message: 'Login successful'
    })
  } catch (error) {
    console.error('Admin login API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
