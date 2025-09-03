import './globals.css'
import type { ReactNode } from 'react'
import SessionProvider from './components/SessionProvider'
import NavBar from './components/NavBar'
import HeaderCounter from './components/HeaderCounter'
import { project } from './lib/mock'

export const metadata = {
  title: 'NEVA YALI — Onaylı Taşeron Tablosu',
  description: 'Basit, rekabeti artıran, onay mekanizmalı web uygulaması.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <SessionProvider>
          <HeaderCounter project={project} />
          <div className="pt-20 md:pt-24"> {/* Sabit header için üst padding */}
            <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
              <NavBar />
              {children}
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}
