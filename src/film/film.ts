import type { SceneId } from '../story/scenes'

/*
 * The shot list. Every chapter of the story is a sequence of shots; scrolling through a
 * chapter plays its shots like a film edit. Lengths are in viewport-heights of scrolling.
 * All imagery comes from the official Warframe Fan Kit (see scripts/media.manifest.json).
 */

/** Camera framing: scale and offset (percent of the frame). */
export type Cam = { s?: number; x?: number; y?: number; r?: number }

export type Layer = {
  /** Media name in public/media (see the manifest). */
  media: string
  kind: 'bg' | 'cut'
  /** object-position for backgrounds — keeps the subject in frame on narrow screens. */
  focus?: string
  /** Cut-outs: CSS box (left/top/width/height) inside the frame. */
  box?: { left: string; top: string; height: string }
  /** Extra layer motion across the shot, on top of the camera. */
  move?: { from: Cam; to: Cam }
  /** Static CSS filter, e.g. a defocused backplate. */
  filter?: string
  /** Wider-than-frame plate (for pans), as width relative to the frame height. */
  aspect?: number
}

export type Transition = 'cut' | 'fade' | 'flash' | 'whip' | 'iris' | 'wipe' | 'push'
export type Fx = 'mist' | 'glow' | 'sweep' | 'slash' | 'rings' | 'lightning' | 'speed' | 'flare'
export type Particles = 'none' | 'dust' | 'snow' | 'embers' | 'spores'

export type Shot = {
  id: string
  layers: Layer[]
  camera: { from: Cam; to: Cam }
  length: number
  transition: Transition
  /** Where the iris / glow centres (percent). */
  origin?: [number, number]
  fx?: Fx[]
  particles?: Particles
}

export type Chapter = { id: SceneId; shots: Shot[] }

const bg = (media: string, extra: Partial<Layer> = {}): Layer => ({ media, kind: 'bg', ...extra })
const cut = (media: string, box: Layer['box'], extra: Partial<Layer> = {}): Layer => ({ media, kind: 'cut', box, ...extra })

