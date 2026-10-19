/**
 * Facts verified against wiki.warframe.com (Oct 2026):
 * - Excalibur, Mag and Volt are the three starter Warframes.
 * - Each Prime variant keeps the base frame's four abilities.
 * - Excalibur Prime was a Founders-program exclusive (program closed Nov 2013).
 * - Mag Prime was the first female Prime Warframe.
 * - Volt Prime uses a unique black-and-yellow scheme instead of the white-and-olive Prime look.
 * Everything else here is atmospheric fan copy.
 */
export type FrameVariant = 'excalibur' | 'mag' | 'volt'

export type Warframe = {
  id: FrameVariant
  name: string
  epithet: string
  description: string
  note: string
  abilities: readonly [string, string, string, string]
  accent: string
}

export const WARFRAMES: readonly Warframe[] = [
  {
    id: 'excalibur',
    name: 'Excalibur Prime',
    epithet: 'The blade, gilded',
    description:
      'A master of the sword, rebuilt in Orokin gold. Speed and steel answer before the enemy can.',
    note: 'Founders exclusive — no longer obtainable.',
    abilities: ['Slash Dash', 'Radial Blind', 'Radial Javelin', 'Exalted Blade'],
    accent: 'var(--gold)',
  },
  {
    id: 'mag',
    name: 'Mag Prime',
    epithet: 'Fields that bend',
    description:
      'Magnetic force shaped into crowd control, pulling enemies close and stripping their defences.',
    note: 'The first female Prime Warframe.',
    abilities: ['Pull', 'Magnetize', 'Polarize', 'Crush'],
    accent: 'var(--crimson)',
  },
  {
    id: 'volt',
    name: 'Volt Prime',
    epithet: 'Lightning, refined',
    description:
      'Electricity runs through every motion. Shields of current, bursts of speed, a field that arcs outward.',
    note: 'Black and yellow — a break from the white-and-olive Primes before it.',
    abilities: ['Shock', 'Speed', 'Electric Shield', 'Discharge'],
    accent: 'var(--cyan)',
  },
]
