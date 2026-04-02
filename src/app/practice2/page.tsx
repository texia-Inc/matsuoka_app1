'use client'

import { useState, useEffect } from 'react'

export default function Practice2Page() {
  const [name2, setName2] = useState('〇〇')
  const [letter, setLetter] = useState('')
  const [touch, setTouch] = useState(false)
  const [season, setSeason] = useState('')

  useEffect(() => {
    if (season === '春') {
      setLetter('桜が綺麗ですね！')
    } else if (season === '冬') {
      setLetter('雪だるまを作りましょう！')
    }
  }, [season])

  const s = () => {
    if (touch === true) {
      setSeason('春')
      setTouch(false)
    } else {
      setSeason('冬')
      setTouch(true)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold text-gray-900">React 練習2</h1>
      <div>
        <p>入力欄</p>
        <input className="border border-gray-200" onChange={(e) => setName2(e.target.value)} />
        <p>私は{name2}です</p>
        <button onClick={s}>🌸</button>
        <p>{letter}</p>
      </div>
    </div>
  )
}
