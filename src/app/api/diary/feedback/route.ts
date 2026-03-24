import { createClient } from '@/lib/supabase/server'
import { generateFeedback } from '@/lib/openai/feedback'
import { NextRequest, NextResponse } from 'next/server'
import type { SimilarDiary } from '@/lib/types'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const tz = searchParams.get('tz') || 'Asia/Tokyo'

  // 今日の日記を取得（ユーザーのタイムゾーン基準）
  const now = new Date()
  const todayStart = new Date(now.toLocaleDateString('en-CA', { timeZone: tz }) + 'T00:00:00+09:00')
  const todayEnd = new Date(now.toLocaleDateString('en-CA', { timeZone: tz }) + 'T23:59:59+09:00')

  const { data: todayDiary, error: todayError } = await supabase
    .from('diaries')
    .select('id, content, mood_score, analysis, created_at, embedding')
    .eq('user_id', user.id)
    .gte('created_at', todayStart.toISOString())
    .lte('created_at', todayEnd.toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (todayError || !todayDiary) {
    return NextResponse.json(
      { error: '今日の日記がまだありません' },
      { status: 404 }
    )
  }

  if (!todayDiary.embedding) {
    return NextResponse.json(
      { error: 'Embeddingがまだ生成されていません' },
      { status: 404 }
    )
  }

  // pgvectorで類似エントリ検索
  const { data: similarEntries, error: similarError } = await supabase.rpc(
    'match_diaries',
    {
      query_embedding: todayDiary.embedding,
      match_user_id: user.id,
      match_threshold: 0.7,
      match_count: 3,
      exclude_id: todayDiary.id,
    }
  )

  if (similarError) {
    console.error('Similarity search failed:', similarError)
  }

  const past = (similarEntries || []) as SimilarDiary[]

  // フィードバック生成
  const feedback = await generateFeedback(todayDiary as unknown as import('@/lib/types').Diary, past)

  return NextResponse.json({
    feedback,
    today: {
      id: todayDiary.id,
      content: todayDiary.content,
      mood_score: todayDiary.mood_score,
      created_at: todayDiary.created_at,
    },
    similar_entries: past.map((e) => ({
      id: e.id,
      content: e.content,
      mood_score: e.mood_score,
      created_at: e.created_at,
      similarity: e.similarity,
    })),
  })
}
