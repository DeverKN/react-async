import { useState } from "react"
import { renderIntoDocument } from "react-dom/test-utils";

export const useFetch = (input, init = undefined) => {
  const data = fetch(input, init)
  //if loading, throw a promise
  //if not return the data
  return [true]
}

const awaitedPromises = new Set();
const resolvedPromises = new Map();
export const useSuspense = <T>(promise: Promise<T>): T => {

  if (resolvedPromises.has(promise)) {
    const resolution = resolvedPromises.get(promise)
    console.log({resolution})
    return resolution
  } else {
    console.log(awaitedPromises.size)
    console.log(awaitedPromises.has(promise))
    console.log(resolvedPromises.has(promise))
    if (awaitedPromises.has(promise)) {
      throw promise
    } else {
      awaitedPromises.add(promise)
      throw promise.then(res => {
        console.log({res})
        resolvedPromises.set(promise, res)
      })
    }
  }
}

export const useAwait = <T>(promise: Promise<T>) => {
  const [promisePending, setPromisePending] = useState(true)
  const [promiseResult, setPromiseResult] = useState(null)
  const [promiseError, setPromiseError] = useState(null)

  const onFulfilled = (result: T) => {
    setPromiseResult(result)
    setPromisePending(false)
  }

  const onError = (reason: any) => {
    setPromiseError(reason)
    setPromisePending(false)
  }

  promise.then(onFulfilled, onError)
  return [promisePending, promiseError, promiseResult]
}

export const useSingleton = (singletonVal) => {
  return useState(singletonVal)[0]
}

type Reloader = () => void
type Loader<T> = (options: any, key: string | number) => [Promise<T>, Reloader]
type LoaderHandler<T> = (options?: any) => Promise<T>

export const makeLoader = <T>(handler: LoaderHandler<T>): Loader<T> => {
  const loaders = new Map()
  return (options: any, key: string | number): [any, any] => {

    if (!key) key = options

    if (!(typeof key === "string" || typeof key === "number")) {
      throw TypeError(`Key must be a string or a number not a ${typeof key}`)
    }

    console.log({options, key})

    if (!loaders.has(key)) {
      loaders.set(key, handler(options))
    }

    const invalidator = () => {
      loaders.delete(key)
    }

    return [loaders.get(key), invalidator]
  }
}

export const useLoader = <T>([loader, invalidator]: [Promise<T>, Reloader]): [T, Reloader] => {
  const [reloadCount, setReloadCount] = useState(0)

  const newInvalidator = () => {
    console.log("invalidate")
    setReloadCount(count => count + 1)
    invalidator()
  }

  return [useSuspense(loader), newInvalidator]
}

export const makeLoaderHook = <T>(handler: LoaderHandler<T>) => {  
  const baseLoader = makeLoader(handler)
  const customUseLoader = (options, key) => {
    return useLoader(baseLoader(options, key))
  }
  return customUseLoader
}