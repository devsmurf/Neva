"use client"
import SearchBar from '@/components/SearchBar'
import TaskTable from '@/components/TaskTable'
import TaskForm from '@/components/TaskForm'
import { tasks } from '@/lib/mock'
import type { Task } from '@/lib/types'
import { useMemo, useState } from 'react'
import { useSession } from '@/components/SessionProvider'
import { useTabContext } from '@/components/NavBar'
import Link from 'next/link'
import { companies } from '@/lib/mock'

// Giriş yapmamış kullanıcılar için ana giriş seçenekleri
function LoginSelection() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white px-4 overflow-hidden fixed inset-0">
      <div className="w-full max-w-xs mx-auto space-y-4">
        {/* Ana Başlık */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-10 sm:w-24 sm:h-12 flex items-center justify-center -mt-8">
            <img
              src="/logo/rev-logo.png"
              alt="REV Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="180" height="45" viewBox="0 0 194.861 48.001" className="text-blue-600">
              <path d="M105.394,48l-.546-.024-.482-.005-.639.005-.169,0c-.052,0-.154.009-.3.022l-.005-.076a.7.7,0,0,0,.481-.424,2.075,2.075,0,0,0,.1-.518c.022-.231.032-.541.032-.922v-.829a3.242,3.242,0,0,0-.331-1.634,1.072,1.072,0,0,0-.975-.553,1.329,1.329,0,0,0-1.129.593,2.714,2.714,0,0,0-.425,1.6v.811c0,.388.01.707.029.948a1.791,1.791,0,0,0,.1.515.706.706,0,0,0,.472.41V48l-.528-.023-.525-.005-.514.005L99.477,48v-.076a.664.664,0,0,0,.466-.446,6.767,6.767,0,0,0,.129-1.741V44.312a1.8,1.8,0,0,0-.106-.815.546.546,0,0,0-.413-.18V43.24a6.464,6.464,0,0,0,1.316-.338l.043-.014V44.32a2.162,2.162,0,0,1,.686-1.157,1.859,1.859,0,0,1,1.216-.4,2.054,2.054,0,0,1,1.247.346,1.719,1.719,0,0,1,.625,1.05,2.062,2.062,0,0,1,.731-1.031,2,2,0,0,1,1.194-.364,1.679,1.679,0,0,1,1.4.577,2.963,2.963,0,0,1,.451,1.815v.929c0,.389.009.689.028.92a1.872,1.872,0,0,0,.1.51.672.672,0,0,0,.463.414V48l-.435-.023-.625-.005-.574.005c-.139,0-.292.008-.453.023v-.076a.681.681,0,0,0,.445-.419,4.481,4.481,0,0,0,.126-1.339v-.934a3.418,3.418,0,0,0-.312-1.634,1.013,1.013,0,0,0-.936-.553,1.292,1.292,0,0,0-1.084.569,2.566,2.566,0,0,0-.417,1.537v1.005a4.41,4.41,0,0,0,.128,1.344.72.72,0,0,0,.481.424V48h0Zm22.082,0h0v-.076a.744.744,0,0,0,.5-.443,5.144,5.144,0,0,0,.134-1.511v-1.7a1.767,1.767,0,0,0-.115-.8.39.39,0,0,0-.166-.146.6.6,0,0,0-.25-.055h-.017V43.2a5.82,5.82,0,0,0,.658-.129c.138-.036.249-.066.35-.1.122-.032.258-.076.389-.119V44.44a3.006,3.006,0,0,1,.762-1.174,1.523,1.523,0,0,1,1.025-.408h.2l-.347,1.111h-.076a.583.583,0,0,0-.457-.224h-.014a.815.815,0,0,0-.743.436,2.606,2.606,0,0,0-.252,1.275v.571a5.109,5.109,0,0,0,.127,1.468.735.735,0,0,0,.5.428V48l-.539-.023-.533-.005-.653.005c-.148,0-.309.008-.476.023Zm-10.328,0h0v-.076a.771.771,0,0,0,.519-.491,5.725,5.725,0,0,0,.143-1.63V44.458a2.327,2.327,0,0,0-.114-.948.542.542,0,0,0-.454-.214V43.22a7.058,7.058,0,0,0,.737-.131,7.58,7.58,0,0,0,.8-.232l-.02.706-.018,1.168v1.124a5.633,5.633,0,0,0,.136,1.587.794.794,0,0,0,.526.482V48l-.473-.023-.668,0-.617,0c-.066,0-.154,0-.284.012-.115.008-.187.013-.212.013ZM75.317,48h0l0-.075a.732.732,0,0,0,.553-.468,2.466,2.466,0,0,0,.11-.6c.024-.278.038-.64.038-1.076V42.467a.856.856,0,0,0-.133-.517.8.8,0,0,0-.447-.265V41.61l.585.029.563.009.272,0c.124,0,.221,0,.291,0l.591-.029v.076a.708.708,0,0,0-.448.248.617.617,0,0,0-.1.221,1.231,1.231,0,0,0-.034.312v3.364a5.6,5.6,0,0,0,.143,1.608.773.773,0,0,0,.558.484V48l-.591-.023-.715,0-.72,0c-.156,0-.325.008-.5.024Zm15.627-.01H90.8l-.671-.019H86.152v-.057c.242-.28.482-.568.715-.858.284-.355.563-.714.829-1.067l.186-.243,1.377-1.806.023-.038a1.857,1.857,0,0,0,.386-.643c0-.058-.052-.1-.159-.131a2.13,2.13,0,0,0-.517-.045,3.92,3.92,0,0,0-1.5.229,2.76,2.76,0,0,0-1,.8l-.058-.019.467-1.21H91.15v.067c-.923,1.139-1.7,2.165-2.314,3.05a5.968,5.968,0,0,0-.926,1.578c0,.063.043.113.129.148a1.4,1.4,0,0,0,.41.047,4.534,4.534,0,0,0,1.73-.271,3.017,3.017,0,0,0,1.158-.92l.066.018-.457,1.387Zm26.885-5.925a.544.544,0,0,1-.158-.4.553.553,0,0,1,.167-.406.572.572,0,0,1,.41-.162.562.562,0,0,1,.41.167.552.552,0,0,1,.166.4.534.534,0,0,1-.162.4.567.567,0,0,1-.415.16A.575.575,0,0,1,117.829,42.065ZM76.582,40.733a.565.565,0,0,1-.391-.965.536.536,0,0,1,.391-.169.551.551,0,0,1,.4.169.542.542,0,0,1,.171.4.555.555,0,0,1-.161.405.547.547,0,0,1-.39.162Zm69.274-10.516h-.371l5.362-20.335-2.283-8.76h2.018l7.433,29.093H156.05L154.4,23.9h-6.9l-1.646,6.318h0Zm1.753-6.691h6.743l-3.345-12.848Zm47.251,6.69h-1.911V1.122h1.912V30.216h0Zm-15.716,0h-7.325V1.122h1.912V29.845h5.414v.371h0Zm-52.987,0h-1.91V16.891l-6.9-15.769h2.018l6.583,15.026L133.38,1.122h.424l-7.646,15.449V30.216h0ZM3.7,29.769H0v-.316c.788,0,1.581-.792,1.581-2.3L1.445,2.62C1.445,1.113.977.317.09.317V0H5.647L16.353,21.05V2.62c0-1.378-.581-2.3-1.446-2.3V0h3.614V.317c-.879,0-1.491.948-1.491,2.3V29.767h-.677L2.123,1.987l.09,25.161c0,1.313.641,2.3,1.491,2.3v.316h0Zm91.243-.318a.786.786,0,0,0,.606-.327,4.264,4.264,0,0,0,.342-3.377l-1.445-5.421H88.215l-1.4,5.51c-.365,1.435-.312,2.507.151,3.1a1.352,1.352,0,0,0,1.114.511v.316H83.246v-.316c1.24,0,2.185-1.212,2.891-3.7l4.7-17.8L92.642.994,92.777,0h.679l.18.994,6.188,24.755c.551,2.285,1.676,3.7,2.937,3.7v.315H94.946ZM88.4,19.695h5.918L91.83,9.577l-.452-1.761h0ZM67.75,29.768h-.632l-.271-.994-6.188-24.8a6.467,6.467,0,0,0-1.2-2.744,2.268,2.268,0,0,0-1.74-.914V0h7.815V.317a.763.763,0,0,0-.594.322c-.386.484-.658,1.615-.265,3.335l4.066,16.172.361,1.807c1.573-6.466,3.853-15.419,4.563-18.069.4-1.4.368-2.449-.08-3.042a1.382,1.382,0,0,0-1.14-.527V0h4.789V.317c-1.232,0-2.174,1.231-2.8,3.658l-4.744,17.8-1.761,7-.18.994h0Zm-21.5,0H29.992v-.315c.812,0,1.445-.993,1.445-2.258V2.485c0-1.338-.553-2.169-1.445-2.169V0H46.253V4.291h-.317a3.687,3.687,0,0,0-.88-2.559,3.973,3.973,0,0,0-3.049-1.1h-6.64v13.19h3.388c2.791,0,3.208-1.217,3.208-1.942h.316v4.608h-.316a1.71,1.71,0,0,0-.489-1.254,3.805,3.805,0,0,0-2.719-.779H35.366V29.09h6.64A4,4,0,0,0,45.055,28a3.529,3.529,0,0,0,.881-2.479h.317v4.246h0Z" fill="#2e7aa0" />
            </svg>
          </div>
          <p className="text-slate-600 text-xs sm:text-sm">
            Proje Yönetim Sistemine Hoş Geldiniz
          </p>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {/* Şef Girişi */}
          <Link href="/admin/login" className="block">
            <button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium py-3 px-4 sm:py-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 194.861 48.001" className="w-full h-full text-white">
                      <path d="M105.394,48l-.546-.024-.482-.005-.639.005-.169,0c-.052,0-.154.009-.3.022l-.005-.076a.7.7,0,0,0,.481-.424,2.075,2.075,0,0,0,.1-.518c.022-.231.032-.541.032-.922v-.829a3.242,3.242,0,0,0-.331-1.634,1.072,1.072,0,0,0-.975-.553,1.329,1.329,0,0,0-1.129.593,2.714,2.714,0,0,0-.425,1.6v.811c0,.388.01.707.029.948a1.791,1.791,0,0,0,.1.515.706.706,0,0,0,.472.41V48l-.528-.023-.525-.005-.514.005L99.477,48v-.076a.664.664,0,0,0,.466-.446,6.767,6.767,0,0,0,.129-1.741V44.312a1.8,1.8,0,0,0-.106-.815.546.546,0,0,0-.413-.18V43.24a6.464,6.464,0,0,0,1.316-.338l.043-.014V44.32a2.162,2.162,0,0,1,.686-1.157,1.859,1.859,0,0,1,1.216-.4,2.054,2.054,0,0,1,1.247.346,1.719,1.719,0,0,1,.625,1.05,2.062,2.062,0,0,1,.731-1.031,2,2,0,0,1,1.194-.364,1.679,1.679,0,0,1,1.4.577,2.963,2.963,0,0,1,.451,1.815v.929c0,.389.009.689.028.92a1.872,1.872,0,0,0,.1.51.672.672,0,0,0,.463.414V48l-.435-.023-.625-.005-.574.005c-.139,0-.292.008-.453.023v-.076a.681.681,0,0,0,.445-.419,4.481,4.481,0,0,0,.126-1.339v-.934a3.418,3.418,0,0,0-.312-1.634,1.013,1.013,0,0,0-.936-.553,1.292,1.292,0,0,0-1.084.569,2.566,2.566,0,0,0-.417,1.537v1.005a4.41,4.41,0,0,0,.128,1.344.72.72,0,0,0,.481.424V48h0Zm22.082,0h0v-.076a.744.744,0,0,0,.5-.443,5.144,5.144,0,0,0,.134-1.511v-1.7a1.767,1.767,0,0,0-.115-.8.39.39,0,0,0-.166-.146.6.6,0,0,0-.25-.055h-.017V43.2a5.82,5.82,0,0,0,.658-.129c.138-.036.249-.066.35-.1.122-.032.258-.076.389-.119V44.44a3.006,3.006,0,0,1,.762-1.174,1.523,1.523,0,0,1,1.025-.408h.2l-.347,1.111h-.076a.583.583,0,0,0-.457-.224h-.014a.815.815,0,0,0-.743.436,2.606,2.606,0,0,0-.252,1.275v.571a5.109,5.109,0,0,0,.127,1.468.735.735,0,0,0,.5.428V48l-.539-.023-.533-.005-.653.005c-.148,0-.309.008-.476.023Zm-10.328,0h0v-.076a.771.771,0,0,0,.519-.491,5.725,5.725,0,0,0,.143-1.63V44.458a2.327,2.327,0,0,0-.114-.948.542.542,0,0,0-.454-.214V43.22a7.058,7.058,0,0,0,.737-.131,7.58,7.58,0,0,0,.8-.232l-.02.706-.018,1.168v1.124a5.633,5.633,0,0,0,.136,1.587.794.794,0,0,0,.526.482V48l-.473-.023-.668,0-.617,0c-.066,0-.154,0-.284.012-.115.008-.187.013-.212.013ZM75.317,48h0l0-.075a.732.732,0,0,0,.553-.468,2.466,2.466,0,0,0,.11-.6c.024-.278.038-.64.038-1.076V42.467a.856.856,0,0,0-.133-.517.8.8,0,0,0-.447-.265V41.61l.585.029.563.009.272,0c.124,0,.221,0,.291,0l.591-.029v.076a.708.708,0,0,0-.448.248.617.617,0,0,0-.1.221,1.231,1.231,0,0,0-.034.312v3.364a5.6,5.6,0,0,0,.143,1.608.773.773,0,0,0,.558.484V48l-.591-.023-.715,0-.72,0c-.156,0-.325.008-.5.024Zm15.627-.01H90.8l-.671-.019H86.152v-.057c.242-.28.482-.568.715-.858.284-.355.563-.714.829-1.067l.186-.243,1.377-1.806.023-.038a1.857,1.857,0,0,0,.386-.643c0-.058-.052-.1-.159-.131a2.13,2.13,0,0,0-.517-.045,3.92,3.92,0,0,0-1.5.229,2.76,2.76,0,0,0-1,.8l-.058-.019.467-1.21H91.15v.067c-.923,1.139-1.7,2.165-2.314,3.05a5.968,5.968,0,0,0-.926,1.578c0,.063.043.113.129.148a1.4,1.4,0,0,0,.41.047,4.534,4.534,0,0,0,1.73-.271,3.017,3.017,0,0,0,1.158-.92l.066.018-.457,1.387Zm26.885-5.925a.544.544,0,0,1-.158-.4.553.553,0,0,1,.167-.406.572.572,0,0,1,.41-.162.562.562,0,0,1,.41.167.552.552,0,0,1,.166.4.534.534,0,0,1-.162.4.567.567,0,0,1-.415.16A.575.575,0,0,1,117.829,42.065ZM76.582,40.733a.565.565,0,0,1-.391-.965.536.536,0,0,1,.391-.169.551.551,0,0,1,.4.169.542.542,0,0,1,.171.4.555.555,0,0,1-.161.405.547.547,0,0,1-.39.162Zm69.274-10.516h-.371l5.362-20.335-2.283-8.76h2.018l7.433,29.093H156.05L154.4,23.9h-6.9l-1.646,6.318h0Zm1.753-6.691h6.743l-3.345-12.848Zm47.251,6.69h-1.911V1.122h1.912V30.216h0Zm-15.716,0h-7.325V1.122h1.912V29.845h5.414v.371h0Zm-52.987,0h-1.91V16.891l-6.9-15.769h2.018l6.583,15.026L133.38,1.122h.424l-7.646,15.449V30.216h0ZM3.7,29.769H0v-.316c.788,0,1.581-.792,1.581-2.3L1.445,2.62C1.445,1.113.977.317.09.317V0H5.647L16.353,21.05V2.62c0-1.378-.581-2.3-1.446-2.3V0h3.614V.317c-.879,0-1.491.948-1.491,2.3V29.767h-.677L2.123,1.987l.09,25.161c0,1.313.641,2.3,1.491,2.3v.316h0Zm91.243-.318a.786.786,0,0,0,.606-.327,4.264,4.264,0,0,0,.342-3.377l-1.445-5.421H88.215l-1.4,5.51c-.365,1.435-.312,2.507.151,3.1a1.352,1.352,0,0,0,1.114.511v.316H83.246v-.316c1.24,0,2.185-1.212,2.891-3.7l4.7-17.8L92.642.994,92.777,0h.679l.18.994,6.188,24.755c.551,2.285,1.676,3.7,2.937,3.7v.315H94.946ZM88.4,19.695h5.918L91.83,9.577l-.452-1.761h0ZM67.75,29.768h-.632l-.271-.994-6.188-24.8a6.467,6.467,0,0,0-1.2-2.744,2.268,2.268,0,0,0-1.74-.914V0h7.815V.317a.763.763,0,0,0-.594.322c-.386.484-.658,1.615-.265,3.335l4.066,16.172.361,1.807c1.573-6.466,3.853-15.419,4.563-18.069.4-1.4.368-2.449-.08-3.042a1.382,1.382,0,0,0-1.14-.527V0h4.789V.317c-1.232,0-2.174,1.231-2.8,3.658l-4.744,17.8-1.761,7-.18.994h0Zm-21.5,0H29.992v-.315c.812,0,1.445-.993,1.445-2.258V2.485c0-1.338-.553-2.169-1.445-2.169V0H46.253V4.291h-.317a3.687,3.687,0,0,0-.88-2.559,3.973,3.973,0,0,0-3.049-1.1h-6.64v13.19h3.388c2.791,0,3.208-1.217,3.208-1.942h.316v4.608h-.316a1.71,1.71,0,0,0-.489-1.254,3.805,3.805,0,0,0-2.719-.779H35.366V29.09h6.64A4,4,0,0,0,45.055,28a3.529,3.529,0,0,0,.881-2.479h.317v4.246h0Z" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base">Şef Girişi</span>
                </div>
                <span className="text-white/80 text-sm sm:text-base">→</span>
              </div>
            </button>
          </Link>

          {/* Taşeron Girişi */}
          <Link href="/contractor/login" className="block">
            <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 px-4 sm:py-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="text-sm sm:text-base">Taşeron Girişi</span>
                </div>
                <span className="text-white/80 text-sm sm:text-base">→</span>
              </div>
            </button>
          </Link>
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
  const { activeTab } = user?.role === 'user' ? useTabContext() : { activeTab: 'all' as const }
  const [query, setQuery] = useState('')
  const [onlyUrgentFirst, setOnlyUrgentFirst] = useState(true)
  const [showForm, setShowForm] = useState(false)
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
    <div className="space-y-2">
      {/* Tab Navigation kaldırıldı - NavBar'da artık */}

      {/* Filtreleme Paneli */}
      <div className="bg-slate-50 rounded-lg p-2 border border-slate-200">
        <div className="space-y-2">
          {/* İlk satır - Blok ve Şirket seçimi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                🏢 Blok
              </label>
              <select
                value={selectedBlock}
                onChange={(e) => {
                  setSelectedBlock(e.target.value)
                  setSelectedCompany('') // Blok değişince şirket seçimini sıfırla
                }}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">Tüm bloklar</option>
                {BLOCKS.map(block => (
                  <option key={block} value={block}>{block}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                🏢 Şirket
              </label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">Tüm şirketler</option>
                {availableCompanies.map(company => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* İkinci satır - Arama ve Temizle yan yana */}
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-3">
              <label className="block text-xs font-medium text-slate-700 mb-1">
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
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-2 md:px-3 rounded-lg transition-colors text-xs"
              >
                🗑️ <span className="hidden md:inline">Temizle</span>
              </button>
            </div>
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
          narrow
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
