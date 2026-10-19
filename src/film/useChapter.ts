import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../motion/motion'
import { useMotion } from '../motion/MotionContext'
import type { SceneId } from '../story/scenes'
import { chapterLength, chapterOf, SHOTS, type Cam, type Shot } from './film'
import { film } from './store'

const camVars = ({ s = 1, x = 0, y = 0, r = 0 }: Cam) => ({ scale: s, xPercent: x, yPercent: y, rotation: r })

/** Layer motion uses viewport units so cut-outs can cross the whole frame. */
const layerVars = ({ s = 1, x = 0, y = 0, r = 0 }: Cam) => ({
  scale: s,
  x: () => (x * window.innerWidth) / 100,
  y: () => (y * window.innerHeight) / 100,
  rotation: r,
})

type Timeline = gsap.core.Timeline

/** Cut from `prev` into `el` at time t over T, in the shot's chosen style. */
function transitionIn(tl: Timeline, shot: Shot, el: HTMLElement, prev: HTMLElement | null, t: number, T: number) {
  const [ox, oy] = shot.origin ?? [50, 50]
  const content = el.querySelector('.shot__cam')
  switch (shot.transition) {
    case 'cut':
      tl.set(el, { autoAlpha: 1 }, t)
      break
    case 'fade':
      tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: T }, t)
      break
    case 'flash': {
      // Bloom to a soft white, cut underneath it, then clear. Peak stays well below full white.
      const flash = el.querySelector('.shot__flash')
      tl.set(el, { autoAlpha: 1 }, t)
      tl.fromTo(content, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, t + T * 0.45)
      tl.fromTo(flash, { opacity: 0 }, { opacity: 0.72, duration: T * 0.45, ease: 'power2.in' }, t)
      tl.to(flash, { opacity: 0, duration: T * 0.55, ease: 'power2.out' }, t + T * 0.45)
      break
    }
    case 'whip': {
      const streak = el.querySelector('.shot__streak')
      tl.fromTo(el, { autoAlpha: 0, xPercent: 22 }, { autoAlpha: 1, xPercent: 0, duration: T, ease: 'power3.out' }, t)
      if (prev) tl.to(prev, { xPercent: -14, duration: T, ease: 'power2.in' }, t)
      tl.fromTo(streak, { opacity: 0 }, { opacity: 0.85, duration: T * 0.4 }, t)
      tl.to(streak, { opacity: 0, duration: T * 0.6 }, t + T * 0.4)
      break
    }
    case 'iris':
      tl.fromTo(el, { autoAlpha: 1, clipPath: `circle(0% at ${ox}% ${oy}%)` }, { clipPath: `circle(140% at ${ox}% ${oy}%)`, duration: T, ease: 'power2.in' }, t)
      break
    case 'wipe':
      tl.fromTo(
        el,
        { autoAlpha: 1, clipPath: 'polygon(120% 0%, 140% 0%, 140% 100%, 100% 100%)' },
        { clipPath: 'polygon(-40% 0%, 140% 0%, 140% 100%, -60% 100%)', duration: T, ease: 'power2.inOut' },
        t,
      )
      break
    case 'push':
      tl.fromTo(el, { autoAlpha: 0, scale: 1.35 }, { autoAlpha: 1, scale: 1, duration: T, ease: 'power3.out' }, t)
      break
  }
  // Once fully covered, the outgoing shot stops costing anything to composite.
  if (prev) tl.set(prev, { autoAlpha: 0 }, t + T)
}

