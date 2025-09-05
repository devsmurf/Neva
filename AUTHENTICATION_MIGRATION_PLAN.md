# 🔐 NEVA YALI - AUTHENTICATION SYSTEM MIGRATION PLAN

## 📋 CURRENT SYSTEM ANALYSIS

### 🔍 Mevcut Durum
1. **Authentication**: Mock localStorage-based session management
2. **Contractor Login**: Company selection + hardcoded password (123456)
3. **Admin Login**: Email-only, no real validation
4. **Backend**: Supabase auth functions hazır ama kullanılmıyor

### ⚠️ Tespit Edilen Sorunlar

#### 1. **Admin Approval Buttons** - ❌ BROKEN
```typescript
// app/admin/page.tsx:44-52
const handleApprove = (id: string) => {
  // Gerçek uygulamada API çağrısı yapılacak
  alert(`Görev onaylandı: ${id}`)
}

const handleReject = (id: string) => {
  // Gerçek uygulamada API çağrısı yapılacak
  alert(`Görev reddedildi: ${id}`)
}
```
**Problem**: Sadece alert gösteriyor, gerçek API bağlantısı yok!

#### 2. **Task Permissions** - ❌ PARTIALLY BROKEN
- **Silme**: Admin panelinde sadece frontend button var, backend API yok
- **Düzenleme**: Frontend var ama API endpoint boş (`app/api/tasks/[id]/route.ts`)
- **Durum Güncelleme**: Sadece alert gösteriyor

#### 3. **Contractor Task Selection** - ❌ BROKEN
```typescript
// app/components/TaskForm.tsx:271-275
onSubmit={(payload) => {
  // Placeholder: API entegrasyonu eklenecek (/api/tasks)
  alert(`Taslak kaydedildi (mock). Firma: ${user.company_name}. Admin onayı bekleniyor.`)
  setShowForm(false)
}}
```
**Problem**: Yeni görevler backend'e kaydedilmiyor!

#### 4. **Contractor My Tasks** - ❌ BROKEN
```typescript
// app/(public)/page.tsx:103-106
const myTasks = useMemo(
  () => tasks.filter(t => t.company_id === user?.company_id && !t.is_completed && !completedIds.includes(t.id)),
  [user?.company_id, completedIds]
)
```
**Problem**: Mock data kullanıyor, gerçek kullanıcı görevleri görmüyor!

---

## 🎯 YENİ AUTHENTICATION SYSTEM REQUIREMENTS

### 1. **Taşeron Authentication**
- **Giriş**: Şirket adı seçimi + şifre
- **Şifre Yönetimi**: Şefler tarafından şirketler panelinden oluşturulacak
- **Kayıt**: Yok, sadece mevcut şirketler giriş yapabilir

### 2. **Şef Authentication** 
- **Giriş**: Email + şifre
- **Şifre Değiştirme**: İlk girişte "şifre değiştirmek istiyor musun?" seçeneği
- **Kayıt**: Kaldırılacak, sadece önceden tanımlı adminler

### 3. **Database Tables Needed**
- ✅ `profiles` table (mevcut)
- ❌ `company_passwords` table (yeni)
- ❌ `admin_users` table (yeni)

---

## 🚀 MIGRATION PHASES

## 🔐 Phase 1: Database Schema Updates

### 1.1 Company Password Management Table
```sql
-- New table for company passwords
CREATE TABLE company_passwords (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  password_hash TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE company_passwords ENABLE ROW LEVEL SECURITY;

-- Only admins can manage company passwords
CREATE POLICY "company_passwords_admin_only" ON company_passwords
  FOR ALL USING (is_admin());
```

### 1.2 Admin Users Table  
```sql
-- New table for pre-defined admin users
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  is_first_login BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only authenticated admins can see admin users
CREATE POLICY "admin_users_admin_only" ON admin_users
  FOR ALL USING (is_admin());
```

### 1.3 Update Profiles Table
```sql
-- Add password change tracking
ALTER TABLE profiles ADD COLUMN last_password_change TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN is_first_login BOOLEAN DEFAULT true;
```

