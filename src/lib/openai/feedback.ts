import { openai } from './client'
import type { Diary, SimilarDiary } from '@/lib/types'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

const FEEDBACK_PROMPT = `あなたは「過去の自分」の視点から語りかけるAIです。
今日の日記と、過去の似た状況の日記を比較して、温かく、具体的なフィードバックを150〜200文字で生成してください。
成長したこと、繰り返しているパターン、または励ましのメッセージを伝えてください。`

export async function generateFeedback(
  today: Diary,
  pastEntries: SimilarDiary[]
): Promise<string> {
  if (pastEntries.length === 0) {
    return 'まだ過去のデータが少ないですが、書き続けることで過去の自分と対話できるようになります。今日も記録してくれてありがとう。'
  }

  const todayDate = format(new Date(today.created_at), 'yyyy年M月d日', { locale: ja })
  const pastText = pastEntries
    .map((e) => {
      const date = format(new Date(e.created_at), 'yyyy年M月d日', { locale: ja })
      const pct = (e.similarity * 100).toFixed(0)
      return `【${date}（類似度${pct}%）】\n${e.content}`
    })
    .join('\n\n')

  const userMessage = `今日の日記（${todayDate}）:
${today.content}
気分スコア: ${today.mood_score}/5

参考にした過去の記録:
${pastText}`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: FEEDBACK_PROMPT },
      { role: 'user', content: userMessage },
    ],
    max_tokens: 400,
    temperature: 0.7,
  })

  return response.choices[0].message.content!
}
