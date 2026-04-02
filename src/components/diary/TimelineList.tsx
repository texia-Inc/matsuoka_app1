'use client'

import { useState, useEffect } from 'react'
import { DiaryCard } from './DiaryCard'
import { format } from 'date-fns'
import type { Diary } from '@/lib/types'

interface TimelineListProps {
  query?: string
}

export function TimelineList({ query = '' }: TimelineListProps) {
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/diary')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setDiaries(data)
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = diaries.filter((d) =>
    d.content.toLowerCase().includes(query.toLowerCase())
  )

  // 年別にグループ化
  const grouped: Record<string, Diary[]> = {}
  filtered.forEach((d) => {
    const year = format(new Date(d.created_at), 'yyyy')
    if (!grouped[year]) grouped[year] = []
    grouped[year].push(d)
  })
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a))

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-8">
          {query ? `「${query}」に一致する日記がありません` : 'まだ日記がありません。最初の一行を書いてみましょう。'}
        </p>
      ) : (
        years.map((year) => (
          <div key={year} className="space-y-3">
            {/* 年見出し */}
            <p className="text-lg font-medium text-gray-500 border-b border-gray-200 pb-2">{year}年</p>
            {grouped[year].map((diary) => (
              <DiaryCard key={diary.id} diary={diary} variant="glass" />
            ))}
          </div>
        ))
      )}
    </div>
  )
}
