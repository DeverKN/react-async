export const wait = (delayMs: number): Promise<null> => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res(null)
        }, delayMs);
      });
}

export const slowFetch = async (url: string, delayMs: number): Promise<Response> => {
    await wait(delayMs)
    return fetch(url)
  };