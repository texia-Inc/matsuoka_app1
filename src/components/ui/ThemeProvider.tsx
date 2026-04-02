'use client'

import { useEffect } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const saved = localStorage.getItem('diary-theme') || 'mint'
    document.documentElement.setAttribute('data-theme', saved)
  }, [])
  return <>{children}</>
}
