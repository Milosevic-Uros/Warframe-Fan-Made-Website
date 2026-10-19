import type { ReactNode, Ref } from 'react'
import { sceneMeta, type SceneId } from '../story/scenes'

type StorySectionProps = {
  id: SceneId
  className?: string
  ref?: Ref<HTMLElement>
  children: ReactNode
}

/** Shared scene shell: id for navigation, heading association and scene metadata. */
export function StorySection({ id, className = '', ref, children }: StorySectionProps) {
  return (
    <section
      id={id}
      ref={ref}
      className={`scene scene--${id} ${className}`}
      aria-labelledby={`${id}-title`}
      data-scene={sceneMeta(id).index}
    >
      {children}
    </section>
  )
}

/** Small "04 — Warframes" label that opens each scene. */
export function SceneLabel({ id, className = '' }: { id: SceneId; className?: string }) {
  const { index, label } = sceneMeta(id)
  return (
    <p className={`label scene__index ${className}`}>
      <span className="label--cyan">{index}</span>
      <span>{label}</span>
    </p>
  )
}
