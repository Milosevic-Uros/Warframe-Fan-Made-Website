import { useEffect, useLayoutEffect } from 'react'
import { SiteFooter } from './components/SiteFooter'
import { SiteNavigation } from './components/SiteNavigation'
import { StoryProgress } from './components/StoryProgress'
import { Chapters } from './film/Chapters'
import { FilmStage } from './film/FilmStage'
import { ScrollTrigger } from './motion/motion'
import { useMotion } from './motion/MotionContext'
import { useActiveScene } from './story/useActiveScene'

export default function App() {
  const active = useActiveScene()
  const { reduced } = useMotion()

  // Chapters build their timelines in document order (child effects run first); re-measure
  // once all exist, whenever the motion mode flips (layouts differ), and after fonts settle.
  useLayoutEffect(() => {
    ScrollTrigger.refresh()
  }, [reduced])

  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to the story
      </a>
      <FilmStage />
      <div className="grain" aria-hidden="true" />
      <SiteNavigation active={active} />
      <StoryProgress active={active} />
      <main id="main">
        <Chapters />
      </main>
      <SiteFooter />
    </>
  )
}