/** Scroll-scrubbed effects inside a shot occupying [t, t + L]. */
function effects(tl: Timeline, el: HTMLElement, t: number, L: number) {
  el.querySelectorAll<HTMLElement | SVGElement>('[data-fx]').forEach((fx) => {
    switch (fx.dataset.fx) {
      case 'glow':
        tl.fromTo(fx, { opacity: 0.2, scale: 0.6 }, { opacity: 1, scale: 1.5, duration: L, ease: 'power1.in' }, t)
        break
      case 'flare':
        tl.fromTo(fx, { opacity: 0.4, xPercent: -6 }, { opacity: 0.9, xPercent: 6, duration: L }, t)
        break
      case 'sweep':
        tl.fromTo(fx, { xPercent: -120, opacity: 0 }, { xPercent: 120, opacity: 1, duration: L * 0.7, ease: 'power1.inOut' }, t + L * 0.2)
        break
      case 'speed':
        tl.fromTo(fx, { opacity: 0, scale: 1.4 }, { opacity: 0.9, scale: 1, duration: L * 0.5, ease: 'power2.out' }, t)
        break
      case 'slash': {
        const paths = fx.querySelectorAll('path')
        tl.fromTo(paths, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: L * 0.18, stagger: L * 0.06, ease: 'power3.out' }, t + L * 0.32)
        tl.fromTo(fx, { opacity: 1 }, { opacity: 0, duration: L * 0.2 }, t + L * 0.62)
        break
      }
      case 'rings': {
        const rings = fx.querySelectorAll('circle')
        tl.fromTo(rings, { scale: 0.2, opacity: 0.9, transformOrigin: '50% 50%' }, { scale: 4.5, opacity: 0, duration: L * 0.45, stagger: L * 0.12, ease: 'power1.out' }, t + L * 0.15)
        break
      }
      case 'lightning':
        tl.fromTo(fx, { opacity: 0 }, { opacity: 1, duration: L * 0.15 }, t + L * 0.25)
        tl.to(fx, { opacity: 0.3, duration: L * 0.2 }, t + L * 0.75)
        break
    }
  })
}

/**
 * Builds a chapter's film timeline: camera moves, layer motion, transitions and captions,
 * scrubbed across the chapter's scroll length. Captions mark their timing with
 * data-in / data-out (chapter-time units; data-in="-1" = visible from the start).
 */
export function useChapter<T extends HTMLElement>(id: SceneId) {
  const ref = useRef<T>(null)
  const { reduced } = useMotion()

  useLayoutEffect(() => {
    const section = ref.current
    const stage = document.querySelector('.film')
    if (!section || !stage || reduced) return

    const chapter = chapterOf(id)
    const total = chapterLength(chapter)
    const first = SHOTS.findIndex((s) => s.chapter === id)

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            if (!self.isActive) return
            const time = self.progress * total
            let index = first
            for (let i = 0; i < chapter.shots.length; i++) {
              if (time >= SHOTS[first + i].start - 0.02) index = first + i
            }
            film.setActive(index)
          },
        },
      })

      chapter.shots.forEach((shot, i) => {
        const global = first + i
        const t = SHOTS[global].start
        const el = stage.querySelector<HTMLElement>(`[data-shot="${shot.id}"]`)!
        const prev = global > 0 ? stage.querySelector<HTMLElement>(`[data-shot="${SHOTS[global - 1].shot.id}"]`) : null
        const T = Math.min(0.3, shot.length * 0.24)
        const cam = el.querySelector('.shot__cam')

        // The camera keeps drifting through the next shot's transition, like a real cut.
        tl.fromTo(cam, camVars(shot.camera.from), { ...camVars(shot.camera.to), duration: shot.length + T, ease: 'sine.inOut' }, t)
        shot.layers.forEach((layer, l) => {
          if (!layer.move) return
          const target = el.querySelectorAll('.shot__cam > *')[l].querySelector('.cut__move')
          tl.fromTo(target, layerVars(layer.move.from), { ...layerVars(layer.move.to), duration: shot.length + T, ease: 'sine.inOut' }, t)
        })
        if (global > 0) transitionIn(tl, shot, el, prev, t, T)
        effects(tl, el, t, shot.length)
      })

      section.querySelectorAll<HTMLElement>('[data-in]').forEach((caption) => {
        const inAt = Number(caption.dataset.in)
        const outAt = caption.dataset.out ? Number(caption.dataset.out) : null
        const title = caption.dataset.cap === 'title'
        if (inAt >= 0) {
          tl.fromTo(
            caption,
            title ? { autoAlpha: 0, scale: 1.06, filter: 'blur(14px)' } : { autoAlpha: 0, y: 26 },
            { autoAlpha: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 0.16, ease: 'power2.out' },
            inAt,
          )
        }
        if (outAt !== null) tl.to(caption, { autoAlpha: 0, y: -18, duration: 0.12, ease: 'power1.in' }, outAt)
      })

      tl.set({}, {}, total)
    }, section)

    return () => ctx.revert()
  }, [id, reduced])

  return ref
}
