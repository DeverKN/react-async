import { useState } from "react"

export const useForceReload = () => {
    const [reloadCount, setReloadCount] = useState(0)
    return () => {
      setReloadCount(count => count + 1)
    }
  }