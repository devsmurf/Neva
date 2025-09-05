import { NextResponse } from 'next/server'
import { getSessionUser, createSession } from '@/lib/auth-helpers'
import { supabaseAdmin } from '@/lib/supabaseClient'

export async function PATCH(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { current_password, new_password } = body

    if (!current_password || !new_password) {
      return NextResponse.json(
        { error: 'Current and new passwords required' },
        { status: 400 }
      )
    }

    // Verify current password
    const { data: adminId, error: verifyError } = await supabaseAdmin
      .rpc('verify_admin_credentials', {
        email_input: user.email!,
        password_input: current_password
      })

    if (verifyError || !adminId) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // Change password
    const { data: success, error: changeError } = await supabaseAdmin
      .rpc('change_admin_password', {
        admin_uuid: user.id,
        new_password: new_password
      })

    if (changeError || !success) {
      return NextResponse.json(
        { error: 'Failed to change password' },
        { status: 400 }
      )
    }

    // Update session to mark as not first login
    const updatedUser = { ...user, is_first_login: false }
    createSession(updatedUser)

    return NextResponse.json({
      message: 'Password changed successfully',
      user: updatedUser
    })
  } catch (error) {
    console.error('Password change error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