export const FILM: Chapter[] = [
  {
    id: 'awakening',
    shots: [
      {
        id: 'orbit',
        layers: [bg('orbit', { focus: '50% 62%' })],
        camera: { from: { s: 1.06, y: 1 }, to: { s: 1.3, y: -3 } },
        length: 1.1,
        transition: 'cut',
        fx: ['mist', 'flare'],
        origin: [62, 38],
        particles: 'dust',
      },
      {
        id: 'pod',
        layers: [
          bg('orbit', { focus: '50% 70%', filter: 'blur(18px) brightness(0.35) saturate(0.8)' }),
          cut('cryopod', { left: '50%', top: '52%', height: '64%' }, { move: { from: { s: 0.86, r: -6 }, to: { s: 1.08, r: -2 } } }),
        ],
        camera: { from: { s: 1.02 }, to: { s: 1.12 } },
        length: 1.1,
        transition: 'fade',
        fx: ['glow', 'mist'],
        origin: [50, 52],
        particles: 'dust',
      },
    ],
  },
  {
    id: 'void',
    shots: [
      {
        id: 'ruins',
        layers: [bg('moon-ruins', { focus: '55% 60%' })],
        camera: { from: { s: 1.16, x: 4 }, to: { s: 1.22, x: -4 } },
        length: 1,
        transition: 'flash',
        particles: 'dust',
        fx: ['mist'],
      },
      {
        id: 'asteroids',
        layers: [
          bg('asteroids', { focus: '50% 50%' }),
          cut('xiphos', { left: '50%', top: '50%', height: '46%' }, { move: { from: { x: -95, y: 18, s: 0.55, r: 8 }, to: { x: 85, y: -14, s: 1.25, r: -4 } } }),
        ],
        camera: { from: { s: 1.12, x: -2 }, to: { s: 1.2, x: 3 } },
        length: 1,
        transition: 'whip',
        particles: 'dust',
      },
      {
        id: 'earth',
        layers: [
          bg('moon-earth', { focus: '70% 45%' }),
          cut('archwing', { left: '50%', top: '50%', height: '30%' }, { move: { from: { x: 70, y: -40, s: 0.35, r: -18 }, to: { x: -40, y: 18, s: 1.6, r: -6 } } }),
        ],
        camera: { from: { s: 1.08 }, to: { s: 1.32, x: -6, y: 2 } },
        length: 1.1,
        transition: 'fade',
        fx: ['sweep'],
        particles: 'dust',
      },
    ],
  },
  {
    id: 'tenno',
    shots: [
      {
        id: 'doorway',
        layers: [bg('doorway', { focus: '58% 45%' })],
        camera: { from: { s: 1.05 }, to: { s: 2.1, x: -8, y: 4 } },
        length: 1.1,
        transition: 'iris',
        origin: [58, 45],
        fx: ['glow'],
        particles: 'dust',
      },
      {
        id: 'reveal',
        layers: [
          bg('doorway', { focus: '58% 45%', filter: 'blur(14px) brightness(0.55) saturate(1.1)' }),
          cut('excalibur-prime-render', { left: '64%', top: '54%', height: '86%' }, { move: { from: { s: 1.18, y: 4 }, to: { s: 1, y: 0 } } }),
        ],
        camera: { from: { s: 1.06 }, to: { s: 1.0 } },
        length: 1.3,
        transition: 'flash',
        origin: [62, 45],
        fx: ['sweep', 'mist'],
        particles: 'dust',
      },
    ],
  },
  {
    id: 'warframes',
    shots: [
      {
        id: 'excalibur',
        layers: [bg('excalibur-prime', { focus: '62% 28%' })],
        camera: { from: { s: 1.08, x: 2 }, to: { s: 1.0, x: -1 } },
        length: 1.2,
        transition: 'wipe',
        fx: ['slash'],
        particles: 'dust',
      },
      {
        id: 'mag',
        layers: [bg('mag-prime', { focus: '62% 45%' })],
        camera: { from: { s: 1.2, x: -3 }, to: { s: 1.06, x: 2 } },
        length: 1.2,
        transition: 'whip',
        origin: [60, 46],
        fx: ['rings'],
        particles: 'dust',
      },
      {
        id: 'volt',
        layers: [bg('volt-prime', { focus: '55% 40%' })],
        camera: { from: { s: 1.22, y: 3 }, to: { s: 1.06, y: -1 } },
        length: 1.2,
        transition: 'whip',
        origin: [48, 40],
        fx: ['lightning'],
        particles: 'embers',
      },
    ],
  },
  {
    id: 'worlds',
    shots: [
      {
        id: 'plains',
        layers: [bg('plains', { focus: '40% 50%' })],
        camera: { from: { s: 1.18, x: 5 }, to: { s: 1.1, x: -5 } },
        length: 1.15,
        transition: 'iris',
        origin: [82, 18],
        particles: 'dust',
        fx: ['flare'],
      },
      {
        id: 'vallis',
        layers: [bg('vallis', { focus: '65% 50%' })],
        camera: { from: { s: 1.1, x: -4 }, to: { s: 1.24, x: 4, y: -2 } },
        length: 1.15,
        transition: 'wipe',
        particles: 'snow',
      },
      {
        id: 'cambion',
        layers: [bg('cambion', { focus: '30% 50%' })],
        camera: { from: { s: 1.24, x: 4 }, to: { s: 1.08, x: -3 } },
        length: 1.15,
        transition: 'iris',
        origin: [30, 40],
        particles: 'spores',
        fx: ['mist'],
      },
    ],
  },
  {
    id: 'conflict',
    shots: [
      {
        id: 'battle',
        layers: [bg('battle-wide', { aspect: 1.95, focus: '50% 50%' })],
        camera: { from: { s: 1.06, x: 22 }, to: { s: 1.14, x: -22 } },
        length: 1.5,
        transition: 'flash',
        particles: 'embers',
      },
      { id: 'grineer', layers: [bg('grineer', { focus: '30% 60%' })], camera: { from: { s: 1.25 }, to: { s: 1.08, x: 2 } }, length: 0.8, transition: 'whip', particles: 'embers' },
      { id: 'corpus', layers: [bg('corpus', { focus: '50% 40%' })], camera: { from: { s: 1.25, x: -3 }, to: { s: 1.08, x: 2 } }, length: 0.8, transition: 'whip', particles: 'embers' },
      { id: 'infested', layers: [bg('infested', { focus: '60% 50%' })], camera: { from: { s: 1.22, x: 3 }, to: { s: 1.06 } }, length: 0.8, transition: 'whip', particles: 'spores' },
      { id: 'speed', layers: [bg('speed', { focus: '50% 45%' })], camera: { from: { s: 1.0 }, to: { s: 1.3 } }, length: 1, transition: 'push', fx: ['speed'], particles: 'embers' },
    ],
  },
  {
    id: 'resolve',
    shots: [
      {
        id: 'orbiter',
        layers: [bg('orbiter', { focus: '60% 50%' })],
        camera: { from: { s: 1.25, y: 3 }, to: { s: 1.05, y: 0 } },
        length: 1.4,
        transition: 'fade',
        particles: 'dust',
        fx: ['mist'],
      },
    ],
  },
]

export const chapterLength = (chapter: Chapter) => chapter.shots.reduce((sum, shot) => sum + shot.length, 0)

/** Every shot in story order, with its chapter and start time inside the chapter. */
export const SHOTS = FILM.flatMap((chapter) => {
  let t = 0
  return chapter.shots.map((shot) => {
    const entry = { shot, chapter: chapter.id, start: t }
    t += shot.length
    return entry
  })
})

export const chapterOf = (id: SceneId) => FILM.find((chapter) => chapter.id === id)!

/** srcset for a background plate (sizes are generated by scripts/build-media.mjs). */
export function srcSet(layer: Layer) {
  if (layer.media === 'battle-wide') return '/media/battle-wide-1920w.webp 1920w, /media/battle-wide-3600w.webp 3600w'
  return `/media/${layer.media}-1280w.webp 1280w, /media/${layer.media}-2400w.webp 2400w`
}
