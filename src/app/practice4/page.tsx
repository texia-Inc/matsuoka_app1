'use client'

import { useState } from 'react'

export default function Practice4Page() {

  // =============================
  // 問題① の state
  // =============================
  // ヒント: true/false で昼・夜を管理する
  const [isDay, setIsDay] = useState(true)

  // =============================
  // 問題② の state
  // =============================
  // ヒント: チェックの状態を管理する
  const [isDone, setIsDone] = useState(false)

  // =============================
  // 問題③ の state
  // =============================
  // ヒント: 入力した年齢を管理する
  const [age, setAge] = useState('')

  return (
    <div className="max-w-xl mx-auto p-6 space-y-12">
      <h1 className="text-2xl font-bold text-gray-900">⑤ 条件分岐レンダリング 練習</h1>

      {/* ==============================
          問題①: ボタンで昼/夜を切り替えよう
      ============================== */}
      <section className="space-y-3 border rounded-lg p-5">
        <h2 className="text-lg font-bold">問題① ボタンで昼/夜を切り替えよう</h2>
        <p className="text-sm text-gray-600">
          ボタンを押すたびに「☀️ 昼」と「🌙 夜」が切り替わるようにしよう。
        </p>

        {/* 🟡 ここに書いてみよう！ */}
        {/* ヒント: ボタンのonClickで setIsDay(!isDay) を呼ぶ */ }
        <button className="px-4 bg-red-400 text-white rounded-lg font-bold"
        onClick={() => setIsDay(!isDay)}>切り替える</button>
        {/* ヒント: 三項演算子 → {isDay ? '☀️ 昼' : '🌙 夜'} */}
        {isDay ? '☀️昼' :'🌕夜'}


      </section>

      {/* ==============================
          問題②: チェックしたら「完了！」を表示しよう
      ============================== */}
      <section className="space-y-3 border rounded-lg p-5">
        <h2 className="text-lg font-bold">問題② チェックしたら「完了！」を表示しよう</h2>
        <p className="text-sm text-gray-600">
          チェックボックスにチェックを入れると「✅ 完了！」が表示されるようにしよう。
        </p>

        {/* 🟡 ここに書いてみよう！ */}
        {/* ヒント: checkboxのonChangeは (e) => setIsDone(e.target.checked) */}
        <input className=""
        type = "checkbox"
        onChange = {(e) => {setIsDone(e.target.checked)}}/>
        {/* ヒント: && 演算子 → {isDone && <p>✅ 完了！</p>} */}
        {isDone && <p>✅完了！</p>}
      </section>

      {/* ==============================
          問題③: 年齢を入力して「大人」か「子供」か表示しよう
      ============================== */}
      <section className="space-y-3 border rounded-lg p-5">
        <h2 className="text-lg font-bold">問題③ 年齢を入力して大人か子供か判定しよう</h2>
        <p className="text-sm text-gray-600">
          18歳以上なら「🧑 大人です」、18歳未満なら「🧒 子供です」と表示しよう。<br/>
          何も入力していない時は何も表示しない。
        </p>

        {/* 🟡 ここに書いてみよう！ */}
        {/* ヒント①: inputのonChangeで setAge(e.target.value) を呼ぶ */}
        <input className="border border-blue-400"
        onChange={(e) => setAge(e.target.value)}/>
        {/* ヒント②: age が空の時は何も表示しない → age !== '' && ... */}
        {age !== '' &&  Number(age) >= 18 && <p>成人です</p>}
        {/* ヒント③: 18以上かどうかは Number(age) >= 18 で判定できる */}
      </section>

      <p className="text-center text-sm text-gray-400">条件分岐レンダリング 練習ページ</p>
    </div>
  )
}
