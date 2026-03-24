import { createClient } from '@/lib/supabase/server'
import { DiaryCard } from '@/components/diary/DiaryCard'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Diary } from '@/lib/types'

export default async function DiaryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('diaries')
    .select('id, content, mood_score, analysis, created_at')
    .eq('id', id)
    .single()

  if (error || !data) {
    notFound()
  }

  return (
    <div className="space-y-4">
      <Link href="/timeline">
        <Button variant="ghost" size="sm">← タイムラインに戻る</Button>
      </Link>
      <DiaryCard diary={data as Diary} />
    </div>
  )
}
