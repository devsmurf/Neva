import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { getSessionUser } from '@/lib/auth-helpers'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser(request)
    if (!user) {
      console.log('❌ TASK UPDATE: No user session')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id } = params

    // Check if user can update this task
    const { data: existingTask, error: fetchError } = await supabaseAdmin
      .from('tasks')
      .select('company_id, is_approved')
      .eq('id', id)
      .single()

    if (fetchError || !existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Only allow updates if user owns the task or is admin
    if (user.role !== 'admin' && existingTask.company_id !== user.company_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Non-admin users cannot change approval status
    if (user.role !== 'admin' && 'is_approved' in body) {
      delete body.is_approved
    }

    const { data, error } = await supabaseAdmin
      .from('tasks')
      .update({
        ...body,
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

    return NextResponse.json(data)
  } catch (error) {
    console.error('Task update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser(request)
    
    if (!user) {
      console.log('❌ DELETE FAILED: No user session')
      return NextResponse.json({ error: 'Unauthorized - Please login' }, { status: 401 })
    }

    if (!user.role) {
      console.log('❌ DELETE FAILED: No user role')
      return NextResponse.json({ error: 'Unauthorized - Invalid session' }, { status: 401 })
    }

    console.log('🔒 DELETE REQUEST - User Authentication:', { 
      role: user.role, 
      id: user.id, 
      email: user.email,
      company_id: user.company_id,
      timestamp: new Date().toISOString()
    })
    
    const { id } = params
    console.log('🎯 Target Task ID:', id)

    // Check if user can delete this task
    const { data: existingTask, error: fetchError } = await supabaseAdmin
      .from('tasks')
      .select('company_id, is_approved')
      .eq('id', id)
      .single()

    if (fetchError || !existingTask) {
      console.log('❌ Task not found:', id, fetchError)
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    console.log('📋 Task info:', { 
      taskId: id, 
      taskCompanyId: existingTask.company_id, 
      taskIsApproved: existingTask.is_approved,
      userRole: user.role,
      userCompanyId: user.company_id 
    })

    // Authorization Logic:
    // 1. Admin can delete ANY task (approved/unapproved, any company)
    // 2. Contractors can only delete their OWN UNAPPROVED tasks
    if (user.role === 'admin') {
      console.log('✅ ADMIN ACCESS - Can delete any task')
    } else {
      console.log('👤 CONTRACTOR ACCESS - Checking ownership and approval status')
      
      // Contractor restrictions
      if (existingTask.company_id !== user.company_id) {
        console.log('❌ FORBIDDEN: Task belongs to different company')
        return NextResponse.json({ 
          error: 'Forbidden - You can only delete your own company tasks' 
        }, { status: 403 })
      }
      
      if (existingTask.is_approved) {
        console.log('❌ FORBIDDEN: Cannot delete approved tasks')
        return NextResponse.json({ 
          error: 'Forbidden - Cannot delete approved tasks' 
        }, { status: 403 })
      }
      
      console.log('✅ CONTRACTOR ACCESS - Can delete own unapproved task')
    }

    console.log('🗑️ Executing DELETE operation...')
    
    const { error } = await supabaseAdmin
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) {
      console.log('❌ DELETE FAILED - Database error:', error.message)
      return NextResponse.json({ 
        error: 'Database error: ' + error.message 
      }, { status: 400 })
    }

    console.log('✅ DELETE SUCCESS - Task removed from database')
    
    return NextResponse.json({ 
      success: true,
      message: 'Task deleted successfully',
      deletedId: id,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Task delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

