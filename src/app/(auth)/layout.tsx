import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ProfileMenu } from '@/components/diary/ProfileMenu'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { count } = await supabase
    .from('diaries')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const displayName = user.user_metadata?.full_name ?? ''
  const avatarUrl = user.user_metadata?.avatar_url ?? null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4">
          <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
            My日記
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/timeline" className="text-sm font-medium text-gray-700 border border-gray-300 rounded-lg px-3 py-1 hover:bg-gray-100 transition-colors">
              タイムライン
            </Link>
            <Link href="/report" className="text-sm font-medium text-gray-700 border border-gray-300 rounded-lg px-3 py-1 hover:bg-gray-100 transition-colors">
              レポート
            </Link>
            <Link href="/goals" className="text-sm font-medium text-gray-700 border border-gray-300 rounded-lg px-3 py-1 hover:bg-gray-100 transition-colors">
              目標
            </Link>
            <ProfileMenu
              email={user.email ?? ''}
              initialName={displayName}
              initialAvatarUrl={avatarUrl}
              diaryCount={count ?? 0}
              memberSince={user.created_at}
              userId={user.id}
            />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>
    </div>
  )
}
