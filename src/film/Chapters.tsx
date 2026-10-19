import { useLayoutEffect, type CSSProperties, type ReactNode } from 'react'
import { SceneLabel } from '../components/StorySection'
import { EASE, gsap } from '../motion/motion'
import { useMotion } from '../motion/MotionContext'
import { OFFICIAL_SITE, type SceneId } from '../story/scenes'
import { WARFRAMES } from '../story/warframes'
import { WORLDS } from '../story/worlds'
import { chapterLength, chapterOf, SHOTS } from './film'
import { useChapter } from './useChapter'
import { useActiveShot } from './useFilm'
import './chapters.css'

function Chapter({ id, children }: { id: SceneId; children: ReactNode }) {
  const ref = useChapter<HTMLElement>(id)
  const length = chapterLength(chapterOf(id))
  return (
    <section id={id} ref={ref} className={`scene chapter chapter--${id}`} style={{ '--len': length } as CSSProperties} aria-labelledby={`${id}-title`}>
      <div className="chapter__frame">{children}</div>
    </section>
  )
}

/** Still frame for the reduced-motion telling (lazy, never loaded while the film plays). */
function Poster({ media, alt }: { media: string; alt: string }) {
  return (
    <img
      className="chapter__poster"
      src={`/media/${media}-1280w.webp`}
      srcSet={`/media/${media}-1280w.webp 1280w, /media/${media}-2400w.webp 2400w`}
      sizes="(min-width: 64rem) 64rem, 100vw"
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  )
}

/* ------------------------------------------------------------- 01 awakening */

function Awakening() {
  const { reduced } = useMotion()
  // Opening titles play on load (time-based), before any scrolling.
  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: EASE.expo } })
        .from('.film__bar', { scaleY: 0, duration: 1.6, ease: EASE.inOut })
        .from('.shot--first .shot__cam', { scale: 1.25, autoAlpha: 0, duration: 2.6 }, 0)
        .from('.chapter--awakening .cap__mega-small', { autoAlpha: 0, x: -30, duration: 1.2 }, 0.9)
        .from('.chapter--awakening .cap__letter', { autoAlpha: 0, yPercent: 35, filter: 'blur(16px)', stagger: 0.1, duration: 1.5, clearProps: 'filter' }, 1)
        .from('.chapter--awakening .cap__reveal', { autoAlpha: 0, y: 18, stagger: 0.14, duration: 1 }, 1.7)
    })
    return () => ctx.revert()
  }, [reduced])

  return (
    <Chapter id="awakening">
      <div className="cap cap--lower cap__stack" data-in="-1" data-out="0.7">
        <SceneLabel id="awakening" className="cap__reveal" />
        <h1 id="awakening-title" className="cap__mega">
          <span className="sr-only">Wake, Tenno</span>
          <span className="cap__mega-small" aria-hidden="true">Wake,</span>
          <span className="cap__mega-big" aria-hidden="true">
            {'TENNO'.split('').map((letter, i) => (
              <span key={i} className="cap__letter">{letter}</span>
            ))}
          </span>
        </h1>
        <p className="lead cap__reveal">Something ancient stirs in the dark between worlds. It has been waiting for you to open your eyes.</p>
        <a className="cue cap__reveal" href="#void">Scroll to begin</a>
      </div>
      <p className="cap cap--subtitle" data-in="1.3" data-out="2.05">
        Cryo-sleep is ending. Something is calling you back.
      </p>
      <Poster media="orbit" alt="An Orokin ship's bridge looking out over Earth from orbit." />
    </Chapter>
  )
}

/* ------------------------------------------------------------------ 02 void */

function Void() {
  return (
    <Chapter id="void">
      <div className="cap cap--upper cap__stack" data-in="0.15" data-out="0.85">
        <SceneLabel id="void" />
        <h2 id="void-title" className="cap__title">The Void</h2>
      </div>
      <p className="cap cap--subtitle" data-in="0.4" data-out="0.92">Between the planets lies a silence that does not end.</p>
      <p className="cap cap--subtitle" data-in="1.3" data-out="1.92">Light bends here. So does memory.</p>
      <p className="cap cap--subtitle" data-in="2.3" data-out="3.0">Far ahead, a seam of light opens. It is meant for you.</p>
      <Poster media="moon-ruins" alt="Crystalline Orokin ruins on a barren moon." />
    </Chapter>
  )
}

