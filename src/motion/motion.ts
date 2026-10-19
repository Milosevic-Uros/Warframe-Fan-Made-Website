import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Shared timing tokens, in seconds (mirrors --dur-* in tokens.css). */
export const DURATION = {
  micro: 0.2,
  reveal: 0.7,
  cinematic: 1.2,
} as const

export const EASE = {
  out: 'power3.out',
  inOut: 'power2.inOut',
  expo: 'expo.out',
} as const

export const MEDIA = {
  tablet: '(min-width: 768px)',
  desktop: '(min-width: 1024px)',
} as const

gsap.defaults({ ease: EASE.out, duration: DURATION.reveal })

// Mobile browsers resize the viewport when the URL bar shows/hides; ignore that to avoid jumps.
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger }
