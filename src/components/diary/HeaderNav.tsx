'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ProfileMenu } from './ProfileMenu'
import { ReportPopup } from './ReportPopup'

type Props = {
  email: string
  initialName: string
  initialAvatarUrl: string | null
  diaryCount: number
  memberSince: string
  userId: string
}

const noContext = (e: React.MouseEvent) => e.preventDefault()

export function HeaderNav({ email, initialName, initialAvatarUrl, diaryCount, memberSince, userId }: Props) {
  const [reportOpen, setReportOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = reportOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [reportOpen])

  return (
    <>
      <Link
        href="/dashboard"
        onContextMenu={noContext}
        className="text-2xl font-bold text-gray-900"
      >
        My日記
      </Link>

      <nav className="flex items-center gap-3">
        <Link
          href="/dashboard"
          onContextMenu={noContext}
          className="text-sm font-medium text-gray-700 border border-gray-300 rounded-lg px-3 py-1 hover:bg-gray-100 transition-colors"
        >
          カレンダー
        </Link>
        <Link
          href="/timeline"
          onContextMenu={noContext}
          className="text-sm font-medium text-gray-700 border border-gray-300 rounded-lg px-3 py-1 hover:bg-gray-100 transition-colors"
        >
          タイムライン
        </Link>
        <Link
          href="/goals"
          onContextMenu={noContext}
          className="text-sm font-medium text-gray-700 border border-gray-300 rounded-lg px-3 py-1 hover:bg-gray-100 transition-colors"
        >
          目標
        </Link>
        <div className="relative z-50">
          <button
            onClick={() => setReportOpen(v => !v)}
            onContextMenu={noContext}
            className={[
              'text-sm font-medium border rounded-lg px-3 py-1 transition-colors',
              reportOpen
                ? 'bg-gray-900 text-white border-gray-900'
                : 'text-gray-700 border-gray-300 hover:bg-gray-100',
            ].join(' ')}
          >
            レポート
          </button>
          {reportOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/30 z-40"
                onClick={() => setReportOpen(false)}
              />
              <ReportPopup onClose={() => setReportOpen(false)} />
            </>
          )}
        </div>
        <ProfileMenu
          email={email}
          initialName={initialName}
          initialAvatarUrl={initialAvatarUrl}
          diaryCount={diaryCount}
          memberSince={memberSince}
          userId={userId}
        />
      </nav>
    </>
  )
}
