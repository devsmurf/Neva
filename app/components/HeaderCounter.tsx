"use client"
import { startOfDayLocal, parseDateLocalNoon } from '@/lib/date'
import type { Project } from '@/lib/types'

export default function HeaderCounter({ project }: { project: Project }) {
  const diffDays = Math.floor((startOfDayLocal(parseDateLocalNoon(project.end_date)).getTime() - startOfDayLocal(new Date()).getTime()) / 86400000)

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 shadow-lg border-b-4 border-white/20"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="py-2 md:py-3">
          {/* 3 sütunlu düzen: Sol logo (md+), orta içerik, sağ boşluk (denge) */}
          <div className="grid grid-cols-3 items-center">
            {/* Sol logo - mobilde gizli */}
            <div className="hidden md:flex justify-start">
              <div className="w-10 h-10 bg-white rounded-xl p-2 shadow-lg border border-white/30">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 181 150" className="w-full h-full">
                  <path d="M0 7.563c.133-.242 13.457-4.914 29.535-6.357 44.882-4.016 83.944 2.04 103.812 17.517 13.486 10.495 12.812 32.625-1.155 41.172-15.711 9.63-34.588 10.496-66.98 13.774-7.567.763-18.713 1.792-18.713 2.716 0 1.187 49.786 25.826 58.625 30.268 10.669 5.36 72.876 40.214 75.046 42.772 1.2 1.41-7.764-.092-9.79-1.094-10.831-5.403-22.904-12.02-23.803-9.346-.905 2.673 5.383 7.647.899 7.647-1.804 0-37.394-17.403-41.578-19.715-3.317-1.813-11.75-5.806-12.983-3.16-1.062 2.294 2.183 8.533-.813 7.774-3.003-.763-55.46-24.842-69.977-34.72C6.651 86.291 2.598 71.547 12.54 62.657c15.88-14.217 36.6-11.84 65.123-15.588 10.335-1.36 27.723-3.927 27.547-13.265-.34-17.433-17.929-22.225-56.215-26.221-11.656-1.22-18.345-1.301-32.652.327-4.008.453-1.778-1.756-7.765-.706C3.49 8.1-.09 7.719 0 7.563" fill="#003DA6" />
                </svg>
              </div>
            </div>

            {/* Orta içerik - her zaman ortalı */}
            <div className="col-span-3 md:col-span-1 flex justify-center">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 md:px-6 py-2.5 md:py-3 shadow-xl border border-white/30">
                <div className="flex items-center gap-3 md:gap-4 md:whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-700 font-medium text-[12px] md:text-sm">
                      NEVA YALI PROJESİ
                    </span>
                  </div>
                  <div className="w-px h-5 md:h-6 bg-slate-300"></div>
                  <div className="text-center">
                    {diffDays > 0 && (
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-slate-600 text-[12px] md:text-base">Bitmesine</span>
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold text-base md:text-2xl">
                          {diffDays}
                        </span>
                        <span className="text-slate-600 text-[12px] md:text-base">gün kaldı</span>
                      </div>
                    )}
                    {diffDays === 0 && (
                      <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent font-bold text-base md:text-2xl">
                        TESLİM GÜNÜ!
                      </span>
                    )}
                    {diffDays < 0 && (
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-slate-600 text-[12px] md:text-base">Teslim</span>
                        <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent font-bold text-base md:text-2xl">
                          {Math.abs(diffDays)}
                        </span>
                        <span className="text-slate-600 text-[12px] md:text-base">gün önce bitti</span>
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
