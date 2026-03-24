import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/dashboard" className="text-lg font-bold text-gray-900">
            AI日記
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/timeline" className="text-sm text-gray-600 hover:text-gray-900">
              タイムライン
            </Link>
            <Link href="/search" className="text-sm text-gray-600 hover:text-gray-900">
              検索
            </Link>
            <form action={handleSignOut}>
              <Button variant="ghost" size="sm" type="submit">
                ログアウト
              </Button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>
    </div>
  )
}
