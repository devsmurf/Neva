import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE || ''

// Validation for environment variables
if (!supabaseUrl) {
  console.warn('NEXT_PUBLIC_SUPABASE_URL is not set. Please check your environment variables.')
}

if (!supabaseAnonKey) {
  console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Please check your environment variables.')
}

// Singleton Supabase client instance to prevent multiple instances
let _supabase: any = null

// Create Supabase client with singleton pattern and enhanced multi-tab support
function createSupabaseClient() {
  if (_supabase) return _supabase
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase configuration missing')
    _supabase = createClient('https://placeholder.supabase.co', 'placeholder-key')
  } else {
    _supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        // Enhanced storage options for better multi-tab support
        storage: {
          getItem: (key: string) => {
            if (typeof window !== 'undefined') {
              return window.localStorage.getItem(key)
            }
            return null
          },
          setItem: (key: string, value: string) => {
            if (typeof window !== 'undefined') {
              window.localStorage.setItem(key, value)
              // Trigger storage event for cross-tab communication
              window.dispatchEvent(new StorageEvent('storage', {
                key,
                newValue: value,
                url: window.location.href
              }))
            }
          },
          removeItem: (key: string) => {
            if (typeof window !== 'undefined') {
              window.localStorage.removeItem(key)
              // Trigger storage event for cross-tab communication
              window.dispatchEvent(new StorageEvent('storage', {
                key,
                newValue: null,
                url: window.location.href
              }))
            }
          }
        },
        // Add global fetch configuration
        global: {
          fetch: (url: RequestInfo | URL, options: RequestInit = {}) => {
            return fetch(url, {
              ...options,
              credentials: 'include', // Always include cookies
              headers: {
                ...options.headers,
              }
            })
          }
        }
      }
    })
  }
  
  return _supabase
}

export const supabase = createSupabaseClient()

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

