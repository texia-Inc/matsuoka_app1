import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import type { Diary } from '@/lib/types'

const MOOD_EMOJIS = ['', '😞', '😐', '🙂', '😊', '😄']

interface DiaryCardProps {
  diary: Diary
}

export function DiaryCard({ diary }: DiaryCardProps) {
  const tags = diary.analysis?.tags || []

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {format(new Date(diary.created_at), 'yyyy年M月d日(E)', { locale: ja })}
          </span>
          <span className="text-xl">{MOOD_EMOJIS[diary.mood_score]}</span>
        </div>
        {diary.analysis?.summary && (
          <p className="text-sm text-gray-600 italic">{diary.analysis.summary}</p>
        )}
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{diary.content}</p>
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
