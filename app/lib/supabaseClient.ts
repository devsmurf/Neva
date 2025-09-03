// Client placeholder (for future integration)
// For user operations use anon key via NEXT_PUBLIC_*, for admin operations use service role on server only.

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  serviceKey: process.env.SUPABASE_SERVICE_ROLE || '',
}

