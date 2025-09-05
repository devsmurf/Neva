import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client (admin operations)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types (generate with: supabase gen types typescript)
export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          end_date: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          name: string
          end_date: string
          is_active?: boolean
        }
        Update: {
          name?: string
          end_date?: string
          is_active?: boolean
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          block_prefix: string | null
          created_at: string
        }
        Insert: {
          name: string
          block_prefix?: string | null
        }
        Update: {
          name?: string
          block_prefix?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          company_id: string
          block: string
          title: string
          start_date: string
          due_date: string
          status: 'planned' | 'in_progress'
          is_completed: boolean
          is_approved: boolean
          notes: string | null
          dependent_company_id: string | null
          created_by: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          project_id: string
          company_id: string
          block: string
          title: string
          start_date: string
          due_date: string
          status: 'planned' | 'in_progress'
          is_completed?: boolean
          is_approved?: boolean
          notes?: string | null
          dependent_company_id?: string | null
          created_by?: string | null
        }
        Update: {
          block?: string
          title?: string
          start_date?: string
          due_date?: string
          status?: 'planned' | 'in_progress'
          is_completed?: boolean
          is_approved?: boolean
          notes?: string | null
          dependent_company_id?: string | null
          updated_by?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          company_id: string | null
          role: string
          created_at: string
        }
        Insert: {
          id: string
          company_id?: string | null
          role?: string
        }
        Update: {
          company_id?: string | null
          role?: string
        }
      }
    }
  }
}

