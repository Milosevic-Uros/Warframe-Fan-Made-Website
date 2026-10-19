// Builds optimized, colour-graded WebP media for the scroll film from the official Fan Kit.
// Usage: npm run media   (requires raw/fankit — see README → Media)
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpeg from 'ffmpeg-static'

const root = fileURLToPath(new URL('..', import.meta.url))
const manifest = JSON.parse(readFileSync(join(root, 'scripts/media.manifest.json'), 'utf8'))
const source = join(root, manifest.source)
const out = join(root, 'public/media')
mkdirSync(out, { recursive: true })

if (!existsSync(source)) {
  console.error(`Missing ${source}. Download and unzip the official Warframe Fan Kit there first.`)
  process.exit(1)
}

// One shared grade so every source reads as the same film: lifted blacks, cool shadows, warm highlights.
const GRADE = 'eq=contrast=1.07:saturation=0.94:gamma=0.97,colorbalance=rs=-0.03:gs=0:bs=0.04:rh=0.04:gh=0.01:bh=-0.03'

const sizes = {}
function encode(name, input, filters, variants, alpha) {
  sizes[name] = []
  for (const [label, scale] of variants) {
    const file = `${name}-${label}.webp`
    const vf = [...filters, scale, alpha ? 'format=yuva420p' : 'format=yuv420p'].filter(Boolean).join(',')
    execFileSync(ffmpeg, ['-v', 'error', '-y', '-i', input, '-vf', vf, '-frames:v', '1', '-c:v', 'libwebp', '-quality', alpha ? '82' : '78', '-compression_level', '6', join(out, file)])
    const kb = Math.round(statSync(join(out, file)).size / 1024)
    sizes[name].push({ file, label, kb })
    console.log(`${file.padEnd(36)} ${kb} KB`)
  }
}

for (const [name, item] of Object.entries(manifest.backgrounds.items)) {
  const widths = item.widths ?? manifest.backgrounds.widths
  const filters = [item.crop && `crop=${item.crop}`, GRADE]
  encode(name, join(source, item.file), filters, widths.map((w) => [`${w}w`, `scale=${w}:-2:flags=lanczos`]), false)
}

for (const [name, item] of Object.entries(manifest.cutouts.items)) {
  const heights = item.heights ?? manifest.cutouts.heights
  encode(name, join(source, item.file), [], heights.map((h) => [`${h}h`, `scale=-2:'min(${h},ih)':flags=lanczos`]), true)
}

writeFileSync(join(out, 'sizes.json'), JSON.stringify(sizes, null, 2))
