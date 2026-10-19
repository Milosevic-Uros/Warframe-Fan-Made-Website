import { OFFICIAL_SITE } from '../story/scenes'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>
        Unofficial, non-commercial fan project. Not affiliated with, endorsed or sponsored by Digital
        Extremes Ltd. Warframe and related names are trademarks of Digital Extremes Ltd. Imagery from the
        official Warframe Fan Kit © Digital Extremes Ltd., used under their fan content policy.
      </p>
      <p>
        Official game: <a href={OFFICIAL_SITE}>warframe.com</a>
      </p>
    </footer>
  )
}
