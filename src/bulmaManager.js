// Bulma CSS and project extras are injected dynamically at runtime
// to avoid importing non-JS assets during Node-based tests.

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

  // If this link is a theme override, keep it last so it can override
  // earlier Bulma styles that may be injected later (e.g., by bundler).
  if (attrs['data-bulmaswatch-theme']) {
    // Keep the theme link last in <head>. Use a guarded MutationObserver
    // that will re-append the theme link when other styles are injected,
    // but avoid tight re-append loops by tracking a per-link move count
    // and temporarily disconnecting while we adjust the DOM.
    try {
      if (l.getAttribute('data-bulmaswatch-observer')) return
      let moveCount = Number(l.getAttribute('data-bulmaswatch-move-count') || 0)
      let moving = false
      const observer = new MutationObserver(() => {
        try {
          if (moving) return
          const parent = l.parentNode
          if (!parent) return
          const last = parent.lastElementChild
          if (last === l) return
          if (moveCount >= 1000) {
            // safety guard: give up after a very high number of moves
            l.setAttribute('data-bulmaswatch-move-stopped', '1')
            return
          }
          moving = true
          try { parent.appendChild(l) } catch (e) { /* ignore */ }
          moveCount += 1
          l.setAttribute('data-bulmaswatch-move-count', String(moveCount))
          moving = false
        } catch (e) { /* ignore */ }
      })
      try {
        observer.observe(document.head, { childList: true })
        l.setAttribute('data-bulmaswatch-observer', '1')
        l.setAttribute('data-bulmaswatch-move-count', String(moveCount))
      } catch (e) { /* ignore */ }
      // Ensure it's at the end now once
      const parent = document.head
      if (parent && parent.lastElementChild !== l) parent.appendChild(l)
    } catch (e) {
      // ignore
    }
  }
}

async function ensureBaseBulma() {
  // Try local copies first (served by the dev server), then fallback to CDN.
  const localCandidates = ['/dist/bulma.min.css', '/dist/bulma.css', '/bulma.css']
  for (const p of localCandidates) {
    try {
      // Use HEAD where supported to avoid downloading full CSS just to test.
      const res = await fetch(p, { method: 'HEAD' })
      if (res && res.ok) {
        if (!document.querySelector(`link[href="${p}"]`)) {
          const l = document.createElement('link')
          l.rel = 'stylesheet'
          l.href = p
          l.setAttribute('data-bulma-base', '1')
          // Insert before our bundle if present
          const ourCss = document.querySelector('link[href*="/dist/nimbi-cms.css"], link[href*="dist/nimbi-cms.css"]')
          if (ourCss && ourCss.parentNode) ourCss.parentNode.insertBefore(l, ourCss)
          else document.head.appendChild(l)
        }
        return
      }
    } catch (e) {
      // ignore and try next
    }
  }

  // Fallback to CDN (protocol-relative to match page protocol)
  try {
    const href = (location && location.protocol && location.protocol === 'file:') ? 'https://unpkg.com/bulma/css/bulma.min.css' : '//unpkg.com/bulma/css/bulma.min.css'
    if (!document.querySelector(`link[href="${href}"]`)) {
      const l = document.createElement('link')
      l.rel = 'stylesheet'
      l.href = href
      l.setAttribute('data-bulma-base', '1')
      const ourCss = document.querySelector('link[href*="/dist/nimbi-cms.css"], link[href*="dist/nimbi-cms.css"]')
      if (ourCss && ourCss.parentNode) ourCss.parentNode.insertBefore(l, ourCss)
      else document.head.appendChild(l)
    }
  } catch (e) { /* ignore */ }
}

function removeThemeAndOverrides() {
  try {
    const themeLinks = Array.from(document.querySelectorAll('link[data-bulmaswatch-theme]'))
    for (const tl of themeLinks) if (tl && tl.parentNode) tl.parentNode.removeChild(tl)
  } catch (e) { /* ignore */ }
  try {
    const overrides = Array.from(document.querySelectorAll('style[data-bulma-override]'))
    for (const s of overrides) if (s && s.parentNode) s.parentNode.removeChild(s)
  } catch (e) { /* ignore */ }
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
  const debug = typeof window !== 'undefined' && window.__nimbiCMSDebug
  if (debug) {
    try {
      console.debug('[bulmaManager] ensureBulma called', { bulmaCustomize, pageDir })
    } catch (_) {}
  }

  if (!bulmaCustomize) return

  // When explicitly asked for 'none' we should ensure Bulma's base CSS is
  // present but remove any Bulmaswatch theme overrides so the default Bulma
  // look is used. This keeps the page layout functional when the user
  // chooses "None (default)" in the playground.
  if (bulmaCustomize === 'none') {
    try {
        // Inject base Bulma if not present. Insert it before our bundle CSS
        // (`dist/nimbi-cms.css`) so Bulma's base rules apply and our
        // component CSS can override them as needed.
        const candidates = [
          (location && location.protocol && location.protocol === 'file:') ? 'https://unpkg.com/bulma/css/bulma.min.css' : '//unpkg.com/bulma/css/bulma.min.css',
          'https://unpkg.com/bulma/css/bulma.min.css'
        ]
        let injected = false
        for (const href of candidates) {
          try {
            if (document.querySelector(`link[href="${href}"]`)) { injected = true; break }
          } catch (_) {}
        }
        if (!injected) {
          const href = candidates[0]
          const l = document.createElement('link')
          l.rel = 'stylesheet'
          l.href = href
          l.setAttribute('data-bulma-base', '1')
          // Prefer inserting before our dist css so Bulma is the foundation.
          const ourCss = document.querySelector('link[href*="/dist/nimbi-cms.css"], link[href*="dist/nimbi-cms.css"]')
          if (ourCss && ourCss.parentNode) ourCss.parentNode.insertBefore(l, ourCss)
          else document.head.appendChild(l)
        }
    } catch (e) { /* ignore */ }
    try {
      // Remove any Bulmaswatch theme links or local override styles so the
      // original Bulma styling takes effect.
      const themeLinks = Array.from(document.querySelectorAll('link[data-bulmaswatch-theme]'))
      for (const tl of themeLinks) {
        if (tl && tl.parentNode) tl.parentNode.removeChild(tl)
      }
    } catch (e) { /* ignore */ }
    try {
      const overrides = Array.from(document.querySelectorAll('style[data-bulma-override]'))
      for (const s of overrides) {
        if (s && s.parentNode) s.parentNode.removeChild(s)
      }
    } catch (e) { /* ignore */ }
    return
  }

  // (rate-limit guard removed)

  const rawLocalCandidates = [pageDir + 'bulma.css', '/bulma.css']
  const localCandidates = Array.from(new Set(rawLocalCandidates))

  if (bulmaCustomize === 'local') {
    // Remove any previous Bulmaswatch theme links so local override isn't
    // mixed with a previously loaded theme.
    removeThemeAndOverrides()
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
    // Remove any previously applied theme/overrides before injecting new theme
    removeThemeAndOverrides()
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
