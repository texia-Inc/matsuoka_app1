import { createClient } from '@/lib/supabase/server'
import { sendPushNotification } from '@/lib/push/webpush'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Vercel Cronからの呼び出し認証
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()

  // 今日（JST）書いていないユーザーのサブスクリプションを取得
  const todayJST = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' })
  const todayStart = `${todayJST}T00:00:00+09:00`
  const todayEnd = `${todayJST}T23:59:59+09:00`

  // 今日書いたユーザーのID一覧
  const { data: wroteToday } = await supabase
    .from('diaries')
    .select('user_id')
    .gte('created_at', todayStart)
    .lte('created_at', todayEnd)

  const wroteUserIds = new Set((wroteToday || []).map((d) => d.user_id))

  // 今日書いていないユーザーのサブスクリプション
  const { data: subscriptions } = await supabase
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth, user_id')

  if (!subscriptions) {
    return NextResponse.json({ sent: 0 })
  }

  const toNotify = subscriptions.filter((s) => !wroteUserIds.has(s.user_id))
  let sent = 0

  for (const sub of toNotify) {
    try {
      await sendPushNotification(sub, {
        title: '今日の日記を書きませんか？',
        body: '1日5行で、未来の自分へのメッセージを残そう。',
        url: '/dashboard',
      })
      sent++
    } catch (err) {
      // 無効なサブスクリプションを削除
      console.error('Push failed:', err)
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('endpoint', sub.endpoint)
    }
  }

  return NextResponse.json({ sent })
}
