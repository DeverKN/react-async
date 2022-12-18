import * as React from "react"
import { useState } from "react"

export const Counter = ({label = "Count is: "}) => {
  const [count, setCount] = useState(1)

  return (
    <div>
      <button onClick={() => setCount(count => count - 1)}>-</button>
      {label}{count}
      <button onClick={() => setCount(count => count + 1)}>+</button>
    </div>
  )
}