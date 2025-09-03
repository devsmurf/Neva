"use client"
import SearchBar from '@/components/SearchBar'
import TaskTable from '@/components/TaskTable'
import TaskForm from '@/components/TaskForm'
import { tasks } from '@/lib/mock'
import type { Task } from '@/lib/types'
import { useMemo, useState } from 'react'
import { useSession } from '@/components/SessionProvider'
import Link from 'next/link'
import { companies } from '@/lib/mock'

// Giriş yapmamış kullanıcılar için ana giriş seçenekleri
function LoginSelection() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Ana Başlık */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            NEVA YALI
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto">
            Taşeron yönetim sistemine hoş geldiniz. Lütfen giriş türünüzü seçiniz.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 max-w-lg mx-auto">
          {/* Şef Girişi */}
          <Link href="/admin/login" className="group">
            <div className="card p-4 sm:p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:border-orange-300">
              <div className="space-y-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <span className="text-lg sm:text-xl font-bold text-white">Ş</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-800">Rönesans Şef</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Proje yöneticileri için giriş
                </p>
                <div className="inline-flex items-center gap-2 text-orange-600 font-medium text-sm justify-center">
                  <span>Giriş Yap</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Taşeron Girişi */}
          <Link href="/contractor/login" className="group">
            <div className="card p-4 sm:p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-300">
              <div className="space-y-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <span className="text-lg sm:text-xl font-bold text-white">T</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-800">Taşeron Girişi</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Taşeron firmalar için giriş
                </p>
                <div className="inline-flex items-center gap-2 text-green-600 font-medium text-sm justify-center">
                  <span>Giriş Yap</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="text-sm text-slate-500 space-y-2">
          <p>🔒 Güvenli ve modern proje yönetimi</p>
          <p>📊 Gerçek zamanlı görev takibi</p>
        </div>
      </div>
    </div>
  )
}

// Blok seçenekleri
const BLOCKS = ['A Blok', 'B Blok', 'C Blok', 'D Blok', 'E Blok']

// Giriş yapmış kullanıcılar için görev listesi
function TaskList() {
  const { user } = useSession()
  const [query, setQuery] = useState('')
  const [onlyUrgentFirst, setOnlyUrgentFirst] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all')
  const [selectedBlock, setSelectedBlock] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('')

  // Ana liste: sadece onaylı ve tamamlanmamış
  const approvedActive = useMemo(() => tasks.filter(t => t.is_approved && !t.is_completed), [])

  // Benim görevlerim: kendi şirketime ait tüm görevler (onaylı + onaysız)
  const myTasks = useMemo(() => tasks.filter(t => t.company_id === user?.company_id), [])

  // Seçilen bloka göre şirketleri filtrele
  const availableCompanies = useMemo(() => {
    if (!selectedBlock) return companies
    const companiesInBlock = tasks
      .filter(t => t.block === selectedBlock)
      .map(t => t.company_id)
    return companies.filter(c => companiesInBlock.includes(c.id))
  }, [selectedBlock])

  // Görev durum güncelleme
  const handleUpdateStatus = (id: string, status: 'planned' | 'in_progress') => {
    // Gerçek uygulamada API çağrısı yapılacak
    const statusText = status === 'planned' ? 'Planlandı' : 'Devam Ediyor'
    alert(`Görev durumu güncellendi: ${statusText} (${id})`)
    // Mock: Burada tasks array'ini güncelleyebiliriz
  }

  // Görev düzenleme
  const handleEdit = (id: string) => {
    // Gerçek uygulamada düzenleme modal'ı açılacak
    alert(`Düzenleme modalı açılacak: ${id}`)
  }

  // Görev tamamlama
  const handleComplete = (id: string) => {
    if (confirm('Bu görevi tamamlandı olarak işaretlemek istediğinizden emin misiniz?')) {
      alert(`Görev tamamlandı: ${id}`)
      // Mock: Burada tasks array'inden kaldırılacak
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let rows: Task[] = activeTab === 'all' ? approvedActive : myTasks

    // Blok filtresi
    if (selectedBlock) {
      rows = rows.filter(t => t.block === selectedBlock)
    }

    // Şirket filtresi
    if (selectedCompany) {
      rows = rows.filter(t => t.company_id === selectedCompany)
    }

    // Arama filtresi
    if (q) {
      rows = rows.filter((r) => [r.company?.name || '', r.title, r.block].some(x => x.toLowerCase().includes(q)))
    }

    return rows
  }, [approvedActive, myTasks, query, activeTab, selectedBlock, selectedCompany])

  return (
    <div className="space-y-6">
      {/* Tab Navigation - Sadece taşeronlar için */}
      {user?.role === 'user' && (
        <div className="card p-2">
          <div className="flex gap-2">
            <button
              className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('all')}
            >
              📋 Ana Liste
            </button>
            <button
              className={`btn ${activeTab === 'my' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('my')}
            >
              📁 Görevlerim
            </button>
          </div>
        </div>
      )}

      {/* Filtreleme Paneli */}
      <div className="card p-4">
        <h3 className="text-md font-semibold text-slate-800 mb-3">Filtreleme</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              🏢 Blok Seçimi
            </label>
            <select
              value={selectedBlock}
              onChange={(e) => {
                setSelectedBlock(e.target.value)
                setSelectedCompany('') // Blok değişince şirket seçimini sıfırla
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="">Tüm bloklar</option>
              {BLOCKS.map(block => (
                <option key={block} value={block}>{block}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              🏢 Şirket Seçimi
            </label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="">Tüm şirketler</option>
              {availableCompanies.map(company => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              🔍 Arama
            </label>
            <SearchBar value={query} onChange={setQuery} />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedBlock('')
                setSelectedCompany('')
                setQuery('')
              }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-lg transition-colors"
            >
              🗑️ Temizle
            </button>
          </div>
        </div>
      </div>

      <div className="card p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <label className="inline-flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" className="accent-brand-600" checked={onlyUrgentFirst} onChange={(e) => setOnlyUrgentFirst(e.target.checked)} />
            Kırmızıları öne al
          </label>
          <span className="text-sm text-slate-500">
            {filtered.length} görev görüntüleniyor
            {(selectedBlock || selectedCompany || query) && ' (filtrelenmiş)'}
          </span>
        </div>

        <div className="flex gap-2">
          {user?.role === 'user' && (
            <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>
              {showForm ? 'Formu Gizle' : '📝 Yeni Görev'}
            </button>
          )}
        </div>
      </div>

      {showForm && user && (
        <TaskForm onSubmit={(payload) => {
          // Placeholder: API entegrasyonu eklenecek (/api/tasks)
          alert(`Taslak kaydedildi (mock). Firma: ${user.company_name}. Admin onayı bekleniyor.`)
          setShowForm(false)
        }} />
      )}

      <div className="card p-0">
        <TaskTable
          rows={filtered}
          currentCompanyId={user?.company_id}
          onEdit={handleEdit}
          onComplete={handleComplete}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </div>
  )
}

export default function HomePage() {
  const { user } = useSession()

  // Eğer kullanıcı giriş yapmamışsa, giriş seçeneklerini göster
  if (!user) {
    return <LoginSelection />
  }

  // Giriş yapmış kullanıcılara görev listesini göster
  return <TaskList />
}
