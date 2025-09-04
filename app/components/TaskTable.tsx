"use client"
import { clsx } from 'clsx'
import type { Task } from '@/lib/types'
import { durumText, isLate, kalanGecikme, uyariText, parseDateLocalNoon } from '@/lib/date'
import { companies } from '@/lib/mock'
import { useEffect, useState } from 'react'

type Props = {
  rows: Task[]
  currentCompanyId?: string
  onComplete?: (id: string) => void
  onEdit?: (id: string) => void
  onUpdateStatus?: (id: string, status: 'planned' | 'in_progress') => void
  showDeleteButton?: boolean
  narrow?: boolean
}

export default function TaskTable({ rows, currentCompanyId, onComplete, onEdit, onUpdateStatus, showDeleteButton, narrow }: Props) {
  const [openDependencyId, setOpenDependencyId] = useState<string | null>(null)

  // Close dependency popover on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!openDependencyId) return
      const target = e.target as HTMLElement | null
      if (!target) return
      const container = document.querySelector(`[data-dep-container="${openDependencyId}"]`)
      if (container && container.contains(target)) return
      setOpenDependencyId(null)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [openDependencyId])
  const formatFloor = (k: number) => (k < 0 ? `B${Math.abs(k)}` : `${k}`)
  const formatBlock = (b: string) => b.replace(/\s*blok\s*$/i, '').trim()
  const showActionsCol = Boolean(showDeleteButton || onComplete || onEdit || onUpdateStatus)
  const sorted = [...rows].sort((a, b) => {
    const la = isLate(a), lb = isLate(b)
    if (la !== lb) return la ? -1 : 1 // kırmızılar en üstte
    const da = +parseDateLocalNoon(a.due_date) - +parseDateLocalNoon(b.due_date)
    if (da !== 0) return da // en acil önce
    const ca = (a.company?.name || ''), cb = (b.company?.name || '')
    return ca.localeCompare(cb)
  })

  return (
    <div className="relative">
      {/* Mobile scroll indicator */}
      <div className="block md:hidden text-xs text-slate-500 mb-2 px-3 py-2 bg-slate-50 rounded-lg">
        💡 Tabloyu görmek için yatay kaydırın →
      </div>
      <div className="table-wrap">
        <table className={clsx('table table-compact', narrow && 'table-narrow')}>
          <thead>
            <tr className="bg-slate-50">
              <th className="th w-40 cmp md:sticky md:left-0 md:z-20 md:bg-slate-50">Şirket</th>
              <th className="th w-20 blk">Blok</th>
              <th className="th w-16 kat">Kat</th>
              <th className="th">Görev</th>
              <th className="th">Başlangıç</th>
              <th className="th">Bitiş</th>
              <th className="th">Durum</th>
              <th className="th">Kalan/Gecikme</th>
              <th className="th">Uyarı</th>
              {showActionsCol && <th className="th">İşlemler</th>}
            </tr>
          </thead>
          <tbody>
            {sorted.map((t) => {
              const mine = t.company_id === currentCompanyId
              const late = isLate(t)
              const warning = uyariText(t)
              return (
                <tr
                  key={t.id}
                  className={clsx(
                    late
                      ? 'bg-red-100 text-red-900 border-l-4 border-l-red-400'
                      : 'bg-emerald-100 text-emerald-900 border-l-4 border-l-emerald-400',
                    'border-b border-slate-100'
                  )}
                >
                  <td className="td w-40 font-semibold text-blue-600 cmp md:sticky md:left-0 md:z-10 md:bg-inherit">{t.company?.name}</td>
                  <td className="td w-20 font-medium blk">{formatBlock(t.block)}</td>
                  <td className="td w-16 kat">{t.floor_from != null && t.floor_to != null ? `${formatFloor(t.floor_from)}–${formatFloor(t.floor_to)}` : (t.floor != null ? `${formatFloor(t.floor)}` : '—')}</td>
                  <td className="td">{t.title}</td>
                  <td className="td tabular-nums">{t.start_date}</td>
                  <td className="td tabular-nums">{t.due_date}</td>
                  <td className="td">{durumText(t)}</td>
                  <td className="td">{kalanGecikme(t)}</td>
                  <td className="td">
                    {t.dependent_company_id && warning === 'Bağımlılığı beklemede' ? (
                      <div className="relative inline-flex items-center gap-1" data-dep-container={t.id}>
                        <span>{warning}</span>
                        <button
                          type="button"
                          aria-label="Bağımlılık bilgisi"
                          aria-expanded={openDependencyId === t.id}
                          className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] leading-4 shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpenDependencyId(openDependencyId === t.id ? null : t.id)
                          }}
                        >
                          i
                        </button>
                        {openDependencyId === t.id && (
                          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50" onClick={(e) => e.stopPropagation()}>
                            <div className="relative rounded-xl border border-slate-200 bg-white/95 backdrop-blur px-3 py-2 shadow-xl">
                              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-l border-t border-slate-200 rotate-45"></div>
                              <div className="text-[11px] text-slate-500 text-center">Bağımlı Olduğu</div>
                              <div className="text-sm font-semibold text-slate-800 text-center">
                                {companies.find(c => c.id === t.dependent_company_id)?.name || '—'}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span>{warning}</span>
                    )}
                  </td>
                  {showActionsCol && (
                    <td className="td">
                      {showDeleteButton ? (
                        // Admin paneli - silme butonu
                        <div className="flex items-center justify-center">
                          <button
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors"
                            onClick={() => onComplete?.(t.id)}
                            title="Görevi sil"
                          >
                            🗑️
                          </button>
                        </div>
                      ) : mine ? (
                        // Normal taşeron paneli - durum butonları
                        <div className="flex items-center gap-1 flex-wrap">
                          {/* Düzenleme Butonu - Her zaman görünür */}
                          <button
                            className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-1 md:px-2 py-1 rounded-md transition-colors"
                            onClick={() => onEdit?.(t.id)}
                            title="Görev detaylarını düzenle"
                          >
                            <span className="hidden md:inline">✏️ Düzenle</span>
                            <span className="md:hidden">✏️</span>
                          </button>

                          {/* Durum Değiştirme Butonları */}
                          {t.status === 'planned' && (
                            <button
                              className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-1 md:px-2 py-1 rounded-md transition-colors"
                              onClick={() => onUpdateStatus?.(t.id, 'in_progress')}
                              title="İşe başla"
                            >
                              <span className="hidden md:inline">🚀 Başla</span>
                              <span className="md:hidden">🚀</span>
                            </button>
                          )}

                          {t.status === 'in_progress' && (
                            <>
                              <button
                                className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 px-1 md:px-2 py-1 rounded-md transition-colors"
                                onClick={() => onComplete?.(t.id)}
                                title="İşi tamamla"
                              >
                                <span className="hidden md:inline">✅ Tamamla</span>
                                <span className="md:hidden">✅</span>
                              </button>

                              {/* Planlandı durumuna geri dönüş */}
                              <button
                                className="text-xs bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-1 md:px-2 py-1 rounded-md transition-colors"
                                onClick={() => onUpdateStatus?.(t.id, 'planned')}
                                title="İşi durdur"
                              >
                                <span className="hidden md:inline">⏸️ Durdur</span>
                                <span className="md:hidden">⏸️</span>
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm">—</span>
                      )}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
