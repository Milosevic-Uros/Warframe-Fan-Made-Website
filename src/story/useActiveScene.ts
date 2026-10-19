import { useEffect, useState } from 'react'
import { SCENES, type SceneId } from './scenes'

/**
 * Tracks which scene crosses the middle of the viewport. Updates React state only when the
 * scene changes — never per scroll pixel.
 */
export function useActiveScene() {
  const [active, setActive] = useState<SceneId>(SCENES[0].id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as SceneId)
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    SCENES.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    // The last scene can be too short to reach mid-viewport; the end of the page counts as it.
    const last = SCENES[SCENES.length - 1].id
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) setActive(last)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return active
}
