import { SHOTS } from './film'

/**
 * Which shot is on screen (global index into SHOTS). Written by chapter timelines, read by
 * the stage (lazy loading), particles and live effects. Changes only on cuts, not per pixel.
 */
let active = 0
/** Shots whose images may load: a window around every shot visited so far. */
const loaded = new Set<number>()
/** Immutable snapshot of `loaded` for React (a new array whenever it grows). */
let loadedSnapshot: readonly boolean[] = []
const listeners = new Set<() => void>()

function allow(index: number) {
  for (let i = index - 1; i <= index + 2; i++) if (i >= 0 && i < SHOTS.length) loaded.add(i)
  loadedSnapshot = SHOTS.map((_, i) => loaded.has(i))
}
allow(0)

export const film = {
  get active() {
    return active
  },
  get loaded() {
    return loadedSnapshot
  },
  setActive(index: number) {
    const next = Math.max(0, Math.min(SHOTS.length - 1, index))
    if (next === active) return
    active = next
    allow(next)
    listeners.forEach((fn) => fn())
  },
  subscribe(fn: () => void) {
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  },
}
