# 🚀 NEVA YALI - Supabase Entegrasyon Roadmap

## 📋 Mevcut Durum Analizi

### ✅ Şu An Çalışan Sistemler:
- Mock data (`app/lib/mock.ts`)
- localStorage tabanlı auth (`SessionProvider`)
- Client-side state management
- UI components tam hazır
- Database schema hazır (`0001_init.sql`)

### 🔄 Entegrasyon Gereken Alanlar:
- Authentication system
- Data fetching (tasks, companies, projects)
- API endpoints (4 adet)
- Real-time updates
- File uploads (opsiyonel)

---

## 🎯 PHASE 1: Supabase Setup & Database

### 1.1 Supabase Project Setup

```bash
# 1. Supabase projesi oluştur (https://supabase.com)
# 2. Package'ları yükle
npm install @supabase/supabase-js

# 3. Environment variables ekle (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE=your-service-role-key
```

### 1.2 Database Migration

```sql
-- Mevcut migration'ı Supabase Dashboard'da çalıştır
-- Dosya: supabase/migrations/0001_init.sql (zaten hazır)

-- Seed data ekle (SQL Editor'da çalıştır)
INSERT INTO projects (name, end_date) VALUES ('Neva Yalı', '2025-12-29');

INSERT INTO companies (name) VALUES 
  ('Beta Beton'),
  ('Gamma Sıva'),
  ('Epsilon Alçıpan'),
  ('Boyacı Ltd.'),
  ('Alfa Elektrik');

-- Admin kullanıcı oluştur (Auth'tan sonra)
-- INSERT INTO profiles (id, company_id, role) VALUES ('<admin_user_id>', null, 'admin');
```

### 1.3 Supabase Client Setup

**Güncelle:** `app/lib/supabaseClient.ts`
```typescript
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
```

---

## 🔐 PHASE 2: Authentication Integration

### 2.1 Auth Helper Functions

**Yeni dosya:** `app/lib/auth-helpers.ts`
```typescript
import { supabase } from './supabaseClient'
import type { Database } from './supabaseClient'

type Profile = Database['public']['Tables']['profiles']['Row']
type Company = Database['public']['Tables']['companies']['Row']

export type SessionUser = {
  id: string
  email: string
  profile: Profile
  company?: Company
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) return { data: null, error }
  
  // Fetch profile and company info
  const profile = await getProfile(data.user.id)
  
  return { data: { user: data.user, profile }, error: null }
}

export async function signUp(email: string, password: string, companyId: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  
  if (error) return { data: null, error }
  
  // Create profile after signup
  if (data.user) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      company_id: companyId,
      role: 'user'
    })
  }
  
  return { data, error: null }
}

export async function getProfile(userId: string): Promise<SessionUser | null> {
  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      *,
      company:companies(*)
    `)
    .eq('id', userId)
    .single()
    
  if (!profile) return null
  
  return {
    id: userId,
    email: '', // Will be filled from auth user
    profile,
    company: profile.company
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  const profile = await getProfile(user.id)
  if (!profile) return null
  
  return {
    ...profile,
    email: user.email || ''
  }
}
```

### 2.2 SessionProvider Güncellemesi

**Güncelle:** `app/components/SessionProvider.tsx`
```typescript
"use client"
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { getSessionUser, signInWithEmail, signOut } from '@/lib/auth-helpers'
import type { SessionUser } from '@/lib/auth-helpers'
import type { User } from '@supabase/supabase-js'

type SessionCtx = {
  user: SessionUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  logout: () => Promise<void>
}

const Ctx = createContext<SessionCtx | null>(null)

export function useSession() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSession must be used inside SessionProvider')
  return ctx
}

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    getSessionUser().then(setUser).finally(() => setLoading(false))

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const userData = await getSessionUser()
          setUser(userData)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    const { data, error } = await signInWithEmail(email, password)
    
    if (error) {
      setLoading(false)
      return { error: error.message }
    }
    
    if (data) {
      setUser({
        id: data.user.id,
        email: data.user.email || '',
        profile: data.profile.profile,
        company: data.profile.company
      })
    }
    
    setLoading(false)
    return {}
  }

  const logout = async () => {
    setLoading(true)
    await signOut()
    setUser(null)
    setLoading(false)
  }

  return (
    <Ctx.Provider value={{ user, loading, login, logout }}>
      {children}
    </Ctx.Provider>
  )
}

