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
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="max-w-md mx-auto">
                <div className="card p-8">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4">
                            <span className="text-3xl font-bold text-white">Ş</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            {isRegister ? 'Rönesans Şef Kaydı' : 'Rönesans Şef Girişi'}
                        </h1>
                        <p className="text-slate-600 mt-2">
                            {isRegister ? 'Yeni şef hesabı oluşturun' : 'Şef paneline giriş yapın'}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {isRegister && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Ad Soyad
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border border-slate-300/60 bg-white/90 backdrop-blur-sm px-4 py-3 outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-400 transition-all duration-200"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Örn: Ahmet Yılmaz"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                E-posta
                            </label>
                            <input
                                type="email"
                                className="w-full rounded-xl border border-slate-300/60 bg-white/90 backdrop-blur-sm px-4 py-3 outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-400 transition-all duration-200"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ornek@firma.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Şifre
                            </label>
                            <input
                                type="password"
                                className="w-full rounded-xl border border-slate-300/60 bg-white/90 backdrop-blur-sm px-4 py-3 outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-400 transition-all duration-200"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                            onClick={handleSubmit}
                        >
                            {isRegister ? 'Şef Hesabı Oluştur' : 'Şef Paneline Giriş'}
                        </button>

                        <div className="text-center pt-4">
                            <button
                                onClick={() => setIsRegister(!isRegister)}
                                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                            >
                                {isRegister ? 'Zaten hesabım var, giriş yap' : 'Yeni hesap oluştur'}
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                        <Link href="/" className="text-slate-500 hover:text-slate-700 text-sm">
                            ← Ana sayfaya dön
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
