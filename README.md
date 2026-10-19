# Wake, Tenno — a fan-made scroll film

An unofficial, non-commercial, single-page story inspired by **Warframe**, told like a trailer:
every scroll moves the camera, cuts between shots and times the captions. No video plays — the
"film" is official key art and renders composited and animated live, frame by frame, with scroll.

Not affiliated with, endorsed or sponsored by Digital Extremes Ltd. Warframe and related names
are trademarks of Digital Extremes Ltd.

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check (tsc -b) + production build
npm run lint
npm run media    # rebuild public/media from the Fan Kit (see Media)
```

## How it works

- **Stack:** Vite + React 19 + TypeScript, GSAP + ScrollTrigger for all motion.
- **`src/film/film.ts`** — the shot list. Seven chapters (Awakening → Resolve), each a sequence of
  shots with image layers (backgrounds and transparent cut-outs), a camera move, effects and a
  transition (`flash`, `whip`, `iris`, `wipe`, `push`, `fade`).
- **`FilmStage`** — one fixed, letterboxed stage holding every shot; images load lazily in a
  window around the shot on screen.
- **`useChapter`** — builds each chapter's scroll-scrubbed timeline: camera push/pan, cut-out
  flight paths, transitions, effects (blade slash, magnetic rings, lightning, light sweeps, speed
  lines, flares) and captions timed with `data-in` / `data-out`.
- **`Chapters.tsx`** — the story text: semantic sections and headings, in order, readable by
  assistive tech and search engines; the stage itself is decorative (`aria-hidden`).

**Reduced motion** (OS setting or the in-page toggle) removes the film entirely and shows a plain
editorial page: every caption visible, one still per beat.

## Media

All imagery comes from the **official Warframe Fan Kit** published by Digital Extremes
([announcement](https://www.warframe.com/en/news/warframe-fansite-kit)), used non-commercially under
their [content policy](https://www.warframe.com/contentpolicy). Only logo-free images are used; the
Excalibur Prime key art is cropped clear of its logo. No game files were extracted or datamined.

- `raw/` (git-ignored) holds the unzipped Fan Kit.
- `scripts/media.manifest.json` lists exactly which files are used and how they are cropped.
- `scripts/build-media.mjs` grades every image with one shared colour grade (via `ffmpeg-static`)
  and writes responsive WebP to `public/media/` (≈6 MB total, loaded progressively).

To change a shot: add the source file to the manifest, run `npm run media`, then reference the
media name in `film.ts`.

## Facts

Verified against wiki.warframe.com and warframe.com (Oct 2026): the starter frames; Prime ability
sets; Excalibur Prime (Founders exclusive), Mag Prime (first female Prime), Volt Prime
(black-and-yellow scheme); the landscapes' planets and hubs; the faction summaries. Other lines are
atmospheric fan copy. CTA: https://www.warframe.com/.
