import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'
import { getSessionUser } from '@/lib/auth-helpers'

export async function POST(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Contractors can only create tasks for their own company
    if (user.role !== 'admin' && body.company_id !== user.company_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get project ID (assuming single project for now)
    const { data: projects } = await supabaseAdmin
      .from('projects')
      .select('id')
      .limit(1)

    if (!projects?.[0]) {
      return NextResponse.json({ error: 'No project found' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('tasks')
      .insert({
        ...body,
        project_id: projects[0].id,
        company_id: user.role === 'admin' ? body.company_id : user.company_id,
        is_approved: false, // New tasks need approval
        created_by: null, // Will be set when we implement proper user profiles
        updated_by: null
      })
      .select(`
        *,
        company:companies!tasks_company_id_fkey(*),
        dependent_company:companies!tasks_dependent_company_id_fkey(*),
        project:projects(*)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Task creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const my_tasks = searchParams.get('my_tasks') === 'true'
    const approved_only = searchParams.get('approved_only') === 'true'
    const newly_approved = searchParams.get('newly_approved') === 'true'

    let query = supabaseAdmin
      .from('tasks')
      .select(`
        *,
        company:companies!tasks_company_id_fkey(*),
        dependent_company:companies!tasks_dependent_company_id_fkey(*),
        project:projects(*)
      `)
      .order('due_date', { ascending: true })

    // Filter based on user role and request
    if (user.role !== 'admin') {
      if (my_tasks) {
        // Contractor's own tasks (approved + unapproved)
        query = query.eq('company_id', user.company_id)
        
        if (newly_approved) {
          // Only newly approved tasks from last 24 hours
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          query = query
            .eq('is_approved', true)
            .gte('updated_at', yesterday.toISOString())
        }
      } else if (approved_only) {
        // Only approved tasks for main list
        query = query.eq('is_approved', true)
      }
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Tasks fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

