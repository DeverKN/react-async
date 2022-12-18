import * as React from 'react';
import { useState } from 'react';
import { Fetcher, Suspender } from './Fetcher';
import './style.css';
import { Timer } from './IdealFetcher';
import {
  AsyncDateTime,
  DateTime,
  EffectDateTime,
  GeneratorDateTime,
  GeneratorDateTimeV2,
  UseDateTime,
} from './Date';
import { RerenderCounter } from './RerenderCounter';
import { ReloadableSuspense } from './ReloadableSuspense';
import { Counter } from './Counter';
import { AsyncDate, GeneratorDate } from './Test';

// const twoSecondPromise = new Promise((res, rej) => {
//   setTimeout(() => {
//     console.log("res")
//     res(10)
//   }, 2*1000)
// })

const Greeter = () => {
  return (
    <Suspender
      promise={
        new Promise((res, rej) => {
          setTimeout(() => {
            console.log(Date.now());
            res(Date.now());
          }, 2 * 1000);
        })
      }
      handler={(data) => <Fetcher fetch={data} />}
      fallback={'test'}
    />
  );
};

export const LoadingSymbol = ({ delayMS, message = "Loading" }) => {
  const [numDots, setNumDots] = useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setNumDots((numDots) => (numDots < 3 ? numDots + 1 : 0));
    }, delayMS);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return <div>{message}{'.'.repeat(numDots)}</div>;
};

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Hello StackBlitz!</h1>
      <p>Start editing to see some magic happen :)</p>
      {/* <React.Suspense fallback={<LoadingSymbol delayMS={200} />}>
        <AsyncDate timezone={'America/Chicago'}/>
      </React.Suspense> */}
      <GeneratorDate timezone={'America/Chicago'}/>
      {/* <React.Suspense fallback={<LoadingSymbol delayMS={200} />}>
        <AsyncDateTime timezone={'America/Chicago'}>
          Test
          <Counter />
        </AsyncDateTime>
      </React.Suspense>
      <GeneratorDateTimeV2 timezone={'America/Chicago'} /> */}
      {/* <React.Suspense fallback={<LoadingSymbol delayMS={200} />}>
        <UseDateTime timezone={"America/Chicago"}>
          <Counter />
        </UseDateTime>
      </React.Suspense> */}
      {/* <EffectDateTime timezone={"America/Chicago"} />
      <React.Suspense fallback={<LoadingSymbol delayMS={200} />}>
        <DateTime timezone={"America/Chicago"} />
      </React.Suspense>
      <React.Suspense fallback={<LoadingSymbol delayMS={200} />}>
        <AsyncDateTime timezone={"America/Chicago"}>
          <Counter />
        </AsyncDateTime>
      </React.Suspense>
      <React.Suspense fallback={<LoadingSymbol delayMS={200} />}>
        <GeneratorDateTime timezone={"America/Chicago"}>
          <Counter />
        </GeneratorDateTime>
      </React.Suspense> */}
      {/* <React.Suspense fallback={<LoadingSymbol delayMS={200} />}>
        <UseDateTime timezone={"America/Chicago"}>
          <Counter />
        </UseDateTime>
      </React.Suspense> */}
      <button onClick={() => setCount((count) => count + 1)}>{count}</button>
      <RerenderCounter />
    </div>
  );
}
