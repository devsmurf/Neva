"use client"
import { useMemo, useState } from 'react'
import { tasks, companies, project } from '@/lib/mock'
import TaskTable from '@/components/TaskTable'
import { useSession } from '@/components/SessionProvider'
import Link from 'next/link'

type Tab = 'queue' | 'all' | 'project' | 'companies'

// Blok seçenekleri
const BLOCKS = ['A Blok', 'B Blok', 'C Blok', 'D Blok', 'E Blok']

// Admin olmayan kullanıcılar için erişim reddedildi sayfası
function AccessDenied() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="w-24 h-24 mx-auto bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
          <span className="text-4xl text-white">🚫</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-800">Erişim Reddedildi</h1>
          <p className="text-slate-600">
            Bu sayfaya erişmek için şef yetkilerine sahip olmanız gerekiyor.
          </p>
        </div>
        <div className="space-y-3">
          <Link href="/admin/login" className="btn btn-primary">
            👑 Şef Girişi Yap
          </Link>
          <br />
          <Link href="/" className="text-slate-500 hover:text-slate-700 text-sm">
            ← Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  )
}

// Onay kuyruğu komponenti
function ApprovalQueue({ queue }: { queue: any[] }) {
  const handleApprove = (id: string) => {
    // Gerçek uygulamada API çağrısı yapılacak
    alert(`Görev onaylandı: ${id}`)
  }

  const handleReject = (id: string) => {
    // Gerçek uygulamada API çağrısı yapılacak
    alert(`Görev reddedildi: ${id}`)
  }

  if (!queue.length) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-2xl flex items-center justify-center mb-4">
          <span className="text-2xl">✅</span>
        </div>
        <h3 className="text-lg font-medium text-slate-800 mb-2">Tüm görevler onaylandı!</h3>
        <p className="text-slate-600">Onay bekleyen görev bulunmuyor.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <span className="text-amber-600">⚠️</span>
          <span className="font-medium text-amber-800">
            {queue.length} görev onay bekliyor
          </span>
        </div>
      </div>

      {queue.map(task => (
        <div key={task.id} className="card p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">
                  Onay Bekliyor
                </span>
                <span className="text-sm text-slate-500">
                  {task.company?.name}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                {task.title}
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-xs md:text-sm">
                <div>
                  <span className="text-slate-500">Blok:</span>
                  <span className="ml-2 font-medium">{task.block}</span>
                </div>
                <div>
                  <span className="text-slate-500">Başlangıç:</span>
                  <span className="ml-2 font-medium">{task.start_date}</span>
                </div>
                <div>
                  <span className="text-slate-500">Bitiş:</span>
                  <span className="ml-2 font-medium">{task.due_date}</span>
                </div>
                <div>
                  <span className="text-slate-500">Durum:</span>
                  <span className="ml-2 font-medium">{task.status === 'planned' ? 'Planlandı' : 'Devam Ediyor'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 md:ml-4 md:self-start mt-2 md:mt-0">
              <button
                onClick={() => handleApprove(task.id)}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs md:text-sm font-medium transition-all shadow-sm border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                aria-label="Onayla"
              >
                <span>✅</span>
                <span>Onayla</span>
              </button>
              <button
                onClick={() => handleReject(task.id)}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs md:text-sm font-medium transition-all shadow-sm border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                aria-label="Reddet"
              >
                <span>❌</span>
                <span>Reddet</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminPage() {
  const { user } = useSession()
  const [tab, setTab] = useState<Tab>('queue')
  const [selectedBlock, setSelectedBlock] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('')

  // Hook'ları koşullu return'den önce çağırıyoruz
  const queue = useMemo(() => tasks.filter(t => !t.is_approved), [])
  const all = useMemo(() => tasks, [])

  // Filtrelenmiş tüm görevler
  const filteredAll = useMemo(() => {
    let filtered = all
    if (selectedBlock) {
      filtered = filtered.filter(t => t.block === selectedBlock)
    }
    if (selectedCompany) {
      filtered = filtered.filter(t => t.company_id === selectedCompany)
    }
    return filtered
  }, [all, selectedBlock, selectedCompany])

  // Seçilen bloka göre şirketleri filtrele
  const availableCompanies = useMemo(() => {
    if (!selectedBlock) return companies
    const companiesInBlock = tasks
      .filter(t => t.block === selectedBlock)
      .map(t => t.company_id)
    return companies.filter(c => companiesInBlock.includes(c.id))
  }, [selectedBlock])

  // Görev silme fonksiyonu
  const handleDeleteTask = (id: string) => {
    if (confirm('Bu görevi kalici olarak silmek istediğinizden emin misiniz?')) {
      alert(`Görev silindi: ${id} (Mock - gerçek uygulamada API çağrısı yapılacak)`)
    }
  }

  // Admin kontrolü - hook'lardan sonra
  if (!user || user.role !== 'admin') {
    return <AccessDenied />
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
            <span className="text-xl text-white">👑</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Şef Paneli</h1>
            <p className="text-slate-600">{user.company_name} - Admin Yetkileri</p>
          </div>
        </div>
      </div>

      <div className="card p-2">
        <div className="flex gap-2 flex-wrap">
          <button
            className={`btn ${tab === 'queue' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setTab('queue')}
          >
            ⚠️ Onay Kuyruğu {queue.length > 0 && `(${queue.length})`}
          </button>
          <button
            className={`btn ${tab === 'all' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setTab('all')}
          >
            📋 Tüm Görevler
          </button>
          <button
            className={`btn ${tab === 'project' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setTab('project')}
          >
            🏗️ Proje Ayarları
          </button>
          <button
            className={`btn ${tab === 'companies' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setTab('companies')}
          >
            🏢 Şirketler
          </button>
        </div>
      </div>

      {tab === 'queue' && <ApprovalQueue queue={queue} />}

      {tab === 'all' && (
        <div className="space-y-4">
          {/* Filtreleme Paneli */}
          <div className="card p-4">
            <h3 className="text-md font-semibold text-slate-800 mb-3">Filtreleme</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedBlock('')
                    setSelectedCompany('')
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-lg transition-colors"
                >
                  🗑️ Filtreleri Temizle
                </button>
              </div>
            </div>
          </div>

          {/* Görev Listesi */}
          <div className="card p-0">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Tüm Görevler</h2>
              <p className="text-sm text-slate-600">
                {filteredAll.length} görev görüntüleniyor
                {(selectedBlock || selectedCompany) && ' (filtrelenmiş)'}
              </p>
            </div>
            <TaskTable
              rows={filteredAll}
              onEdit={(id) => alert('Şef düzenleme: ' + id)}
              onComplete={handleDeleteTask}
              showDeleteButton={true}
            />
          </div>
        </div>
      )}

      {tab === 'project' && (
        <div className="card p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-semibold text-slate-800">Proje Ayarları</h2>
            <p className="text-sm text-slate-600">Proje detaylarını ve teslim tarihini yönetin</p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <div className="text-slate-700 mb-4">
              <span className="text-sm text-slate-500">Proje Adı:</span>
              <div className="text-xl font-bold">{project.name}</div>
            </div>

            <div className="flex items-end gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Teslim Tarihi
                </label>
                <input
                  type="date"
                  className="rounded-xl border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500/50"
                  defaultValue={project.end_date}
                />
              </div>
              <button className="btn btn-primary">📅 Tarihi Güncelle</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'companies' && (
        <div className="card p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-semibold text-slate-800">Şirket Yönetimi</h2>
            <p className="text-sm text-slate-600">Taşeron şirketleri ekleyin, düzenleyin ve yönetin</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {companies.map(company => (
              <div key={company.id} className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-800">{company.name}</h3>
                    <p className="text-sm text-slate-500">ID: {company.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => alert(`Düzenle: ${company.name}`)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      ✏️ Düzenle
                    </button>
                    <button
                      onClick={() => alert(`Sil: ${company.name}`)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      🗑️ Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-medium text-blue-800 mb-3">Yeni Şirket Ekle</h3>
            <div className="flex gap-3">
              <input
                placeholder="Şirket adını girin..."
                className="flex-1 rounded-lg border border-blue-300 px-3 py-2 focus:ring-2 focus:ring-blue-500/50"
              />
              <button
                onClick={() => alert('Yeni şirket ekleme özelliği aktif edilecek')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
              >
                ➕ Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
