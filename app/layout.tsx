import './globals.css'
import type { ReactNode } from 'react'
import SessionProvider from './components/SessionProvider'
import HeaderCounter from './components/HeaderCounter'
import { project } from './lib/mock'
import ClientLayout from './components/ClientLayout'



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
          <ClientLayout>
            {children}
          </ClientLayout>
        </SessionProvider>
      </body>
    </html>
  )
}
