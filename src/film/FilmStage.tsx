import type { CSSProperties } from 'react'
import { SHOTS, srcSet, type Layer } from './film'
import { Fx } from './Fx'
import { Particles } from './Particles'
import { useLoadedShots } from './useFilm'
import './film.css'

function Plate({ layer, load, eager }: { layer: Layer; load: boolean; eager: boolean }) {
  if (layer.kind === 'cut') {
    const box = layer.box!
    return (
      <div className="cut" style={{ left: box.left, top: box.top, height: box.height }}>
        <div className="cut__move">
          <picture>
            {load && <source media="(max-width: 760px), (max-height: 760px)" srcSet={`/media/${layer.media}-900h.webp`} />}
            <img className="layer layer--cut" src={load ? `/media/${layer.media}-1600h.webp` : undefined} alt="" decoding="async" />
          </picture>
        </div>
      </div>
    )
  }
  const style: CSSProperties = { objectPosition: layer.focus, filter: layer.filter }
  if (layer.aspect) style.width = `max(100%, ${layer.aspect * 100}vh)`
  return (
    <img
      className={`layer layer--bg${layer.aspect ? ' layer--wide' : ''}`}
      src={load ? `/media/${layer.media}-1280w.webp` : undefined}
      srcSet={load ? srcSet(layer) : undefined}
      sizes={layer.aspect ? `${Math.round(layer.aspect * 100)}vh` : '100vw'}
      style={style}
      alt=""
      decoding="async"
      fetchPriority={eager ? 'high' : 'auto'}
    />
  )
}

/**
 * The film itself: one fixed stage holding every shot of the story, stacked in order.
 * Chapter timelines (useChapter) cut between them as the visitor scrolls. Purely visual —
 * the story text lives in the chapters, so the whole stage is hidden from assistive tech.
 */
export function FilmStage() {
  const loaded = useLoadedShots()
  return (
    <div className="film" aria-hidden="true">
      {SHOTS.map(({ shot, chapter }, i) => (
        <div key={shot.id} className={`shot${i === 0 ? ' shot--first' : ''}`} data-shot={shot.id} data-chapter={chapter} style={{ zIndex: i + 1 }}>
          <div className="shot__cam">
            {shot.layers.map((layer, l) => (
              <Plate key={l} layer={layer} load={loaded[i]} eager={i === 0} />
            ))}
          </div>
          {shot.fx?.map((name) => <Fx key={name} name={name} origin={shot.origin ?? [50, 50]} shotIndex={i} />)}
          <div className="shot__shade" />
          <div className="shot__streak" />
          <div className="shot__flash" />
        </div>
      ))}
      <Particles />
      <div className="film__vignette" />
      <div className="film__bar film__bar--top" />
      <div className="film__bar film__bar--bottom" />
    </div>
  )
}
