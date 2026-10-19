/**
 * Landscape names, planets and hubs verified against wiki.warframe.com (Oct 2026).
 * Descriptions are atmospheric fan copy.
 */
export type World = {
  id: 'plains' | 'vallis' | 'cambion'
  name: string
  planet: string
  hub: string
  line: string
}

export const WORLDS: readonly World[] = [
  {
    id: 'plains',
    name: 'Plains of Eidolon',
    planet: 'Earth',
    hub: 'Cetus',
    line: 'Wide grassland on the site of an ancient battle. When night falls, the plains change.',
  },
  {
    id: 'vallis',
    name: 'Orb Vallis',
    planet: 'Venus',
    hub: 'Fortuna',
    line: 'A mountain valley caught between frost and thaw, shaped by Corpus industry.',
  },
  {
    id: 'cambion',
    name: 'Cambion Drift',
    planet: 'Deimos',
    hub: 'Necralisk',
    line: 'Living ground on an infested moon. Warm, breathing, and wrong.',
  },
]
