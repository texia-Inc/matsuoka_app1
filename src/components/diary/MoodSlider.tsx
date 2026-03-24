'use client'

const MOODS = [
  {
    value: 1,
    label: '辛い',
    color: '#9B8DC4',   // ラベンダー
    bg: '#F0ECFA',
    face: (
      // M: 渦目＋困り眉
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="24" cy="24" r="22" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
        {/* 困り眉（八の字） */}
        <path d="M12 13 Q16 16 20 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
        <path d="M28 13 Q32 16 36 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
        {/* 渦目（左） */}
        <path d="M17 22 C17 19 14 18 14 20 C14 23 18 23 18 21 C18 19.5 16.5 19 16 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
        {/* 渦目（右） */}
        <path d="M31 22 C31 19 28 18 28 20 C28 23 32 23 32 21 C32 19.5 30.5 19 30 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
        {/* への字口 */}
        <path d="M15 33 Q24 27 33 33" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  {
    value: 2,
    label: 'しんどい',
    color: '#3AABBF',   // ピーコック
    bg: '#E0F5F8',
    face: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="24" cy="24" r="22" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
        <ellipse cx="17" cy="19" rx="2" ry="2" fill="currentColor"/>
        <ellipse cx="31" cy="19" rx="2" ry="2" fill="currentColor"/>
        <path d="M17 31 Q24 27 31 31" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  {
    value: 3,
    label: 'ふつう',
    color: '#3DC46A',   // 明るい緑
    bg: '#E2F9EC',
    face: (
      // B: 半目＋ぽかん口
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="24" cy="24" r="22" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
        <path d="M13 19 Q17 22 21 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M27 19 Q31 22 35 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <ellipse cx="24" cy="31" rx="4" ry="3" stroke="currentColor" strokeWidth="2" fill="none"/>
      </svg>
    ),
  },
  {
    value: 4,
    label: '良い',
    color: '#E8729A',   // フラミンゴ
    bg: '#FCE4EF',
    face: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="24" cy="24" r="22" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
        <ellipse cx="17" cy="19" rx="2" ry="2" fill="currentColor"/>
        <ellipse cx="31" cy="19" rx="2" ry="2" fill="currentColor"/>
        <path d="M17 27 Q24 34 31 27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  {
    value: 5,
    label: '最高！',
    color: '#F28C28',   // みかん
    bg: '#FEF0E0',
    face: (
      // C: ウィンク＋控えめ笑顔
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="24" cy="24" r="22" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
        <path d="M13 19 Q17 22 21 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <ellipse cx="31" cy="19" rx="2.5" ry="2.5" fill="currentColor"/>
        <path d="M18 29 Q24 33 30 29" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
]

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
