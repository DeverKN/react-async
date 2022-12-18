import { createElement as h, FunctionComponent, useEffect, useState } from 'react';
import { AsyncComponent } from './AsyncComponent';
import { isPromise } from './isPromise';
import { useForceReload } from './useForceReload';

type GeneratorComponentReloader = () => void;
type GeneratorFCYield = Promise<any> | JSX.Element;
type GeneratorFC<T> = (
  props: T,
  reload: GeneratorComponentReloader
) => Generator<GeneratorFCYield, JSX.Element, any>;
export const GeneratorComponent = <T>(generatorComponent: GeneratorFC<T>) => {
  const WrappedGeneratorComponent = (
    props: T,
    reloader: GeneratorComponentReloader
  ): Promise<JSX.Element> => {
    const promisedComponent = new Promise<JSX.Element>(async (res, rej) => {
      const instance = generatorComponent(props, reloader);
      let isDone = false;
      let previousResult = null;
      let finalValue: JSX.Element | null = null;
      while (!isDone) {
        const { done, value } = instance.next(previousResult);
        isDone = done ?? true;
        if (isDone) {
          finalValue = value as JSX.Element;
        } else {
          previousResult = await value;
        }
      }
      res(finalValue ?? h("div"));
    });

    return promisedComponent;
  };

  return AsyncComponent(WrappedGeneratorComponent);
};

// export const GeneratorComponentNoAsync = <T>(generatorComponent: GeneratorFC<T>) => {

//   const WrappedGeneratorComponent = (props: T): Promise<JSX.Element> => {

//     const promisedComponent = new Promise<JSX.Element>(async (res, rej) => {
//       const instance = generatorComponent(props)
//       let isDone = false
//       let previousResult = null
//       let finalValue: JSX.Element = null
//       while (!isDone) {
//         const {done, value} = instance.next(previousResult)
//         isDone = done
//         if (isDone) {
//           finalValue = value
//         } else {
//           previousResult = await value
//         }
//       }
//       res(finalValue)
//     })

//     return promisedComponent
//   }

//   throw WrappedGeneratorComponent

// }

// const makeInstance = (generatorComponent) => {
//   (async () => {
//     const instance = generatorComponent(props)
//     let isDone = false
//     let previousResult = null
//     let
//   })
//   const promisedComponent = new Promise<JSX.Element>(async (res, rej) => {
//     const instance = generatorComponent(props)
//     let isDone = false
//     let previousResult = null
//     let finalValue: JSX.Element = null
//     while (!isDone) {
//       const {done, value} = instance.next(previousResult)
//       isDone = done
//       if (isDone) {
//         finalValue = value as
//       } else {
//         previousResult = await value
//       }
//     }
//     res(finalValue)
//   })
// }

type UpdaterFunction = (newJSX: JSX.Element) => void;
type Reloader = () => void
const generatorComponentHandler = <T>(props: T, generatorComponent: GeneratorFC<T>, update: UpdaterFunction, reload: Reloader) => {

  let makeNewInstance = () => {

  }

  let refresh = () => {
    console.log("refresh")
    reload()
    makeNewInstance()
  }

  let cancelledInstanceNum = -1;
  let currInstanceNum = 0;

  makeNewInstance = () => {

    const instanceNum = currInstanceNum++
    cancelledInstanceNum = instanceNum - 1;
    
    (async () => {
      let instance = generatorComponent(props, refresh);
      let isDone = false;
      let previousResult: any = null;
      while (!isDone) {
        if (cancelledInstanceNum >= instanceNum) isDone = true
        const { done, value } = instance.next(previousResult);
        isDone = done ?? true;
        console.log({ value });
        if (isPromise(value)) {
          previousResult = await value;
        } else {
          const newJSX = value;
          console.log({ newJSX });
          update(newJSX);
          previousResult = null;
        }
      }
    })()

  }

  makeNewInstance()

  return makeNewInstance
};

export const GeneratorComponentV2 = <T>(generatorComponent: GeneratorFC<T>) => {
  const WrappedGeneratorComponent: FunctionComponent<T> = (props: T) => {
    const [currJSX, setCurrJSX] = useState<JSX.Element>(h("div"));
    const reload = useForceReload()

    const update = (newJSX: JSX.Element) => {
      setCurrJSX(newJSX);
    };

    useEffect(() => {
      try {
        generatorComponentHandler(
          props,
          generatorComponent,
          update,
          reload
        );
      } catch (e) {
        console.error(
          `The following error occured in a generator component "${generatorComponent.name}"`
        );
        console.error(e);
      }
    }, []);

    return currJSX;
  };

  return WrappedGeneratorComponent;
};
