"use client"
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Role = 'user' | 'admin'
export type Session = {
  id: string
  email: string
  company_id: string
  company_name: string
  user_name?: string
  role: Role
}

type SessionCtx = {
  user: Session | null
  login: (email: string, company_id: string, company_name: string, role?: Role, user_name?: string) => void
  register: (email: string, company_name: string) => void
  logout: () => void
}

const Ctx = createContext<SessionCtx | null>(null)

export function useSession() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSession must be used inside SessionProvider')
  return ctx
}

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Session | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('neva-session')
    if (raw) try { setUser(JSON.parse(raw)) } catch { }
  }, [])

  const api = useMemo<SessionCtx>(() => ({
    user,
    login: (email, company_id, company_name, role = 'user', user_name) => {
      const u: Session = { id: crypto.randomUUID(), email, company_id, company_name, role, user_name }
      setUser(u)
      localStorage.setItem('neva-session', JSON.stringify(u))
    },
    register: (email, company_name) => {
      // In real app: create user + company pick/assign. For now, create a mock company id by slugging name.
      const cid = 'c-' + company_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const u: Session = { id: crypto.randomUUID(), email, company_id: cid, company_name, role: 'user' }
      setUser(u)
      localStorage.setItem('neva-session', JSON.stringify(u))
    },
    logout: () => {
      setUser(null)
      localStorage.removeItem('neva-session')
    }
  }), [user])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

