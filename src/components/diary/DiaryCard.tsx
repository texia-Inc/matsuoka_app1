'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { Diary } from '@/lib/types'
import { DiaryForm } from './DiaryForm'

interface DiaryCardProps {
  diary: Diary
  variant?: 'default' | 'glass'
}

interface FeedbackData {
  feedback: string
  similar_entries: { id: string; content: string; mood_score: number; created_at: string; similarity: number }[]
}

export function DiaryCard({ diary, variant = 'default' }: DiaryCardProps) {
  const primaryEmotion = diary.analysis?.emotions?.primary
  const tags = (diary.analysis?.tags || []).filter((t) => t !== primaryEmotion)
  const [isEditing, setIsEditing] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null)
  const [feedbackLoading, setFeedbackLoading] = useState(false)

  const handleToggleFeedback = async () => {
    if (feedbackOpen) {
      setFeedbackOpen(false)
      return
    }
    setFeedbackOpen(true)
    if (!feedbackData) {
      setFeedbackLoading(true)
      try {
        const res = await fetch(`/api/diary/${diary.id}/feedback`)
        const data = await res.json()
        if (!data.error) setFeedbackData(data)
      } finally {
        setFeedbackLoading(false)
      }
    }
  }

  if (isEditing) {
    return (
      <div className="space-y-2">
        <button
          onClick={() => setIsEditing(false)}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          ← キャンセル
        </button>
        <DiaryForm diary={diary} onSaved={() => setIsEditing(false)} />
      </div>
    )
  }

  return (
    <div className={variant === 'glass'
      ? 'rounded-2xl p-5 border border-gray-300 bg-white shadow-lg space-y-3'
      : 'rounded-2xl p-5 border border-gray-300 bg-white space-y-3'
    }>
      {/* 日付 + 編集ボタン（タイムラインでは非表示） */}
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold text-gray-900">
          {format(new Date(diary.created_at), 'M月d日(E)', { locale: ja })}
        </p>
        {variant !== 'glass' && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-white bg-gray-900 hover:bg-black rounded-lg px-4 py-1 transition-colors"
          >
            編集
          </button>
        )}
      </div>

      {/* 本文 */}
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
        {diary.content}
      </p>

      {/* AIサマリー（ミント色） */}
      {diary.analysis?.summary && (
        <p className="text-sm text-teal-600 leading-relaxed">
          {diary.analysis.summary}
        </p>
      )}

      {/* タグ + 感情分析（全てミント色） */}
      {(tags.length > 0 || primaryEmotion) && (
        <div className="flex flex-wrap gap-1 pt-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-600 border border-teal-400"
            >
              {tag}
            </span>
          ))}
          {primaryEmotion && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-600 border border-teal-400">
              {primaryEmotion}
            </span>
          )}
        </div>
      )}

      {/* タイムライン限定：フィードバック展開ボタン */}
      {variant === 'glass' && (
        <div className="pt-1 border-t border-gray-100">
          <button
            onClick={handleToggleFeedback}
            className="flex items-center gap-1 text-xs text-teal-500 hover:text-teal-700 transition-colors"
          >
            {feedbackOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            過去の自分からのメッセージ
          </button>

          {feedbackOpen && (
            <div className="mt-3">
              {feedbackLoading ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-3 bg-teal-100 rounded w-full" />
                  <div className="h-3 bg-teal-100 rounded w-4/5" />
                  <div className="h-3 bg-teal-100 rounded w-3/5" />
                </div>
              ) : feedbackData ? (
                <p className="text-sm text-teal-600 leading-loose">{feedbackData.feedback}</p>
              ) : (
                <p className="text-xs text-gray-400">フィードバックを取得できませんでした</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
