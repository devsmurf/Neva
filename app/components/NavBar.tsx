"use client"
import Link from 'next/link'
import { useSession } from './SessionProvider'
import { usePathname } from 'next/navigation'
import { useState, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'

// Tab context for contractor navigation
type TabContextType = {
  activeTab: 'all' | 'my'
  setActiveTab: (tab: 'all' | 'my') => void
}

const TabContext = createContext<TabContextType | null>(null)

export const useTabContext = () => {
  const context = useContext(TabContext)
  if (!context) {
    throw new Error('useTabContext must be used within a TabProvider')
  }
  return context
}

export const TabProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all')
  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  )
}

// Tab navigation for contractors
function TabNavigation() {
  const { activeTab, setActiveTab } = useTabContext()

  return (
    <div className="flex items-center gap-0.5 md:gap-1 scale-[0.85] md:scale-100">
      <button
        className={`btn text-[8px] md:text-xs px-1 md:px-2 py-0 shadow-none md:shadow ${activeTab === 'all' ? 'btn-primary' : 'btn-ghost'} transform-none`}
        onClick={() => setActiveTab('all')}
      >
        <span className="hidden md:inline">📋 </span>Ana Liste
      </button>
      <span className="text-slate-400 text-[8px] md:text-xs">/</span>
      <button
        className={`btn text-[8px] md:text-xs px-1 md:px-2 py-0 shadow-none md:shadow ${activeTab === 'my' ? 'btn-primary' : 'btn-ghost'} transform-none`}
        onClick={() => setActiveTab('my')}
      >
        <span className="hidden md:inline">📁 </span>Görevlerim
      </button>
    </div>
  )
}

export default function NavBar() {
  const { user, logout } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  // Hide navbar on specific login routes
  if (pathname === '/admin/login' || pathname === '/contractor/login') {
    return null
  }

  // Ana sayfada ve kullanıcı giriş yapmamışsa navbar'ı gizle
  if (pathname === '/' && !user) {
    return null
  }

  return (
    <div className="bg-white rounded-xl p-2 md:p-2.5 mb-4 shadow-sm border border-slate-200">
      {/* Mobil ve desktop layout */}
      <div className="flex items-center justify-between gap-1 md:gap-2">
        {/* Sol taraf - Sadece Logo Yazısı */}
        <div className="flex items-center min-w-0">
          <Link href="/" className="text-sm md:text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 truncate">
            NEVA YALI
          </Link>
        </div>

        {/* Orta - Navigation butonları */}
        <div className="flex items-center justify-center flex-1">
          {user?.role === 'user' && (
            <TabNavigation />
          )}
          {user?.role === 'admin' && (
            <div className="flex items-center gap-0.5 md:gap-1 scale-[0.85] md:scale-100">
              <Link
                className={`btn text-[8px] md:text-xs px-1 md:px-2 py-0 shadow-none md:shadow ${pathname === '/' ? 'btn-primary' : 'btn-ghost'} transform-none`}
                href="/"
              >
                <span className="hidden md:inline">📋 </span>Ana Liste
              </Link>
              <span className="text-slate-400 text-[8px] md:text-xs">/</span>
              <Link
                className={`btn text-[8px] md:text-xs px-1 md:px-2 py-0 shadow-none md:shadow ${pathname === '/admin' ? 'btn-primary' : 'btn-ghost'} transform-none`}
                href="/admin"
              >
                <span className="hidden md:inline">👑 </span>Panelim
              </Link>
            </div>
          )}
        </div>

        {/* Sağ taraf - Şirket ismi ve Çıkış */}
        <div className="flex items-center gap-0.5 md:gap-1 justify-end min-w-0">
          {user ? (
            <>
              <div className="px-1 md:px-1.5 py-0.5 bg-slate-50 rounded-md border border-slate-200 min-w-0">
                <span className="text-[10px] md:text-xs font-medium text-slate-700 truncate block">{user.company_name}</span>
              </div>
              <button
                className="btn btn-primary text-[10px] md:text-xs px-1 md:px-2 py-0.5 flex-shrink-0"
                onClick={() => { logout(); router.push('/') }}
              >
                Çıkış
              </button>
            </>
          ) : (
            <Link className="btn btn-primary text-[10px] md:text-xs px-1 md:px-2 py-0.5" href="/login">Giriş</Link>
          )}
        </div>
      </div>
    </div>
  )
}
