// PATCH /api/admin/reject/:id (admin)
// Deletes or leaves a note; prefer delete per spec
// NOTE: Placeholder to be implemented after Supabase wiring
import { NextResponse } from 'next/server'

export async function PATCH() {
  return NextResponse.json({ ok: true, message: 'Not implemented (Supabase to be wired)' }, { status: 501 })
}