### 1.4 Helper Functions
```sql
-- Function to verify company password
CREATE OR REPLACE FUNCTION verify_company_password(
  company_uuid UUID,
  password_input TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT password_hash INTO stored_hash 
  FROM company_passwords 
  WHERE company_id = company_uuid;
  
  IF stored_hash IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Use crypt to verify password
  RETURN crypt(password_input, stored_hash) = stored_hash;
END;
$$;

-- Function to set company password
CREATE OR REPLACE FUNCTION set_company_password(
  company_uuid UUID,
  new_password TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only admins can set passwords
  IF NOT is_admin() THEN
    RETURN FALSE;
  END IF;
  
  INSERT INTO company_passwords (company_id, password_hash, created_by)
  VALUES (
    company_uuid,
    crypt(new_password, gen_salt('bf')),
    auth.uid()
  )
  ON CONFLICT (company_id) 
  DO UPDATE SET 
    password_hash = crypt(new_password, gen_salt('bf')),
    updated_at = NOW();
    
  RETURN TRUE;
END;
$$;

-- Function to verify admin credentials
CREATE OR REPLACE FUNCTION verify_admin_credentials(
  email_input TEXT,
  password_input TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_id UUID;
  stored_hash TEXT;
BEGIN
  SELECT id, password_hash INTO admin_id, stored_hash
  FROM admin_users 
  WHERE email = email_input;
  
  IF stored_hash IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Verify password
  IF crypt(password_input, stored_hash) = stored_hash THEN
    RETURN admin_id;
  END IF;
  
  RETURN NULL;
END;
$$;
```

## 🔧 Phase 2: Authentication API Endpoints

