"use client"
import { startOfDayLocal, parseDateLocalNoon } from '@/lib/date'
import type { Project } from '@/lib/types'

export default function HeaderCounter({ project }: { project: Project }) {
  const diffDays = Math.floor((startOfDayLocal(parseDateLocalNoon(project.end_date)).getTime() - startOfDayLocal(new Date()).getTime()) / 86400000)

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 shadow-lg border-b-4 border-white/20">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="py-4 md:py-5">
          <div className="flex items-center justify-center">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-xl border border-white/30">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-slate-700 font-medium text-sm md:text-base">
                    NEVA YALI PROJESİ
                  </span>
                </div>
                <div className="w-px h-6 bg-slate-300"></div>
                <div className="text-center">
                  {diffDays > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600 text-sm md:text-base">Bitmesine</span>
                      <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold text-xl md:text-2xl">
                        {diffDays}
                      </span>
                      <span className="text-slate-600 text-sm md:text-base">gün kaldı</span>
                    </div>
                  )}
                  {diffDays === 0 && (
                    <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent font-bold text-xl md:text-2xl">
                      TESLİM GÜNÜ!
                    </span>
                  )}
                  {diffDays < 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600 text-sm md:text-base">Teslim</span>
                      <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent font-bold text-xl md:text-2xl">
                        {Math.abs(diffDays)}
                      </span>
                      <span className="text-slate-600 text-sm md:text-base">gün önce bitti</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

