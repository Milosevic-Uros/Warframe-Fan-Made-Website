import { useEffect, useRef, type CSSProperties } from 'react'
import { ScrollTrigger } from '../motion/motion'
import { SCENES, sceneMeta, type SceneId } from '../story/scenes'
import './StoryProgress.css'

/** Where each scene starts, as a 0–1 fraction of the scrollable height (pin spacers included). */
function measureSceneStarts() {
  const max = document.documentElement.scrollHeight - window.innerHeight
  return SCENES.map(({ id }) => {
    const element = document.getElementById(id)
    if (!element || max <= 0) return 0
    const parent = element.parentElement
    const box = parent?.classList.contains('pin-spacer') ? parent : element
    return Math.min(1, Math.max(0, (box.getBoundingClientRect().top + window.scrollY) / max))
  })
}

/**
 * Rail that fills with real scroll progress. The fill is written straight to a CSS custom
 * property (no React re-render); the scene counter only changes with the active scene.
 */
export function StoryProgress({ active }: { active: SceneId }) {
  const rail = useRef<HTMLDivElement>(null)
  const position = SCENES.findIndex((scene) => scene.id === active) + 1
  const { index, label } = sceneMeta(active)

  useEffect(() => {
    const element = rail.current
    if (!element) return

    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => element.style.setProperty('--progress', self.progress.toFixed(4)),
    })
    const placeTicks = () => {
      const starts = measureSceneStarts()
      element.querySelectorAll<HTMLElement>('.progress__tick').forEach((tick, i) => {
        tick.style.setProperty('--at', String(starts[i]))
      })
      element.style.setProperty('--progress', trigger.progress.toFixed(4))
    }

    placeTicks()
    ScrollTrigger.addEventListener('refresh', placeTicks)
    return () => {
      ScrollTrigger.removeEventListener('refresh', placeTicks)
      trigger.kill()
    }
  }, [])

  return (
    <div
      ref={rail}
      className="progress"
      role="progressbar"
      aria-label="Story progress"
      aria-valuemin={1}
      aria-valuemax={SCENES.length}
      aria-valuenow={position}
      aria-valuetext={`Scene ${position} of ${SCENES.length}: ${label}`}
    >
      <span className="progress__count label" aria-hidden="true">
        <span className="label--cyan">{index}</span> / {String(SCENES.length).padStart(2, '0')}
      </span>
      <span className="progress__track" aria-hidden="true">
        <span className="progress__fill" />
        {SCENES.map((scene, i) => (
          <span
            key={scene.id}
            className={`progress__tick${i < position ? ' is-passed' : ''}`}
            style={{ '--at': i / (SCENES.length - 1) } as CSSProperties}
          />
        ))}
      </span>
    </div>
  )
}
