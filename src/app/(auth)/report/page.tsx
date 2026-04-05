'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { MOODS } from '@/lib/moods'

// ── 型定義 ──────────────────────────────────────────────────
interface RadarItem { avg: number | null; count: number }
interface TagItem { tag: string; count: number }
interface Stats {
  total: number
  avg: number
  weekday: RadarItem[]
  timeofday: RadarItem[]
  mood_dist: number[]
  tags: TagItem[]
}
interface OverallStats extends Stats { days_since_start: number }
interface ReportData {
  overall: OverallStats
  selected: (Stats & { month: string }) | null
}

type ViewMode = 'month' | 'overall'

// ── 時間帯アイコン ────────────────────────────────────────────
const TIME_SLOTS = [
  {
    label: '朝', sub: '5〜11時', color: '#FBBF24',
    face: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="24" cy="24" r="22" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
        <line x1="10" y1="31" x2="38" y2="31" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 31 A8 8 0 0 1 32 31" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.25" strokeLinecap="round"/>
        <line x1="24" y1="13" x2="24" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="31" y1="16" x2="33" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="17" y1="16" x2="15" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="35" y1="23" x2="38" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="10" y1="23" x2="13" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: '昼', sub: '12〜16時', color: '#F59E0B',
    face: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="24" cy="24" r="22" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
        <circle cx="24" cy="23" r="6" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.3"/>
        <line x1="24" y1="10" x2="24" y2="8"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="24" y1="38" x2="24" y2="36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="9"  y1="23" x2="11" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="37" y1="23" x2="39" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="13" y1="13" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="35" y1="13" x2="33" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="13" y1="33" x2="15" y2="31" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="35" y1="33" x2="33" y2="31" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: '夕', sub: '17〜21時', color: '#FB923C',
    face: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="24" cy="24" r="22" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
        <line x1="9"  y1="33" x2="39" y2="33" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M13 33 A11 11 0 0 1 35 33" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.25" strokeLinecap="round"/>
        <line x1="24" y1="11" x2="24" y2="8"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="33" y1="15" x2="35" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="15" y1="15" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="37" y1="23" x2="40" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="8"  y1="23" x2="11" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: '夜', sub: '22〜4時', color: '#818CF8',
    face: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="24" cy="24" r="22" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
        <path d="M29 13C22 13 16 18 16 25C16 32 22 37 29 37C24 37 19 33 19 25C19 18 24 13 29 13Z"
          fill="currentColor" fillOpacity="0.45" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <circle cx="34" cy="16" r="1.5" fill="currentColor"/>
        <circle cx="37" cy="23" r="1"   fill="currentColor"/>
        <circle cx="33" cy="22" r="1"   fill="currentColor"/>
      </svg>
    ),
  },
]

// ── 共通タブ ─────────────────────────────────────────────────
function ViewTab({ mode, onChange, disableMonth, monthLabel }: {
  mode: ViewMode; onChange: (m: ViewMode) => void
  disableMonth: boolean; monthLabel: string
}) {
  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
      {(['month', 'overall'] as ViewMode[]).map((t) => (
        <button key={t} onClick={() => onChange(t)}
          disabled={t === 'month' && disableMonth}
          className={[
            'text-xs px-3 py-1 rounded-lg font-medium transition-colors',
            mode === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700',
            t === 'month' && disableMonth ? 'opacity-40 cursor-not-allowed' : '',
          ].join(' ')}
        >
          {t === 'month' ? monthLabel : '全体'}
        </button>
      ))}
    </div>
  )
}

// 件数に応じて背景色を段階的に深化（0件=gray-100 → 多いほど gray-600〜700 寄りに）
function barBg(count: number): string {
  const levels = ['#F3F4F6', '#D1D5DB', '#9CA3AF', '#6B7280', '#4B5563', '#374151']
  return levels[Math.min(count, levels.length - 1)]
}

const STEP_PX = 20 // 1件ごとに増えるバー幅（px）