/* ----------------------------------------------------------------- 03 tenno */

const TENNO_HUD = [
  { label: 'Helm', text: 'No face. Only intent.' },
  { label: 'Plating', text: 'Orokin gold over pale ceramic.' },
  { label: 'Sidearm', text: 'Never far from hand.' },
]

function Tenno() {
  return (
    <Chapter id="tenno">
      <p className="cap cap--subtitle" data-in="0.3" data-out="0.95">Something waits behind the light.</p>
      <div className="cap cap--lower cap__stack" data-in="1.4" data-out="2.3">
        <SceneLabel id="tenno" />
        <h2 id="tenno-title" className="cap__title">The Tenno</h2>
        <p className="lead">Warriors of blade and gun, waking into a system at war. Each one commands a Warframe — a biomechanical suit of ancient design.</p>
      </div>
      <ul className="cap cap--upper cap__stack cap__huds" aria-label="Excalibur Prime details">
        {TENNO_HUD.map((item, i) => (
          <li key={item.label} className="cap__hud" data-in={String(1.65 + i * 0.1)} data-out="2.3">
            <span className="label label--cyan">{item.label}</span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
      <Poster media="doorway" alt="A glowing doorway set deep in a rock face." />
    </Chapter>
  )
}

/* ------------------------------------------------------------- 04 warframes */

function Warframes() {
  const active = useActiveShot()
  const first = SHOTS.findIndex((s) => s.chapter === 'warframes')
  const chapter = chapterOf('warframes')
  const total = chapterLength(chapter)

  const jump = (i: number) => {
    const section = document.getElementById('warframes')
    if (!section) return
    const top = section.getBoundingClientRect().top + window.scrollY
    const span = section.offsetHeight - window.innerHeight
    const at = (SHOTS[first + i].start + chapter.shots[i].length * 0.45) / total
    window.scrollTo({ top: top + span * at })
  }

  const inOut = [
    ['0.42', '1.12'],
    ['1.55', '2.32'],
    ['2.75', '3.52'],
  ]

  return (
    <Chapter id="warframes">
      <div className="cap cap--upper cap__stack" data-in="0.05" data-out="0.42">
        <SceneLabel id="warframes" />
        <h2 id="warframes-title" className="cap__title">Prime Warframes</h2>
        <p className="body-copy">Every new Tenno begins with one of three frames: Excalibur, Mag or Volt. Here they stand in their Prime forms — Orokin-era designs, gilded and exact.</p>
      </div>

      {WARFRAMES.map((frame, i) => (
        <article key={frame.id} className="cap cap--lower cap__stack" data-in={inOut[i][0]} data-out={inOut[i][1]} aria-labelledby={`frame-${frame.id}`}>
          <p className="label" style={{ color: frame.accent }}>{frame.epithet}</p>
          <h3 id={`frame-${frame.id}`} className="cap__name">{frame.name}</h3>
          <p className="cap__body">{frame.description}</p>
          <ul className="cap__list" aria-label={`${frame.name} abilities`}>
            {frame.abilities.map((ability) => (
              <li key={ability}>{ability}</li>
            ))}
          </ul>
          <p className="cap__note">{frame.note}</p>
          <Poster media={`${frame.id}-prime`} alt={`${frame.name}, official key art.`} />
        </article>
      ))}

      <nav className="cap cap--upper cap--right" data-in="0.42" data-out="3.55" aria-label="Jump to a Prime Warframe">
        <ul className="frame-nav">
          {WARFRAMES.map((frame, i) => (
            <li key={frame.id}>
              <button type="button" aria-current={active === first + i} onClick={() => jump(i)}>
                {String(i + 1).padStart(2, '0')} {frame.name.replace(' Prime', '')}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </Chapter>
  )
}

/* ---------------------------------------------------------------- 05 worlds */

const WORLD_MEDIA = { plains: 'plains', vallis: 'vallis', cambion: 'cambion' } as const

function Worlds() {
  const inOut = [
    ['0.45', '1.05'],
    ['1.5', '2.22'],
    ['2.65', '3.38'],
  ]
  return (
    <Chapter id="worlds">
      <div className="cap cap--upper cap__stack" data-in="0.08" data-out="0.45">
        <SceneLabel id="worlds" />
        <h2 id="worlds-title" className="cap__title">Worlds</h2>
        <p className="body-copy">Beyond the ship, the Origin System opens wide. Three landscapes, three skies — each alive with its own weather and danger.</p>
      </div>
      {WORLDS.map((world, i) => (
        <article key={world.id} className="cap cap--lower cap__stack" data-in={inOut[i][0]} data-out={inOut[i][1]} aria-labelledby={`world-${world.id}`}>
          <p className="label label--gold">{world.planet} · Hub: {world.hub}</p>
          <h3 id={`world-${world.id}`} className="cap__name">{world.name}</h3>
          <p className="cap__body">{world.line}</p>
          <Poster media={WORLD_MEDIA[world.id]} alt={`${world.name}, ${world.planet}.`} />
        </article>
      ))}
    </Chapter>
  )
}

/* -------------------------------------------------------------- 06 conflict */

const FACTIONS = [
  { name: 'Grineer', media: 'grineer', text: 'Cloned legions, made by the Orokin to serve — now building an empire of their own.', at: ['1.62', '2.24'] },
  { name: 'Corpus', media: 'corpus', text: 'A profit-driven conglomerate of merchants and machines, cold as the vacuum.', at: ['2.42', '3.04'] },
  { name: 'Infested', media: 'infested', text: 'A plague that spreads through flesh and metal alike. A disease that thinks.', at: ['3.22', '3.84'] },
]

function Conflict() {
  return (
    <Chapter id="conflict">
      <div className="cap cap--center cap__stack" data-in="0.3" data-out="1.3" data-cap="title">
        <SceneLabel id="conflict" />
        <h2 id="conflict-title" className="cap__title">Every front, contested</h2>
      </div>
      {FACTIONS.map((faction) => (
        <article key={faction.name} className="cap cap--lower cap__stack" data-in={faction.at[0]} data-out={faction.at[1]}>
          <h3 className="cap__name">{faction.name}</h3>
          <p className="cap__body">{faction.text}</p>
          <Poster media={faction.media} alt={`${faction.name} — official key art.`} />
        </article>
      ))}
      <p className="cap cap--center cap__title" data-in="4.15" data-out="4.75" data-cap="title" style={{ fontSize: 'var(--text-title)' }}>
        The Tenno answer with speed and steel.
      </p>
    </Chapter>
  )
}

/* --------------------------------------------------------------- 07 resolve */

function Resolve() {
  return (
    <Chapter id="resolve">
      <div className="cap cap--center cap__stack" data-in="0.3">
        <SceneLabel id="resolve" />
        <h2 id="resolve-title" className="cap__title">The journey continues</h2>
        <p className="lead" style={{ textAlign: 'center', maxWidth: '36ch' }}>This was only first light. The real Origin System is waiting — and Warframe is free to play.</p>
        <div className="resolve__actions">
          <a className="button" href={OFFICIAL_SITE} target="_blank" rel="noopener noreferrer">
            Visit the official Warframe site
            <span className="sr-only"> (warframe.com, opens in a new tab)</span>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M5 3h8v8M13 3 3 13" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </a>
          <a className="cue" href="#awakening">Return to the beginning</a>
        </div>
        <Poster media="orbiter" alt="The bridge of a Tenno ship, a planet beyond the window." />
      </div>
    </Chapter>
  )
}

export function Chapters() {
  return (
    <>
      <Awakening />
      <Void />
      <Tenno />
      <Warframes />
      <Worlds />
      <Conflict />
      <Resolve />
    </>
  )
}