// Backward compatibility types
export type Session = {
  id: string
  email: string
  company_id: string
  company_name: string
  role: 'user' | 'admin'
}
```

### 2.3 Login Sayfaları Güncellemesi

**Güncelle:** `app/(auth)/login/page.tsx`
```typescript
"use client"
import Link from 'next/link'
import { useState } from 'react'
import { useSession } from '@/components/SessionProvider'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { login, loading } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const result = await login(email, password)
    
    if (result.error) {
      setError(result.error)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="card p-5 md:p-6">
        <h1 className="text-lg md:text-xl font-semibold mb-4">Giriş Yap</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="grid gap-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">E-posta</label>
            <input 
              type="email"
              required
              className="w-full rounded-lg border px-3 py-2 text-sm" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="ornek@firma.com" 
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Şifre</label>
            <input 
              type="password"
              required
              className="w-full rounded-lg border px-3 py-2 text-sm" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
      <div className="text-center text-sm text-slate-600">
        Hesabın yok mu? <Link className="text-brand-600" href="/register">Kayıt ol</Link>
      </div>
    </div>
  )
}
```

---

## 📊 PHASE 3: Data Layer Integration

### 3.1 Data Fetching Hooks

**Yeni dosya:** `app/lib/hooks/useTasks.ts`
```typescript
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Database } from '@/lib/supabaseClient'

type Task = Database['public']['Tables']['tasks']['Row'] & {
  company?: Database['public']['Tables']['companies']['Row']
}

type TaskFilters = {
  approved?: boolean
  company_id?: string
  block?: string
  status?: 'planned' | 'in_progress'
}

export function useTasks(filters?: TaskFilters) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async () => {
    setLoading(true)
    setError(null)
    
    let query = supabase
      .from('tasks')
      .select(`
        *,
        company:companies(*)
      `)
      .order('due_date', { ascending: true })
    
    // Apply filters
    if (filters?.approved !== undefined) {
      query = query.eq('is_approved', filters.approved)
    }
    if (filters?.company_id) {
      query = query.eq('company_id', filters.company_id)
    }
    if (filters?.block) {
      query = query.eq('block', filters.block)
    }
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    
    const { data, error: fetchError } = await query
    
    if (fetchError) {
      setError(fetchError.message)
    } else {
      setTasks(data || [])
    }
    
    setLoading(false)
  }

  useEffect(() => {
    fetchTasks()
  }, [JSON.stringify(filters)])

  // Real-time subscription
  useEffect(() => {
    const subscription = supabase
      .channel('tasks')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tasks' }, 
        () => fetchTasks()
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { tasks, loading, error, refetch: fetchTasks }
}
```

**Yeni dosya:** `app/lib/hooks/useCompanies.ts`
```typescript
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Database } from '@/lib/supabaseClient'

type Company = Database['public']['Tables']['companies']['Row']

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompanies = async () => {
      const { data, error: fetchError } = await supabase
        .from('companies')
        .select('*')
        .order('name')
      
      if (fetchError) {
        setError(fetchError.message)
      } else {
        setCompanies(data || [])
      }
      
      setLoading(false)
    }

    fetchCompanies()
  }, [])

  return { companies, loading, error }
}
```

**Yeni dosya:** `app/lib/hooks/useProjects.ts`
```typescript
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Database } from '@/lib/supabaseClient'

type Project = Database['public']['Tables']['projects']['Row']

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('is_active', true)
        .order('name')
      
      if (fetchError) {
        setError(fetchError.message)
      } else {
        setProjects(data || [])
      }
      
      setLoading(false)
    }

    fetchProjects()
  }, [])

  return { projects, loading, error }
}
```

---

## 🔌 PHASE 4: API Endpoints Implementation

### 4.1 Tasks API

**Güncelle:** `app/api/tasks/route.ts`
```typescript
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { getSessionUser } from '@/lib/auth-helpers'

