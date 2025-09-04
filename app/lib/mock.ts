import type { Company, Project, Task } from './types'

export const project: Project = {
  id: 'proj-neva-yali',
  name: 'Neva Yalı',
  end_date: '2025-12-29',
  is_active: true,
}

export const companies: Company[] = [
  { id: 'c-beta', name: 'Beta Beton' },
  { id: 'c-gamma', name: 'Gamma Sıva' },
  { id: 'c-eps', name: 'Epsilon Alçıpan' },
  { id: 'c-boy', name: 'Boyacı Ltd.' },
  { id: 'c-alfa', name: 'Alfa Elektrik' },
]

// today helper (local). For accurate TR timezone in SSR, set TZ=Europe/Istanbul
const today = new Date()
const yyyy = today.getFullYear()
const mm = String(today.getMonth() + 1).padStart(2, '0')
const dd = String(today.getDate()).padStart(2, '0')
const todayStr = `${yyyy}-${mm}-${dd}`

export const currentCompanyId = 'c-beta' // simulate logged-in company for UI

// Helper to format a date offset from today as YYYY-MM-DD
const addDays = (base: Date, days: number) => {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const tasks: Task[] = [
  {
    id: 't1',
    project_id: project.id,
    company_id: 'c-beta',
    block: 'A Blok',
    floor: 3,
    title: 'Şap dökümü - 3. kat',
    start_date: todayStr,
    due_date: todayStr,
    status: 'in_progress',
    is_completed: false,
    is_approved: true,
    company: companies.find(c => c.id === 'c-beta')!
  },
  {
    id: 't2',
    project_id: project.id,
    company_id: 'c-gamma',
    block: 'B Blok',
    floor_from: 2,
    floor_to: 5,
    title: 'Alçı sıva - 2. kat',
    start_date: '2025-09-06',
    due_date: '2025-09-10',
    status: 'planned',
    is_completed: false,
    is_approved: true,
    dependent_company_id: 'c-beta',
    company: companies.find(c => c.id === 'c-gamma')!
  },
  {
    id: 't3',
    project_id: project.id,
    company_id: 'c-eps',
    block: 'C Blok',
    floor: -1,
    title: 'Alçıpan tavan - lobi',
    start_date: '2025-09-01',
    due_date: '2025-09-03',
    status: 'in_progress',
    is_completed: true,
    is_approved: true,
    company: companies.find(c => c.id === 'c-eps')!
  },
  {
    id: 't4',
    project_id: project.id,
    company_id: 'c-boy',
    block: 'A Blok',
    floor: 5,
    title: 'Boyama - 5. kat',
    start_date: '2025-09-10',
    due_date: '2025-09-20',
    status: 'planned',
    is_completed: false,
    is_approved: false, // not on main list
    company: companies.find(c => c.id === 'c-boy')!
  },
  {
    id: 't5',
    project_id: project.id,
    company_id: 'c-alfa',
    block: 'B Blok',
    floor_from: -2,
    floor_to: -1,
    title: 'Elektrik pano montajı',
    start_date: '2025-08-25',
    due_date: '2025-08-30',
    status: 'in_progress',
    is_completed: true,
    is_approved: true,
    company: companies.find(c => c.id === 'c-alfa')!
  },
  // Onay bekleyen görevler
  {
    id: 't6',
    project_id: project.id,
    company_id: 'c-beta',
    block: 'A Blok',
    floor_from: 10,
    floor_to: 12,
    title: 'Seramik döşeme - 1. kat',
    start_date: '2025-09-15',
    due_date: '2025-09-25',
    status: 'planned',
    is_completed: false,
    is_approved: false, // Onay bekliyor
    dependent_company_id: 'c-gamma',
    company: companies.find(c => c.id === 'c-beta')!
  },
  {
    id: 't7',
    project_id: project.id,
    company_id: 'c-gamma',
    block: 'C Blok',
    floor: 8,
    title: 'Dış cephe mantolama',
    start_date: '2025-10-01',
    due_date: '2025-10-15',
    status: 'planned',
    is_completed: true,
    is_approved: false, // Onay bekliyor
    company: companies.find(c => c.id === 'c-gamma')!
  },
  {
    id: 't8',
    project_id: project.id,
    company_id: 'c-eps',
    block: 'B Blok',
    floor: 4,
    title: 'Asma tavan montajı - 4. kat',
    start_date: '2025-09-20',
    due_date: '2025-09-30',
    status: 'planned',
    is_completed: false,
    is_approved: false, // Onay bekliyor
    company: companies.find(c => c.id === 'c-eps')!
  }
  ,
  // Yeni eklenen 5 görev (2 gecikmiş: 3 ve 5 gün; 3 normal)
  {
    id: 't9',
    project_id: project.id,
    company_id: 'c-beta',
    block: 'A Blok',
    floor: 7,
    title: 'Şap düzeltme ve tesviye - 7. kat',
    start_date: addDays(today, -8),
    due_date: addDays(today, -5), // 5 gün gecikmiş
    status: 'in_progress',
    is_completed: false,
    is_approved: true,
    company: companies.find(c => c.id === 'c-beta')!
  },
  {
    id: 't10',
    project_id: project.id,
    company_id: 'c-gamma',
    block: 'B Blok',
    floor_from: 3,
    floor_to: 4,
    title: 'Alçı sıva detay düzeltmeleri',
    start_date: addDays(today, -6),
    due_date: addDays(today, -3), // 3 gün gecikmiş
    status: 'planned',
    is_completed: false,
    is_approved: true,
    company: companies.find(c => c.id === 'c-gamma')!
  },
  {
    id: 't11',
    project_id: project.id,
    company_id: 'c-eps',
    block: 'C Blok',
    floor: -2,
    title: 'Alçıpan taşıyıcı montajı - otopark',
    start_date: addDays(today, 0),
    due_date: addDays(today, 3), // normal
    status: 'in_progress',
    is_completed: false,
    is_approved: true,
    dependent_company_id: 'c-alfa',
    company: companies.find(c => c.id === 'c-eps')!
  },
  {
    id: 't12',
    project_id: project.id,
    company_id: 'c-boy',
    block: 'D Blok',
    floor: 2,
    title: 'Astar uygulaması - 2. kat',
    start_date: addDays(today, 1),
    due_date: addDays(today, 7), // normal
    status: 'planned',
    is_completed: false,
    is_approved: true,
    company: companies.find(c => c.id === 'c-boy')!
  },
  {
    id: 't13',
    project_id: project.id,
    company_id: 'c-alfa',
    block: 'E Blok',
    floor_from: 1,
    floor_to: 2,
    title: 'Elektrik priz montajı - 1–2. kat',
    start_date: addDays(today, 2),
    due_date: addDays(today, 10), // normal
    status: 'planned',
    is_completed: false,
    is_approved: true,
    company: companies.find(c => c.id === 'c-alfa')!
  }
]
