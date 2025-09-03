"use client"
import Link from 'next/link'
import { useState } from 'react'
import { useSession } from '@/components/SessionProvider'
import { companies } from '@/lib/mock'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { login } = useSession()
  const [email, setEmail] = useState('')
  const [companyId, setCompanyId] = useState(companies[0]?.id || '')
  const router = useRouter()

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="card p-5 md:p-6">
        <h1 className="text-lg md:text-xl font-semibold mb-4">Giriş Yap</h1>
        <div className="grid gap-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">E-posta</label>
            <input className="w-full rounded-lg border px-3 py-2 text-sm" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="ornek@firma.com" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Şirket</label>
            <select className="w-full rounded-lg border px-3 py-2 text-sm" value={companyId} onChange={(e)=>setCompanyId(e.target.value)}>
              {companies.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <button
              className="btn btn-primary min-w-[160px]"
              onClick={()=>{ const c = companies.find(x=>x.id===companyId)!; login(email || 'kullanici@ornek.com', c.id, c.name, 'user'); router.push('/') }}
            >Taşeron Girişi</button>
            <button
              className="btn btn-ghost min-w-[160px]"
              onClick={()=>{ login(email || 'sef@ronesans.com', 'ronesans', 'Rönesans Yönetim', 'admin'); router.push('/admin') }}
            >Rönesans Şef Girişi</button>
          </div>
        </div>
      </div>
      <div className="text-center text-sm text-slate-600">
        Hesabın yok mu? <Link className="text-brand-600" href="/register">Kayıt ol</Link>
      </div>
    </div>
  )
}
