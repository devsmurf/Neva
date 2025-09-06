import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { getSessionUser } from '@/lib/auth-helpers'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔐 APPROVE REQUEST - Checking session...')
    const user = await getSessionUser(request)
    
    if (!user) {
      console.log('❌ APPROVE FAILED: No user session')
      return NextResponse.json({ error: 'Unauthorized - Please login' }, { status: 401 })
    }
    
    if (user.role !== 'admin') {
      console.log('❌ APPROVE FAILED: Not admin role:', user.role)
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
    }

    console.log('✅ APPROVE ACCESS GRANTED for user:', user.email)
    const { id } = params
    console.log('🎯 Approving task ID:', id)

    const { data, error } = await supabaseAdmin
      .from('tasks')
      .update({
        is_approved: true,
        updated_by: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        company:companies!tasks_company_id_fkey(*)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...data,
      message: 'Task approved successfully'
    })
  } catch (error) {
    console.error('Task approval error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

