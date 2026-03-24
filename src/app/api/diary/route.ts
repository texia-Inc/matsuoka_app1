import { createClient } from '@/lib/supabase/server'
import { generateEmbedding } from '@/lib/openai/embedding'
import { analyzeDiary } from '@/lib/openai/analysis'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const createDiarySchema = z.object({
  content: z.string().min(1).max(2000),
  mood_score: z.number().int().min(1).max(5),
})

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = createDiarySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { content, mood_score } = parsed.data

  // Embedding生成
  const embedding = await generateEmbedding(content)

  // DB保存
  const { data: diary, error } = await supabase
    .from('diaries')
    .insert({
      user_id: user.id,
      content,
      mood_score,
      embedding: JSON.stringify(embedding),
    })
    .select('id, content, mood_score, created_at')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // AI分析を非同期で実行（レスポンス後にDBを更新）
  const diaryId = diary.id
  const analyzeAsync = async () => {
    try {
      const analysis = await analyzeDiary(content)
      await supabase
        .from('diaries')
        .update({ analysis })
        .eq('id', diaryId)
    } catch (err) {
      console.error('AI analysis failed:', err)
    }
  }

  // Vercel環境ではwaitUntilを使う。ローカルではfireAndForget
  try {
    const { waitUntil } = await import('@vercel/functions')
    waitUntil(analyzeAsync())
  } catch {
    // ローカル環境: fire-and-forget
    analyzeAsync()
  }

  return NextResponse.json(diary, { status: 201 })
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month') // 例: "2024-03"

  let query = supabase
    .from('diaries')
    .select('id, content, mood_score, analysis, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (month) {
    const start = `${month}-01T00:00:00+09:00`
    const [year, m] = month.split('-').map(Number)
    const nextMonth = m === 12 ? `${year + 1}-01` : `${year}-${String(m + 1).padStart(2, '0')}`
    const end = `${nextMonth}-01T00:00:00+09:00`
    query = query.gte('created_at', start).lt('created_at', end)
  } else {
    query = query.limit(30)
  }

  const { data, error } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
