export const isFunction = (maybeFunction: Function | any): maybeFunction is Function => {
  return typeof maybeFunction === "function"
}