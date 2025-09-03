"use client"
import Link from 'next/link'
import { useSession } from './SessionProvider'
import { usePathname } from 'next/navigation'

export default function NavBar() {
  const { user, logout } = useSession()
  const pathname = usePathname()

  // Ana sayfada ve kullanıcı giriş yapmamışsa navbar'ı gizle
  if (pathname === '/' && !user) {
    return null
  }

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 mb-6 shadow-lg border border-white/40">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-base md:text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-500 hover:to-purple-500 transition-all duration-200">
          NEVA YALI
        </Link>
        <div className="flex items-center gap-2">
          {user && <Link className="btn btn-ghost" href="/">📋 Ana Liste</Link>}
          {user?.role === 'user' && (
            <Link className="btn btn-ghost" href="/">🔧 Görevlerim</Link>
          )}
          {user?.role === 'admin' && (
            <Link className="btn btn-ghost" href="/admin">📋 Panelim</Link>
          )}
          <div className="w-px h-6 bg-slate-300/60 mx-2" />
          {user ? (
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                <span className="text-sm font-medium text-indigo-700">{user.company_name}</span>
              </div>
              <button className="btn btn-primary" onClick={logout}>Çıkış</button>
            </div>
          ) : (
            <Link className="btn btn-primary" href="/login">Giriş</Link>
          )}
        </div>
      </div>
    </div>
  )
}
