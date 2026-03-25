'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function Test() {
  const test = "こんにちは"
  return test
}


export function LoginForm() {
  const router = useRouter()
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください')
      setIsSubmitting(false)
      return
    }
    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      setIsSubmitting(false)
      return
    }

    const result = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    console.log('Supabase result:', JSON.stringify(result))

    const { error } = result

    if (error) {
      setError(`[${error.status}] ${error.message}`)
    } else if (isSignUp) {
      setError('確認メールを送信しました。メールを確認してください。')
    } else {
      router.push('/dashboard')
      router.refresh()
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          name="email"
          placeholder="メールアドレス"
          required
          className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
        />
      </div>
      <div>
        <input
          type="password"
          name="password"
          placeholder="パスワード（6文字以上）"
          required
          className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-9 rounded-md bg-gray-900 px-4 text-sm font-medium text-white shadow hover:bg-gray-700 disabled:opacity-50"
      >
        {isSubmitting ? '処理中...' : isSignUp ? '新規登録' : 'ログイン'}
      </button>
      <button
        type="button"
        className="w-full text-sm text-gray-500 underline"
        onClick={() => { setIsSignUp(!isSignUp); setError(null) }}
      >
        {isSignUp ? 'すでにアカウントをお持ちの方はこちら' : '新規登録はこちら'}
      </button>
    </form>
  )
}