### 2.1 Contractor Login API
**Yeni dosya:** `app/api/auth/contractor/login/route.ts`
```typescript
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { company_id, password } = await request.json()

    if (!company_id || !password) {
      return NextResponse.json(
        { error: 'Company ID and password required' },
        { status: 400 }
      )
    }

    // Verify company password
    const { data: isValid } = await supabaseAdmin
      .rpc('verify_company_password', {
        company_uuid: company_id,
        password_input: password
      })

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Get company info
    const { data: company } = await supabaseAdmin
      .from('companies')
      .select('*')
      .eq('id', company_id)
      .single()

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Create or get user profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('company_id', company_id)
      .eq('role', 'user')
      .single()

    // Create session token (simplified - in production use proper JWT)
    const sessionToken = Buffer.from(JSON.stringify({
      user_id: profile?.id || `contractor-${company_id}`,
      company_id,
      company_name: company.name,
      role: 'user',
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    })).toString('base64')

    // Set secure cookie
    cookies().set('neva-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    return NextResponse.json({
      user: {
        id: profile?.id || `contractor-${company_id}`,
        company_id,
        company_name: company.name,
        role: 'user'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 2.2 Admin Login API
**Yeni dosya:** `app/api/auth/admin/login/route.ts`
```typescript
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Verify admin credentials
    const { data: adminId } = await supabaseAdmin
      .rpc('verify_admin_credentials', {
        email_input: email,
        password_input: password
      })

    if (!adminId) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Get admin user info
    const { data: admin } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('id', adminId)
      .single()

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    // Create session token
    const sessionToken = Buffer.from(JSON.stringify({
      user_id: admin.id,
      email: admin.email,
      name: admin.name,
      role: 'admin',
      is_first_login: admin.is_first_login,
      exp: Date.now() + (24 * 60 * 60 * 1000)
    })).toString('base64')

    // Set secure cookie
    cookies().set('neva-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60
    })

    return NextResponse.json({
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: 'admin',
        is_first_login: admin.is_first_login
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 2.3 Password Change API
**Yeni dosya:** `app/api/auth/admin/change-password/route.ts`
```typescript
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'
import { getSessionUser } from '@/lib/auth-helpers'

export async function PATCH(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user || user.profile.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { current_password, new_password } = await request.json()

    if (!current_password || !new_password) {
      return NextResponse.json(
        { error: 'Current and new passwords required' },
        { status: 400 }
      )
    }

    // Verify current password
    const { data: isValid } = await supabaseAdmin
      .rpc('verify_admin_credentials', {
        email_input: user.profile.email,
        password_input: current_password
      })

    if (!isValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // Update password
    const { error } = await supabaseAdmin
      .from('admin_users')
      .update({
        password_hash: supabaseAdmin.rpc('crypt', {
          password: new_password,
          salt: supabaseAdmin.rpc('gen_salt', { type: 'bf' })
        }),
        is_first_login: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

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

## 🔧 Phase 3: Fix Broken Backend Connections

### 3.1 Task Creation API
**Güncelle:** `app/api/tasks/route.ts`
```typescript
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'
import { getSessionUser } from '@/lib/auth-helpers'

export async function POST(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Contractors can only create tasks for their own company
    if (user.profile.role !== 'admin' && body.company_id !== user.profile.company_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data, error } = await supabaseAdmin
      .from('tasks')
      .insert({
        ...body,
        company_id: user.profile.role === 'admin' ? body.company_id : user.profile.company_id,
        is_approved: false, // New tasks need approval
        created_by: user.id,
        updated_by: user.id
      })
      .select(`
        *,
        company:companies(*),
        project:projects(*)
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
    const my_tasks = searchParams.get('my_tasks') === 'true'
    const approved_only = searchParams.get('approved_only') === 'true'

    let query = supabaseAdmin
      .from('tasks')
      .select(`
        *,
        company:companies(*),
        project:projects(*)
      `)
      .order('due_date', { ascending: true })

    // Filter based on user role and request
    if (user.profile.role !== 'admin') {
      if (my_tasks) {
        // Contractor's own tasks (approved + unapproved)
        query = query.eq('company_id', user.profile.company_id)
      } else if (approved_only) {
        // Only approved tasks for main list
        query = query.eq('is_approved', true)
      }
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 3.2 Task Update API
**Güncelle:** `app/api/tasks/[id]/route.ts`
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
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id } = params

    // Check if user can update this task
    const { data: existingTask } = await supabaseAdmin
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

    const { data, error } = await supabaseAdmin
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
    const { data: existingTask } = await supabaseAdmin
      .from('tasks')
      .select('company_id, is_approved')
      .eq('id', id)
      .single()

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Only allow deletion if user owns the task or is admin
    // Contractors can only delete unapproved tasks
    if (user.profile.role !== 'admin') {
      if (existingTask.company_id !== user.profile.company_id || existingTask.is_approved) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

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

### 3.3 Admin Approval APIs
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Delete rejected task
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

### 3.4 Company Password Management API
**Yeni dosya:** `app/api/admin/companies/[id]/password/route.ts`
```typescript
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'
import { getSessionUser } from '@/lib/auth-helpers'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser()
    if (!user || user.profile.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { password } = await request.json()
    const { id: company_id } = params

    if (!password) {
      return NextResponse.json(
        { error: 'Password required' },
        { status: 400 }
      )
    }

    // Set company password
    const { data: success } = await supabaseAdmin
      .rpc('set_company_password', {
        company_uuid: company_id,
        new_password: password
      })

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to set password' },
        { status: 400 }
      )
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

## 🎨 Phase 4: Frontend Updates

### 4.1 Update Session Provider
**Güncelle:** `app/components/SessionProvider.tsx`
```typescript
"use client"
import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

type Session = {
  id: string
  email?: string
  name?: string
  company_id?: string
  company_name?: string
  role: 'user' | 'admin'
  is_first_login?: boolean
}

type SessionCtx = {
  user: Session | null
  loginContractor: (company_id: string, password: string) => Promise<boolean>
  loginAdmin: (email: string, password: string) => Promise<boolean>
  changePassword: (current: string, newPassword: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const Ctx = createContext<SessionCtx | null>(null)

export function useSession() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Session check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const api = useMemo<SessionCtx>(() => ({
    user,
    loading,
    
    loginContractor: async (company_id: string, password: string) => {
      try {
        const response = await fetch('/api/auth/contractor/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ company_id, password })
        })
        
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          return true
        }
        return false
      } catch {
        return false
      }
    },
    
    loginAdmin: async (email: string, password: string) => {
      try {
        const response = await fetch('/api/auth/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })
        
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          return true
        }
        return false
      } catch {
        return false
      }
    },
    
    changePassword: async (current: string, newPassword: string) => {
      try {
        const response = await fetch('/api/auth/admin/change-password', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            current_password: current, 
            new_password: newPassword 
          })
        })
        
        if (response.ok) {
          setUser(prev => prev ? { ...prev, is_first_login: false } : null)
          return true
        }
        return false
      } catch {
        return false
      }
    },
    
    logout: async () => {
      try {
        await fetch('/api/auth/logout', { method: 'POST' })
      } catch {}
      setUser(null)
      router.push('/')
    }
  }), [user, loading, router])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}
```

### 4.2 Update Login Pages
**Güncelle:** `app/contractor/login/page.tsx`
```typescript
"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession } from '@/components/SessionProvider'
import { useRouter } from 'next/navigation'

export default function ContractorLoginPage() {
  const { loginContractor } = useSession()
  const [companies, setCompanies] = useState<any[]>([])
  const [selectedCompany, setSelectedCompany] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Fetch companies
  useEffect(() => {
    fetch('/api/companies')
      .then(res => res.json())
      .then(data => setCompanies(data))
      .catch(() => setError('Şirketler yüklenemedi'))
  }, [])

  const handleSubmit = async () => {
    if (!selectedCompany || !password) {
      setError('Lütfen tüm alanları doldurun')
      return
    }

    setLoading(true)
    setError('')

    const success = await loginContractor(selectedCompany, password)
    
    if (success) {
      router.push('/')
    } else {
      setError('Hatalı şifre! Şirket şifresi doğru değil.')
    }
    
    setLoading(false)
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Taşeron Girişi</h1>
          <p className="text-slate-600 mt-2">Şirketinizi seçin ve şifrenizi girin</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              🏢 Şirket Seçin
            </label>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              disabled={loading}
            >
              <option value="">Şirketinizi seçin...</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              🔒 Şifre
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrenizi girin"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !selectedCompany || !password}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-800">
            ← Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  )
}
```

**Güncelle:** `app/admin/login/page.tsx`
```typescript
"use client"
import Link from 'next/link'
import { useState } from 'react'
import { useSession } from '@/components/SessionProvider'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const { loginAdmin } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Lütfen e-posta ve şifrenizi girin')
      return
    }

    setLoading(true)
    setError('')

    const success = await loginAdmin(email, password)
    
    if (success) {
      router.push('/admin')
    } else {
      setError('Hatalı e-posta veya şifre!')
    }
    
    setLoading(false)
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Şef Girişi</h1>
          <p className="text-slate-600 mt-2">E-posta ve şifrenizle giriş yapın</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              📧 E-posta
            </label>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@ronesans.com"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              🔒 Şifre
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrenizi girin"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !email || !password}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-800">
            ← Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  )
}
```

## 📊 Phase 5: Migration Scripts

### 5.1 Database Migration File
**Yeni dosya:** `supabase/migrations/20250904120001_auth_system.sql`

### 5.2 Seed Admin Users
**Yeni dosya:** `supabase/migrations/20250904120002_seed_admin_users.sql`

### 5.3 Seed Company Passwords  
**Yeni dosya:** `supabase/migrations/20250904120003_seed_company_passwords.sql`

---

## ✅ IMPLEMENTATION CHECKLIST

### Database (Phase 1)
- [ ] Create `company_passwords` table
- [ ] Create `admin_users` table  
- [ ] Update `profiles` table
- [ ] Add helper functions
- [ ] Set up RLS policies

### API Endpoints (Phase 2 & 3)
- [ ] `/api/auth/contractor/login`
- [ ] `/api/auth/admin/login`
- [ ] `/api/auth/admin/change-password`
- [ ] `/api/tasks` (POST/GET)
- [ ] `/api/tasks/[id]` (PATCH/DELETE)
- [ ] `/api/admin/approve/[id]`
- [ ] `/api/admin/reject/[id]`
- [ ] `/api/admin/companies/[id]/password`

### Frontend (Phase 4)
- [ ] Update `SessionProvider`
- [ ] Update contractor login page
- [ ] Update admin login page
- [ ] Add password change modal
- [ ] Update task forms to use APIs
- [ ] Update admin approval buttons
- [ ] Fix "My Tasks" to show real data

### Testing
- [ ] Test contractor login flow
- [ ] Test admin login flow
- [ ] Test password changes
- [ ] Test task creation/approval
- [ ] Test permissions and RLS
- [ ] Test "My Tasks" visibility

---

## 🚨 CRITICAL NOTES

1. **Remove Registration**: Kayıt olma sistemini tamamen kaldır
2. **Password Security**: bcrypt kullan, plain text şifre sakla
3. **Session Management**: Secure HTTP-only cookies
4. **RLS Policies**: Her endpoint için doğru yetki kontrolü
5. **Error Handling**: Kullanıcı dostu hata mesajları
6. **Testing**: Her feature'ı test et

Bu plan uygulandıktan sonra tüm authentication ve backend bağlantıları düzgün çalışacak! 🎯


