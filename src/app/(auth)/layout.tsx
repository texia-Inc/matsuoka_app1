import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { HeaderNav } from '@/components/diary/HeaderNav'

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
      <header className="sticky top-0 z-30 border-b bg-white py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4">
          <HeaderNav
            email={user.email ?? ''}
            initialName={displayName}
            initialAvatarUrl={avatarUrl}
            diaryCount={count ?? 0}
            memberSince={user.created_at}
            userId={user.id}
          />
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>
    </div>
  )
}
