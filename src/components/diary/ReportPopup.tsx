'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { MOODS } from '@/lib/moods'

interface TagItem { tag: string; count: number }
interface Stats {
  total: number
  mood_dist: number[]
  tags: TagItem[]
}
interface OverallStats extends Stats { days_since_start: number }
interface ReportData {
  overall: OverallStats
  selected: (Stats & { month: string }) | null
}

type TabMode = 'month' | 'overall'

const STEP_PX = 16

export function ReportPopup({ onClose }: { onClose: () => void }) {
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [kwTab, setKwTab] = useState<TabMode>('month')

  const monthKey   = format(new Date(), 'yyyy-MM')
  const monthLabel = format(new Date(), 'M月', { locale: ja })

  useEffect(() => {
    fetch(`/api/report?month=${monthKey}`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [monthKey])

  const kwList = kwTab === 'month' ? (data?.selected?.tags ?? null) : (data?.overall.tags ?? [])

  return (
    <div className="absolute right-0 top-full mt-3 w-80 z-50">
      {/* 吹き出し三角 */}
      <div className="absolute right-5 -top-[9px] w-4 h-4 overflow-hidden pointer-events-none">
        <div className="w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45 translate-y-[6px] mx-auto shadow-sm" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl flex flex-col h-[420px]">
        {/* ヘッダー（固定） */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
          <p className="text-lg font-bold text-gray-800">レポート</p>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-0.5"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 px-4 pb-4 overflow-hidden flex flex-col">
          {loading ? (
            <div className="space-y-2 pt-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-5 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : !data || data.overall.total === 0 ? (
            <p className="text-xs text-gray-400 pt-2">日記を書くとレポートが表示されます</p>
          ) : (
            <div className="flex flex-col gap-4 h-full">
              {/* 気分の分布 */}
              <div className="shrink-0">
                <p className="text-xs font-semibold text-gray-600 mb-2">気分の分布</p>
                <div className="space-y-1.5">
                  {[...MOODS].reverse().map(mood => {
                    const count = data.overall.mood_dist[mood.value - 1]
                    return (
                      <div key={mood.value} className="flex items-center gap-2">
                        <div className="w-5 h-5 shrink-0" style={{ color: mood.color }}>{mood.face}</div>
                        <div className="flex-1 rounded-full h-2 bg-gray-100 overflow-hidden">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ width: `min(${count * STEP_PX}px, 100%)`, backgroundColor: '#9CA3AF' }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* キーワード */}
              <div className="flex flex-col flex-1 min-h-0">
                <p className="text-xs font-semibold text-gray-600 mb-2 shrink-0">よく出るキーワード</p>
                <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit mb-3 shrink-0">
                  {(['month', 'overall'] as TabMode[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setKwTab(t)}
                      className={[
                        'text-xs px-3 py-1 rounded-lg font-medium transition-colors',
                        kwTab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700',
                      ].join(' ')}
                    >
                      {t === 'month' ? monthLabel : '全体'}
                    </button>
                  ))}
                </div>
                {kwTab === 'month' && data.selected === null ? (
                  <p className="text-xs text-gray-600">この月の記録はありません</p>
                ) : kwList !== null && kwList.length === 0 ? (
                  <p className="text-xs text-gray-600">データがありません</p>
                ) : (
                  <div className="overflow-y-auto flex-1 min-h-0">
                  <div className="flex flex-wrap gap-2">
                    {(kwList ?? []).map(({ tag, count }) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border border-gray-200 bg-white text-gray-800"
                      >
                        {tag}
                        <span className="text-xs rounded-full px-1.5 font-semibold bg-gray-500 text-white">{count}</span>
                      </span>
                    ))}
                  </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
