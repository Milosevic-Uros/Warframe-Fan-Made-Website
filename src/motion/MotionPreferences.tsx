import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react'
import { MotionContext } from './MotionContext'

const QUERY = '(prefers-reduced-motion: reduce)'
const STORAGE_KEY = 'tenno-motion'

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

const getSystemReduced = () => window.matchMedia(QUERY).matches

function readOverride(): boolean | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? stored === 'reduced' : null
  } catch {
    return null
  }
}

/** Combines prefers-reduced-motion with a persistent in-page override. */
export function MotionPreferences({ children }: { children: ReactNode }) {
  const systemReduced = useSyncExternalStore(subscribe, getSystemReduced, () => false)
  const [override, setOverride] = useState<boolean | null>(readOverride)
  const reduced = override ?? systemReduced

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'reduced' : 'full'
  }, [reduced])

  const toggle = () => {
    const next = !reduced
    setOverride(next)
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'reduced' : 'full')
    } catch {
      // Storage unavailable (private mode etc.) — the choice lasts for this visit only.
    }
  }

  return <MotionContext value={{ reduced, toggle }}>{children}</MotionContext>
}
