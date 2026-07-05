export const dynamic = 'force-dynamic'

import { LoginForm } from '@/components/auth/LoginForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <>
      <style>{`
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-bg {
          background: linear-gradient(135deg, #dbeafe, #e0f2fe, #ede9fe, #bfdbfe, #dbeafe);
          background-size: 300% 300%;
          animation: gradientShift 25s ease infinite;
        }
      `}</style>
      <div className="animated-bg flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center px-10 pt-10 pb-6">
            <CardTitle className="font-bold text-4xl">My日記</CardTitle>
            <p className="text-base text-gray-600 mt-2">毎日の積み重ねで、自分を深く知ろう</p>
          </CardHeader>
          <CardContent className="space-y-5 px-10 pb-10">
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
