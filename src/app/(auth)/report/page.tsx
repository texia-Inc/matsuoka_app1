'use client'

import { useState, useEffect } from 'react'

interface MonthData {
  month: string
  avg: number
  count: number
}

interface TagData {
  tag: string
  count: number
}

interface ReportData {
  monthly: MonthData[]
  tags: TagData[]
  total: number
}

const MOOD_LABEL: Record<number, string> = { 1: '😞', 2: '😐', 3: '🙂', 4: '😊', 5: '😄' }

function MoodBar({ data }: { data: MonthData[] }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1)

  return (
    <div className="space-y-4">
      {/* 折れ線っぽい棒グラフ */}
      <div className="flex items-end gap-2 h-32 px-1">
        {data.map((d) => (
          <div key={d.month} className="flex flex-col items-center gap-1 flex-1">
            <span className="text-xs text-gray-400">{d.avg}</span>
            <div className="w-full flex items-end rounded-t-lg overflow-hidden" style={{ height: '96px' }}>
              <div
                className="w-full rounded-t-lg transition-all duration-500"
                style={{
                  height: `${(d.avg / 5) * 96}px`,
                  backgroundColor: 'var(--theme-400)',
                  opacity: 0.8,
                }}
              />
            </div>
            <span className="text-xs text-gray-500">{d.month.slice(5)}月</span>
            <span className="text-xs text-gray-400">{d.count}件</span>
          </div>
        ))}
      </div>

      {/* 気分スケール凡例 */}
      <div className="flex justify-between px-1 text-xs text-gray-400">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n}>{MOOD_LABEL[n]} {n}</span>
        ))}
      </div>
    </div>
  )
}

export default function ReportPage() {
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/report')
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  const isEmpty = !data || data.total === 0

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">レポート</h1>
        <p className="text-sm text-gray-400 mt-1">気分の傾向やよく出るキーワードを確認できます</p>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: '合計日記', value: `${data?.total ?? 0}件` },
          {
            label: '平均気分',
            value: data?.monthly.length
              ? `${(data.monthly.reduce((s, m) => s + m.avg, 0) / data.monthly.length).toFixed(1)}`
              : '—',
          },
          { label: '記録した月', value: `${data?.monthly.length ?? 0}ヶ月` },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-gray-300 bg-white px-4 py-3 text-center">
            <p className="text-xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {isEmpty ? (
        <div className="rounded-2xl border border-gray-300 bg-white px-6 py-12 text-center">
          <p className="text-gray-400 text-sm">日記を書くとレポートが表示されます</p>
        </div>
      ) : (
        <>
          {/* 気分グラフ */}
          {data.monthly.length > 0 && (
            <div className="rounded-2xl border border-gray-300 bg-white px-5 py-5 space-y-4">
              <p className="text-sm font-semibold text-gray-700">月ごとの平均気分</p>
              <MoodBar data={data.monthly} />
            </div>
          )}

          {/* よく出るタグ */}
          {data.tags.length > 0 && (
            <div className="rounded-2xl border border-gray-300 bg-white px-5 py-5 space-y-3">
              <p className="text-sm font-semibold text-gray-700">よく出るキーワード</p>
              <div className="flex flex-wrap gap-2">
                {data.tags.map(({ tag, count }, i) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border"
                    style={{
                      backgroundColor: 'var(--theme-50)',
                      color: 'var(--theme-600)',
                      borderColor: 'var(--theme-400)',
                      opacity: 1 - i * 0.06,
                    }}
                  >
                    {tag}
                    <span
                      className="text-xs rounded-full px-1.5 py-0.5 font-medium"
                      style={{ backgroundColor: 'var(--theme-400)', color: 'white' }}
                    >
                      {count}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
