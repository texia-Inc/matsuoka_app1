'use client'

import { useState, useEffect } from 'react'

// ================================
// ① コンポーネント（部品）とは
// ================================
// Reactはページを「部品（コンポーネント）」に分けて作る。
// 部品は関数として定義し、JSXを返す。
// 部品には「props（プロップス）」でデータを渡せる。

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span
      className="inline-block px-3 py-1 rounded text-white text-lg font-bold"
      style={{ backgroundColor: color }}
    >
      {text}
    </span>
  )
}

// ================================
// ② Propsとは
// ================================
// 親から子コンポーネントにデータを渡す仕組み。
// HTMLの属性のようにして値を渡す。

function UserCard({ name, age, job }: { name: string; age: number; job: string }) {
  return (
    <div className="border border-gray-800 rounded-lg p-3 text-center bg-gray-200">
      <p className="font-bold text-gray-900">{name}</p>
      <p className="text-sm text-gray-800">{age}歳 / {job}</p>
    </div>
  )
}

// ================================
// ③ メインページ
// ================================
export default function PracticePage() {

  // --- useState: 状態（変数）の管理 ---
  // useState(初期値) → [現在の値, 値を変える関数]
  const [count, setCount] = useState(0)

  // --- 演算の練習用 ---
  const [numA, setNumA] = useState('')
  const [numB, setNumB] = useState('')
  const [operator, setOperator] = useState('+')
  const [calcResult, setCalcResult] = useState<string | null>(null)

  // --- 条件分岐の練習用 ---
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // --- リスト表示の練習用 ---
  const [todos, setTodos] = useState(['牛乳を買う', '日記を書く', '運動する'])
  const [newTodo, setNewTodo] = useState('')

  // --- useEffect: 副作用（値が変わった時に実行される処理）---
  // [count] → count が変わるたびに実行される
  const [message, setMessage] = useState('カウントは0です')
  useEffect(() => {
    if (count === 0) setMessage('カウントは0です')
    else if (count > 0) setMessage(`${count}回クリックしました！`)
    else setMessage(`${Math.abs(count)}回マイナスしました`)
  }, [count])

  // --- 演算処理 ---
  const calculate = () => {
    const a = parseFloat(numA)
    const b = parseFloat(numB)
    if (isNaN(a) || isNaN(b)) { setCalcResult('数字を入力してください'); return }
    if (operator === '÷' && b === 0) { setCalcResult('0では割れません'); return }
    const results: Record<string, number> = {
      '+': a + b,
      '-': a - b,
      '×': a * b,
      '÷': a / b,
    }
    setCalcResult(`${a} ${operator} ${b} = ${results[operator]}`)
  }

  // --- Todoの追加 ---
  const addTodo = () => {
    if (!newTodo.trim()) return
    setTodos([...todos, newTodo]) // 既存のリストに新しい項目を追加
    setNewTodo('')
  }

  // --- Todoの削除 ---
  const removeTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index)) // 選んだindex以外を残す
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold text-gray-900">React 基礎練習</h1>

      {/* ======================================
          セクション1: JSX と式の埋め込み
      ====================================== */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800 border-b pb-1">① JSX と式の埋め込み</h2>
        <p className="text-sm text-gray-600">
          JSXはHTMLに似た書き方。<code className="bg-gray-100 px-1 rounded">{'{}'}</code>の中にJavaScriptの式を書ける。
        </p>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p>文字列: <span className="font-bold">{'こんにちは！'}</span></p>
          <p>計算式: <span className="font-bold">{1 + 2 + 3}</span></p>
          <p>三項演算子: <span className="font-bold">{10 > 5 ? '10は5より大きい' : '10は5より小さい'}</span></p>
          <p>今の時刻: <span className="font-bold">{new Date().toLocaleTimeString('ja-JP')}</span></p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
          <code>{`// {}の中はJavaScriptとして評価される`}<br />{`<p>{1 + 2 + 3}</p>  // → 6 と表示`}</code>
        </div>
      </section>

      {/* ======================================
          セクション2: コンポーネントとProps
      ====================================== */}
      <section className="space-y-20">
        <h2 className="text-lg font-bold text-gray-800 border-b pt-5 pb-1 text-center">② コンポーネントと Props</h2>
        <p className="text-sm text-gray-600">
          部品（コンポーネント）を作って、データ（props）を渡して再利用できる。
        </p>
        <div className="space-y-5">
          <div className="flex gap-2 flex-wrap">
            <Badge text="こんにちは" color="#61dafb" />
            <Badge text="Hello" color="#3178c6" />
            <Badge text="アニョハセヨ" color="#000000" />
          </div>
          <p className="text-sm text-gray-600">↑ 同じ Badge コンポーネントに違う props を渡している</p>
        </div>
        <div className="space-y-10">
          <UserCard name="松岡さん" age={25} job="エンジニア" />
          <UserCard name="田中さん" age={30} job="デザイナー" />
          <UserCard name="杉野さん" age={29} job="俳優" />
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
          <code>{`// コンポーネントを定義`}<br />
          {`function Badge({ text, color }) {`}<br />
          {`  return <span style={{ color }}>{text}</span>`}<br />
          {`}`}<br /><br />
          {`// 使う時は属性でデータを渡す`}<br />
          {`<Badge text="React" color="#61dafb" />`}</code>
        </div>
      </section>

      {/* ======================================
          セクション3: useState（状態管理）
      ====================================== */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800 border-b pb-1">③ useState（状態管理）</h2>
        <p className="text-sm text-gray-600">
          値が変わると画面が自動で更新される。通常の変数では画面は更新されない。
        </p>
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <p className="text-2xl font-bold text-center text-gray-900">{count}</p>
          <p className="text-center text-sm text-gray-500">{message}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setCount(count - 1)}
              className="px-4 py-2 bg-gray-200 rounded-lg font-bold hover:bg-gray-300"
            >
              − 1
            </button>
            <button
              onClick={() => setCount(0)}
              className="px-4 py-2 bg-gray-200 rounded-lg font-bold hover:bg-gray-300"
            >
              リセット
            </button>
            <button
              onClick={() => setCount(count + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600"
            >
              ＋ 1
            </button>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
          <code>{`const [count, setCount] = useState(0)`}<br /><br />
          {`// NG: 普通の変数は画面に反映されない`}<br />
          {`let count = 0`}<br />
          {`count = count + 1  // 画面は変わらない`}<br /><br />
          {`// OK: setCount を使うと画面が更新される`}<br />
          {`setCount(count + 1)`}</code>
        </div>
      </section>

      {/* ======================================
          セクション4: 演算（計算機）
      ====================================== */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800 border-b pb-1">④ 演算（計算機）</h2>
        <p className="text-sm text-gray-600">
          入力値を state で管理して、ボタンで計算を実行する。
        </p>
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={numA}
              onChange={(e) => setNumA(e.target.value)}
              placeholder="数字A"
              className="w-24 border border-gray-300 rounded px-2 py-1 text-center"
            />
            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            >
              {['+', '-', '×', '÷'].map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
            <input
              type="number"
              value={numB}
              onChange={(e) => setNumB(e.target.value)}
              placeholder="数字B"
              className="w-24 border border-gray-300 rounded px-2 py-1 text-center"
            />
            <button
              onClick={calculate}
              className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              ＝
            </button>
          </div>
          {calcResult && (
            <p className="text-lg font-bold text-gray-900">{calcResult}</p>
          )}
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
          <code>{`// input の値が変わるたびに state を更新`}<br />
          {`onChange={(e) => setNumA(e.target.value)}`}<br /><br />
          {`// e.target.value は文字列なので数値に変換`}<br />
          {`const a = parseFloat(numA)`}</code>
        </div>
      </section>

      {/* ======================================
          セクション5: 条件分岐レンダリング
      ====================================== */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800 border-b pb-1">⑤ 条件分岐レンダリング</h2>
        <p className="text-sm text-gray-600">
          state の値によって表示する内容を切り替える。
        </p>
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <button
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className={`px-4 py-2 rounded-lg font-bold text-white ${isLoggedIn ? 'bg-red-400 hover:bg-red-500' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {isLoggedIn ? 'ログアウト' : 'ログイン'}
          </button>

          {/* 条件分岐: && 演算子（trueの時だけ表示） */}
          {isLoggedIn && (
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <p className="text-green-800 font-bold">ようこそ！ログイン中です。</p>
            </div>
          )}
          {!isLoggedIn && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <p className="text-yellow-800">ログインしていません。</p>
            </div>
          )}
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
          <code>{`// && を使った条件分岐（trueの時だけ表示）`}<br />
          {`{isLoggedIn && <p>ログイン中</p>}`}<br /><br />
          {`// 三項演算子（どちらかを表示）`}<br />
          {`{isLoggedIn ? <p>ログイン中</p> : <p>未ログイン</p>}`}</code>
        </div>
      </section>

      {/* ======================================
          セクション6: リスト表示 (.map)
      ====================================== */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800 border-b pb-1">⑥ リスト表示（.map）</h2>
        <p className="text-sm text-gray-600">
          配列を <code className="bg-gray-100 px-1 rounded">.map()</code> でループして一覧表示する。追加・削除も state で管理。
        </p>
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              placeholder="新しいタスクを入力"
              className="flex-1 border border-gray-300 rounded px-3 py-1"
            />
            <button
              onClick={addTodo}
              className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              追加
            </button>
          </div>
          <ul className="space-y-2">
            {todos.map((todo, index) => (
              <li key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded px-3 py-2">
                <span>{todo}</span>
                <button
                  onClick={() => removeTodo(index)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
          {todos.length === 0 && (
            <p className="text-center text-gray-400 text-sm">タスクがありません</p>
          )}
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
          <code>{`// 配列を .map() でリスト表示`}<br />
          {`{todos.map((todo, index) => (`}<br />
          {`  <li key={index}>{todo}</li>`}<br />
          {`))}`}<br /><br />
          {`// 追加: スプレッド構文で新しい配列を作る`}<br />
          {`setTodos([...todos, newTodo])`}<br /><br />
          {`// 削除: filter で該当index以外を残す`}<br />
          {`setTodos(todos.filter((_, i) => i !== index))`}</code>
        </div>
      </section>

      {/* ======================================
          セクション7: useEffect（副作用）
      ====================================== */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800 border-b pb-1">⑦ useEffect（副作用）</h2>
        <p className="text-sm text-gray-600">
          特定の値が変わった時や、ページが表示された時に処理を実行する。
          カウンターを変えるとメッセージが自動で更新される（③のカウンターと連動）。
        </p>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="font-bold">現在のカウント: <span className="text-blue-600">{count}</span></p>
          <p className="text-gray-700 mt-1">{message}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
          <code>{`// count が変わるたびに実行される`}<br />
          {`useEffect(() => {`}<br />
          {`  setMessage(\`\${count}回クリック\`)`}<br />
          {`}, [count])  // ← [] の中が「監視する値」`}<br /><br />
          {`// [] を空にすると「ページ表示時に1回だけ」実行`}<br />
          {`useEffect(() => { /* 初期化処理 */ }, [])`}</code>
        </div>
      </section>

      <div className="text-center text-sm text-gray-400 pb-6">
        React 基礎練習ページ — http://localhost:3000/practice
      </div>
    </div>
  )
}
