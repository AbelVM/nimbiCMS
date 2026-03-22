/**
 * Utility helper functions used by the runtime.
 * @module utils/helpers
 */

/**
 * Return true if the href points to an external or special link.  This
 * matches absolute URLs and mailto/tel schemes.
 *
 * @param {string} href - URL or href string to evaluate
 * @returns {boolean}
 */
import { debugWarn } from './debug.js'

export function isExternalLink(href) {
  if (!href || typeof href !== 'string') return false
  return /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')
}

/**
 * Normalize a path by stripping leading dots and slashes.  Useful for
 * converting user-supplied paths into canonical relative identifiers.
 *
 * @param {string} p - input path to normalize (remove leading ./ or /)
 * @returns {string}
 */
export function normalizePath(p) {
  return String(p || '').replace(/^[.\/]+/, '')
}

/**
 * Remove one or more trailing slashes from a URL or path.  This is handy
 * when composing base paths to avoid the dreaded `//` sequence.
 *
 * @param {string} u - input path or URL to trim trailing slashes from
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
 * @param {HTMLImageElement} img - image element to mark for lazy loading
 * @returns {void}
 */
export function setLazyload(img) {
  try {
    if (img && img.getAttribute && !img.getAttribute('loading')) {
      img.setAttribute('loading', 'lazy')
    }
  } catch (err) { debugWarn('[helpers] setLazyload failed', err) }
}

/**
 * Add a preload link for an image URL to the document head.
 *
 * This is used to give browsers an early hint to fetch images that are
 * determined to be above-the-fold (eager) by `setEagerForAboveFoldImages`.
 *
 * @param {string} url - Absolute or relative URL to preload.
 * @returns {void}
 */
function preloadImage(url) {
  try {
    if (!url || typeof document === 'undefined' || !document.head) return
    if (url.startsWith('data:')) return
    const existing = document.head.querySelector(`link[rel="preload"][as="image"][href="${url}"]`)
    if (existing) return
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = url
    document.head.appendChild(link)
  } catch (err) {
    debugWarn('[helpers] preloadImage failed', err)
  }
}

/**
 * Mark images that are above the fold as eager and high priority.
 *
 * This runs in a best-effort fashion: it scans all images within `container`,
 * determines which ones appear (or will appear) within the visible portion of
 * the container, and applies `loading="eager"` + `fetchpriority="high"`.
 *
 * The function also defaults every image to `loading="lazy"` unless
 * otherwise marked eager.
 *
 * @param {HTMLElement} container - Root element containing the images.
 * @param {number} [marginPx=0] - Extra pixels past the visible bottom that should still be considered above-the-fold.
 * @param {boolean} [debug=false] - If true, logs debug info for each image.
 * @returns {void}
 */
export function setEagerForAboveFoldImages(container, marginPx = 0, debug = false) {
  try {
    if (typeof window === 'undefined' || !container || !container.querySelectorAll) return

    const imgs = Array.from(container.querySelectorAll('img'))
    if (!imgs.length) return

    const viewportEl = container
    const viewportRect = viewportEl && viewportEl.getBoundingClientRect ? viewportEl.getBoundingClientRect() : null

    const winTop = 0
    const winBottom = (typeof window !== 'undefined') ? (window.innerHeight || document.documentElement.clientHeight || 0) : 0

    const visibleTop = viewportRect ? Math.max(winTop, viewportRect.top) : winTop
    const visibleBottomBase = viewportRect ? Math.min(winBottom, viewportRect.bottom) : winBottom
    const visibleBottom = visibleBottomBase + Number(marginPx || 0)

    let viewportHeight = 0
    if (viewportEl) {
      viewportHeight = viewportEl.clientHeight || (viewportRect ? viewportRect.height : 0)
    }
    if (!viewportHeight) {
      viewportHeight = (winBottom - winTop)
    }

    let maxHeightRatio = 0.6
    try {
      const css = viewportEl && window.getComputedStyle ? window.getComputedStyle(viewportEl) : null
      const ratio = css && css.getPropertyValue('--nimbi-image-max-height-ratio')
      const parsed = ratio ? parseFloat(ratio) : NaN
      if (!Number.isNaN(parsed) && parsed > 0 && parsed <= 1) maxHeightRatio = parsed
    } catch (err) {
      debugWarn('[helpers] read CSS ratio failed', err)
    }

    const maxImageHeight = Math.max(200, Math.floor(viewportHeight * maxHeightRatio))

    let foundAboveFold = false
    let firstVisibleImage = null

    imgs.forEach(img => {
      try {
        const beforeLoading = img.getAttribute ? img.getAttribute('loading') : undefined
        if (beforeLoading !== 'eager' && img.setAttribute) img.setAttribute('loading', 'lazy')

        const rect = img.getBoundingClientRect ? img.getBoundingClientRect() : null
        const src = img.src || (img.getAttribute && img.getAttribute('src'))

        const effectiveHeight = rect && rect.height > 1 ? rect.height : maxImageHeight
        const effectiveTop = rect ? rect.top : 0
        const effectiveBottom = effectiveTop + effectiveHeight

        const isAboveFold = Boolean(
          rect &&
          effectiveHeight > 0 &&
          effectiveTop <= visibleBottom &&
          effectiveBottom >= visibleTop
        )

        if (isAboveFold) {
          if (img.setAttribute) {
            img.setAttribute('loading', 'eager')
            img.setAttribute('fetchpriority', 'high')
            img.setAttribute('data-eager-by-nimbi', '1')
          } else {
            img.loading = 'eager'
            img.fetchPriority = 'high'
          }
          preloadImage(src)
          foundAboveFold = true
        }

        if (!firstVisibleImage && rect && rect.top <= visibleBottom) {
          firstVisibleImage = { img, src, rect, beforeLoading }
        }

      } catch (err) {
        debugWarn('[helpers] setEagerForAboveFoldImages per-image failed', err)
      }
    })

    if (!foundAboveFold && firstVisibleImage) {
      const { img, src, rect, beforeLoading } = firstVisibleImage
      try {
        if (img.setAttribute) {
          img.setAttribute('loading', 'eager')
          img.setAttribute('fetchpriority', 'high')
          img.setAttribute('data-eager-by-nimbi', '1')
        } else {
          img.loading = 'eager'
          img.fetchPriority = 'high'
        }
      } catch (err) {
        debugWarn('[helpers] setEagerForAboveFoldImages fallback failed', err)
      }
    }
  } catch (err) {
    debugWarn('[helpers] setEagerForAboveFoldImages failed', err)
  }
}

