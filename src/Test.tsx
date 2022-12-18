import { wait } from "./wait"
import * as React from "react"
import { AsyncComponent } from "./AsyncComponent"
import { GeneratorComponentV2 } from "./GeneratorComponent"
import { LoadingSymbol } from "./App"

export const AsyncDate = AsyncComponent(async ({timezone}: {timezone: string}, reload) => {
    await wait(2000)
    const res = await fetch(`https://worldtimeapi.org/api/timezone/${timezone}`)
    const resJSON = await res.json()
    const datetime = resJSON.datetime
    return (
        <div>
            Time is {datetime} in {timezone}
            <button onClick={reload}>reload</button>
        </div>
    )
})

export const GeneratorDate = GeneratorComponentV2(function* ({timezone}: {timezone: string}, reload) {
    yield <LoadingSymbol delayMS={100}/>

    yield wait(2000)
    const res = yield fetch(`https://worldtimeapi.org/api/timezone/${timezone}`)
    const resJSON = yield res.json()
    const datetime = resJSON.datetime

    yield <LoadingSymbol delayMS={100} message={"Waiting"}/>
    yield wait(2000)

    return (
        <div>
            Time is {datetime} in {timezone}
            <button onClick={reload}>reload</button>
        </div>
    )
})