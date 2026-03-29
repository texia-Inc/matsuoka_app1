'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MoodSlider } from './MoodSlider'
import { toast } from 'sonner'
import type { Diary } from '@/lib/types'

const schema = z.object({
  content: z.string().min(1, '日記を入力してください').max(2000),
  mood_score: z.number().int().min(1).max(5),
})

type FormData = z.infer<typeof schema>

interface DiaryFormProps {
  date?: string       // 過去日付 例: "2026-03-20"
  diary?: Diary       // 編集時に渡す既存日記
  onSaved?: () => void
}

export function DiaryForm({ date, diary, onSaved }: DiaryFormProps) {
  const router = useRouter()
  const isEdit = !!diary
  const [mood, setMood] = useState(diary?.mood_score ?? 3)

  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      content: diary?.content ?? '',
      mood_score: diary?.mood_score ?? 3,
    },
  })

  const handleMoodChange = (value: number) => {
    setMood(value)
    setValue('mood_score', value)
  }

  const onSubmit = async (data: FormData) => {
    let res: Response

    if (isEdit) {
      // 編集モード: PUT
      res = await fetch(`/api/diary/${diary.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } else {
      // 新規作成: POST（過去日付対応）
      res = await fetch('/api/diary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, date }),
      })
    }

    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error ?? '保存に失敗しました')
      return
    }

    toast.success(isEdit ? '日記を更新しました！' : '日記を保存しました！AIが分析中です...')
    reset()
    setMood(3)
    onSaved?.()
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-2xl border border-gray-300 bg-white overflow-hidden">
        <Textarea
          placeholder="今日はどんな一日でしたか？気になったこと、感じたこと、出来事を自由に書いてみましょう。"
          rows={6}
          className="resize-none border-0 rounded-none focus:border-0 shadow-none"
          {...register('content')}
        />
        {errors.content && (
          <p className="px-3 pb-2 text-sm text-red-500">{errors.content.message}</p>
        )}
        <div className="border-t border-gray-200 px-4 py-4">
          <MoodSlider value={mood} onChange={handleMoodChange} />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? '保存中...' : isEdit ? '日記を更新する' : '日記を保存する'}
      </Button>
    </form>
  )
}
