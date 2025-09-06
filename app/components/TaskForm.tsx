"use client"
import { useMemo, useState, useEffect } from 'react'
import type { Task } from '@/lib/types'

type Props = {
  initial?: Partial<Task>
  onSubmit?: (payload: Partial<Task>) => void
}

// Blok seçenekleri
const BLOCKS = ['A Blok', 'B Blok', 'C Blok', 'D Blok', 'E Blok']
const FLOOR_MAP: Record<string, number> = {
  'A Blok': 28,
  'B Blok': 38,
  'C Blok': 28,
  'D Blok': 18,
  'E Blok': 28,
}

// Bugünün tarihini YYYY-MM-DD formatında al
const today = new Date().toISOString().split('T')[0]

// Tarih helper fonksiyonu - X gün sonrasını hesapla
const addDays = (date: string, days: number): string => {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

export default function TaskForm({ initial, onSubmit }: Props) {
  const [form, setForm] = useState<Partial<Task>>({
    block: '',
    floor: null,
    floor_from: null,
    floor_to: null,
    title: '',
    start_date: today,
    due_date: addDays(today, 7), // Varsayılan olarak 1 hafta sonra
    status: 'planned',
    ...initial,
  })

  // Bağımlılık durumu
  const [hasDependency, setHasDependency] = useState(false)
  const [dependentCompany, setDependentCompany] = useState('')
  const [useRange, setUseRange] = useState(false)

  // API state
  const [companies, setCompanies] = useState<any[]>([])
  const [loadingCompanies, setLoadingCompanies] = useState(true)

  // Load companies from API
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await fetch('/api/companies')
        if (response.ok) {
          const data = await response.json()
          setCompanies(data)
        }
      } catch (error) {
        console.error('Error loading companies:', error)
      } finally {
        setLoadingCompanies(false)
      }
    }

    loadCompanies()
  }, [])

  const floors = useMemo(() => {
    const n = FLOOR_MAP[form.block || '']
    if (!n) return [] as number[]
    const list: number[] = [-2, -1]
    for (let i = 1; i <= n; i++) list.push(i)
    return list
  }, [form.block])

  const formatFloor = (k: number) => (k < 0 ? `B${Math.abs(k)}` : `${k}`)

  // Hızlı tarih seçenekleri
  const quickDateOptions = [
    { label: 'Bugün', days: 0 },
    { label: 'Yarın', days: 1 },
    { label: '3 Gün Sonra', days: 3 },
    { label: '1 Hafta Sonra', days: 7 },
    { label: '2 Hafta Sonra', days: 14 },
    { label: '1 Ay Sonra', days: 30 },
  ]

  const handleQuickStart = (days: number) => {
    const newDate = addDays(today, days)
    setForm(f => ({
      ...f,
      start_date: newDate,
      // Bitiş tarihini de güncelle (başlangıç + mevcut süre)
      due_date: f.start_date && f.due_date
        ? addDays(newDate, Math.max(1, Math.floor((new Date(f.due_date).getTime() - new Date(f.start_date).getTime()) / (1000 * 60 * 60 * 24))))
        : addDays(newDate, 7)
    }))
  }

  const handleQuickEnd = (days: number) => {
    const newDate = addDays(form.start_date || today, days)
    setForm(f => ({ ...f, due_date: newDate }))
  }

  return (
    <div className="card p-6 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <span className="text-blue-600">📝</span>
          Yeni Görev Oluştur
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          Görevinizi tanımlayın, REV Şeflerin onayından sonra ana listede görünecek
        </p>
      </div>

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          if (!form.block || !form.title || !form.start_date || !form.due_date) {
            alert('Lütfen tüm alanları doldurun')
            return
          }
          if (!useRange) {
            if (floors.length && (form.floor === undefined || form.floor === null)) {
              alert('Lütfen bir kat seçiniz')
              return
            }
          } else {
            if (floors.length && (form.floor_from === null || form.floor_to === null)) {
              alert('Lütfen kat aralığı seçiniz')
              return
            }
            if ((form.floor_from as number) > (form.floor_to as number)) {
              alert('Başlangıç katı, bitiş katından büyük olamaz')
              return
            }
          }
          if (new Date(form.due_date) < new Date(form.start_date)) {
            alert('Bitiş tarihi başlangıç tarihinden önce olamaz')
            return
          }
          // Normalize mutually exclusive floor fields for DB check constraint
          const payload: Partial<Task> = {
            ...form,
            dependent_company_id: hasDependency && dependentCompany ? dependentCompany : null,
          }
          if (useRange) {
            payload.floor = null
            if (payload.floor_from != null) payload.floor_from = Number(payload.floor_from as any)
            if (payload.floor_to != null) payload.floor_to = Number(payload.floor_to as any)
          } else {
            payload.floor_from = null
            payload.floor_to = null
            if (payload.floor != null) payload.floor = Number(payload.floor as any)
          }
          onSubmit?.(payload)
        }}
      >
        {/* Blok Seçimi */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            🏗️ Blok Seçimi
          </label>
          <select
            required
            className="w-full rounded-xl border border-slate-300/60 bg-white/90 backdrop-blur-sm px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200"
            value={form.block || ''}
            onChange={e => setForm(f => ({ ...f, block: e.target.value, floor: null, floor_from: null, floor_to: null }))}
          >
            <option value="">Blok seçiniz...</option>
            {BLOCKS.map(block => (
              <option key={block} value={block}>{block}</option>
            ))}
          </select>
        </div>

        {/* Kat Seçimi */}
        {form.block && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                🏢 Kat Seçimi
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={useRange}
                  onChange={(e) => {
                    const checked = e.target.checked
                    setUseRange(checked)
                    // Clear opposite fields to satisfy DB constraint chk_floor_range
                    setForm(f => ({
                      ...f,
                      floor: checked ? null : f.floor,
                      floor_from: checked ? f.floor_from : null,
                      floor_to: checked ? f.floor_to : null,
                    }))
                  }}
                />
                Kat aralığı seç
              </label>
            </div>

            {!useRange ? (
              <select
                required
                className="w-full rounded-xl border border-slate-300/60 bg-white/90 backdrop-blur-sm px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200"
                value={form.floor ?? ''}
                onChange={(e) => setForm(f => ({ ...f, floor: Number(e.target.value) }))}
              >
                <option value="">Kat seçiniz...</option>
                {floors.map(k => (
                  <option key={k} value={k}>{formatFloor(k)}</option>
                ))}
              </select>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Başlangıç katı</label>
                  <select
                    required
                    className="w-full rounded-xl border border-slate-300/60 bg-white/90 backdrop-blur-sm px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200"
                    value={form.floor_from ?? ''}
                    onChange={(e) => setForm(f => ({ ...f, floor_from: Number(e.target.value) }))}
                  >
                    <option value="">Seçiniz</option>
                    {floors.map(k => (
                      <option key={k} value={k}>{formatFloor(k)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Bitiş katı</label>
                  <select
                    required
                    className="w-full rounded-xl border border-slate-300/60 bg-white/90 backdrop-blur-sm px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200"
                    value={form.floor_to ?? ''}
                    onChange={(e) => setForm(f => ({ ...f, floor_to: Number(e.target.value) }))}
                  >
                    <option value="">Seçiniz</option>
                    {floors.map(k => (
                      <option key={k} value={k}>{formatFloor(k)}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <p className="text-xs text-slate-500 mt-2">Seçili blok: {form.block}. Kat seçenekleri: B2, B1 ve 1'den {FLOOR_MAP[form.block] || 0}'e kadar.</p>
          </div>
        )}

        {/* Görev Başlığı */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            📋 Görev Açıklaması
          </label>
          <input
            required
            type="text"
            className="w-full rounded-xl border border-slate-300/60 bg-white/90 backdrop-blur-sm px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200"
            value={form.title || ''}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Örn: Şap dökümü"
          />
        </div>

        {/* Bağımlılık Seçimi */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            🔗 Bağımlılık Durumu
          </label>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={hasDependency}
                onChange={(e) => {
                  setHasDependency(e.target.checked)
                  if (!e.target.checked) {
                    setDependentCompany('')
                  }
                }}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-medium text-slate-800">Bağımlılığım var</div>
                <div className="text-xs text-slate-600">Bu görev başka bir taşeronun işini bekliyor</div>
              </div>
            </label>

            {hasDependency && (
              <div className="ml-7 space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <label className="block text-sm font-medium text-blue-800 mb-2">
                    Hangi taşeronun işini bekliyorsunuz?
                  </label>
                  <select
                    value={dependentCompany}
                    onChange={(e) => setDependentCompany(e.target.value)}
                    className="w-full rounded-lg border border-blue-300 px-3 py-2 focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="">Taşeron seçiniz...</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 text-sm">⚠️</span>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      <strong>Önemli:</strong> Geç kalma toleransına düşmemeniz için bağımlılığınız bittiğinde işi hemen başlatın.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Başlangıç Tarihi */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            🚀 Başlangıç Tarihi
          </label>

          {/* Hızlı tarih seçenekleri */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-3">
            {quickDateOptions.map(option => (
              <button
                key={option.label}
                type="button"
                onClick={() => handleQuickStart(option.days)}
                className={`text-xs py-2 px-3 rounded-lg transition-all duration-200 ${form.start_date === addDays(today, option.days)
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <input
            required
            type="date"
            min={today}
            className="w-full rounded-xl border border-slate-300/60 bg-white/90 backdrop-blur-sm px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200"
            value={form.start_date || ''}
            onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
          />
        </div>

        {/* Bitiş Tarihi */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            🏁 Bitiş Tarihi
          </label>

          {/* Süre seçenekleri */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
            {[
              { label: '1 Gün', days: 1 },
              { label: '3 Gün', days: 3 },
              { label: '1 Hafta', days: 7 },
              { label: '2 Hafta', days: 14 }
            ].map(option => (
              <button
                key={option.label}
                type="button"
                onClick={() => handleQuickEnd(option.days)}
                className="text-xs py-2 px-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-all duration-200"
              >
                +{option.label}
              </button>
            ))}
          </div>

          <input
            required
            type="date"
            min={form.start_date || today}
            className="w-full rounded-xl border border-slate-300/60 bg-white/90 backdrop-blur-sm px-4 py-3 outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400 transition-all duration-200"
            value={form.due_date || ''}
            onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
          />
        </div>

        {/* Durum Seçimi - Sadece Planlandı */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            ⚡ İş Durumu
          </label>
          <div className="max-w-xs">
            <div className="border-2 border-yellow-400 bg-yellow-50 rounded-xl p-4">
              <input
                type="hidden"
                name="status"
                value="planned"
              />
              <div className="text-center">
                <div className="text-2xl mb-1">📋</div>
                <div className="font-medium text-slate-800">Planlandı</div>
                <div className="text-xs text-slate-600">Yeni görevler planlandı durumunda oluşturulur</div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-amber-600 text-xl">⚠️</span>
            <div className="flex-1">
              <p className="text-sm text-amber-800 font-medium mb-2">
                Onay Süreci Hakkında Bilgi
              </p>
              <p className="text-xs text-amber-700">
                Kaydedilen görev admin onayına gönderilecek. Onaylandıktan sonra ana listede görünecek ve diğer ekipler tarafından görülebilecek.
              </p>
            </div>
          </div>

          <button
            className="w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            type="submit"
          >
            📤 Görev Gönder (Onay Bekleyecek)
          </button>
        </div>
      </form>
    </div>
  )
}
