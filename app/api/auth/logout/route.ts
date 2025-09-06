import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'

export async function POST() {
  try {
    const { error } = await supabaseAdmin.auth.signOut()

    if (error) {
      console.error('Logout error:', error)
    }

    return NextResponse.json({
      message: 'Logout successful',
      success: !error
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}