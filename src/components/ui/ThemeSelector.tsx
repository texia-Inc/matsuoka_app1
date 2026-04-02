'use client'

import { useState, useEffect } from 'react'

const THEMES = [
  { id: 'mint',     label: 'ミント',     color: '#2dd4bf' },
  { id: 'lavender', label: 'ラベンダー', color: '#c084fc' },
  { id: 'sand',     label: 'サンド',     color: '#fbbf24' },
  { id: 'cherry',   label: 'チェリー',   color: '#fb7185' },
  { id: 'sky',      label: 'スカイ',     color: '#38bdf8' },
  { id: 'slate',    label: 'スレート',   color: '#94a3b8' },
]

export function ThemeSelector() {
  const [current, setCurrent] = useState('mint')

  useEffect(() => {
    const saved = localStorage.getItem('diary-theme') || 'mint'
    setCurrent(saved)
  }, [])

  const handleSelect = (id: string) => {
    setCurrent(id)
    localStorage.setItem('diary-theme', id)
    document.documentElement.setAttribute('data-theme', id)
  }

  return (
    <div className="flex items-center gap-1.5">
      {THEMES.map((t) => (
        <button
          key={t.id}
          title={t.label}
          onClick={() => handleSelect(t.id)}
          className={[
            'w-5 h-5 rounded-full transition-transform hover:scale-110',
            current === t.id ? 'ring-2 ring-offset-1 ring-gray-400' : '',
          ].join(' ')}
          style={{ backgroundColor: t.color }}
        />
      ))}
    </div>
  )
}
