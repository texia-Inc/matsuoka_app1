'use client'

import { useState, useEffect } from "react"
import { ClassNames } from "react-day-picker"

export default function Practice3Page(){

    const [count, setCount] = useState(0)

    return(
        <div className="flex justify-center">
        <button 
        className="font-bold"
        onClick={() => setCount(count + 1)}>➕</button>
        <p>{count}</p>
        <button onClick={() => setCount(count - 1)}>➖</button>
        </div>
        
    )
}