"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession } from '@/components/SessionProvider'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
    const { loginAdmin, user, loading: sessionLoading } = useSession()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    // Redirect if already logged in as admin
    useEffect(() => {
        if (!sessionLoading && user?.role === 'admin') {
            router.push('/admin')
        }
    }, [user, sessionLoading, router])

    // Show loading during session check
    if (sessionLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Yükleniyor...</p>
                </div>
            </div>
        )
    }

    // Don't show login form if already logged in as admin
    if (user?.role === 'admin') {
        return null
    }

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
        <div className="h-screen w-screen flex items-center justify-center bg-white px-4 overflow-hidden fixed inset-0">
            {/* Sol üst geri butonu */}
            <Link href="/" className="absolute top-32 left-3 z-[9999] inline-flex items-center justify-center w-10 h-10 text-slate-700 hover:text-orange-600 text-lg transition-all duration-200 bg-white rounded-full shadow-lg border-2 border-slate-200 hover:border-orange-400 hover:shadow-xl">
                <span>←</span>
            </Link>

            <div className="w-full max-w-xs">
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                    {/* Header */}
                    <div className="text-center mb-4">
                        <div className="w-12 h-12 mx-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-2 shadow-lg">
                            <span className="text-lg font-bold text-white">Ş</span>
                        </div>
                        <h1 className="text-base font-bold text-slate-800 mb-1">
                            Rönesans Şef Girişi
                        </h1>
                        <p className="text-slate-600 text-xs">
                            E-posta ve şifrenizle giriş yapın
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                📧 E-posta
                            </label>
                            <input
                                type="email"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-400 transition-all duration-200"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@ronesans.com"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                🔐 Şifre
                            </label>
                            <input
                                type="password"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-400 transition-all duration-200"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Şifrenizi girin"
                                disabled={loading}
                            />
                            <div className="mt-1 p-2 bg-orange-50 rounded-lg border border-orange-200">
                                <p className="text-xs text-orange-700">
                                    💡 Demo şifre: <code className="bg-orange-100 px-1 py-0.5 rounded text-xs">admin123</code>
                                </p>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-600 text-xs bg-red-50 p-2 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2.5 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg mt-3 disabled:opacity-50"
                            onClick={handleSubmit}
                            disabled={loading || !email || !password}
                        >
                            {loading ? '⏳ Giriş yapılıyor...' : '🔑 Şef Paneline Giriş'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}