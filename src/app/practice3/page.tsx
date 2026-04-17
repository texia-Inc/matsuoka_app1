'use client'

import { FolderClosed } from 'lucide-react'
import { useState } from 'react'
import { object } from 'zod'

// ── 連想配列（オブジェクト）の練習 ──────────────────────────────
//
// 連想配列とは？
// { キー: 値, キー: 値 } という形でデータをまとめたもの
//
// 例:
// const person = {
//   name: '田中',
//   age: 20,
//   city: '東京'
// }
// person.name → '田中'
// person.age  → 20

export default function Practice3Page() {

  // ① 連想配列をstateで管理する
  const [person, setPerson] = useState({
    name: '田中',
    age: 20,
    city: '東京',
  })

  // ② 名前だけを更新する関数
  const updateName = () => {
    setPerson({ ...person, name: '鈴木' })
  }

  // ③ 年齢を1つ増やす関数
  const incrementAge = () => {
    setPerson({ ...person, age: person.age + 1 })
  }


 type Food = {
    name: string
    price: number
 }

 const [foods, setFood] = useState<Record<string, Food>>({
    food1: {name: 'ラーメン', price :800},
    food2: {name: '寿司', price: 1200},
 })

 type Book = {
    title : string
    author : string
    page : number
 }

 const [book , setBook] = useState<Record<string ,Book>>({
    book1 :{title : '羅生門', author :'芥川龍之介' ,page : 350},
    book2 :{title :'こころ', author :'夏目漱石', page :250 }
 })

  type Profile = {
    name : string
    age : number
    hobby : string
 }
 const [information, setInformation] = useState<Record<string,Profile>>({
    profile1 :{name: '鈴木' ,age:20 ,hobby: 'soccer'},
    profile2 :{name: '田中' ,age:25 ,hobby:'volleyball'}
 })

 type Movie ={
    title : string
    director : string
    year : number
 }

 const[movie, setMovie] =useState<Record<string ,Movie>>({
    movie1 :{title:'国宝',director:'a',year:2025},
    movie2 :{title:'コンフィデンスマン',director:'b',year:2018},
    movie3 :{title:'名探偵コナン',director:'c',year:2026}
 })

  return (
    <div className="max-w-md mx-auto mt-10 space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-900">連想配列の練習</h1>

      <h2 className="text-xl font-bold">食べ物</h2>
        <p>{foods.food1.name}</p>
        <p>{foods.food2.price}</p>
      <h2 className="text-xl font-bold">Object.keys().map()</h2>
        <ul>
            {Object.keys(foods).map(key =>(
                <li>
                    {foods[key].name}/{foods[key].price}
                </li>
            ))}
        </ul>

       <h2 className="font-bold">本</h2>
        <p>タイトル：{book.book1.title}</p>
        <p>著者：{book.book1.author}</p>
        <p>ページ数:{book.book1.page}</p>
       
       <h2 className="font-bold">Object.keys().map()</h2>
        <ul>
            {Object.keys(book).map(key =>(
                <li key = {key}>
                    {book[key].title}/{book[key].author}/{book[key].page}
                </li>
                
            ))}
        </ul>

      <h2 className="font-bold">プロフィール</h2>

       
        <p>{information.profile2.name}</p>
        <ul>
            {Object.keys(information).map(key =>(
                <li>
                    {information[key].name}/{information[key].age}/{information[key].hobby}
                </li>
            ))}
        </ul>

        <h2 className="font-bold">映画</h2>
        <p>タイトル/監督/公開年</p>
        <ul>
            {Object.keys(movie).map(key =>(
                <li>
                    {movie[key].title}/{movie[key].director}/{movie[key].year}
                </li>
            ))}
        </ul>

        <p>{movie.movie1.title}</p>
        
      {/* 現在のデータを表示 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-2">
        <p className="text-sm text-gray-500">現在のデータ</p>
        <p className="text-lg font-bold text-gray-900">名前: {person.name}</p>
        <p className="text-lg font-bold text-gray-900">年齢: {person.age}歳</p>
        <p className="text-lg font-bold text-gray-900">都市: {person.city}</p>
      </div>

      {/* ボタンで値を更新 */}
      <div className="space-y-3">
        <button
          onClick={updateName}
          className="w-full rounded-xl bg-gray-900 text-white py-2 text-sm font-medium"
        >
          名前を「鈴木」に変える
        </button>
        <button
          onClick={incrementAge}
          className="w-full rounded-xl bg-gray-900 text-white py-2 text-sm font-medium"
        >
          年齢を+1する
        </button>
      </div>

      {/* コードの解説 */}
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-2 text-xs text-gray-500">
        <p className="font-bold text-gray-700">ポイント</p>
        <p>・person.name → 名前を取り出す</p>
        <p>・person.age  → 年齢を取り出す</p>
        <p>・{'{ ...person, name: \'鈴木\' }'} → 名前だけ変えて残りはそのまま</p>
      </div>
    </div>
  )
}
