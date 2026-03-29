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
          <nav className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm font-medium text-gray-700 border border-gray-300 rounded-lg px-3 py-1 hover:bg-gray-100 transition-colors">
              ホーム
            </Link>
            <Link href="/timeline" className="text-sm font-medium text-gray-700 border border-gray-300 rounded-lg px-3 py-1 hover:bg-gray-100 transition-colors">
              タイムライン
            </Link>
            <form action={handleSignOut}>
              <button
                type="submit"
                className="text-sm font-medium text-gray-700 border border-gray-300 rounded-lg px-3 py-1 hover:bg-gray-100 transition-colors"
              >
                ログアウト
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>
    </div>
  )
}
