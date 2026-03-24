'use client'

import { useState, useEffect } from 'react'
import { DiaryCard } from './DiaryCard'
import type { Diary } from '@/lib/types'

export function TimelineList() {
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (diaries.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        まだ日記がありません。最初の一行を書いてみましょう。
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {diaries.map((diary) => (
        <DiaryCard key={diary.id} diary={diary} />
      ))}
    </div>
  )
}
