// PATCH /api/admin/approve/:id (admin)
// Sets is_approved=true using service role (server only)
// NOTE: Placeholder to be implemented after Supabase wiring
import { NextResponse } from 'next/server'

export async function PATCH() {
  return NextResponse.json({ ok: true, message: 'Not implemented (Supabase to be wired)' }, { status: 501 })
}

