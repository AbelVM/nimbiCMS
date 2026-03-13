import 'bulma/css/bulma.min.css'
// project-specific extra rules that should override/augment Bulma
import './styles/nimbi-cms-extra.css'

// track current theme style for Bulma overrides
/** @type {'light'|'dark'} */
let currentStyle = 'light'

/**
 * @typedef {Record<string,string>} ThemeVars
 */

/**
 * Insert a stylesheet link into the document head if not already present.
 * @param {string} href
 * @param {Record<string,string>} [attrs]
 * @returns {void}
 */
function injectLink(href, attrs = {}) {
  if (document.querySelector(`link[href="${href}"]`)) return
  const l = document.createElement('link')
  l.rel = 'stylesheet'
  l.href = href 
  Object.entries(attrs).forEach(([k, v]) => l.setAttribute(k, v))
  document.head.appendChild(l)
}
/**
 * Ensure that Bulma or a Bulmaswatch theme is loaded.  Supports local
 * overrides or named themes fetched from unpkg.
 *
 * @param {string} bulmaCustomize
 * @param {string} pageDir
 * @returns {Promise<void>}
 */
export async function ensureBulma(bulmaCustomize = 'none', pageDir = '/') {
  if (!bulmaCustomize || bulmaCustomize === 'none') return

  const rawLocalCandidates = [pageDir + 'bulma.css', '/bulma.css']
  const localCandidates = Array.from(new Set(rawLocalCandidates))

  if (bulmaCustomize === 'local') {
    if (document.querySelector('style[data-bulma-override]')) return
    for (const p of localCandidates) {
      try {
        const res = await fetch(p, { method: 'GET' })
        if (res.ok) {
          const css = await res.text()
          const s = document.createElement('style')
          s.setAttribute('data-bulma-override', p)
          s.appendChild(document.createTextNode(`\n/* bulma override: ${p} */\n` + css))
          document.head.appendChild(s)
          return
        }
      } catch (_) { console.warn('[bulmaManager] fetch local bulma candidate failed', _) }
    }
    return
  }

  try {
    const theme = String(bulmaCustomize).trim()
    if (!theme) return
    const href = `https://unpkg.com/bulmaswatch/${encodeURIComponent(theme)}/bulmaswatch.min.css`
    injectLink(href, { 'data-bulmaswatch-theme': theme })
  } catch (_) { console.warn('[bulmaManager] ensureBulma failed', _) }
}

/**
 * Toggle light/dark styling by setting `data-theme` and `is-dark`.
 *
 * @param {'light'|'dark'} style
 * @returns {void}
 */
export function setStyle(style) {
  currentStyle = style === 'dark' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', currentStyle)
  if (currentStyle === 'dark') document.body.classList.add('is-dark')
  else document.body.classList.remove('is-dark')
}

/**
 * Apply an object of CSS custom properties to the document root. This makes
 * it easy for consumers to theme colors/fonts/etc. without touching Bulma
 * directly. Property names should be provided without the leading `--`.
 *
 * @param {Record<string,string>} vars
 * @returns {void}
 */
export function setThemeVars(vars) {
  const root = document.documentElement
  for (const [k, v] of Object.entries(vars || {})) {
    try { root.style.setProperty(`--${k}`, v) } catch (_) { console.warn('[bulmaManager] setThemeVars failed for', k, _ ) }
  }
}