export async function POST(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate required fields
    const { project_id, block, title, start_date, due_date, status, dependent_company_id } = body
    
    if (!project_id || !block || !title || !start_date || !due_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create task
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        project_id,
        company_id: user.profile.company_id!,
        block,
        title,
        start_date,
        due_date,
        status: status || 'planned',
        is_approved: false,
        is_completed: false,
        dependent_company_id: dependent_company_id || null,
        created_by: user.id
      })
      .select(`
        *,
        company:companies(*)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const approved = searchParams.get('approved')
    const company_id = searchParams.get('company_id')
    
    let query = supabase
      .from('tasks')
      .select(`
        *,
        company:companies(*)
      `)
      .order('due_date', { ascending: true })
    
    // Apply filters based on user role and params
    if (user.profile.role !== 'admin') {
      // Non-admin users see only approved tasks or their own
      query = query.or(`is_approved.eq.true,company_id.eq.${user.profile.company_id}`)
    }
    
    if (approved !== null) {
      query = query.eq('is_approved', approved === 'true')
    }
    
    if (company_id) {
      query = query.eq('company_id', company_id)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
```

### 4.2 Task Update API

**Güncelle:** `app/api/tasks/[id]/route.ts`
```typescript
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { getSessionUser } from '@/lib/auth-helpers'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id } = params

    // Check if user can update this task
    const { data: existingTask } = await supabase
      .from('tasks')
      .select('company_id, is_approved')
      .eq('id', id)
      .single()

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Only allow updates if user owns the task or is admin
    if (user.profile.role !== 'admin' && existingTask.company_id !== user.profile.company_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Non-admin users cannot change approval status
    if (user.profile.role !== 'admin' && 'is_approved' in body) {
      delete body.is_approved
    }

    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...body,
        updated_by: user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        company:companies(*)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Check if user can delete this task
    const { data: existingTask } = await supabase
      .from('tasks')
      .select('company_id')
      .eq('id', id)
      .single()

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Only allow deletion if user owns the task or is admin
    if (user.profile.role !== 'admin' && existingTask.company_id !== user.profile.company_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
```

### 4.3 Admin Approval APIs

**Güncelle:** `app/api/admin/approve/[id]/route.ts`
```typescript
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'
import { getSessionUser } from '@/lib/auth-helpers'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser()
    if (!user || user.profile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id } = params

    // Use admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('tasks')
      .update({
        is_approved: true,
        updated_by: user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        company:companies(*)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
```

**Güncelle:** `app/api/admin/reject/[id]/route.ts`
```typescript
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'
import { getSessionUser } from '@/lib/auth-helpers'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser()
    if (!user || user.profile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id } = params

    // Use admin client to bypass RLS
    const { error } = await supabaseAdmin
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
```

---

## 🎨 PHASE 5: Frontend Component Updates

### 5.1 Ana Sayfa Güncellemesi

**Güncelle:** `app/(public)/page.tsx`
```typescript
"use client"
import SearchBar from '@/components/SearchBar'
import TaskTable from '@/components/TaskTable'
import TaskForm from '@/components/TaskForm'
import { useTasks } from '@/lib/hooks/useTasks'
import { useCompanies } from '@/lib/hooks/useCompanies'
import { useProjects } from '@/lib/hooks/useProjects'
import type { Task } from '@/lib/types'
import { useEffect, useMemo, useState } from 'react'
import { useSession } from '@/components/SessionProvider'
import { useTabContext } from '@/components/NavBar'
import Link from 'next/link'

// ... LoginSelection component stays the same ...

function TaskList() {
  const { user } = useSession()
  const { activeTab } = user?.profile.role === 'user' ? useTabContext() : { activeTab: 'all' as const }
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('')

  // Use Supabase hooks instead of mock data
  const { tasks, loading: tasksLoading, error: tasksError, refetch } = useTasks()
  const { companies, loading: companiesLoading } = useCompanies()
  const { projects } = useProjects()

  // Filter tasks based on active tab
  const filteredTasks = useMemo(() => {
    if (activeTab === 'all') {
      return tasks.filter(t => t.is_approved && !t.is_completed)
    } else {
      return tasks.filter(t => t.company_id === user?.profile.company_id && !t.is_completed)
    }
  }, [tasks, activeTab, user?.profile.company_id])

  // Apply search and filter logic
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let rows = filteredTasks

    if (selectedBlock) {
      rows = rows.filter(t => t.block === selectedBlock)
    }

    if (selectedCompany) {
      rows = rows.filter(t => t.company_id === selectedCompany)
    }

    if (q) {
      rows = rows.filter((r) => 
        [r.company?.name || '', r.title, r.block].some(x => 
          x.toLowerCase().includes(q)
        )
      )
    }

    return rows
  }, [filteredTasks, query, selectedBlock, selectedCompany])

  // Handle task actions with API calls
  const handleUpdateStatus = async (id: string, status: 'planned' | 'in_progress') => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        refetch() // Refresh tasks
      } else {
        const error = await response.json()
        alert(`Hata: ${error.error}`)
      }
    } catch (error) {
      alert('Bağlantı hatası')
    }
  }

  const handleComplete = async (id: string) => {
    if (!confirm('Bu görevi tamamlandı olarak işaretlemek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: true })
      })

      if (response.ok) {
        refetch()
      } else {
        const error = await response.json()
        alert(`Hata: ${error.error}`)
      }
    } catch (error) {
      alert('Bağlantı hatası')
    }
  }

  const handleEdit = (id: string) => {
    // TODO: Implement edit modal
    alert(`Düzenleme modalı açılacak: ${id}`)
  }

  // Loading state
  if (tasksLoading || companiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
          <p className="text-slate-600">Veriler yükleniyor...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (tasksError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-2">Hata oluştu</div>
        <p className="text-slate-600 mb-4">{tasksError}</p>
        <button onClick={() => refetch()} className="btn btn-primary">
          Tekrar Dene
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Filter panel and task form remain mostly the same */}
      {/* ... */}

      {showForm && user && (
        <TaskForm 
          onSubmit={async (payload) => {
            try {
              const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...payload,
                  project_id: projects[0]?.id // Use first active project
                })
              })

              if (response.ok) {
                refetch()
                setShowForm(false)
                alert('Görev başarıyla oluşturuldu. Admin onayı bekleniyor.')
              } else {
                const error = await response.json()
                alert(`Hata: ${error.error}`)
              }
            } catch (error) {
              alert('Bağlantı hatası')
            }
          }} 
        />
      )}

      <div className="card p-0">
        <TaskTable
          rows={filtered}
          currentCompanyId={activeTab === 'my' ? user?.profile.company_id : undefined}
          onEdit={activeTab === 'my' ? handleEdit : undefined}
          onComplete={activeTab === 'my' ? handleComplete : undefined}
          onUpdateStatus={activeTab === 'my' ? handleUpdateStatus : undefined}
          narrow
        />
      </div>
    </div>
  )
}

// ... rest of component stays the same ...
```

### 5.2 Admin Panel Güncellemesi

**Güncelle:** `app/admin/page.tsx`
```typescript
"use client"
import { useEffect, useMemo, useState } from 'react'
import { useTasks } from '@/lib/hooks/useTasks'
import { useCompanies } from '@/lib/hooks/useCompanies'
import { useProjects } from '@/lib/hooks/useProjects'
import TaskTable from '@/components/TaskTable'
import { useSession } from '@/components/SessionProvider'
import Link from 'next/link'

// ... AccessDenied component stays the same ...

function ApprovalQueue({ queue, onApprove, onReject }: { 
  queue: any[], 
  onApprove: (id: string) => void,
  onReject: (id: string) => void 
}) {
  if (!queue.length) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-2xl flex items-center justify-center mb-4">
          <span className="text-2xl">✅</span>
        </div>
        <h3 className="text-lg font-medium text-slate-800 mb-2">Tüm görevler onaylandı!</h3>
        <p className="text-slate-600">Onay bekleyen görev bulunmuyor.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <span className="text-amber-600">⚠️</span>
          <span className="font-medium text-amber-800">
            {queue.length} görev onay bekliyor
          </span>
        </div>
      </div>

      {queue.map(task => (
        <div key={task.id} className="card p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">
                  Onay Bekliyor
                </span>
                <span className="text-sm text-slate-500">
                  {task.company?.name}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                {task.title}
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-xs md:text-sm">
                <div>
                  <span className="text-slate-500">Blok:</span>
                  <span className="ml-2 font-medium">{task.block}</span>
                </div>
                <div>
                  <span className="text-slate-500">Başlangıç:</span>
                  <span className="ml-2 font-medium">{task.start_date}</span>
                </div>
                <div>
                  <span className="text-slate-500">Bitiş:</span>
                  <span className="ml-2 font-medium">{task.due_date}</span>
                </div>
                <div>
                  <span className="text-slate-500">Durum:</span>
                  <span className="ml-2 font-medium">{task.status === 'planned' ? 'Planlandı' : 'Devam Ediyor'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 md:ml-4 md:self-start mt-2 md:mt-0">
              <button
                onClick={() => onApprove(task.id)}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs md:text-sm font-medium transition-all shadow-sm border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
              >
                <span>✅</span>
                <span>Onayla</span>
              </button>
              <button
                onClick={() => onReject(task.id)}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs md:text-sm font-medium transition-all shadow-sm border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
              >
                <span>❌</span>
                <span>Reddet</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminPage() {
  const { user } = useSession()
  const [tab, setTab] = useState<'queue' | 'all' | 'completed' | 'project' | 'companies'>('queue')
  
  // Use Supabase hooks
  const { tasks, loading, error, refetch } = useTasks()
  const { companies } = useCompanies()
  const { projects } = useProjects()

  // Filter tasks
  const queue = useMemo(() => tasks.filter(t => !t.is_approved), [tasks])
  const completed = useMemo(() => tasks.filter(t => t.is_completed), [tasks])

  // Handle approval
  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/approve/${id}`, {
        method: 'PATCH'
      })

      if (response.ok) {
        refetch()
        alert('Görev onaylandı!')
      } else {
        const error = await response.json()
        alert(`Hata: ${error.error}`)
      }
    } catch (error) {
      alert('Bağlantı hatası')
    }
  }

  // Handle rejection
  const handleReject = async (id: string) => {
    if (!confirm('Bu görevi reddetmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/admin/reject/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        refetch()
        alert('Görev reddedildi!')
      } else {
        const error = await response.json()
        alert(`Hata: ${error.error}`)
      }
    } catch (error) {
      alert('Bağlantı hatası')
    }
  }

  // Admin check
  if (!user || user.profile.role !== 'admin') {
    return <AccessDenied />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
          <p className="text-slate-600">Veriler yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header remains the same */}
      
      <div className="card p-2">
        <div className="flex gap-2 flex-wrap">
          <button
            className={`btn ${tab === 'queue' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setTab('queue')}
          >
            ⚠️ Onay Kuyruğu {queue.length > 0 && `(${queue.length})`}
          </button>
          <button
            className={`btn ${tab === 'all' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setTab('all')}
          >
            📋 Tüm Görevler
          </button>
          <button
            className={`btn ${tab === 'completed' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setTab('completed')}
          >
            ✅ Tamamlananlar {completed.length > 0 && `(${completed.length})`}
          </button>
          {/* ... other tabs ... */}
        </div>
      </div>

      {tab === 'queue' && (
        <ApprovalQueue 
          queue={queue} 
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {tab === 'all' && (
        <div className="space-y-4">
          <div className="card p-0">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Tüm Görevler</h2>
              <p className="text-sm text-slate-600">
                {tasks.length} görev görüntüleniyor
              </p>
            </div>
            <TaskTable
              rows={tasks}
              showDeleteButton={true}
              onComplete={async (id) => {
                if (confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
                  try {
                    const response = await fetch(`/api/tasks/${id}`, {
                      method: 'DELETE'
                    })
                    if (response.ok) {
                      refetch()
                    }
                  } catch (error) {
                    alert('Silme işlemi başarısız')
                  }
                }
              }}
            />
          </div>
        </div>
      )}

      {/* ... other tabs remain similar with API integration ... */}
    </div>
  )
}
```

---

## 🚀 PHASE 6: Type Safety & Error Handling

### 6.1 Updated Types

**Güncelle:** `app/lib/types.ts`
```typescript
import type { Database } from './supabaseClient'

// Export database types
export type TaskStatus = Database['public']['Tables']['tasks']['Row']['status']

export type Company = Database['public']['Tables']['companies']['Row']

export type Project = Database['public']['Tables']['projects']['Row']

export type Task = Database['public']['Tables']['tasks']['Row'] & {
  company?: Company
}

export type Profile = Database['public']['Tables']['profiles']['Row'] & {
  company?: Company
}

// API response types
export type ApiResponse<T = any> = {
  data?: T
  error?: string
}

// Form types
export type TaskFormData = Database['public']['Tables']['tasks']['Insert']
```

### 6.2 Error Handling Component

**Yeni dosya:** `app/components/ErrorBoundary.tsx`
```typescript
"use client"
import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">Bir hata oluştu</h3>
          <p className="text-slate-600 mb-4">Sayfa yüklenirken bir sorun yaşandı.</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Sayfayı Yenile
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

### 6.3 Loading Component

**Yeni dosya:** `app/components/Loading.tsx`
```typescript
export default function Loading({ message = 'Yükleniyor...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
        <p className="text-slate-600">{message}</p>
      </div>
    </div>
  )
}
```

---

## 🎯 PHASE 7: Testing & Deployment

### 7.1 Environment Setup

**.env.local örneği:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE=your-service-role-key
```

### 7.2 Test Users

```sql
-- Admin kullanıcı oluştur (Supabase Auth'tan sonra)
INSERT INTO profiles (id, company_id, role) VALUES 
  ('<admin-user-uuid>', null, 'admin');

-- Test şirket kullanıcıları
INSERT INTO profiles (id, company_id, role) VALUES 
  ('<user1-uuid>', '<beta-beton-company-id>', 'user'),
  ('<user2-uuid>', '<gamma-siva-company-id>', 'user');
```

### 7.3 Deployment Checklist

- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Seed data inserted
- [ ] RLS policies tested
- [ ] Admin user created
- [ ] Test users created
- [ ] All API endpoints tested
- [ ] Frontend components updated
- [ ] Error handling implemented
- [ ] Loading states added

---

## 📚 Implementation Order

### Week 1: Foundation
1. ✅ Supabase project setup
2. ✅ Database migration
3. ✅ Environment configuration
4. ✅ Supabase client setup

### Week 2: Authentication
1. ✅ Auth helper functions
2. ✅ SessionProvider update
3. ✅ Login pages update
4. ✅ Test authentication flow

### Week 3: Data Layer
1. ✅ Custom hooks creation
2. ✅ API endpoints implementation
3. ✅ Frontend component updates
4. ✅ Error handling

### Week 4: Polish & Deploy
1. ✅ Type safety improvements
2. ✅ Loading states
3. ✅ Testing
4. ✅ Production deployment

---

## 🚨 Critical Notes

### Security
- ✅ RLS policies are properly configured
- ✅ Service role key is server-only
- ✅ User input validation in API routes
- ✅ Proper error messages (no sensitive data)

### Performance
- ✅ Real-time subscriptions for live updates
- ✅ Proper indexing on database
- ✅ Optimized queries with select specific fields
- ✅ Loading states for better UX

### Maintenance
- ✅ Type-safe database operations
- ✅ Consistent error handling
- ✅ Comprehensive logging
- ✅ Easy rollback capability

Bu roadmap'i takip ederek Supabase entegrasyonunu adım adım tamamlayabilirsiniz. Her phase'i bitirdikten sonra test etmenizi öneririm.

