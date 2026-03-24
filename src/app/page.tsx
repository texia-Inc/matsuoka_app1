import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white px-4">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">AI日記</h1>
        <p className="text-lg text-gray-600">
          「書いて終わり」にしない、過去の自分と対話する日記。
        </p>
        <div className="space-y-3 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>✍️</span>
            <span>1日5行の記録で続けやすい</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🧠</span>
            <span>AIが感情を分析してタグ付け</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⏰</span>
            <span>数ヶ前の自分からフィードバック</span>
          </div>
        </div>
        <Link href="/auth/login">
          <Button size="lg" className="w-full">
            始める
          </Button>
        </Link>
       </div>
    </div>
  )
}
