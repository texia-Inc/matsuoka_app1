'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ThemeSelector } from '@/components/ui/ThemeSelector'
import { Pencil, Check, X, LogOut, BookOpen, CalendarDays, Camera } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import Image from 'next/image'

interface ProfileMenuProps {
  email: string
  initialName: string
  initialAvatarUrl: string | null
  diaryCount: number
  memberSince: string
  userId: string
}

export function ProfileMenu({ email, initialName, initialAvatarUrl, diaryCount, memberSince, userId }: ProfileMenuProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(initialName)
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(initialName)
  const [saving, setSaving] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl)
  const [uploading, setUploading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setEditingName(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSaveName = async () => {
    setSaving(true)
    const supabase = createClient()
    await supabase.auth.updateUser({ data: { full_name: nameInput.trim() } })
    setName(nameInput.trim())
    setEditingName(false)
    setSaving(false)
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${userId}/avatar.${ext}`

    const { error } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (!error) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      // キャッシュバスト用にタイムスタンプを付加
      const url = `${data.publicUrl}?t=${Date.now()}`
      await supabase.auth.updateUser({ data: { avatar_url: data.publicUrl } })
      setAvatarUrl(url)
    }
    setUploading(false)
    // 同じファイルを再選択できるようリセット
    e.target.value = ''
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const initial = (name || email).charAt(0).toUpperCase()

  const Avatar = ({ size }: { size: 'sm' | 'lg' }) => {
    const cls = size === 'lg'
      ? 'w-16 h-16 rounded-full text-2xl font-bold'
      : 'w-9 h-9 rounded-full text-sm font-bold'

    if (avatarUrl) {
      return (
        <Image
          src={avatarUrl}
          alt="avatar"
          width={size === 'lg' ? 64 : 36}
          height={size === 'lg' ? 64 : 36}
          className={`${cls} object-cover`}
        />
      )
    }
    return (
      <div
        className={`${cls} flex items-center justify-center text-white`}
        style={{ backgroundColor: 'var(--theme-600)' }}
      >
        {initial}
      </div>
    )
  }

  return (
    <div ref={ref} className="relative">
      {/* ヘッダーのアバターボタン */}
      <button
        onClick={() => setOpen(!open)}
        className="transition-opacity hover:opacity-80"
      >
        <Avatar size="sm" />
      </button>

      {/* ポップアップパネル */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-gray-200 shadow-xl z-50 overflow-hidden">

          {/* プロフィールヘッダー */}
          <div className="px-5 py-5 flex flex-col items-center gap-2 border-b border-gray-100">

            {/* アバター（カメラオーバーレイ付き） */}
            <div className="relative group">
              <Avatar size="lg" />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {uploading
                  ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <Camera className="w-5 h-5 text-white" />
                }
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            {/* 名前編集 */}
            {editingName ? (
              <div className="flex items-center gap-1.5">
                <input
                  autoFocus
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName() }}
                  className="text-sm font-semibold text-gray-900 text-center border-b border-gray-400 outline-none w-36"
                />
                <button onClick={handleSaveName} disabled={saving}>
                  <Check className="w-4 h-4 text-green-500" />
                </button>
                <button onClick={() => { setEditingName(false); setNameInput(name) }}>
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-gray-900">{name || 'ユーザー'}</p>
                <button onClick={() => { setEditingName(true); setNameInput(name) }}>
                  <Pencil className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 transition-colors" />
                </button>
              </div>
            )}

            <p className="text-xs text-gray-400">{email}</p>
          </div>

          {/* 統計 */}
          <div className="px-5 py-3 flex gap-5 border-b border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{diaryCount}件の日記</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{format(new Date(memberSince), 'yyyy年M月', { locale: ja })}から</span>
            </div>
          </div>

          {/* テーマカラー */}
          <div className="px-5 py-3 border-b border-gray-100">
            <p className="text-xs text-gray-400 mb-2.5">テーマカラー</p>
            <ThemeSelector />
          </div>

          {/* ログアウト */}
          <div className="px-5 py-3">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              ログアウト
            </button>
          </div>

        </div>
      )}
    </div>
  )
}
