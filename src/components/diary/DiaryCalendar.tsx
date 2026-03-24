'use client'

import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isToday } from 'date-fns'
import { ja } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Diary } from '@/lib/types'

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

const MOOD_COLOR: Record<number, string> = {
  1: '#9B8DC4',
  2: '#3AABBF',
  3: '#3DC46A',
  4: '#E8729A',
  5: '#F28C28',
}

interface DiaryCalendarProps {
  onSelectDay?: (diary: Diary | undefined) => void
}

export function DiaryCalendar({ onSelectDay }: DiaryCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    const month = format(currentMonth, 'yyyy-MM')
    fetch(`/api/diary?month=${month}`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setDiaries(data) })
  }, [currentMonth])

  const diaryMap = new Map(
    diaries.map((d) => [format(new Date(d.created_at), 'yyyy-MM-dd'), d])
  )

  // カレンダーの全日付セルを生成（前後月の埋め含む）
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const days: Date[] = []
  let day = calStart
  while (day <= calEnd) {
    days.push(day)
    day = addDays(day, 1)
  }

  const handleDayClick = (date: Date) => {
    const key = format(date, 'yyyy-MM-dd')
    setSelected(key)
    onSelectDay?.(diaryMap.get(key))
  }

  return (
    <div className="w-full rounded-xl border border-gray-300 bg-white p-4">
      {/* ヘッダー：曜日グリッドと同じ7列 日|月|火水木|金|土 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', width: '100%' }} className="mb-4 items-center">
        <div />
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="flex items-center justify-end p-1 rounded hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="col-span-3 flex items-center justify-center">
          <span className="text-xl font-semibold">
            {format(currentMonth, 'yyyy年 M月', { locale: ja })}
          </span>
        </div>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="flex items-center justify-start p-1 rounded hover:bg-gray-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div />
      </div>

      {/* 曜日ヘッダー */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', width: '100%' }}>
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className="text-center text-xs font-medium pb-2"
            style={{
              color: i === 0 ? '#ef4444' : i === 6 ? '#3b82f6' : '#6b7280',
            }}
          >
            {w}
          </div>
        ))}
      </div>

      {/* 日付グリッド */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', width: '100%', gap: '2px' }}>
        {days.map((date) => {
          const key = format(date, 'yyyy-MM-dd')
          const diary = diaryMap.get(key)
          const isCurrentMonth = isSameMonth(date, currentMonth)
          const isSelected = selected === key
          const dayOfWeek = date.getDay()

          return (
            <button
              key={key}
              onClick={() => handleDayClick(date)}
              style={{ width: '100%', aspectRatio: '1.6', fontSize: '1.1rem' }}
              className={[
                'flex flex-col items-center justify-center rounded-md font-medium transition-colors',
                isCurrentMonth ? '' : 'opacity-30',
                isSelected ? 'ring-2 ring-gray-400' : '',
                isToday(date) ? 'font-bold underline' : '',
                'hover:bg-gray-100',
                dayOfWeek === 0 ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : 'text-gray-800',
              ].filter(Boolean).join(' ')}
            >
              {date.getDate()}
              {diary ? (
                <span
                  style={{ backgroundColor: MOOD_COLOR[diary.mood_score] }}
                  className="mt-0.5 w-1.5 h-1.5 rounded-full"
                />
              ) : (
                <span className="mt-0.5 w-1.5 h-1.5" />
              )}
            </button>
          )
        })}
      </div>

    </div>
  )
}
