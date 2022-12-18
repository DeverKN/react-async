import { makeLoader, makeLoaderHook, useAwait } from './useFetch';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { AsyncUseComponent as AsyncComponent, useReload } from './AsyncComponent';
import { RerenderCounter } from './RerenderCounter';
import { GeneratorComponent, GeneratorComponentV2 } from './GeneratorComponent';
import { Counter } from './Counter';
import { use } from './ReactUnstable';
import { slowFetch, wait } from './wait';
import { LoadingSymbol } from './App';

const useTimeLoader = makeLoaderHook(async ({ timezone }) => {
  const res = await slowFetch(
    `https://worldtimeapi.org/api/timezone/${timezone}`,
    2000
  );
  const resJOSN = await res.json();
  const datetime = resJOSN.datetime;
  return datetime;
});

export const DateTime = ({ timezone }: { timezone: string }) => {
  const [datetime, reload] = useTimeLoader({ timezone }, timezone);

  return (
    <div>
      Time is {datetime} in {timezone}
      <button onClick={reload}>reload</button>
      <RerenderCounter />
    </div>
  );
};

export const AsyncDateTime = AsyncComponent(
  async (
    { timezone, children }: { timezone: string; children: any },
    reload
  ) => {
    const res = await slowFetch(
      `https://worldtimeapi.org/api/timezone/${timezone}`,
      2000
    );
    const resJOSN = await res.json();
    const datetime = resJOSN.datetime;

    return (
      <div>
        Time is {datetime} in {timezone}
        <button onClick={reload}>Reload</button>
        {children}
      </div>
    );

    // return () => {
    //   const [count, setCount] = useState(0)
    //   return (
    //     <div>
    //       Time is {datetime} in {timezone}
    //       <button onClick={reload}>Reload</button>
    //       <button onClick={() => setCount(count => count - 1)}>-</button>
    //       {count}
    //       <button onClick={() => setCount(count => count + 1)}>+</button>
    //       {children}
    //     </div>
    //   )
    // }
  }
);

export const GeneratorDateTime = GeneratorComponent(function* (
  { timezone, children }: { timezone: string; children: any },
  reload
) {
  const res = yield slowFetch(
    `https://worldtimeapi.org/api/timezone/${timezone}`,
    2000
  );
  const resJOSN = yield res.json();
  const datetime = resJOSN.datetime;

  return (
    <div>
      Time is {datetime} in {timezone}
      <button onClick={reload}>Reload</button>
      <RerenderCounter />
      {children}
    </div>
  );
});

export const GeneratorDateTimeV2 = GeneratorComponentV2(function* ({timezone}: {timezone: string;}, reload) {
  yield (
    <div>
      <div>Loading</div>
      <Counter />
    </div>
  );
  
  const res = yield slowFetch(
    `https://worldtimeapi.org/api/timezone/${timezone}`,
    2000
  );
  
  const resJOSN = yield res.json();
  const datetime = resJOSN.datetime;

  yield (
    <LoadingSymbol delayMS={100} message={"Waiting"}></LoadingSymbol>
  )
  yield wait(2000)

  return (
    <div>
      Time is {datetime} in {timezone}
      <Counter />
      <button onClick={reload}>Reload</button>
      <RerenderCounter />
    </div>
  );
});

const resource = (async () => {
  const res = await slowFetch(
    `https://worldtimeapi.org/api/timezone/America/Chicago`,
    2000
  );
  const resJOSN = await res.json();
  return resJOSN.datetime;
})();
export const UseDateTime = ({
  timezone,
  children,
}: {
  timezone: string;
  children: any;
}) => {
  const datetime = use(resource);

  return (
    <div>
      Time is {datetime} in {timezone}
      <button>Reload</button>
      <RerenderCounter />
      {children}
    </div>
  );
};

export const EffectDateTime = ({ timezone }: { timezone: string }) => {
  const [datetime, setDateTime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (isLoading) {
      (async () => {
        try {
          console.log('test');
          const res: any = await slowFetch(
            `https://worldtimeapi.org/api/timezone/${timezone}`,
            2000
          );
          const resJOSN = await res.json();
          const time = resJOSN.datetime;
          console.log({ time });
          setDateTime(time);
          setIsLoading(false);
        } catch (e) {
          console.log(e.toString());
        }
      })();
    }
    return;
  }, [isLoading]);

  return isLoading ? (
    <div>loading...</div>
  ) : (
    <div>
      Time is {datetime} in {timezone}
      <button onClick={() => setIsLoading(true)}>Reload</button>
      <RerenderCounter />
    </div>
  );
};
