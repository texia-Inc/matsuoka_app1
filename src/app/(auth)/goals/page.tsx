'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'

interface Goal {
  id: string
  year_month: string
  goal: string
  reflection: string
  updated_at: string
}

function GoalCard({ goal, onUpdate }: { goal: Goal; onUpdate: (g: Goal) => void }) {
  const [open, setOpen] = useState(false)
  const [editGoal, setEditGoal] = useState(goal.goal)
  const [editReflection, setEditReflection] = useState(goal.reflection)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const isCurrentMonth = goal.year_month === format(new Date(), 'yyyy-MM')
  const label = format(new Date(`${goal.year_month}-01`), 'yyyy年M月', { locale: ja })

  const handleSave = async () => {
    setSaving(true)
    const res = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year_month: goal.year_month, goal: editGoal, reflection: editReflection }),
    })
    const data = await res.json()
    if (!data.error) {
      onUpdate(data)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  return (
    <div className="rounded-2xl border border-gray-300 bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-800">{label}</span>
          {isCurrentMonth && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--theme-50)', color: 'var(--theme-600)' }}
            >
              今月
            </span>
          )}
          {goal.goal && <span className="text-xs text-gray-400 truncate max-w-[160px]">{goal.goal}</span>}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-gray-100">
          <div className="pt-4 space-y-1.5">
            <label className="text-xs font-medium text-gray-500">今月の目標</label>
            <textarea
              value={editGoal}
              onChange={(e) => setEditGoal(e.target.value)}
              placeholder="今月達成したいことを書いてみましょう..."
              rows={3}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none resize-none focus:border-gray-400 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500">振り返り</label>
            <textarea
              value={editReflection}
              onChange={(e) => setEditReflection(e.target.value)}
              placeholder="月末にどうだったか振り返ってみましょう..."
              rows={3}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none resize-none focus:border-gray-400 transition-colors"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 text-sm font-medium text-white px-4 py-1.5 rounded-lg transition-colors"
            style={{ backgroundColor: saved ? '#22c55e' : 'var(--theme-600)' }}
          >
            {saved ? <><Check className="w-3.5 h-3.5" />保存しました</> : saving ? '保存中...' : '保存する'}
          </button>
        </div>
      )}
    </div>
  )
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  const currentMonth = format(new Date(), 'yyyy-MM')

  useEffect(() => {
    fetch('/api/goals')
      .then((r) => r.json())
      .then((data: Goal[]) => {
        // 今月のエントリがなければ空で追加
        const hasCurrentMonth = data.some((g) => g.year_month === currentMonth)
        if (!hasCurrentMonth) {
          const empty: Goal = { id: '', year_month: currentMonth, goal: '', reflection: '', updated_at: '' }
          setGoals([empty, ...data])
        } else {
          setGoals(data)
        }
      })
      .finally(() => setLoading(false))
  }, [currentMonth])

  const handleUpdate = (updated: Goal) => {
    setGoals((prev) =>
      prev.map((g) => (g.year_month === updated.year_month ? updated : g))
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">目標・振り返り</h1>
        <p className="text-sm text-gray-400 mt-1">月ごとに目標を立てて、月末に振り返りましょう</p>
      </div>

      <div className="space-y-3">
        {goals.map((goal) => (
          <GoalCard
            key={goal.year_month}
            goal={goal}
            onUpdate={handleUpdate}
          />
        ))}
      </div>

      {/* 過去の月を追加するボタン */}
      <AddPastMonthButton currentGoals={goals} onAdd={(g) => setGoals((prev) => [...prev, g])} />
    </div>
  )
}

function AddPastMonthButton({ currentGoals, onAdd }: { currentGoals: Goal[]; onAdd: (g: Goal) => void }) {
  const [open, setOpen] = useState(false)

  // 直近12ヶ月のうちまだ追加されていない月を候補に出す
  const options: string[] = []
  const now = new Date()
  for (let i = 1; i <= 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const ym = format(d, 'yyyy-MM')
    if (!currentGoals.some((g) => g.year_month === ym)) {
      options.push(ym)
    }
  }

  if (options.length === 0) return null

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        + 過去の月を追加
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
          {options.slice(0, 6).map((ym) => (
            <button
              key={ym}
              onClick={() => {
                onAdd({ id: '', year_month: ym, goal: '', reflection: '', updated_at: '' })
                setOpen(false)
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {format(new Date(`${ym}-01`), 'yyyy年M月', { locale: ja })}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
