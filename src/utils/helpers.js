/** Generic helpers reused throughout the codebase */
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
 * Add a preload link for an image URL to the document head.
 *
 * This is used to give browsers an early hint to fetch images that are
 * determined to be above-the-fold (eager) by `setEagerForAboveFoldImages`.
 *
 * @param {string} url - Absolute or relative URL to preload.
 */
function preloadImage(url) {
  try {
    if (!url || typeof document === 'undefined' || !document.head) return
    // Avoid preloading data URLs and updates that already exist
    if (url.startsWith('data:')) return
    const existing = document.head.querySelector(`link[rel="preload"][as="image"][href="${url}"]`)
    if (existing) return
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = url
    document.head.appendChild(link)
  } catch (err) {
    console.warn('[helpers] preloadImage failed', err)
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
      console.warn('[helpers] read CSS ratio failed', err)
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

        if (debug) {
          console.log('[helpers] setEagerForAboveFoldImages:', {
            src,
            rect,
            marginPx,
            visibleTop,
            visibleBottom,
            beforeLoading,
            isAboveFold,
            effectiveHeight,
            maxImageHeight
          })
        }
      } catch (err) {
        console.warn('[helpers] setEagerForAboveFoldImages per-image failed', err)
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
        if (debug) {
          console.log('[helpers] setEagerForAboveFoldImages (fallback first visible):', {
            src,
            rect,
            marginPx,
            visibleTop,
            visibleBottom,
            beforeLoading,
            fallback: true
          })
        }
      } catch (err) {
        console.warn('[helpers] setEagerForAboveFoldImages fallback failed', err)
      }
    }
  } catch (err) {
    console.warn('[helpers] setEagerForAboveFoldImages failed', err)
  }
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
    if (s.includes('%')) return s
    return encodeURI(s)
  } catch (_) {
    console.warn('[helpers] encodeURL failed', _)
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
        console.warn('[helpers] safe swallowed error', e)
        return undefined
      })
    }
    return result
  } catch (_e) {
    console.warn('[helpers] safe swallowed error', _e)
  }
}

try {
  if (typeof globalThis !== 'undefined' && !globalThis.safe) globalThis.safe = safe
} catch (err) { console.warn('[helpers] global attach failed', err) }
