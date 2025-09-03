"use client"
import { useState, useEffect } from 'react'

export default function SearchBar({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  const [q, setQ] = useState(value ?? '')
  useEffect(() => setQ(value ?? ''), [value])
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="relative w-full md:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-slate-400 text-lg">🔍</span>
        </div>
        <input
          className="w-full rounded-xl border border-slate-300/60 bg-white/90 backdrop-blur-sm pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all duration-200 shadow-sm hover:shadow-md"
          placeholder="Ara: şirket / görev / blok..."
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            onChange(e.target.value)
          }}
        />
        {q && (
          <button
            onClick={() => {
              setQ('')
              onChange('')
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span className="text-lg">✕</span>
          </button>
        )}
      </div>
    </div>
  )
}

