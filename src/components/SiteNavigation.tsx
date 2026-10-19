import { useEffect, useRef, useState } from 'react'
import { SCENES, type SceneId } from '../story/scenes'
import { useMotion } from '../motion/MotionContext'
import './SiteNavigation.css'

export function SiteNavigation({ active }: { active: SceneId }) {
  const [open, setOpen] = useState(false)
  const { reduced, toggle } = useMotion()
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="site-header">
      <a className="brand" href="#awakening" onClick={() => setOpen(false)}>
        <svg className="brand__mark" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2 21 12 12 22 3 12Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 8 16 12 12 16 8 12Z" fill="var(--cyan)" />
        </svg>
        <span className="brand__name">Tenno</span>
        <span className="brand__sub">Fan journey</span>
      </a>

      <nav id="site-nav" className={`site-nav${open ? ' is-open' : ''}`} aria-label="Story scenes">
        <ol>
          {SCENES.map((scene) => (
            <li key={scene.id}>
              <a
                href={`#${scene.id}`}
                aria-current={active === scene.id ? 'step' : undefined}
                onClick={() => setOpen(false)}
              >
                <span className="site-nav__index">{scene.index}</span>
                {scene.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="site-header__actions">
        <button type="button" className="chip" aria-pressed={reduced} onClick={toggle}>
          <span className="chip__dot" aria-hidden="true" />
          Reduce motion
        </button>
        <button
          ref={menuButton}
          type="button"
          className="chip menu-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Close' : 'Scenes'}
        </button>
      </div>
    </header>
  )
}