/**
 * Join multiple path segments ensuring there is exactly one slash between
 * them and no leading/trailing slashes on the result (unless the first
 * segment starts with a slash, in which case the result is absolute).
 * Similar to `path.posix.join` but for URL-like paths.
 *
 * @param {...string} parts - Path segments to join (strings). Empty segments are ignored.
 * @returns {string} Joined path string without duplicate slashes.
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
  if (String(parts[0] || '').startsWith('/')) {
    if (!joined.startsWith('/')) joined = '/' + joined
  }
  return joined
}
/**
 * Build a URL that uses the site’s `?page=` query parameter while preserving
 * any other query parameters currently present in the location search.
 *
 * This is useful for ensuring that options passed via URL (e.g. `lang`,
 * `defaultStyle`, etc.) remain present as the user navigates around the site.
 *
 * @param {string} page - The target page slug or path.
 * @param {string|null} [hash] - Optional hash fragment (without the leading '#').
 * @param {string} [baseSearch] - Optional base query string (defaults to current location.search).
 * @returns {string} URL string (e.g. "?page=foo&lang=es#bar").
 */
export function buildPageUrl(page, hash = null, baseSearch) {
  try {
    const rawSearch = typeof baseSearch === 'string'
      ? baseSearch
      : (typeof window !== 'undefined' && window.location ? window.location.search : '')
    const params = new URLSearchParams(rawSearch.startsWith('?') ? rawSearch.slice(1) : rawSearch)

    const pageVal = String(page || '')
    params.delete('page')
    const merged = new URLSearchParams()
    merged.set('page', pageVal)
    for (const [k, v] of params.entries()) {
      merged.append(k, v)
    }

    const query = merged.toString()
    let url = query ? `?${query}` : ''
    if (hash) {
      url += `#${encodeURIComponent(hash)}`
    }
    return url || `?page=${encodeURIComponent(pageVal)}`
  } catch (err) {
    const base = `?page=${encodeURIComponent(String(page || ''))}`
    return hash ? `${base}#${encodeURIComponent(hash)}` : base
  }
}
/**
 * Safely encode a URL or URL component using encodeURI.  Falls back to the
 * original string if encoding fails.
 *
 * @param {string} u - URL or component to encode safely
 * @returns {string}
 */
export function encodeURL(u) {
  try {
    const s = String(u || '')
    if (s.includes('%')) return s
    return encodeURI(s)
  } catch (_) {
    debugWarn('[helpers] encodeURL failed', _)
    return String(u || '')
  }
}

/**
 * Execute the given function and silently ignore any exceptions. Returns
 * the result of `fn` or `undefined` if an error occurred. If `fn` returns
 * a Promise, the returned Promise will resolve to `undefined` on rejection.
 * Useful for replacing frequent `try { ... } catch (_) {}` patterns.
 *
 * @param {() => any|Promise<any>} fn
 * @returns {any|Promise<any>|undefined}
 */
export function safe(fn) {
  try {
    const result = fn()
    if (result && typeof result.then === 'function') {
      return result.catch(e => {
        debugWarn('[helpers] safe swallowed error', e)
        return undefined
      })
    }
    return result
  } catch (_e) {
    debugWarn('[helpers] safe swallowed error', _e)
  }
}

try {
  if (typeof globalThis !== 'undefined' && !globalThis.safe) globalThis.safe = safe
} catch (err) { debugWarn('[helpers] global attach failed', err) }

/**
 * Decode a small set of common HTML entities and numeric entities in a string.
 * This is a lightweight fallback to avoid DOM-dependent decoding in workers.
 * @param {string} s
 * @returns {string}
 */
export function decodeHtmlEntities(s) {
  try {
    if (!s && s !== 0) return ''
    const str = String(s)
    const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }
    return str.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, g) => {
      if (!g) return m
      if (g[0] === '#') {
        try {
          if (g[1] === 'x' || g[1] === 'X') return String.fromCharCode(parseInt(g.slice(2), 16))
          return String.fromCharCode(parseInt(g.slice(1), 10))
        } catch (e) {
          return m
        }
      }
      return (named[g] !== undefined) ? named[g] : m
    })
  } catch (err) {
    return String(s || '')
  }
}
