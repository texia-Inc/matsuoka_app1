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

const schema = z.object({
  content: z.string().min(1, '日記を入力してください').max(2000),
  mood_score: z.number().int().min(1).max(5),
})

type FormData = z.infer<typeof schema>

export function DiaryForm() {
  const router = useRouter()
  const [mood, setMood] = useState(3)

  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { content: '', mood_score: 3 },
  })

  const handleMoodChange = (value: number) => {
    setMood(value)
    setValue('mood_score', value)
  }

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/diary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      toast.error('日記の保存に失敗しました')
      return
    }

    toast.success('日記を保存しました！AIが分析中です...')
    reset()
    setMood(3)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-xl border border-gray-300 bg-white overflow-hidden transition-colors duration-200 focus-within:border-gray-900">
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
        {isSubmitting ? '保存中...' : '日記を保存する'}
      </Button>
    </form>
  )
}
