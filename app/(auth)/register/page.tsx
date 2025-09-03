"use client"
import Link from 'next/link'
import { useState } from 'react'
import { useSession } from '@/components/SessionProvider'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const { register } = useSession()
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const router = useRouter()

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="card p-5 md:p-6">
        <h1 className="text-lg md:text-xl font-semibold mb-4">Kayıt Ol</h1>
        <div className="grid gap-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">E-posta</label>
            <input className="w-full rounded-lg border px-3 py-2 text-sm" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="ornek@firma.com" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Firma Adı</label>
            <input className="w-full rounded-lg border px-3 py-2 text-sm" value={companyName} onChange={(e)=>setCompanyName(e.target.value)} placeholder="Örn: Beta Beton" />
          </div>
          <button
            className="btn btn-primary"
            onClick={()=>{ if(!companyName) return; register(email || 'kullanici@ornek.com', companyName); router.push('/') }}
          >Kayıt Ol</button>
        </div>
      </div>
      <div className="text-center text-sm text-slate-600">
        Hesabın var mı? <Link className="text-brand-600" href="/login">Giriş yap</Link>
      </div>
    </div>
  )
}
