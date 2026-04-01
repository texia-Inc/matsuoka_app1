 'use client'

  import { useState, useEffect } from 'react'
// 　名前を入力すると挨拶が表示される。ボタンを押すと好きな季節が切り替わる。季節が変わるたびにメッセージも自動で変わる
  const [name2 ,setName2] = useState('〇〇')
  const [hello, setHello] = useState('挨拶が表示されます')
  const [letter, setLetter] = useState('')
  const [touch, setTouch] =useState(false)
  const [season, setSeason] =useState('')

  const s = () =>{
    if(touch){
        setSeason('春')
        setTouch(true)
        setLetter('桜が綺麗ですね！')
    }else if (touch){
        setSeason('冬')
        setTouch(false)
        setLetter('雪だるまを作りましょう！')
    }else{
        setLetter('')
    }
  }

  const i = () => {
    if(name2){
        setLetter('こんにちは')
    }else{
        setLetter('')
    }
  }


  export default function Practice2Page() {
    return (
    <div className="max-w-2xl mx-auto p-6 space-y-10">
        <h1 className="text-2xl font-bold text-gray-900">React 練習2</h1>

    <div>
    <p>入力欄</p>  
    <input className="border border-gray-200" onChange={(i) => setName2(i.target.value)}>{hello}</input>
    <button onClick={(s) => setSeason }>🌸</button>
    </div>
    </div>

     
    )
  }
