import { useEffect, useRef, type CSSProperties } from 'react'
import { useMotion } from '../motion/MotionContext'
import type { Fx as FxName } from './film'
import { useActiveShot } from './useFilm'

type FxProps = { origin: [number, number]; shotIndex: number }

const at = ([x, y]: [number, number]) => ({ '--fx-x': `${x}%`, '--fx-y': `${y}%` }) as CSSProperties

/** Jagged polyline from a to b (percent coordinates in a 100×100 box). */
function bolt(ax: number, ay: number, bx: number, by: number, rand: () => number) {
  const points: string[] = []
  const steps = 9
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const jitter = i === 0 || i === steps ? 0 : (rand() - 0.5) * 9 * Math.sin(t * Math.PI)
    points.push(`${(ax + (bx - ax) * t + jitter).toFixed(1)},${(ay + (by - ay) * t + jitter * 0.6).toFixed(1)}`)
  }
  return points.join(' ')
}

const BOLT_ENDS: [number, number][] = [[8, 18], [92, 12], [12, 88], [88, 84], [50, 4], [96, 52]]

/** Volt: arcs crawl out from the origin while the shot is on screen. */
function Lightning({ origin, shotIndex }: FxProps) {
  const svg = useRef<SVGSVGElement>(null)
  const active = useActiveShot() === shotIndex
  const { reduced } = useMotion()
  useEffect(() => {
    if (!active || reduced || !svg.current) return
    const lines = Array.from(svg.current.querySelectorAll('polyline'))
    let seed = 1
    const rand = () => {
      seed = (seed * 16807) % 2147483647
      return seed / 2147483647
    }
    let frame = 0
    let last = 0
    const tick = (now: number) => {
      // Re-roll ~12 times a second: lively without strobing.
      if (now - last > 85) {
        last = now
        lines.forEach((line, i) => {
          const [bx, by] = BOLT_ENDS[(i + Math.floor(now / 400)) % BOLT_ENDS.length]
          line.setAttribute('points', bolt(origin[0], origin[1], origin[0] + (bx - origin[0]) * (0.4 + rand() * 0.4), origin[1] + (by - origin[1]) * (0.4 + rand() * 0.4), rand))
          line.style.opacity = String(0.35 + rand() * 0.5)
        })
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, reduced, origin])
  return (
    <svg ref={svg} className="fx fx--lightning" data-fx="lightning" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {BOLT_ENDS.slice(0, 4).map((_, i) => (
        <polyline key={i} fill="none" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  )
}

export function Fx({ name, origin, shotIndex }: FxProps & { name: FxName }) {
  switch (name) {
    case 'mist':
      return <div className="fx fx--mist" aria-hidden="true" />
    case 'glow':
      return <div className="fx fx--glow" data-fx="glow" style={at(origin)} aria-hidden="true" />
    case 'flare':
      return <div className="fx fx--flare" data-fx="flare" style={at(origin)} aria-hidden="true" />
    case 'sweep':
      return <div className="fx fx--sweep" data-fx="sweep" aria-hidden="true" />
    case 'speed':
      return <div className="fx fx--speed" data-fx="speed" aria-hidden="true" />
    case 'slash':
      return (
        <svg className="fx fx--slash" data-fx="slash" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <path pathLength={1} d="M120 760 C 520 520, 980 260, 1520 110" />
          <path pathLength={1} d="M220 860 C 640 600, 1080 380, 1580 260" />
        </svg>
      )
    case 'rings':
      return (
        <svg className="fx fx--rings" data-fx="rings" viewBox="0 0 100 100" style={at(origin)} aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <circle key={i} cx="50" cy="50" r="10" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
      )
    case 'lightning':
      return <Lightning origin={origin} shotIndex={shotIndex} />
  }
}
