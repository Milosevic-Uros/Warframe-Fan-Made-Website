import { useSyncExternalStore } from 'react'
import { film } from './store'

/** Index of the shot currently on screen. */
export function useActiveShot() {
  return useSyncExternalStore(film.subscribe, () => film.active, () => 0)
}

/** Which shots may load their images (grows as the visitor travels). */
export function useLoadedShots() {
  return useSyncExternalStore(film.subscribe, () => film.loaded, () => film.loaded)
}
