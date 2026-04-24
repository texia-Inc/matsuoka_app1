'use client'

import { useState } from 'react'

export default function Practice4Page() {
// 配列を作成してインデックスと中身を表示
const menbers = ["Araki", "ibata", "Fukutome", "Woods", "Alex", "Tatsunami"];
const dragons_2006_menbers = menbers.map((output,index) => {
  return `${index + 1}番目は${output}`;
});

console.log(dragons_2006_menbers);
 


//mapの第一引数outputは配列のmembersで定義した中身
//第二引数indexは配列members各要素のインデックス番号
// 配列を作成して中身の部分でaを含むものを表示
const members = ["Araki", "Ibata", "Fukutome", "Woods", "Alex", "Tatsunami"];
const filter_include_a = members.filter((output, index) => {
  return output.includes("a");
});

console.log(filter_include_a);

// オブジェクト配列を作成してidが1以外のものを表示する
const tasks = [
  {id:1 ,title:"one"},
  {id:2, title:"two"},
  {id:3, title:"three"},
  {id:4, title:"four"},
  {id:5, title:"five"}
];

const deleteTaskID = 1;

// filterは条件がtrueのものだけを残すメソッド
const deleteTasks = tasks.filter(task =>{
  return task.id !== deleteTaskID;
});

console.log(deleteTasks);

// ボタンを押すと新たな動物の名前、科、年が表示される
type Animal = {
  name : string
  type : string
  age : number
}

const [animal, setAnimal] = useState<Record<string, Animal>>({
  animal1:{name:'ライオン',type:'ネコ科',age:5},
  animal2:{name:'象', type:'ゾウ科',age:10},
  animal3:{name:'ペンギン',type:'鳥類',age:3},
})

animal.animal1.name
animal.animal2.name
animal.animal3.name

const newAnimal = {name:'キリン',type:'哺乳類',age:7}

Object.keys(animal).map(key =>(
  <li>
    {animal[key].name}/{animal[key].type}/{animal[key].age}
  </li>
))

// ボタンを押したら追加する関数
const addAnimal = () =>{
setAnimal (prev =>({
  // 今あるanimal1~3はそのまま残す
  ...prev,
  animal4: newAnimal
}))}

type Product = {
  name : string
  price : number
  quantity : number
}

const [product, setProduct] = useState<Record<string, Product>>({
  product1 : {name:'りんご', price:100, quantity:0},
  product2 : {name:'バナナ', price:80, quantity:0},
  product3 : {name:'みかん', price:60, quantity:0}
})

const addQuantity = (key : string) => {
  setProduct(prev =>({
  ...prev,
  [key]:{...prev[key], quantity:prev[key].quantity+1}
  })) 
}
const total = Object.keys(product).reduce((合計, key) => {
  return 合計 + product[key].price * product[key].quantity
},0)

return(
  
  <div className="max-w-md mx-auto mt-10 space-y-6 p-6">
        <h2 className="font-bold">動物一覧</h2>
        <ul>
          {Object.keys(animal).map(key => (
            <li key={key}>
              {animal[key].name}/{animal[key].type}/{animal[key].age}歳
            </li>
          ))}
        </ul>
        <button
          onClick={addAnimal}
          className="rounded-xl bg-gray-900 text-white px-4 py-2 text-sm"
        >
          🟣 キリンを追加
        </button>
        <p>動物の数：{Object.keys(animal).length}匹</p>

        <h2 className="font-bold">ショッピングカート</h2>
        <ul>
          {Object.keys(product).map(key => (
            <li key={key}>
              {product[key].name} / {product[key].price}円 / {product[key].quantity}個
              <button
                onClick={() => addQuantity(key)}
                className="ml-2 rounded-lg bg-blue-500 text-white px-2 py-0.5 text-sm"
              >
                🔵
              </button>
            </li>
          ))}
        </ul>
        <p>合計金額：{total}円</p>
      </div>
    
)
}
