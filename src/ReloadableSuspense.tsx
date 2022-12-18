import * as React from "react"
import { useState, useContext } from "react"
import { useForceReload } from "./useForceReload";

const ReloadContext = React.createContext(null);
export const ReloadableSuspense = ({fallback, children}: {fallback: React.ReactNode, children: any}, ) => {

  const reload = useForceReload()
  return (
    <ReloadContext.Provider value={reload}>
      <React.Suspense fallback={fallback}>
        {children}
      </React.Suspense>
    </ReloadContext.Provider>
  )
}

export const useReload = (reloader) => {
  const forceReload = useContext(ReloadContext)
  return () => {
    reloader()
    forceReload()
  }
}