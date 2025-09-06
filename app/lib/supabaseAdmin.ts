import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE || ''

// Server-only admin client
let _supabaseAdmin: any = null

function createSupabaseAdminClient() {
  if (_supabaseAdmin) return _supabaseAdmin
  
  if (!supabaseUrl || !supabaseServiceRole) {
    throw new Error('Supabase admin configuration missing. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE environment variables.')
  }
  
  _supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  
  return _supabaseAdmin
}

// Only export admin client on server-side
export const supabaseAdmin = createSupabaseAdminClient()



