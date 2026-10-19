import { useEffect, useRef } from 'react'
import { useMotion } from '../motion/MotionContext'
import { SHOTS, type Particles as Mode } from './film'
import { film } from './store'

type Mote = { x: number; y: number; z: number; vx: number; vy: number; phase: number }

const STYLE: Record<Exclude<Mode, 'none'>, { color: string; size: number; vy: number; vx: number; count: number; glow: boolean }> = {
  dust: { color: '216,222,232', size: 1.2, vy: -0.08, vx: 0.05, count: 70, glow: false },
  snow: { color: '245,247,251', size: 1.8, vy: 0.9, vx: 0.25, count: 160, glow: false },
  embers: { color: '255,170,90', size: 1.6, vy: -0.6, vx: 0.15, count: 90, glow: true },
  spores: { color: '214,182,110', size: 1.8, vy: -0.2, vx: 0.1, count: 80, glow: true },
}

/**
 * One canvas of atmospheric particles over the film. The mode follows the active shot and
 * cross-fades on cuts. Decorative: paused when the tab is hidden and off under reduced motion.
 */
export function Particles() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const { reduced } = useMotion()

  useEffect(() => {
    const el = canvas.current
    const ctx = el?.getContext('2d')
    if (!el || !ctx || reduced) return

    let width = 0
    let height = 0
    const motes: Mote[] = Array.from({ length: 160 }, () => ({ x: Math.random(), y: Math.random(), z: 0.3 + Math.random() * 0.7, vx: Math.random() - 0.5, vy: Math.random() - 0.5, phase: Math.random() * 6 }))
    let mode: Mode = 'none'
    let fade = 0
    let frame = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = window.innerWidth
      height = window.innerHeight
      el.width = width * dpr
      el.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const tick = (time: number) => {
      const wanted = SHOTS[film.active]?.shot.particles ?? 'none'
      // Fade out, switch, fade back in.
      if (wanted !== mode) {
        fade -= 0.05
        if (fade <= 0) {
          mode = wanted
          fade = 0
        }
      } else fade = Math.min(1, fade + 0.03)

      ctx.clearRect(0, 0, width, height)
      if (mode !== 'none' && fade > 0) {
        const s = STYLE[mode]
        ctx.fillStyle = `rgba(${s.color},1)`
        for (let i = 0; i < s.count; i++) {
          const m = motes[i]
          m.x += (s.vx * m.z + Math.sin(time * 0.0006 + m.phase) * 0.15) / width
          m.y += (s.vy * m.z) / height * 2
          if (m.y < -0.02) m.y = 1.02
          if (m.y > 1.02) m.y = -0.02
          if (m.x > 1.02) m.x = -0.02
          if (m.x < -0.02) m.x = 1.02
          const twinkle = 0.55 + 0.45 * Math.sin(time * 0.002 + m.phase)
          ctx.globalAlpha = fade * twinkle * m.z * (s.glow ? 0.9 : 0.55)
          const r = s.size * m.z
          ctx.beginPath()
          ctx.arc(m.x * width, m.y * height, r, 0, Math.PI * 2)
          ctx.fill()
          if (s.glow) {
            ctx.globalAlpha *= 0.18
            ctx.beginPath()
            ctx.arc(m.x * width, m.y * height, r * 4, 0, Math.PI * 2)
            ctx.fill()
          }
        }
        ctx.globalAlpha = 1
      }
      frame = requestAnimationFrame(tick)
    }

    const onVisibility = () => {
      cancelAnimationFrame(frame)
      if (!document.hidden) frame = requestAnimationFrame(tick)
    }

    resize()
    frame = requestAnimationFrame(tick)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced])

  return <canvas ref={canvas} className="film__particles" aria-hidden="true" />
}
