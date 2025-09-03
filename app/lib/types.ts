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
  title: string
  start_date: string // YYYY-MM-DD
  due_date: string   // YYYY-MM-DD
  status: TaskStatus
  is_completed: boolean
  is_approved: boolean
  notes?: string | null
  company?: Company
}

