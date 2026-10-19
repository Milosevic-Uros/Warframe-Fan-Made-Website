import { createContext, useContext } from 'react'

export type MotionState = {
  /** True when motion should be minimised (OS setting or the in-page toggle). */
  reduced: boolean
  toggle: () => void
}

export const MotionContext = createContext<MotionState>({
  reduced: false,
  toggle: () => {},
})

export function useMotion() {
  return useContext(MotionContext)
}
