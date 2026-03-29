'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

interface SimilarEntry {
  id: string
  content: string
  mood_score: number
  created_at: string
  similarity: number
}

interface FeedbackData {
  feedback: string
  similar_entries: SimilarEntry[]
}

export function FeedbackPanel() {
  const [data, setData] = useState<FeedbackData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    fetch(`/api/diary/feedback?tz=${encodeURIComponent(tz)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          setError(d.error)
        } else {
          setData(d)
        }
      })
      .catch(() => setError('フィードバックの取得に失敗しました'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">AIフィードバック</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-4/5" />
            <div className="h-4 bg-gray-200 rounded w-3/5" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-gray-500 text-center">
            {error === '今日の日記がまだありません'
              ? '日記を書くと、AIが過去のあなたからのフィードバックを届けます。'
              : error}
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  // 色の変更はここだけ: 案A=purple, 案B=teal
  const theme = {
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    title: 'text-teal-700',
    body: 'text-teal-700',
    link: 'text-teal-400',
    cardBorder: 'border-teal-400',
  }

  return (
    <div className={`rounded-2xl ${theme.bg} border border-teal-300 px-6 py-5 space-y-4`}>
      <p className={`text-sm font-semibold ${theme.title}`}>過去の自分からのメッセージ</p>
      <p className={`text-sm leading-loose ${theme.body}`}>{data.feedback}</p>
      {data.similar_entries.length > 0 && (
        <div>
          <button
            className={`text-xs ${theme.link} underline`}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? '閉じる' : `参考にした過去の記録（${data.similar_entries.length}件）を見る`}
          </button>
          {expanded && (
            <div className="mt-3 space-y-2">
              {data.similar_entries.map((entry) => (
                <div key={entry.id} className={`rounded-xl border ${theme.cardBorder} bg-white px-3 py-2 text-xs`}>
                  <div className="flex justify-between text-gray-400 mb-1">
                    <span>{format(new Date(entry.created_at), 'yyyy年M月d日', { locale: ja })}</span>
                    <span>類似度 {(entry.similarity * 100).toFixed(0)}%</span>
                  </div>
                  <p className="line-clamp-3 text-gray-700">{entry.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
