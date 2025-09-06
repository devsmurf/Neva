"use client"
import { startOfDayLocal, parseDateLocalNoon, todayStart, daysDiff } from '@/lib/date'
import type { Project } from '@/lib/types'

export default function HeaderCounter({ project }: { project: Project }) {
  // Inclusive countdown: remaining days includes the end date
  const rawDiff = daysDiff(todayStart(), parseDateLocalNoon(project.end_date))
  const diffDays = rawDiff > 0 ? rawDiff + 1 : rawDiff

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 shadow-lg border-b-4 border-white/20 overflow-x-hidden"
      data-header="true"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="py-2 md:py-3">
          {/* 3 sütunlu düzen: Sol logo (md+), orta içerik, sağ boşluk (denge) */}
          <div className="grid grid-cols-[auto,1fr] md:grid-cols-3 items-center gap-2">
            {/* Sol logo - mobilde gizli */}
            <div className="flex justify-start">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl p-2 shadow-lg border border-white/30">
                <img
                  src="/logo/about-icon-25446322e91a5a0f84.22695571.svg"
                  alt="NEVA Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Orta içerik - her zaman ortalı */}
            <div className="md:col-span-1 flex justify-start md:justify-center">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-3 md:px-6 py-2 md:py-3 shadow-xl border border-white/30 ml-[20px] md:ml-0">
                <div className="flex items-center gap-2.5 md:gap-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-700 font-medium text-[11px] md:text-sm">
                      NEVA YALI PROJESİ
                    </span>
                  </div>
                  <div className="w-px h-5 md:h-6 bg-slate-300"></div>
                  <div className="text-center">
                    {diffDays > 0 && (
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-slate-600 text-[11px] md:text-base">Bitmesine</span>
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold text-base md:text-2xl">
                          {diffDays}
                        </span>
                        <span className="text-slate-600 text-[11px] md:text-base">gün kaldı</span>
                      </div>
                    )}
                    {diffDays === 0 && (
                      <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent font-bold text-base md:text-2xl">
                        TESLİM GÜNÜ!
                      </span>
                    )}
                    {diffDays < 0 && (
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-slate-600 text-[11px] md:text-base">Teslim</span>
                        <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent font-bold text-base md:text-2xl">
                          {Math.abs(diffDays)}
                        </span>
                        <span className="text-slate-600 text-[11px] md:text-base">gün önce bitti</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ boşluk - sol logoyla denge (md+) */}
            <div className="hidden md:block" />
          </div>
        </div>
      </div>
    </div>
  )
}
