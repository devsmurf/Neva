export type TaskStatus = 'planned' | 'in_progress'

export type Company = {
  id: string
  name: string
  block_prefix?: string | null
}

export type Project = {
  id: string
  name: string
  end_date: string
  is_active: boolean
}

export type Task = {
  id: string
  project_id: string
  company_id: string
  block: string
  floor?: number | null
  floor_from?: number | null
  floor_to?: number | null
  title: string
  start_date: string // YYYY-MM-DD
  due_date: string   // YYYY-MM-DD
  status: TaskStatus
  is_completed: boolean
  is_approved: boolean
  notes?: string | null
  dependent_company_id?: string | null
  company?: Company
  dependent_company?: Company
}
