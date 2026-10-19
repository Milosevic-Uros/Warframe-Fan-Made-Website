/** Narrative order of the page. Drives navigation, progress markers and section ids. */
export const SCENES = [
  { id: 'awakening', index: '01', label: 'Awakening' },
  { id: 'void', index: '02', label: 'The Void' },
  { id: 'tenno', index: '03', label: 'The Tenno' },
  { id: 'warframes', index: '04', label: 'Warframes' },
  { id: 'worlds', index: '05', label: 'Worlds' },
  { id: 'conflict', index: '06', label: 'Conflict' },
  { id: 'resolve', index: '07', label: 'Resolve' },
] as const

export type SceneId = (typeof SCENES)[number]['id']

export function sceneMeta(id: SceneId) {
  return SCENES.find((scene) => scene.id === id)!
}

export const OFFICIAL_SITE = 'https://www.warframe.com/'
