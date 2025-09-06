import './globals.css'
import type { ReactNode } from 'react'
import SupabaseSessionProvider from './components/SupabaseSessionProvider'
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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        {/* React DevTools için standalone connection (sadece development) */}
        {process.env.NODE_ENV === 'development' && (
          <script src="http://localhost:8097" async />
        )}
        {/* Clear old cookies for migration (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Clear old neva-session cookie on page load
                if (document.cookie.includes('neva-session')) {
                  console.log('🧹 Clearing old session cookie...');
                  document.cookie = 'neva-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                  console.log('✅ Old cookie cleared');
                }
              `
            }}
          />
        )}
      </head>
      <body>
        <SupabaseSessionProvider>
          <HeaderCounter project={project} />
          <ClientLayout>
            {children}
          </ClientLayout>
        </SupabaseSessionProvider>
      </body>
    </html>
  )
}
