import { NextResponse } from 'next/server'
import { clearSession } from '@/lib/auth-helpers'

export async function POST() {
  try {
    clearSession()

    return NextResponse.json({
      message: 'Logout successful'
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


