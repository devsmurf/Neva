import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { getSessionUser } from '@/lib/auth-helpers'

export async function POST(request: Request) {
  try {
    // TODO: Re-implement authentication
    // const user = await getSessionUser()
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()
    
    // TODO: Re-implement role-based authorization
    // Contractors can only create tasks for their own company
    // if (user.role !== 'admin' && body.company_id !== user.company_id) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    // }

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
        company_id: body.company_id, // TODO: Use user.company_id when auth is implemented
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
    const user = await getSessionUser(request)
    console.log('📡 Tasks API - User session:', user ? `${user.email} (${user.role})` : 'No user')

    const { searchParams } = new URL(request.url)
    const my_tasks = searchParams.get('my_tasks') === 'true'
    const approved_only = searchParams.get('approved_only') === 'true'
    const newly_approved = searchParams.get('newly_approved') === 'true'

    console.log('📡 Tasks API params:', { my_tasks, approved_only, newly_approved })

    let query = supabaseAdmin
      .from('tasks')
      .select(`
        *,
        company:companies!tasks_company_id_fkey(*),
        dependent_company:companies!tasks_dependent_company_id_fkey(*),
        project:projects(*)
      `)
      .order('due_date', { ascending: true })

    // Role-based filtering
    if (approved_only) {
      query = query.eq('is_approved', true)
    }

    // Filter by user's tasks if requested
    if (my_tasks && user && user.company_id) {
      console.log('📡 Filtering by company_id:', user.company_id)
      query = query.eq('company_id', user.company_id)
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

