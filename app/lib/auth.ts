// Placeholder auth helpers to be wired with Supabase later
export type SessionUser = { id: string; company_id: string | null; role: 'user' | 'admin' }

export async function getSessionUser(): Promise<SessionUser | null> {
  // TODO: Implement using Supabase client in server actions
  return null
}