// ── 気分分布（最高→辛い順） ───────────────────────────────────
function MoodDist({ dist }: { dist: number[] }) {
  const [openId, setOpenId] = useState<number | null>(null)
  return (
    <div className="space-y-3">
      {[...MOODS].reverse().map((mood) => {
        const i = mood.value - 1
        const count = dist[i]
        const isOpen = openId === mood.value
        return (
          <div key={mood.value} className="flex items-center gap-3">
            <div className="w-8 h-8 shrink-0" style={{ color: mood.color }}>{mood.face}</div>
            <span className="text-xs text-gray-500 w-14 shrink-0">{mood.label}</span>
            <div className="relative flex-1 group">
              <div
                className="rounded-full h-2.5 bg-gray-100 overflow-hidden cursor-pointer"
                onClick={() => setOpenId(isOpen ? null : mood.value)}
              >
                <div className="h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `min(${count * STEP_PX}px, 100%)`, backgroundColor: '#9CA3AF' }} />
              </div>
              {/* ツールチップ: hover（PC）またはタップ（スマホ）で表示 */}
              <div className={[
                'absolute left-0 -top-8 z-20 pointer-events-none',
                'bg-gray-800 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap shadow-md',
                'transition-opacity duration-150',
                isOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
              ].join(' ')}>
                {count}件
                <span className="absolute left-3 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── キーワード ────────────────────────────────────────────────
function Keywords({ overall, selected, monthLabel }: {
  overall: TagItem[]; selected: TagItem[] | null; monthLabel: string
}) {
  const [tab, setTab] = useState<ViewMode>('month')
  const list = tab === 'month' && selected ? selected : overall
  return (
    <div className="space-y-3">
      <ViewTab mode={tab} onChange={setTab} disableMonth={!selected} monthLabel={monthLabel} />
      {list.length === 0 ? (
        <p className="text-xs text-gray-400">データがありません</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {list.map(({ tag, count }) => (
            <span key={tag}
              className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border border-gray-200 bg-white text-gray-800"
            >
              {tag}
              <span className="text-xs rounded-full px-1.5 font-semibold bg-gray-500 text-white">{count}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ── いつ記録しているか ────────────────────────────────────────
function RecordingTime({ data }: { data: RadarItem[] }) {
  return (
    <div className="space-y-3">
      {TIME_SLOTS.map((slot, i) => {
        const count = data[i]?.count ?? 0
        return (
          <div key={slot.label} className="flex items-center gap-3">
            <div className="w-8 h-8 shrink-0" style={{ color: slot.color }}>{slot.face}</div>
            <span className="text-xs text-gray-700 w-24 shrink-0">
              <span className="font-semibold">{slot.label}</span>
              <span className="text-gray-400 ml-1">{slot.sub}</span>
            </span>
            <div className="flex-1 rounded-full h-2.5 bg-gray-100 overflow-hidden">
              <div className="h-2.5 rounded-full transition-all duration-500"
                style={{ width: `min(${count * STEP_PX}px, 100%)`, backgroundColor: '#9CA3AF' }} />
            </div>
            <span className="text-sm font-medium text-gray-600 w-8 text-right">{count}件</span>
          </div>
        )
      })}
    </div>
  )
}

// ── メインページ ─────────────────────────────────────────────
export default function ReportPage() {
  const [data, setData]       = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [moodTab, setMoodTab] = useState<ViewMode>('month')
  const [mainTab, setMainTab] = useState<'mood' | 'time'>('mood')

  const monthKey   = format(selectedMonth, 'yyyy-MM')
  const monthLabel = format(selectedMonth, 'M月', { locale: ja })

  useEffect(() => {
    setLoading(true)
    fetch(`/api/report?month=${monthKey}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [monthKey])

  useEffect(() => { setMoodTab('month') }, [monthKey])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  const overall  = data?.overall
  const selected = data?.selected
  const hasData  = (overall?.total ?? 0) > 0
  const moodDist = moodTab === 'month' && selected ? selected.mood_dist : overall?.mood_dist ?? [0,0,0,0,0]

  return (
    <div className="space-y-4">

      {/* ヘッダー */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">レポート</h1>
          <p className="text-sm text-gray-400 mt-1">気分の傾向やよく出るキーワードを確認できます</p>
        </div>
        {hasData && (
          <div className="flex gap-2 shrink-0">
            <div className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-center w-32">
              <p className="text-lg font-bold text-gray-900">{overall!.days_since_start}日目</p>
              <p className="text-xs text-gray-400">記録開始から</p>
            </div>
            <div className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-center w-32">
              <p className="text-lg font-bold text-gray-900">{overall!.total}件</p>
              <p className="text-xs text-gray-400">日記合計</p>
            </div>
          </div>
        )}
      </div>

      {!hasData ? (
        <div className="rounded-2xl border border-gray-300 bg-white px-6 py-12 text-center">
          <p className="text-gray-400 text-sm">日記を書くとレポートが表示されます</p>
        </div>
      ) : (
        <>
          {/* タブ付きカード */}
          <div>
            {/* タブ行 */}
            <div className="flex items-end">
              {([['mood', '気分の分布'], ['time', 'いつ記録しているか']] as const).map(([t, label]) => (
                <button key={t} onClick={() => setMainTab(t)}
                  className={[
                    'text-xs px-5 transition-colors',
                    mainTab === t
                      ? 'rounded-t-2xl bg-white border border-gray-300 [border-bottom:2px_solid_black] pt-3 pb-2.5 font-bold text-black -mb-px z-10'
                      : 'rounded-t-xl bg-gray-50 border border-gray-200 py-2 font-medium text-gray-400 hover:text-gray-500 self-end',
                  ].join(' ')}
                >
                  {label}
                </button>
              ))}
              <div className="flex-1 border-b border-gray-300 self-end" />
            </div>

            {/* コンテンツ枠 */}
            {mainTab === 'mood' && (
              <div className="rounded-b-2xl rounded-tr-2xl border border-t-0 border-gray-300 bg-white px-5 py-5 space-y-3">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold text-gray-700">気分の分布</p>
                  <ViewTab mode={moodTab} onChange={setMoodTab} disableMonth={!selected} monthLabel={monthLabel} />
                </div>
                <MoodDist dist={moodDist} />
              </div>
            )}

            {mainTab === 'time' && (
              <div className="rounded-b-2xl rounded-tr-2xl border border-t-0 border-gray-300 bg-white px-5 py-5 space-y-3">
                <p className="text-sm font-semibold text-gray-700">いつ記録しているか</p>
                <RecordingTime data={overall!.timeofday} />
              </div>
            )}
          </div>

          {/* キーワード（気分タブのみ） */}
          {mainTab === 'mood' && (
            <div className="rounded-2xl border border-gray-300 bg-white px-5 py-5 space-y-3">
              <p className="text-sm font-semibold text-gray-700">よく出るキーワード</p>
              <Keywords overall={overall!.tags} selected={selected?.tags ?? null} monthLabel={monthLabel} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
