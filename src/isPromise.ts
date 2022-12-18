export const isPromise = <T>(
  maybePromise: Promise<T> | any
): maybePromise is Promise<T> => {
  return typeof maybePromise.then === "function"
};
