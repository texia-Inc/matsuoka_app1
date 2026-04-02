import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { format } from 'date-fns'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: diaries } = await supabase
    .from('diaries')
    .select('created_at, mood_score, analysis')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (!diaries || diaries.length === 0) {
    return NextResponse.json({ monthly: [], tags: [], total: 0 })
  }

  // 月ごとにグループ化
  const monthMap: Record<string, { total: number; count: number }> = {}
  const tagCount: Record<string, number> = {}

  for (const d of diaries) {
    const month = format(new Date(d.created_at), 'yyyy-MM')
    if (!monthMap[month]) monthMap[month] = { total: 0, count: 0 }
    monthMap[month].total += d.mood_score
    monthMap[month].count += 1

    const tags: string[] = [...(d.analysis?.tags ?? [])]
    const primary = d.analysis?.emotions?.primary
    if (primary && !tags.includes(primary)) tags.push(primary)
    for (const tag of tags) {
      tagCount[tag] = (tagCount[tag] ?? 0) + 1
    }
  }

  const monthly = Object.entries(monthMap)
    .map(([month, { total, count }]) => ({
      month,
      avg: Math.round((total / count) * 10) / 10,
      count,
    }))
    .slice(-6) // 直近6ヶ月

  const tags = Object.entries(tagCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12)

  return NextResponse.json({ monthly, tags, total: diaries.length })
}
