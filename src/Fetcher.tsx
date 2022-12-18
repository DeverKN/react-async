import * as React from "react"
import { useAwait, useSingleton } from "./useFetch"

export const Fetcher = ({fetch}) => {

  const data = useAwait(fetch)

  return (
    <div>
    Hello!
    { data }
    </div>
  )
}

export const Suspender = ({promise, handler, fallback}) => {
  const data = useSingleton(promise)
  return (
    <React.Suspense fallback={fallback}>
    {handler(data)}
    </React.Suspense>
  )
}