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
      <div className="card p-6">
        <h1 className="text-xl font-semibold mb-4">Giriş Yap</h1>
        <div className="grid gap-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">E-posta</label>
            <input className="w-full rounded-lg border px-3 py-2" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="ornek@firma.com" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Şirket</label>
            <select className="w-full rounded-lg border px-3 py-2" value={companyId} onChange={(e)=>setCompanyId(e.target.value)}>
              {companies.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button
            className="btn btn-primary"
            onClick={()=>{ const c = companies.find(x=>x.id===companyId)!; login(email, c.id, c.name); router.push('/') }}
          >Giriş</button>
        </div>
      </div>
      <div className="text-center text-sm text-slate-600">
        Hesabın yok mu? <Link className="text-brand-600" href="/register">Kayıt ol</Link>
      </div>
    </div>
  )
}

