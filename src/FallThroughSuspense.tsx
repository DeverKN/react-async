import * as React from "react"

export const FallThroughSuspense = ({fallback, children}) => {
  const child = React.Children.only(children)
  const fallthroughChildren = child.props.children
  // console.log({child})
  return (
    <React.Suspense fallback={fallback(fallthroughChildren)}>
      {child}
    </React.Suspense>
  )
}