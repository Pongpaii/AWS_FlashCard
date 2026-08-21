import type { ReactNode } from 'react'
import { ProgressContext, useProgressState } from './useProgress'

interface ProgressProviderProps {
  children: ReactNode
}

/** Instantiates the progress state once and shares it with the whole app. */
export function ProgressProvider({ children }: ProgressProviderProps) {
  const value = useProgressState()
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}
