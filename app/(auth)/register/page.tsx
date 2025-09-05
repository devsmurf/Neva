"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home page - no registration needed
    router.replace('/')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-center">
        <div className="text-red-600 mb-4">⚠️</div>
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Kayıt Gerekmiyor</h2>
        <p className="text-slate-600 mb-4">
          Sisteme taşeron veya şef olarak giriş yapabilirsiniz.
        </p>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
    </div>
  )
}
