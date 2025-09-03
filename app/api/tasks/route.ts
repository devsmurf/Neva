// POST /api/tasks (auth user)
// Body: { projectId, block, title, startDate, dueDate, status }
// Behavior: creates task with is_approved=false for current user's company
// NOTE: Placeholder to be implemented after Supabase wiring
import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ ok: true, message: 'Not implemented (Supabase to be wired)' }, { status: 501 })
}

