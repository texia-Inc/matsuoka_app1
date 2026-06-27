import { openai } from './client'
import type { Diary, SimilarDiary } from '@/lib/types'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

const FEEDBACK_PROMPT = `あなたは日記を読んで気づきをシェアしてくれる友達みたいなAIです。
過去の似た日記と比較して、友達み��いなカジュアル���口調（だよ、だね、じゃない？など）で気づきを伝えてください。
ルール：
- 過去の記録の日付を使って「○ヶ月前も同じこと書いてたよ」「あの時の悩���、解決したじゃん���」のように具体���な時期に触れる
- 繰り返しているパターンや��長・変化を自然に指摘する
- 読み返したくなるような、ちょっとハッとする内容にする
- 100〜150文字程度で短くまとめる`

export async function generateFeedback(
  today: Diary,
  pastEntries: SimilarDiary[]
): Promise<string> {
  const todayDate = format(new Date(today.created_at), 'yyyy年M月d日', { locale: ja })

  if (pastEntries.length === 0) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `あなたは日記を読んで気づきをシェアしてくれる友達みたいなAIです。今日の日記を読んで、友達みたいなカジュアルな口調��だよ、だね、じゃない？など）で短い気づきを伝えてください。100〜150文字程度で、明日も書きたくなるようなひとことにしてく���さい。`,
        },
        {
          role: 'user',
          content: `今日の日記（${todayDate}）:\n${today.content}\n気分スコア: ${today.mood_score}/5`,
        },
      ],
      max_tokens: 250,
      temperature: 0.85,
    })
    return response.choices[0].message.content!
  }

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

過去の似た記録:
${pastText}`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: FEEDBACK_PROMPT },
      { role: 'user', content: userMessage },
    ],
    max_tokens: 250,
    temperature: 0.85,
  })

  return response.choices[0].message.content!
}
