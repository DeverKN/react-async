import * as React from "react"
import { makeLoader, makeLoaderHook } from "./useFetch"

const dateTimeLoader = makeLoader((city) => {
  return new Promise(async (res, rej) => {
    console.log("fetch")
    console.log({city})
    try {
      const resource = await fetch(`https://www.worldtimeapi.org/api/timezone/America/${city}`)
      console.log("fetched")
      console.log({resource})
      res(await resource.json())
    } catch (e) {
      console.log(e.toString())
    }
  })
})

const useDateTimeLoader = makeLoaderHook((city) => {
  return new Promise(async (res, rej) => {
    console.log("fetch")
    console.log({city})
    try {
      const resource = await fetch(`https://www.worldtimeapi.org/api/timezone/America/${city}`)
      console.log("fetched")
      console.log({resource})
      res(await resource.json())
    } catch (e) {
      console.log(e.toString())
    }
  })
})

const useDateTimeLoaderV2 = makeLoaderHook((city) => {
  return new Promise(async (res, rej) => {
    console.log("fetch")
    console.log({city})
    try {
      const resource = await fetch(`https://www.worldtimeapi.org/api/timezone/America/${city}`)
      console.log("fetched")
      console.log({resource})
      res(resource)
    } catch (e) {
      console.log(e.toString())
    }
  })
})

const twoSecondPromise = new Promise((res, rej) => {
  setTimeout(() => {
    console.log("res")
    res(10)
  }, 2*1000)
})

export const Timer = ({city}) => {
  const [data, reload] = useDateTimeLoader(city)//useLoader(dateTimeLoader(city, city))

  return (
      <div>
        Hello!
        { data.datetime }
        <button onClick={reload}>reload</button>
      </div>
  )
}