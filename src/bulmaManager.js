import 'bulma/css/bulma.min.css'
import './styles/nimbi-cms-extra.css'

/** @type {'light'|'dark'|'system'} */
let currentStyle = 'light'

/**
 * @typedef {Record<string,string>} ThemeVars
 */

/**
 * Insert a stylesheet link into the document head if not already present.
 * @param {string} href - stylesheet URL to insert
 * @param {Record<string,string>} [attrs] - optional attributes to set on the link element
 * @returns {void} - No return value.
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
 * @param {string} bulmaCustomize - 'none' | 'local' | theme name to load from unpkg
 * @param {string} pageDir - directory to probe for a local `bulma.css` when using 'local'
 * @returns {Promise<void>} - Promise that resolves when theme loading completes.
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
 * Toggle theme styling by setting `data-theme` on each `.nimbi-mount`
 * container. There are three recognized theme values:
 * - `light`: explicitly apply light theme (sets `data-theme="light"`).
 * - `dark`: explicitly apply dark theme (sets `data-theme="dark"`).
 * - `system`: follow the system/OS preference; implementation removes any
 *   explicit `data-theme` attribute so user agent or CSS using
 *   `prefers-color-scheme` can take effect.
 *
 * When no `.nimbi-mount` elements are present the same attribute is
 * applied to `document.documentElement` to support global/UMD usage.
 *
 * @param {'light'|'dark'|'system'} style - chosen theme mode.
 * @returns {void}
 */
export function setStyle(style) {
  currentStyle = style === 'dark' ? 'dark' : style === 'system' ? 'system' : 'light'
  try {
    const mounts = Array.from(document.querySelectorAll('.nimbi-mount'))
    if (mounts.length > 0) {
      for (const m of mounts) {
        if (currentStyle === 'dark') m.setAttribute('data-theme', 'dark')
        else if (currentStyle === 'light') m.setAttribute('data-theme', 'light')
        else m.removeAttribute('data-theme')
      }
    } else {
      const root = document.documentElement
      if (currentStyle === 'dark') root.setAttribute('data-theme', 'dark')
      else if (currentStyle === 'light') root.setAttribute('data-theme', 'light')
      else root.removeAttribute('data-theme')
    }
  } catch (e) { /* ignore */ }
}

/**
 * Apply an object of CSS custom properties to the document root. This makes
 * it easy for consumers to theme colors/fonts/etc. without touching Bulma
 * directly. Property names should be provided without the leading `--`.
 *
 * @param {Record<string,string>} vars - Map of CSS variable names (without `--`) to values.
 * @returns {void} - No return value.
 */
/**
 * Apply CSS custom properties to the document root (keys without `--`).
 * @param {Record<string,string>} vars - Map of CSS variable names (without `--`) to values.
 * @returns {void} - No return value.
 */
export function setThemeVars(vars) {
  const root = document.documentElement
  for (const [k, v] of Object.entries(vars || {})) {
    try { root.style.setProperty(`--${k}`, v) } catch (_) { console.warn('[bulmaManager] setThemeVars failed for', k, _ ) }
  }
}

/**
 * Register an element so it follows the current Bulma light/dark/system theme.
 * Returns an unregister function to stop observing theme changes.
 * @param {HTMLElement} el
 * @returns {() => void}
 */
export function registerThemedElement(el) {
  if (!el || !(el instanceof HTMLElement)) return () => {}
  // Find the nearest mount; prefer `.nimbi-mount` so Bulma's styles
  // propagate naturally from the container.
  const mount = (el.closest && el.closest('.nimbi-mount')) || null
  try {
    if (mount) {
      if (currentStyle === 'dark') mount.setAttribute('data-theme', 'dark')
      else if (currentStyle === 'light') mount.setAttribute('data-theme', 'light')
      else mount.removeAttribute('data-theme')
    }
  } catch (_) { /* ignore */ }
  // No ongoing observation required; attribute on the mount propagates.
  return () => {}
}
