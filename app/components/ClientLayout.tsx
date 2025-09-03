"use client"
import type { ReactNode } from 'react'
import NavBar from './NavBar'
import { useSession } from './SessionProvider'
import { usePathname } from 'next/navigation'

// NavBar ile padding'i birlikte yöneten component  
function NavBarWithPadding() {
    return (
        <div className="pt-20 md:pt-24"> {/* Sabit header için üst padding */}
            <div className="mx-auto max-w-7xl p-3 md:p-6 lg:p-8">
                <NavBar />
            </div>
        </div>
    )
}

// Ana container - login sayfasında farklı padding
function MainContainer({ children }: { children: ReactNode }) {
    const { user } = useSession()
    const pathname = usePathname()

    // Ana sayfada ve kullanıcı giriş yapmamışsa container padding'ini kaldır
    if (pathname === '/' && !user) {
        return <>{children}</>
    }

    return (
        <div className="mx-auto max-w-7xl p-3 md:p-6 lg:p-8">
            {children}
        </div>
    )
}

export default function ClientLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <NavBarWithPadding />
            <MainContainer>
                {children}
            </MainContainer>
        </>
    )
}
