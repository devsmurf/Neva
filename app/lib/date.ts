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

export const durumText = (t: Task) => {
  if (t.is_completed) return 'Tamamlandı'
  if (isLate(t)) return 'Geç Kaldı'
  if (t.status === 'in_progress') return 'Devam Ediyor'
  
  // Planned durumu için bağımlılık kontrolü
  if (t.status === 'planned') {
    // Bağımlılığı varsa "Planlandı", yoksa "Devam Ediyor" (otomatik başlamış)
    return t.dependent_company_id ? 'Planlandı' : 'Devam Ediyor'
  }
  
  return 'Planlandı' // fallback
}

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
  
  // Sadece bağımlılığı olan görevlerde uyarı göster
  if (t.dependent_company_id && t.status === 'planned') {
    return 'Bağımlılığı beklemede'
  }
  
  // Diğer tüm durumlar için "—" göster (bağımlılık yok, completed, in_progress vs.)
  return '—'
}

