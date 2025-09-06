"use client"
import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import type { SessionUser } from '@/lib/auth-helpers'
import type { Session, AuthChangeEvent } from '@supabase/supabase-js'

type SessionCtx = {
    user: SessionUser | null
    loading: boolean
    session: Session | null
    loginWithEmail: (email: string) => Promise<boolean>
    loginWithPassword: (email: string, password: string) => Promise<boolean>
    loginContractor: (email: string, password: string) => Promise<boolean>
    loginAdmin: (email: string, password: string) => Promise<boolean>
    logout: () => Promise<void>
}

const Ctx = createContext<SessionCtx | undefined>(undefined)

export function useSession() {
    const ctx = useContext(Ctx)
    if (!ctx) throw new Error('useSession must be used within SupabaseSessionProvider')
    return ctx
}

export default function SupabaseSessionProvider({ children }: { children: React.ReactNode }) {
    // Check if Supabase is properly configured FIRST
    const isSupabaseConfigured = Boolean(supabase)

    // Show error UI if Supabase is not configured (before any hooks)
    if (!isSupabaseConfigured) {
        console.error('Supabase client is not properly configured')
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-xl font-bold text-red-600 mb-2">Configuration Error</h1>
                    <p className="text-gray-600">Supabase configuration is missing. Please check your environment variables.</p>
                </div>
            </div>
        )
    }

    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<SessionUser | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    // Get session user from Supabase Auth
    const getSessionUser = useCallback(async (): Promise<SessionUser | null> => {
        try {

            const { data: { user }, error } = await supabase.auth.getUser()

            if (error || !user) {
                console.log('No authenticated user found')
                return null
            }

            // Get user profile from database
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select(`
                    *,
                    company:companies(*)
                `)
                .eq('id', user.id)
                .single()

            if (profileError) {
                console.warn('Profile fetch error:', profileError.message)
                // Return basic user info even if profile fetch fails
                return {
                    id: user.id,
                    email: user.email || '',
                    name: user.email || '',
                    company_id: undefined,
                    company_name: undefined,
                    role: 'user'
                }
            }

            return {
                id: user.id,
                email: user.email || '',
                name: profile.name || user.email || '',
                company_id: profile.company_id,
                company_name: profile.company?.name,
                role: profile.role || 'user'
            }
        } catch (error) {
            console.error('Session user error:', error)
            return null
        }
    }, [])

    // Initialize session
    useEffect(() => {
        const initializeSession = async () => {
            try {

                const { data: { session } } = await supabase.auth.getSession()
                setSession(session)

                if (session) {
                    const user = await getSessionUser()
                    setUser(user)
                }

                setLoading(false)
            } catch (error) {
                console.error('Session initialization error:', error)
                setLoading(false)
            }
        }

        initializeSession()
    }, [getSessionUser])

    // Listen for auth changes
    useEffect(() => {

        // Handle cross-tab session synchronization
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'supabase.auth.token' || event.key?.startsWith('sb-')) {
                // Session changed in another tab, refresh this tab's session
                setTimeout(() => {
                    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
                        setSession(session)
                        if (session) {
                            getSessionUser().then(setUser)
                        } else {
                            setUser(null)
                        }
                    })
                }, 100) // Small delay for Yandex browser compatibility
            }
        }

        // Enhanced cross-tab communication for Yandex browser
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                // Tab became visible, check for session updates
                supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
                    if (session !== null && session !== undefined) {
                        setSession(session)
                        if (session) {
                            getSessionUser().then(setUser)
                        }
                    }
                })
            }
        }

        // Listen for storage changes (cross-tab communication)
        window.addEventListener('storage', handleStorageChange)
        // Listen for visibility changes (Yandex browser fallback)
        document.addEventListener('visibilitychange', handleVisibilityChange)

        try {
            const { data: { subscription } } = supabase.auth.onAuthStateChange(
                async (event: AuthChangeEvent, session: Session | null) => {
                    console.log('Auth state change:', event)
                    setSession(session)

                    if (session) {
                        const user = await getSessionUser()
                        setUser(user)
                    } else {
                        setUser(null)
                    }

                    setLoading(false)
                }
            )

            return () => {
                subscription.unsubscribe()
                window.removeEventListener('storage', handleStorageChange)
                document.removeEventListener('visibilitychange', handleVisibilityChange)
            }
        } catch (error) {
            console.error('Auth state change error:', error)
            setLoading(false)
        }
    }, [getSessionUser])

    const api = useMemo<SessionCtx>(() => ({
        user,
        loading,
        session,

        loginWithEmail: async (email: string) => {
            try {
                const { error } = await supabase.auth.signInWithOtp({
                    email,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`
                    }
                })
                if (error) console.error('Email login error:', error)
                return !error
            } catch (error) {
                console.error('Email login exception:', error)
                return false
            }
        },

        loginWithPassword: async (email: string, password: string) => {
            try {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                })
                if (error) console.error('Password login error:', error)
                return !error
            } catch (error) {
                console.error('Password login exception:', error)
                return false
            }
        },

        // Contractor login with Supabase Auth
        loginContractor: async (email: string, password: string) => {
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                })

                if (error || !data.user) {
                    console.error('Contractor login error:', error)
                    return false
                }

                // Sync session to server cookies so API routes see auth
                try {
                    const sessionRes = await supabase.auth.getSession()
                    const at = sessionRes.data.session?.access_token
                    const rt = sessionRes.data.session?.refresh_token
                    if (at && rt) {
                        await fetch('/api/auth/sync', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ access_token: at, refresh_token: rt }),
                            credentials: 'include'
                        })
                    }
                } catch (e) {
                    console.warn('Session cookie sync failed:', e)
                }

                // User state will be updated by auth state change listener
                return true
            } catch (error) {
                console.error('Contractor login error:', error)
                return false
            }
        },

        // For backward compatibility - admin login
        loginAdmin: async (email: string, password: string) => {
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                })

                if (error || !data.user) {
                    console.error('Admin login error:', error)
                    return false
                }

                // Sync session to server cookies so API routes see auth
                try {
                    const sessionRes = await supabase.auth.getSession()
                    const at = sessionRes.data.session?.access_token
                    const rt = sessionRes.data.session?.refresh_token
                    if (at && rt) {
                        await fetch('/api/auth/sync', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ access_token: at, refresh_token: rt }),
                            credentials: 'include'
                        })
                    }
                } catch (e) {
                    console.warn('Session cookie sync failed:', e)
                }

                // User state will be updated by auth state change listener
                return true
            } catch (error) {
                console.error('Admin login error:', error)
                return false
            }
        },

        logout: async () => {
            try {
                console.log('🚪 Starting logout process...')

                const { error } = await supabase.auth.signOut()
                if (error) {
                    console.error('Sign out error:', error)
                } else {
                    console.log('✅ Logout successful')
                }

                // Clear local state
                setUser(null)
                setSession(null)

                // Clear server cookies too
                try {
                    await fetch('/api/auth/logout-ssr', { method: 'POST', credentials: 'include' })
                } catch {}

                // Hard redirect immediately to avoid any transient flashes
                if (typeof window !== 'undefined') {
                    window.location.replace('/')
                    return
                }
            } catch (error) {
                console.error('Logout error:', error)
                // Clear local state even if logout fails
                setUser(null)
                setSession(null)
                try {
                    await fetch('/api/auth/logout-ssr', { method: 'POST', credentials: 'include' })
                } catch {}
                if (typeof window !== 'undefined') {
                    window.location.replace('/')
                    return
                }
            }
        }
    }), [user, loading, session, router])

    return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}
