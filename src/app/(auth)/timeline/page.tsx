'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { TimelineList } from '@/components/diary/TimelineList'

export default function TimelinePage() {
  const [query, setQuery] = useState('')

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">タイムライン</h1>
          <p className="text-sm text-gray-400 mt-2">過去の日記を振り返りましょう</p>
        </div>
        <div className="relative mt-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="絞り込む..."
            className="w-48 rounded-xl border border-gray-300 bg-white pl-8 pr-3 py-1.5 text-sm outline-none"
          />
        </div>
      </div>

      <TimelineList query={query} />
    </div>
  )
}
