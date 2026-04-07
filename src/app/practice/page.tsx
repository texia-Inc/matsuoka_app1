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
// 情報を受け取る側

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

  const [hour, setHour] = useState('')
  const [greeting, setGreeting] = useState('どんな挨拶が表示されるか確かめる')

  useEffect(() =>{
    const h =parseInt(hour)
    if(isNaN(h)){
      setGreeting('挨拶がここに表示されます')
    }else if (h >= 5 && h < 11){
      setGreeting('おはようございます')
    }else if (h > 11 && h < 18){
      setGreeting('こんにちは')
    }else if (h >= 18 && h <5){
      setGreeting('こんばんは')
    }
  },[hour])

  const [mood, setMood] = useState('')
  const [moodMessage, setMoodMessage] = useState('感情を数字を入力してください')
  useEffect(() =>{
    const m = parseInt(mood)
    if(m === 1){
      setMoodMessage('😢 つらいね、ゆっくり休んでね')
    }else if (m === 2){
      setMoodMessage('😔 しんどいね、無理しないで')
    }else if (m === 3){
      setMoodMessage('😐 ふつうの一日だったね')
    }else if (m === 4){
      setMoodMessage('🙂 良い一日だったね！')
    }else if (m === 5){
      setMoodMessage('😄 最高！その調子！')
    }else {
      setMoodMessage('1〜5の数字を入力してください')
    }},[mood])

    const [name1, setName1] = useState('〇〇')

    const [count1, setCount1] = useState(0)
    const [liked, setLiked] = useState(true)
    // --- いいねボタン ---
    const handleLike = () => {
    setCount1(count1 + 1)
    }

    const [food, setFood] = useState('〇〇')

    const [conversation, setConversation] = useState('挨拶を表示します')
    const [starbutton, setStarButton] = useState(false)

    const m = () =>{
      if(starbutton){
        setConversation('おはよう')
        setStarButton(false)
      }else{
        setConversation('こんにちは')
        setStarButton(true)
      }
    }

  // 入力欄に天気を打つと「今日の天気は〇〇です」と表示される
  const [weather,setWeather] = useState('〇〇')

  // ライトのON/OFF お題： ボタンを押すと「💡 ON」と「🌑 OFF」が切り替わる
  const [light, setLight] = useState('ボタンを押してください')
  const [push , setPush] = useState(false)
  const l = () =>{
    if(push){
      setLight('🌑 OFF')
      setPush(false)
    }else{
      setLight('💡 ON')
      setPush(true)
    }
  }

  // 入力欄に色を打つと「好きな色は〇〇です」と表示される。さらに「赤」と打ったら「情熱
  // 的ですね！」というメッセージも表示される

  const [color ,setColor] = useState('〇〇')
  const [dialog , setDialog] = useState('')

  useEffect(() =>{
    if(color === '赤'){
      setDialog('情熱的ですね！')
    }else{
      setDialog('')
    }
  },[color])
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

