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
 * Apply the lazy-loading attribute to an <img> element if not already set.
 *
 * @param {HTMLImageElement} img
 */
export function setLazyload(img) {
  try {
    if (img && img.getAttribute && !img.getAttribute('loading')) {
      img.setAttribute('loading', 'lazy')
    }
  } catch (_) { }
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
    // ignore
  }
}

// make `safe` available globally in test environments that call it
// without importing (some tests expect a global helper). Attach to
// `globalThis` when available.
try {
  if (typeof globalThis !== 'undefined' && !globalThis.safe) globalThis.safe = safe
} catch (_) { }
