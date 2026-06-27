import { createClient } from '@/lib/supabase/server'
import { generateFeedback } from '@/lib/openai/feedback'
import { NextRequest, NextResponse } from 'next/server'
import type { SimilarDiary } from '@/lib/types'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: diary, error } = await supabase
    .from('diaries')
    .select('id, content, mood_score, analysis, created_at, embedding, feedback')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !diary) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // 保存済みフィードバックがあればそのまま返す
  if (diary.feedback) {
    return NextResponse.json({ feedback: diary.feedback, similar_entries: [] })
  }

  if (!diary.embedding) {
    return NextResponse.json({ error: 'Embeddingがまだ生成されていません' }, { status: 404 })
  }

  const { data: similarEntries, error: similarError } = await supabase.rpc('match_diaries', {
    query_embedding: diary.embedding,
    match_user_id: user.id,
    match_threshold: 0.7,
    match_count: 3,
    exclude_id: diary.id,
  })

  if (similarError) {
    console.error('Similarity search failed:', similarError)
  }

  const past = (similarEntries || []) as SimilarDiary[]

  // フィードバック生成してDBに保存
  const feedback = await generateFeedback(diary as unknown as import('@/lib/types').Diary, past)
  await supabase.from('diaries').update({ feedback }).eq('id', diary.id)

  return NextResponse.json({
    feedback,
    similar_entries: past.map((e) => ({
      id: e.id,
      content: e.content,
      mood_score: e.mood_score,
      created_at: e.created_at,
      similarity: e.similarity,
    })),
  })
}
