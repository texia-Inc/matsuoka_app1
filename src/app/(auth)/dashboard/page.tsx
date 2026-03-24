export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { DiaryForm } from '@/components/diary/DiaryForm'
import { DiaryCalendar } from '@/components/diary/DiaryCalendar'
import { FeedbackPanel } from '@/components/diary/FeedbackPanel'
import { AnalysisPanel } from '@/components/diary/AnalysisPanel'
import { DiaryCard } from '@/components/diary/DiaryCard'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import type { Diary } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()

  // 今日の日記を取得（JST基準）
  const todayJST = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' })
  const todayStart = `${todayJST}T00:00:00+09:00`
  const todayEnd = `${todayJST}T23:59:59+09:00`

  const { data: todayDiary } = await supabase
    .from('diaries')
    .select('id, content, mood_score, analysis, created_at')
    .gte('created_at', todayStart)
    .lte('created_at', todayEnd)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const today = new Date()
  const dateLabel = format(today, 'yyyy年M月d日(E)', { locale: ja })

  return (
    <div className="space-y-6">
      <DiaryCalendar />

      <div>
        <h1 className="text-xl font-bold text-gray-900">{dateLabel}</h1>
      </div>

      {todayDiary ? (
        <DiaryCard diary={todayDiary as Diary} />
      ) : (
        <DiaryForm />
      )}

      {todayDiary && (
        <>
          <AnalysisPanel analysis={(todayDiary as Diary).analysis} />
          <FeedbackPanel />
        </>
      )}
    </div>
  )
}
