"use client"
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import NavBar, { TabProvider } from './NavBar'
import { useSession } from './SessionProvider'
import { usePathname } from 'next/navigation'

// NavBar ile padding'i birlikte yöneten component  
function NavBarWithPadding() {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [offsetTop, setOffsetTop] = useState<number>(96) // fallback ~24

    useEffect(() => {
        // Header yüksekliğini dinamik ölç ve mobile sticky offset olarak uygula
        const measure = () => {
            const header = document.querySelector('[data-header="true"]') as HTMLElement | null
            if (header) {
                const h = header.getBoundingClientRect().height
                // 8px güvenlik payı
                setOffsetTop(Math.max(72, Math.round(h + 8)))
            }
        }
        measure()
        let ro: ResizeObserver | null = null
        const header = document.querySelector('[data-header="true"]') as HTMLElement | null
        if (header && 'ResizeObserver' in window) {
            ro = new ResizeObserver(() => measure())
            ro.observe(header)
        }
        window.addEventListener('orientationchange', measure)
        window.addEventListener('resize', measure)
        return () => {
            window.removeEventListener('orientationchange', measure)
            window.removeEventListener('resize', measure)
            ro?.disconnect()
        }
    }, [])

    return (
        <div className="pt-24 md:pt-28"> {/* Sabit header yüksekliği ile uyumlu padding */}
            {/* Mobilde purple header altında sabitlenecek, desktop'ta normal akış */}
            <div
                ref={containerRef}
                className="mx-auto max-w-7xl p-2 md:p-4 lg:p-6 md:static md:top-auto"
                style={{ position: 'sticky', top: offsetTop, zIndex: 40 }}
            >
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
        <div className="mx-auto max-w-7xl p-2 md:p-4 lg:p-6 overflow-x-hidden">
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
