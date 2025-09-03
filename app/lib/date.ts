import type { Task } from './types'

// NOTE: For consistent results set process.env.TZ = 'Europe/Istanbul' on server.
// On client, we treat all date strings (YYYY-MM-DD) as local dates at 12:00 to avoid TZ drift.

export const parseDateLocalNoon = (d: string) => new Date(d + 'T12:00:00')

export const startOfDayLocal = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

export const todayStart = () => startOfDayLocal(new Date())

export const daysDiff = (from: Date, to: Date) => {
  const MS = 86_400_000
  return Math.floor((startOfDayLocal(to).getTime() - startOfDayLocal(from).getTime()) / MS)
}

export const isLate = (t: Task) => !t.is_completed && todayStart().getTime() > startOfDayLocal(parseDateLocalNoon(t.due_date)).getTime()

export const durumText = (t: Task) => (isLate(t) ? 'Geç Kaldı' : (t.status === 'in_progress' ? 'Devam Ediyor' : 'Planlandı'))

export const daysLeft = (t: Task) => {
  const d = daysDiff(todayStart(), parseDateLocalNoon(t.due_date))
  return -d // not used directly, kept for clarity
}

export const kalanGecikme = (t: Task) => {
  const MS = 86_400_000
  const d = Math.floor((startOfDayLocal(parseDateLocalNoon(t.due_date)).getTime() - todayStart().getTime()) / MS)
  return d < 0 ? `${Math.abs(d)} gün geç` : (d === 0 ? 'Bugün' : `${d} gün kaldı`)
}

export const uyariText = (t: Task) => {
  if (isLate(t)) return 'Kendi işi gecikti'
  const today = todayStart()
  const s = startOfDayLocal(parseDateLocalNoon(t.start_date))
  if (t.status === 'planned' && today.getTime() < s.getTime()) return 'Bağımlılığı beklemede'
  return '—'
}

