import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

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

  const { data, error } = await supabase
    .from('diaries')
    .select('id, content, mood_score, analysis, created_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { content, mood_score } = await request.json()

  const { generateEmbedding } = await import('@/lib/openai/embedding')
  const { analyzeDiary } = await import('@/lib/openai/analysis')

  const embedding = await generateEmbedding(content)

  const { data, error } = await supabase
    .from('diaries')
    .update({ content, mood_score, embedding: JSON.stringify(embedding), analysis: null })
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id, content, mood_score, created_at')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // AI再分析（非同期）
  const analyzeAsync = async () => {
    try {
      const analysis = await analyzeDiary(content)
      await supabase.from('diaries').update({ analysis }).eq('id', id)
    } catch (err) {
      console.error('AI analysis failed:', err)
    }
  }
  try {
    const { waitUntil } = await import('@vercel/functions')
    waitUntil(analyzeAsync())
  } catch {
    analyzeAsync()
  }

  return NextResponse.json(data)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('diaries')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
