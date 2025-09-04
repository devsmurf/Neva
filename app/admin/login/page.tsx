"use client"
import Link from 'next/link'
import { useState } from 'react'
import { useSession } from '@/components/SessionProvider'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
    const { login } = useSession()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isRegister, setIsRegister] = useState(false)
    const [name, setName] = useState('')
    const router = useRouter()

    const handleSubmit = () => {
        if (!email) {
            alert('Lütfen e-posta adresinizi girin')
            return
        }

        if (isRegister && !name) {
            alert('Lütfen adınızı girin')
            return
        }

        // Şef olarak giriş yap (admin rolü)
        login(email, 'admin-company', name || 'Şef', 'admin', name || 'Şef')
        router.push('/admin')
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
                            {isRegister ? 'Rönesans Şef Kaydı' : 'Rönesans Şef Girişi'}
                        </h1>
                        <p className="text-slate-600 text-xs">
                            {isRegister ? 'Yeni hesap oluştur' : 'Giriş yapın'}
                        </p>
                    </div>

                    <div className="space-y-3">
                        {isRegister && (
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    👤 Ad Soyad
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-400 transition-all duration-200"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Örn: Ahmet Yılmaz"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                ✉️ E-posta
                            </label>
                            <input
                                type="email"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-400 transition-all duration-200"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="sef@ronesans.com"
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
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2.5 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg mt-3"
                            onClick={handleSubmit}
                        >
                            {isRegister ? 'Şef Hesabı Oluştur' : 'Şef Paneline Giriş'}
                        </button>

                        <div className="text-center pt-3">
                            <button
                                onClick={() => setIsRegister(!isRegister)}
                                className="text-orange-600 hover:text-orange-700 text-xs font-medium hover:underline transition-all duration-200"
                            >
                                {isRegister ? '← Zaten hesabım var' : '+ Yeni hesap oluştur'}
                            </button>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}
