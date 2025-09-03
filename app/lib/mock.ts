import type { Company, Project, Task } from './types'

export const project: Project = {
  id: 'proj-neva-yali',
  name: 'Neva Yalı',
  end_date: '2025-12-31',
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

export const tasks: Task[] = [
  {
    id: 't1',
    project_id: project.id,
    company_id: 'c-beta',
    block: 'A Blok',
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
    block: 'B2 Blok',
    title: 'Alçı sıva - 2. kat',
    start_date: '2025-09-06',
    due_date: '2025-09-10',
    status: 'planned',
    is_completed: false,
    is_approved: true,
    company: companies.find(c => c.id === 'c-gamma')!
  },
  {
    id: 't3',
    project_id: project.id,
    company_id: 'c-eps',
    block: 'C Blok',
    title: 'Alçıpan tavan - lobi',
    start_date: '2025-09-01',
    due_date: '2025-09-03',
    status: 'in_progress',
    is_completed: false,
    is_approved: true,
    company: companies.find(c => c.id === 'c-eps')!
  },
  {
    id: 't4',
    project_id: project.id,
    company_id: 'c-boy',
    block: 'A Blok',
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
    title: 'Elektrik pano montajı',
    start_date: '2025-08-25',
    due_date: '2025-08-30',
    status: 'in_progress',
    is_completed: false,
    is_approved: true,
    company: companies.find(c => c.id === 'c-alfa')!
  },
  // Onay bekleyen görevler
  {
    id: 't6',
    project_id: project.id,
    company_id: 'c-beta',
    block: 'A Blok',
    title: 'Seramik döşeme - 1. kat',
    start_date: '2025-09-15',
    due_date: '2025-09-25',
    status: 'planned',
    is_completed: false,
    is_approved: false, // Onay bekliyor
    company: companies.find(c => c.id === 'c-beta')!
  },
  {
    id: 't7',
    project_id: project.id,
    company_id: 'c-gamma',
    block: 'C Blok',
    title: 'Dış cephe mantolama',
    start_date: '2025-10-01',
    due_date: '2025-10-15',
    status: 'planned',
    is_completed: false,
    is_approved: false, // Onay bekliyor
    company: companies.find(c => c.id === 'c-gamma')!
  },
  {
    id: 't8',
    project_id: project.id,
    company_id: 'c-eps',
    block: 'B Blok',
    title: 'Asma tavan montajı - 4. kat',
    start_date: '2025-09-20',
    due_date: '2025-09-30',
    status: 'planned',
    is_completed: false,
    is_approved: false, // Onay bekliyor
    company: companies.find(c => c.id === 'c-eps')!
  }
]

