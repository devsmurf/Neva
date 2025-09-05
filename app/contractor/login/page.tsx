"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession } from '@/components/SessionProvider'
import { useRouter } from 'next/navigation'

export default function ContractorLoginPage() {
    const { loginContractor, user, loading: sessionLoading } = useSession()
    const [selectedCompany, setSelectedCompany] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const [companies, setCompanies] = useState<any[]>([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // ALL HOOKS MUST BE AT TOP LEVEL - BEFORE ANY EARLY RETURNS

    // Redirect if already logged in as user
    useEffect(() => {
        if (!sessionLoading && user?.role === 'user') {
            router.push('/')
        }
    }, [user, sessionLoading, router])

    // Fetch companies
    useEffect(() => {
        fetch('/api/companies')
            .then(res => res.json())
            .then(data => setCompanies(data))
            .catch(() => setError('Şirketler yüklenemedi'))
    }, [])

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
        <div className="h-screen w-screen flex items-center justify-center bg-white px-4 overflow-hidden fixed inset-0">
            {/* Sol üst geri butonu */}
            <Link href="/" className="absolute top-32 left-3 z-[9999] inline-flex items-center justify-center w-10 h-10 text-slate-700 hover:text-green-600 text-lg transition-all duration-200 bg-white rounded-full shadow-lg border-2 border-slate-200 hover:border-green-400 hover:shadow-xl">
                <span>←</span>
            </Link>

            <div className="w-full max-w-xs">
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
                            Şirketinizi seçin ve giriş yapın
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                🏢 Şirket Seçin
                            </label>
                            <select
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400 transition-all duration-200"
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
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                🔐 Şirket Şifresi
                            </label>
                            <input
                                type="password"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400 transition-all duration-200"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Şirket şifrenizi girin"
                                disabled={loading}
                            />

                            {error && (
                                <div className="text-red-600 text-xs bg-red-50 p-2 rounded-lg mt-2">
                                    {error}
                                </div>
                            )}
                            <div className="mt-1 p-2 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-xs text-green-700">
                                    💡 Varsayılan şifre: <code className="bg-green-100 px-1 py-0.5 rounded text-xs">123456</code>
                                </p>
                            </div>
                        </div>

                        <button
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2.5 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg mt-3 disabled:opacity-50"
                            onClick={handleSubmit}
                            disabled={loading || !selectedCompany || !password}
                        >
                            {loading ? '⏳ Giriş yapılıyor...' : '🚀 Taşeron Paneline Giriş'}
                        </button>
                    </div>


                </div>
            </div>
        </div>
    )
}
