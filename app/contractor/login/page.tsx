"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession } from '@/components/SupabaseSessionProvider'
import { useRouter } from 'next/navigation'

export default function ContractorLoginPage() {
    const { loginContractor, user, loading: sessionLoading } = useSession()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // ALL HOOKS MUST BE AT TOP LEVEL - BEFORE ANY EARLY RETURNS

    // Redirect if already logged in as user
    useEffect(() => {
        if (!sessionLoading && user?.role === 'user') {
            router.push('/')
        }
    }, [user, sessionLoading, router])

    // No longer need to fetch companies - using email login

    // Show loading during session check
    if (sessionLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Yükleniyor...</p>
                </div>
            </div>
        )
    }

    // Don't show login form if already logged in as user
    if (user?.role === 'user') {
        return null
    }

    const handleSubmit = async () => {
        if (!email || !password) {
            setError('Lütfen email ve şifrenizi girin')
            return
        }

        setLoading(true)
        setError('')

        const success = await loginContractor(email, password)

        if (success) {
            router.push('/')
        } else {
            setError('Hatalı email veya şifre!')
        }

        setLoading(false)
    }

    return (
        <div className="fixed inset-0 h-screen w-screen flex items-center justify-center bg-white px-4 pt-20 md:pt-24 overflow-hidden">
            <div className="w-full max-w-xs">
                {/* Geri butonu - header altında, akışta */}
                <Link href="/" className="inline-flex items-center justify-center w-10 h-10 text-slate-700 hover:text-green-600 text-lg transition-all duration-200 bg-white rounded-full shadow-lg border-2 border-slate-200 hover:border-green-400 hover:shadow-xl mb-3">
                    <span>←</span>
                </Link>

                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                    {/* Header */}
                    <div className="text-center mb-4">
                        <div className="w-12 h-12 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-2 shadow-lg">
                            <span className="text-lg font-bold text-white">T</span>
                        </div>
                        <h1 className="text-base font-bold text-slate-800 mb-1">
                            Taşeron Girişi
                        </h1>
                        <p className="text-slate-600 text-xs">
                            Email ve şifrenizle giriş yapın
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                📧 Email Adresiniz
                            </label>
                            <input
                                type="email"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400 transition-all duration-200"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ornek@sirket.com"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                🔐 Şifreniz
                            </label>
                            <input
                                type="password"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400 transition-all duration-200"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Şifrenizi girin"
                                disabled={loading}
                            />

                            {error && (
                                <div className="text-red-600 text-xs bg-red-50 p-2 rounded-lg mt-2">
                                    {error}
                                </div>
                            )}
                            <div className="mt-1 p-2 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-xs text-green-700">
                                    💡 Test hesabı: <code className="bg-green-100 px-1 py-0.5 rounded text-xs">contractor@test.com</code>
                                    <br />
                                    🔑 Şifre: <code className="bg-green-100 px-1 py-0.5 rounded text-xs">ContractorTest123!</code>
                                </p>
                            </div>
                        </div>

                        <button
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2.5 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg mt-3 disabled:opacity-50"
                            onClick={handleSubmit}
                            disabled={loading || !email || !password}
                        >
                            {loading ? '⏳ Giriş yapılıyor...' : '🚀 Taşeron Paneline Giriş'}
                        </button>
                    </div>


                </div>
            </div>
        </div>
    )
}
