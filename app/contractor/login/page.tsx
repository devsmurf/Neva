"use client"
import Link from 'next/link'
import { useState } from 'react'
import { useSession } from '@/components/SessionProvider'
import { companies } from '@/lib/mock'
import { useRouter } from 'next/navigation'

export default function ContractorLoginPage() {
    const { login } = useSession()
    const [selectedCompany, setSelectedCompany] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const handleSubmit = () => {
        if (!selectedCompany) {
            alert('Lütfen şirketinizi seçin')
            return
        }

        if (!password) {
            alert('Lütfen şifrenizi girin')
            return
        }

        // Basit şifre kontrolü (gerçek uygulamada server-side olacak)
        const correctPassword = '123456' // Tüm şirketler için aynı şifre (demo için)

        if (password !== correctPassword) {
            alert('Hatalı şifre! Demo için şifre: 123456')
            return
        }

        const company = companies.find(c => c.id === selectedCompany)
        if (!company) {
            alert('Şirket bulunamadı')
            return
        }

        // Taşeron olarak giriş yap (user rolü)
        login(`${company.name.toLowerCase().replace(/\s+/g, '')}@firma.com`, company.id, company.name, 'user')
        router.push('/')
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="max-w-md mx-auto">
                <div className="card p-8">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4">
                            <span className="text-3xl font-bold text-white">T</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">Taşeron Girişi</h1>
                        <p className="text-slate-600 mt-2">
                            Şirketinizi seçin ve şifrenizi girin
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Şirket Seçin
                            </label>
                            <select
                                className="w-full rounded-xl border border-slate-300/60 bg-white/90 backdrop-blur-sm px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200"
                                value={selectedCompany}
                                onChange={(e) => setSelectedCompany(e.target.value)}
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
                                Şirket Şifresi
                            </label>
                            <input
                                type="password"
                                className="w-full rounded-xl border border-slate-300/60 bg-white/90 backdrop-blur-sm px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Şirket şifrenizi girin"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                Demo için şifre: <code className="bg-slate-100 px-1 rounded">123456</code>
                            </p>
                        </div>

                        <button
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                            onClick={handleSubmit}
                        >
                            Taşeron Paneline Giriş
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-medium text-green-800 mb-2">Mevcut Şirketler:</h4>
                            <ul className="text-sm text-green-700 space-y-1">
                                {companies.map(company => (
                                    <li key={company.id}>• {company.name}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="text-center mt-4">
                            <Link href="/" className="text-slate-500 hover:text-slate-700 text-sm">
                                ← Ana sayfaya dön
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
