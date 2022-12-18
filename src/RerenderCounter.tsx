import * as React from "react"

export const RerenderCounter = () => {
  const rerenderRef = React.useRef(0)
  rerenderRef.current++
  return (
    <div>
      Rerender Count = {rerenderRef.current}
    </div>
  )
}