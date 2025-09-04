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
                            />
                            <div className="mt-1 p-2 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-xs text-green-700">
                                    💡 Demo şifre: <code className="bg-green-100 px-1 py-0.5 rounded text-xs">123456</code>
                                </p>
                            </div>
                        </div>

                        <button
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2.5 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg mt-3"
                            onClick={handleSubmit}
                        >
                            Taşeron Paneline Giriş
                        </button>
                    </div>


                </div>
            </div>
        </div>
    )
}
