"use client"
import { clsx } from 'clsx'
import type { Task } from '@/lib/types'
import { durumText, isLate, kalanGecikme, uyariText, parseDateLocalNoon } from '@/lib/date'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  rows: Task[]
  currentCompanyId?: string
  onComplete?: (id: string) => void
  onEdit?: (id: string) => void
  onUpdateStatus?: (id: string, status: 'planned' | 'in_progress') => void
  showDeleteButton?: boolean
  narrow?: boolean
  sortMode?: 'default' | 'newest'
  prioritizeLate?: boolean
}

export default function TaskTable({ rows, currentCompanyId, onComplete, onEdit, onUpdateStatus, showDeleteButton, narrow, sortMode = 'default', prioritizeLate = true }: Props) {
  const [openDependencyId, setOpenDependencyId] = useState<string | null>(null)
  const [popoverPos, setPopoverPos] = useState<{ id: string, x: number, y: number, above?: boolean } | null>(null)
  const [anim, setAnim] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Close dependency popover on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!openDependencyId) return
      const target = e.target as HTMLElement | null
      if (!target) return
      const container = document.querySelector(`[data-dep-container="${openDependencyId}"]`)
      if (container && container.contains(target)) return
      setOpenDependencyId(null)
      setPopoverPos(null)
      setAnim(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [openDependencyId])

  // Close on scroll/resize to avoid misaligned popover
  useEffect(() => {
    if (!openDependencyId) return
    const handler = () => {
      setOpenDependencyId(null)
      setPopoverPos(null)
      setAnim(false)
    }
    window.addEventListener('scroll', handler, true)
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('scroll', handler, true)
      window.removeEventListener('resize', handler)
    }
  }, [openDependencyId])
  const formatFloor = (k: number) => (k < 0 ? `B${Math.abs(k)}` : `${k}`)
  const formatBlock = (b: string) => b.replace(/\s*blok\s*$/i, '').trim()
  const showActionsCol = Boolean(showDeleteButton || onComplete || onEdit || onUpdateStatus)
  const sorted = [...rows].sort((a, b) => {
    // Optional prioritization of late tasks (kırmızılar önde)
    if (prioritizeLate) {
      const la = isLate(a), lb = isLate(b)
      if (la !== lb) return la ? -1 : 1
    }

    if (sortMode === 'newest') {
      const ad = Date.parse((a as any).created_at || (a as any).updated_at || (a.due_date + 'T00:00:00'))
      const bd = Date.parse((b as any).created_at || (b as any).updated_at || (b.due_date + 'T00:00:00'))
      return bd - ad // newest first
    }

    // default: due date ascending, then company
    const da = +parseDateLocalNoon(a.due_date) - +parseDateLocalNoon(b.due_date)
    if (da !== 0) return da
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
              <th className="th w-40 md:w-24 cmp md:sticky md:left-0 md:z-20 md:bg-slate-50">Şirket</th>
              <th className="th w-20 md:w-16 blk">Blok</th>
              <th className="th w-16 md:w-10 kat">Kat</th>
              <th className="th md:w-auto md:max-w-48">Görev</th>
              <th className="th md:w-20">Başlama</th>
              <th className="th md:w-20">Bitiş</th>
              <th className="th md:w-16">Durum</th>
              <th className="th md:w-20">Kalan</th>
              <th className="th md:w-24">Uyarı</th>
              {showActionsCol && <th className="th md:w-16">İşlem</th>}
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
                  <td className="td w-40 md:w-24 font-semibold text-blue-600 cmp md:sticky md:left-0 md:z-10 md:bg-inherit" title={t.company?.name}>{t.company?.name}</td>
                  <td className="td w-20 md:w-16 font-medium blk">{formatBlock(t.block)}</td>
                  <td className="td w-16 md:w-10 kat">{t.floor_from != null && t.floor_to != null ? `${formatFloor(t.floor_from)}–${formatFloor(t.floor_to)}` : (t.floor != null ? `${formatFloor(t.floor)}` : '—')}</td>
                  <td className="td md:w-auto md:max-w-48" title={t.title}>
                    <div className="truncate">{t.title}</div>
                  </td>
                  <td className="td md:w-20 tabular-nums text-xs">{t.start_date.split('-').reverse().join('/')}</td>
                  <td className="td md:w-20 tabular-nums text-xs">{t.due_date.split('-').reverse().join('/')}</td>
                  <td className="td md:w-16 text-xs">{durumText(t)}</td>
                  <td className="td md:w-20 text-xs">{kalanGecikme(t)}</td>
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
                            const nowOpen = openDependencyId !== t.id
                            if (!nowOpen) {
                              setOpenDependencyId(null)
                              setPopoverPos(null)
                              setAnim(false)
                              return
                            }
                            setOpenDependencyId(t.id)
                            // Anchor to the middle of the label+icon container
                            const container = (e.currentTarget.parentElement as HTMLElement) || (e.currentTarget as HTMLElement)
                            const rect = container.getBoundingClientRect()
                            const x = rect.left + rect.width / 2
                            const y = rect.bottom + 8 // Always open downward
                            setPopoverPos({ id: t.id, x, y, above: false })
                            setAnim(false)
                            setTimeout(() => setAnim(true), 10)
                          }}
                        >
                          i
                        </button>
                        {mounted && openDependencyId === t.id && popoverPos?.id === t.id && createPortal(
                          (
                            <div
                              className="fixed z-[9999]"
                              style={{
                                left: popoverPos.x,
                                top: anim 
                                  ? popoverPos.y 
                                  : (popoverPos.above ? popoverPos.y + 8 : popoverPos.y - 8),
                                transform: 'translateX(-50%)',
                                opacity: anim ? 1 : 0,
                                transition: 'top 150ms ease-out, opacity 150ms ease-out'
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="relative rounded-xl border border-slate-200 bg-white/95 backdrop-blur px-3 py-2 shadow-xl min-w-[220px] max-w-[85vw]">
                                <div className={clsx(
                                  'absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-slate-200 rotate-45',
                                  popoverPos.above ? ' -bottom-1 border-t border-r' : ' -top-1 border-l border-t'
                                )}></div>
                                <div className="text-[11px] text-slate-500 text-center">Bağımlı Olduğu</div>
                                <div className="text-sm font-semibold text-slate-800 text-center">
                                  {t.dependent_company?.name || 'Yükleniyor...'}
                                </div>
                              </div>
                            </div>
                          ), document.body)
                        }
                      </div>
                    ) : (
                      <span>{warning}</span>
                    )}
                  </td>
                  {showActionsCol && (
                    <td className="td md:w-16">
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
