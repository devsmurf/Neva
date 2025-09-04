"use client"
import type { ReactNode } from 'react'
import NavBar, { TabProvider } from './NavBar'
import { useSession } from './SessionProvider'
import { usePathname } from 'next/navigation'

// NavBar ile padding'i birlikte yöneten component  
function NavBarWithPadding() {
    return (
        <div className="pt-24 md:pt-28"> {/* Sabit header yüksekliği ile uyumlu padding */}
            <div className="mx-auto max-w-7xl p-2 md:p-4 lg:p-6">
                <NavBar />
            </div>
        </div>
    )
}

// Ana container - login sayfasında farklı padding
function MainContainer({ children }: { children: ReactNode }) {
    const { user } = useSession()
    const pathname = usePathname()

    // Ana sayfada, login sayfalarında ve kullanıcı giriş yapmamışsa container padding'ini kaldır
    if ((pathname === '/' && !user) || pathname === '/admin/login' || pathname === '/contractor/login') {
        return <>{children}</>
    }

    return (
        <div className="mx-auto max-w-7xl p-2 md:p-4 lg:p-6">
            {children}
        </div>
    )
}

export default function ClientLayout({ children }: { children: ReactNode }) {
    return (
        <TabProvider>
            <NavBarWithPadding />
            <MainContainer>
                {children}
            </MainContainer>
        </TabProvider>
    )
}
