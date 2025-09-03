// PATCH /api/tasks/:id (auth user)
// Allows updating title/block/start/due/status/is_completed on own company rows
// NOTE: Placeholder to be implemented after Supabase wiring
import { NextResponse } from 'next/server'

export async function PATCH() {
  return NextResponse.json({ ok: true, message: 'Not implemented (Supabase to be wired)' }, { status: 501 })
}

