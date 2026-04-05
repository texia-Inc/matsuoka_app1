import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { format, differenceInDays } from 'date-fns'

// 時間帯: 朝(5-11) / 昼(12-16) / 夕(17-21) / 夜(22-4)
function getTimeSlot(date: Date): number {
  const h = date.getHours()
  if (h >= 5 && h < 12) return 0  // 朝
  if (h >= 12 && h < 17) return 1 // 昼
  if (h >= 17 && h < 22) return 2 // 夕
  return 3                          // 夜
}

function computeStats(diaries: { created_at: string; mood_score: number; analysis: any }[]) {
  const weekday  = Array.from({ length: 7 }, () => ({ total: 0, count: 0 }))
  const timeofday = Array.from({ length: 4 }, () => ({ total: 0, count: 0 }))
  const mood_dist = [0, 0, 0, 0, 0]
  const tagCount: Record<string, number> = {}

  for (const d of diaries) {
    const date = new Date(d.created_at)

    // 曜日: getDay() 0=Sun → Mon=0…Sun=6
    const wd = (date.getDay() + 6) % 7
    weekday[wd].total += d.mood_score
    weekday[wd].count += 1

    // 時間帯
    const ts = getTimeSlot(date)
    timeofday[ts].total += d.mood_score
    timeofday[ts].count += 1

    mood_dist[d.mood_score - 1] += 1

    const tags: string[] = [...(d.analysis?.tags ?? [])]
    const primary = d.analysis?.emotions?.primary
    if (primary && !tags.includes(primary)) tags.push(primary)
    for (const tag of tags) {
      tagCount[tag] = (tagCount[tag] ?? 0) + 1
    }
  }

  const toAvg = ({ total, count }: { total: number; count: number }) =>
    count ? Math.round((total / count) * 10) / 10 : null

  return {
    total: diaries.length,
    avg: diaries.length
      ? Math.round((diaries.reduce((s, d) => s + d.mood_score, 0) / diaries.length) * 10) / 10
      : 0,
    weekday:   weekday.map(  (w) => ({ avg: toAvg(w),  count: w.count })),
    timeofday: timeofday.map((t) => ({ avg: toAvg(t),  count: t.count })),
    mood_dist,
    tags: Object.entries(tagCount)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12),
  }
}

function computeDaysSinceStart(diaries: { created_at: string }[]) {
  if (!diaries.length) return 0
  const first = diaries.reduce((min, d) =>
    d.created_at < min ? d.created_at : min, diaries[0].created_at
  )
  return differenceInDays(new Date(), new Date(first)) + 1
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const selectedMonth = request.nextUrl.searchParams.get('month')

  const { data: all } = await supabase
    .from('diaries')
    .select('created_at, mood_score, analysis')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (!all || all.length === 0) {
    return NextResponse.json({ overall: { ...computeStats([]), days_since_start: 0 }, selected: null })
  }

  const overall = { ...computeStats(all), days_since_start: computeDaysSinceStart(all) }

  let selected = null
  if (selectedMonth) {
    const monthDiaries = all.filter((d) => format(new Date(d.created_at), 'yyyy-MM') === selectedMonth)
    if (monthDiaries.length > 0) {
      selected = { month: selectedMonth, ...computeStats(monthDiaries) }
    }
  }

  return NextResponse.json({ overall, selected })
}
