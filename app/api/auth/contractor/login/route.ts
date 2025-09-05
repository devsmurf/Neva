import { NextResponse } from 'next/server'
import { verifyContractorLogin, createSession } from '@/lib/auth-helpers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { company_id, password } = body

    if (!company_id || !password) {
      return NextResponse.json(
        { error: 'Company ID and password required' },
        { status: 400 }
      )
    }

    const result = await verifyContractorLogin(company_id, password)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      )
    }

    // Create session
    createSession(result.user)

    return NextResponse.json({
      user: result.user,
      message: 'Login successful'
    })
  } catch (error) {
    console.error('Contractor login API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