// 変数を使った計算練習
      const price = 1000
      const tax = 0.1
      const firstName =`松岡`
      const lastName =`史華`
      const num1:number = 10
      const num2:number = 5
      const scores = [80,90,10,100]
      const total = scores.reduce((a,b)=> a+b,0)
      const average = total / scores.length
      const name ="Claude Codeが出してくれた練習問題"
      const practice1 = "①消費税10%込みの値段を表示する（商品価格: 500円)→"
      const practice2 = "②自分の名前をフルネームで結合して表示する"
      const practice3 = "③100 ÷ 7 の答えと余りをそれぞれ表示する"
      const practice4 = "④ 3教科のテストの点数（国語80, 数学65, 英語90の合計と平均を表示する"
      const array = [80,65,90]
      const array_total = array.reduce((a,b) => a+b,0)
      const array_average = (array.reduce((a,b) => a+b,0))/array.length
      const practice5 = "⑤2つの数字を比較して大きい方に「こちらが大きい」と表示する"
      const num3:number = 30
      const num4:number = 11
      const practice6 = "⑥useState を使って、入力した数字の消費税込み価格をリアルタイムで表示する"
      const [price1,setPrice] = useState(0)
 
      type Item = {
        name: string;
        quantity: number;
        price: number;
        };
     
      const [items, setItems] = useState<Record<string, Item>>({
        item1: { name: 'Apple', quantity: 10 ,price: 200},
        item2: { name: 'Banana', quantity: 5 ,price: 150 },
        item3: { name: 'Cherry', quantity: 20 ,price: 180},
      })

      const addItem = () => {
        const newItem = { name: 'Date', quantity: 15 ,price: 300};
        setItems(prevItems => ({
          ...prevItems,
          item4: newItem 
        }));
      };

  return (
    
    <div className="max-w-2xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold text-gray-900">React 基礎練習</h1>

      <div>
      <p>{items['item1'].name} : {items.item1.quantity} : {items.item1.price}</p>
      <p>{items.item2.name} : {items.item2.quantity} : {items.item2.price}</p>
      <p>{items.item3.name} : {items.item3.quantity} : {items.item3.price}</p>
    </div>

    <div>
      <h1>Item List</h1>
      <ul>
        {Object.keys(items).map(key => (
          <li key={key}>
            {items[key].name}: {items[key].quantity}
             {key}
          </li>
        ))}
      </ul>
      <button onClick={addItem}>Add Item</button>
    </div>


      {/* ======================================
          セクション1: JSX と式の埋め込み
      ====================================== */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800 border-b pb-1">① JSX と式の埋め込み</h2>
        <p className="text-sm text-gray-800">
          JSXはHTMLに似た書き方。<code className="bg-gray-100 px-1 rounded">{'{}'}</code>の中にJavaScriptの式を書ける。
        </p>
        <div className="rounded-lg p-4 space-y-2">
          <p>文字列:{'こんにちは！'}</p>
          <p>計算式: <span className="font-bold">{1 + 4 + 3}</span></p>
          <p>足し算：<span className="font-bold">{10+5}</span></p>
          <p>引き算：<span className="font-bold">{10-5}</span></p>
          <p>掛け算：<span className="font-bold">{10*5}</span></p>
          <p>割り算：<span className="font-bold">{10/5}</span></p>
          <p>余りの式：<span className="font-bold">{10%3}</span></p>
          <p className="font-bold">変数を使った計算<span>{price*(1+tax)}</span></p>
          <p>計算式：<span className="font-bold">{price*tax}</span></p>
          <p>計算式：<span className="font-bold">{firstName+lastName}</span></p>
          <p>計算式：<span className="font-bold">{`こんにちは、${firstName}さん`}</span></p>
          <p>三項演算子：<span className="font-bold">{"10 === 10?'同じ':'違う'"}</span></p>
          <p>三項演算子：<span className="font-bold">{10 === 10?'同じ':'違う'}</span></p>
          <p>三項演算子：<span className="font-bold">{num1 !== num2?'違う':'同じ'}</span></p>
          <p>三項演算子: <span className="font-bold">{10 > 11 ? '10は5より大きい' : '10は5より小さい'}</span></p>
          <p>配列：<span className="font-bold">{scores.length}</span></p>
          <p>配列 最大の値：<span className="font-bold">{Math.max(...scores)}</span></p>
          <p>配列 最小の値：<span className="font-bold">{Math.min(...scores)}</span></p>
          <p>配列 合計：<span className="font-bold">{total}</span></p>
          <p>配列 平均値<span className="font-bold">{average}</span></p>
          <p>今の時刻: <span className="font-bold">{new Date().toLocaleTimeString('ja-JP')}</span></p>
          <p className="font-bold text-blue-800">{name}</p>
          <p>{practice1}{500*(1+0.1)}</p>
          <p>{practice2}:{firstName+lastName}</p>
          <p>{practice3}<br/><span>割り算：{100/7}<br/>余り：{100%7}</span></p>
          <p>{practice4}<br/>合計：{array_total}<br/>平均：{array_average}</p>
          <p>{practice5}<br/>{num3>num4?`${num3}が大きい`:`${num4}が大きい`}</p>


          <div>
            <p>{practice6}</p>
            <div className="flex items-center gap-2">
              <p>入力欄</p>
              <input className="border border-gray-300 rounded px-2 py-1" onChange={(e) => setPrice(Number(e.target.value))}/>
              <span>税込価格：{price1*1.1}円</span>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-400 rounded p-3 text-sm text-blue-800">
          <code>{"// {}の中はJavaScriptとして評価される"}<br />{'<p>{1 + 2 + 3}</p>  // → 6 と表示'}</code>
        </div>
      </section>

      {/* ======================================
          セクション2: コンポーネントとProps
      ====================================== */}
      <section className="space-y-20">
        <h2 className="text-lg font-bold text-gray-800 border-b pt-5 pb-1 text-center">② コンポーネントと Props</h2>
        <p className="text-sm text-gray-800">
          部品（コンポーネント）を作って、データ（props）を渡して再利用できる。
        </p>
        <div className="space-y-5">
          <div className="flex gap-2 flex-wrap">
            <Badge text="こんにちは" color="#61dafb" />
            <Badge text="Hello" color="#3178c6" />
            <Badge text="アニョハセヨ" color="#000000" />
          </div>
          <p className="text-sm text-gray-800">↑ 同じ Badge コンポーネントに違う props を渡している</p>
        </div>
        <div className="space-y-10">
          <UserCard name="松岡さん" age={25} job="エンジニア" />
          <UserCard name="田中さん" age={30} job="デザイナー" />
          <UserCard name="中野さん" age={29} job="漁師" />
        </div>
        <div className="bg-blue-50 border border-blue-400 rounded p-3 text-sm text-blue-800">
          <code>{`// コンポーネントを定義する`}<br />
          {'こんにちは、${name}さん'}<br />
          {"こんにちは、${name}さん"}<br />
          {`こんにちは、${name}さん`}<br />
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
        <p className="text-sm text-gray-800">
          値が変わると画面が自動で更新される。通常の変数では画面は更新されない。
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          <p className="text-2xl font-bold text-center text-gray-900">{count}</p>
          <p className="text-center text-sm text-gray-500">{message}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setCount(count - 1)}
              className="px-4 py-2 bg-gray-200 rounded-lg font-bold hover:bg-gray-300"
            >
              - 1
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
            + 1
            </button>
            <button
            onClick={() => setCount(count + 2)}
            className="px-4 py-2 bg-red-300 text-white rounded-lg font-bold hover:bg-red-400"
            > + 2
            </button>
          </div>
        </div>
        <div>
          <p>時間を入力してください(0時〜23時)</p>
          <input className = 'border border-gray-300 rouded px-2 py-1 w-20'
          type = "number"
          value={hour}
          onChange={(e) => setHour(e.target.value)}/>
         <p className= "font- bold">{greeting}</p>

         <div>
          <p>数字を入力してください(1〜5)</p>
          <input type="number" value={mood}
          className="border border-gray-200"
          onChange={(e) => setMood(e.target.value)}/>
          <p>{moodMessage}</p>
         </div>
        
        <div>
          <p>名前の入力欄</p>
          <input className="border border-gray-800" onChange={(e) => setName1(e.target.value)}></input>
          <p>こんにちは、{name1}さん！</p>
        </div>

        <div>
          <button
            onClick={handleLike}
            className="px-4 py-2 rounded-lg font-bold text-white bg-red-400 hover:bg-red-500"
          >❤️ {count1}
          </button>
        </div>
        <div>
          <p>入力欄</p>
          <input className="border border-gray-200" onChange={(e) => setFood(e.target.value)}/>
          <p>私の好きな食べ物は{food}です！</p>
         </div>
         <div>
        <button onClick={m} className="px-4 py-2 bg-yellow-300 rounded">⭐️</button>
        <p>{conversation}</p>
        </div>
        <div>
          <p>入力欄</p>
          <input className = "border border-gray-400" onChange={(e) => setWeather(e.target.value)}/>
          <p>今日の天気は{weather}です！</p>
        </div>

        <div>
        <button onClick = {l}>🔵</button>
        <p>{light}</p>
        </div>

        <div>
          <p>入力欄</p>
          <input className="border border-gray-200" 
          onChange = {(e) => {setColor(e.target.value)
          }}/>
        <p>好きな色は{color}です</p>
        <p>{dialog}</p>
        </div>

        </div>

        <div className="bg-blue-100 border border-blue-800 rounded p-3 text-sb text-blue-800">
          <code>{'const [count, setCount] = useState(0)'}<br /><br />
          {"// NG: 普通の変数は画面に反映されない"}<br />
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
