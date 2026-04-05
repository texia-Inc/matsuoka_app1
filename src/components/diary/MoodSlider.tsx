'use client'

import { MOODS } from '@/lib/moods'

interface MoodSliderProps {
  value: number
  onChange: (value: number) => void
}

export function MoodSlider({ value, onChange }: MoodSliderProps) {
  return (
    <div className="space-y-3">
      <label className="block text-base font-bold text-gray-900">今日の気分</label>
      <div className="flex justify-around items-center">
        {MOODS.map((mood) => {
          const isSelected = value === mood.value
          return (
            <button
              key={mood.value}
              type="button"
              onClick={() => onChange(mood.value)}
              className={[
                'flex items-center justify-center focus:outline-none',
                'transition-transform duration-200 ease-out',
                isSelected ? 'scale-[1.35]' : 'scale-100 hover:scale-125',
              ].join(' ')}
            >
              <div
                className="w-10 h-10"
                style={{ color: mood.color }}
              >
                {mood.face}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
