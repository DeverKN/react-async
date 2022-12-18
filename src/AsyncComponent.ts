import { memo, useState, createElement as h, useEffect, FunctionComponent } from "react"
import { use } from "./ReactUnstable"
import { isFunction } from "./isFunction"
import hash from "object-hash"

console.log({use})

export const useSuspense = <T>(promise: Promise<T>): T => {
  //Check if promise is wrapped promise
  if (promise.hasOwnProperty("status")) {
    switch (promise["status"]) {
      case "fufilled":
        return promise["value"]
      case "rejected":
        throw promise["reason"]
      case "pending":
        throw promise
    }
  } else {
    //Wrap promise
    promise["status"] = "pending"
    promise.then((response) => {
      promise["value"] = response
      promise["status"] = "fufilled"
    }).catch((reason) => {
      promise["reason"] = reason
      promise["status"] = "rejected"
    })
    throw promise
  }

  return "" as T
}

type HashFunc<T> = (key: T) => string
class CustomHashMap<K, V> {

  _privateMap: Map<string, V>
  _hashFunc: HashFunc<K>
  constructor(hashFunc: HashFunc<K>) {
    this._privateMap = new Map()
    this._hashFunc = hashFunc
  }

  has(key: K): boolean {
    return this._privateMap.has(this._hashFunc(key))
  }

  get(key: K): V | undefined {
    return this._privateMap.get(this._hashFunc(key))
  }

  set(key: K, val: V) {
    return this._privateMap.set(this._hashFunc(key), val)
  }

  delete(key: K) {
    return this._privateMap.delete(this._hashFunc(key))
  }
}

const defaultHash = <T>(obj: T) => {
  return hash(obj, {
    excludeKeys: (key) => {
      if (key === "_owner") return true
      if (key === "_store") return true
      return false
    }
  })
}

type AsyncComponentReloader = () => void
type AsyncFCResult = JSX.Element | FunctionComponent<{}>
type AsyncFC<T> = (props: T, reload: AsyncComponentReloader) => Promise<AsyncFCResult>
export const AsyncComponent = <T>(promiseComponent: AsyncFC<T>, hashFunc: HashFunc<T> = defaultHash) => {
  const instances = new CustomHashMap<T, Promise<AsyncFCResult>>(hashFunc)

  const WrappedAsyncFC = (props: T) => {

    const [reloadCount, setReloadCount] = useState(0)
    const [initialLoad, setInitialLoad] = useState(true)

    const evictCache = () => {
      instances.delete(props)
    }

    const forceReload = () => {
      setReloadCount(count => {
        const newCount = count + 1
        console.log({newCount})
        return newCount
      })
    }

    const reloader = () => {
      evictCache()
      forceReload()
    }

    useEffect(() => {
      console.log("mandatory reload")
      setInitialLoad(false)
      evictCache()
      forceReload()
    }, [])

    if (!instances.has(props)) {
      if (initialLoad) {
        instances.set(props, Promise.resolve(h("div")))
      } else {
        instances.set(props, promiseComponent(props, reloader))
      }
    }

    const instance = instances.get(props)!

    const unwrappedInstance = useSuspense(instance)
    if (isFunction(unwrappedInstance)) {
      const StatfulAsyncComponentWrapper = unwrappedInstance
      return h(StatfulAsyncComponentWrapper)
    } else {
      return unwrappedInstance
    }
  }

  return WrappedAsyncFC
}

export const AsyncUseComponent = <T>(promiseComponent: AsyncFC<T>, hashFunc: HashFunc<T> = defaultHash) => {
  const instances = new CustomHashMap<T, Promise<AsyncFCResult>>(hashFunc)

  const WrappedAsyncFC = (props: T) => {

    const [reloadCount, setReloadCount] = useState(0)
    const [initialLoad, setInitialLoad] = useState(true)

    const evictCache = () => {
      instances.delete(props)
    }

    const forceReload = () => {
      setReloadCount(count => {
        const newCount = count + 1
        console.log({newCount})
        return newCount
      })
    }

    const reloader = () => {
      evictCache()
      forceReload()
    }

    useEffect(() => {
      console.log("mandatory reload")
      setInitialLoad(false)
      evictCache()
      forceReload()
    }, [])

    if (!instances.has(props)) {
      if (initialLoad) {
        instances.set(props, Promise.resolve(h("div")))
      } else {
        instances.set(props, promiseComponent(props, reloader))
      }
    }

    const instance = instances.get(props)

    const unwrappedInstance = use(instance)
    if (isFunction(unwrappedInstance)) {
      const StatfulAsyncComponentWrapper = unwrappedInstance
      return h(StatfulAsyncComponentWrapper)
    } else {
      return unwrappedInstance
    }
  }

  return WrappedAsyncFC
}

export const useReload = (reloader: AsyncComponentReloader) => {
  const [reloadCount, setReloadCount] = useState(0)

  const forceReload = () => {
    setReloadCount(count => count + 1)
  }

  return () => {
    reloader()
    forceReload()
    console.log("reload")
  }
}