// generic helpers reused throughout the codebase

/**
 * Return true if the href points to an external or special link.  This
 * matches absolute URLs and mailto/tel schemes.
 *
 * @param {string} href
 * @returns {boolean}
 */
export function isExternalLink(href) {
  if (!href || typeof href !== 'string') return false
  return /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')
}

/**
 * Normalize a path by stripping leading dots and slashes.  Useful for
 * converting user-supplied paths into canonical relative identifiers.
 *
 * @param {string} p
 * @returns {string}
 */
export function normalizePath(p) {
  return String(p || '').replace(/^[.\/]+/, '')
}

/**
 * Remove one or more trailing slashes from a URL or path.  This is handy
 * when composing base paths to avoid the dreaded `//` sequence.
 *
 * @param {string} u
 * @returns {string}
 */
export function trimTrailingSlash(u) {
  return String(u || '').replace(/\/+$/, '')
}

/**
 * Ensure the given URL/path ends with a single slash.  This wraps
 * `trimTrailingSlash` and appends '/'.
 *
 * @param {string} u
 * @returns {string}
 */
export function ensureTrailingSlash(u) {
  return trimTrailingSlash(u) + '/'
}

/**
 * Apply the lazy-loading attribute to an <img> element if not already set.
 *
 * @param {HTMLImageElement} img
 */
export function setLazyload(img) {
  try {
    if (img && img.getAttribute && !img.getAttribute('loading')) {
      img.setAttribute('loading', 'lazy')
    }
  } catch (err) { console.warn('[helpers] setLazyload failed', err) }
}

/**
 * Join multiple path segments ensuring there is exactly one slash between
 * them and no leading/trailing slashes on the result (unless the first
 * segment starts with a slash, in which case the result is absolute).
 * Similar to `path.posix.join` but for URL-like paths.
 *
 * @param {...string} parts
 * @returns {string}
 */
export function joinPaths(...parts) {
  if (!parts || parts.length === 0) return ''
  const segs = parts.map(p => String(p || ''))
    .filter(p => p !== '')
    .map((p, i) => {
      if (i === 0) return p.replace(/\/+$|(?<!^)\/+/g, '') // trim trailing but keep leading
      return p.replace(/^\/+|\/+$/g, '')
    })
  let joined = segs.join('/')
  // if first part started with slash, make absolute
  if (String(parts[0] || '').startsWith('/')) {
    if (!joined.startsWith('/')) joined = '/' + joined
  }
  return joined
}

/**
 * Safely encode a URL or URL component using encodeURI.  Falls back to the
 * original string if encoding fails.
 *
 * @param {string} u
 * @returns {string}
 */
export function encodeURL(u) {
  try {
    const s = String(u || '')
    // if the string already contains percent escapes, avoid double-encoding
    if (s.includes('%')) return s
    return encodeURI(s)
  } catch (_) {
    return String(u || '')
  }
}

/**
 * Execute the given function and silently ignore any exceptions.  Returns
 * the result of `fn` or `undefined` if an error occurred.  Useful for
 * replacing frequent `try { ... } catch (_) {}` patterns.
 *
 * @param {Function} fn
 * @returns {any}
 */
export function safe(fn) {
  try {
    return fn()
  } catch (_e) {
    console.warn('[helpers] safe swallowed error', _e)
  }
}

// make `safe` available globally in test environments that call it
// without importing (some tests expect a global helper). Attach to
// `globalThis` when available.
try {
  if (typeof globalThis !== 'undefined' && !globalThis.safe) globalThis.safe = safe
} catch (err) { console.warn('[helpers] global attach failed', err) }
