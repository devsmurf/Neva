"use client"
import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

export type Session = {
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
      console.log('🔍 Checking session...')
      const response = await fetch('/api/auth/session')
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Session valid:', data.user?.role)
        setUser(data.user)
      } else {
        console.log('❌ Session invalid/expired:', response.status)
        setUser(null)
      }
    } catch (error) {
      console.error('Session check failed:', error)
      setUser(null)
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
          const data = await response.json()
          setUser(data.user)
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
      } catch { }
      setUser(null)
      router.push('/')
    }
  }), [user, loading, router])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

