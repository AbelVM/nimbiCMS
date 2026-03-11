import { slugToMd, mdToSlug, slugify, fetchMarkdown, allMarkdownPaths } from './filesManager.js'

// in-memory LRU cache to avoid repeating slug resolution logic.
// The Map insertion order is used to evict the oldest entry when the max
// size is exceeded.
export const RESOLUTION_CACHE_MAX = 100
export const resolutionCache = new Map()

export function resolutionCacheGet(key) {
  if (!resolutionCache.has(key)) return undefined
  const val = resolutionCache.get(key)
  // refresh order
  resolutionCache.delete(key)
  resolutionCache.set(key, val)
  return val
}
export function resolutionCacheSet(key, value) {
  resolutionCache.delete(key)
  resolutionCache.set(key, value)
  if (resolutionCache.size > RESOLUTION_CACHE_MAX) {
    const oldest = resolutionCache.keys().next().value
    if (oldest !== undefined) resolutionCache.delete(oldest)
  }
}


// re-export for testing convenience and user access
/**
 * List of all markdown file paths collected at build time.  Useful for
 * programs that need to enumerate available pages.
 * @type {string[]}
 */
export { allMarkdownPaths } from './filesManager.js'

// helpers scoped to this module ------------------------------------------------

// `tryFindInNav` removed: slugToMd map is populated when the navbar
// is built, so scanning the DOM again is redundant.  The map will already
// contain any navigable markdown slug.
/**
 * Search the navigation and site index for a page whose H1 slugifies to the
 * provided value.  This is a fallback when a slug doesn't directly map via
 * `slugToMd`.
 *
 * @param {string} decoded - decoded slug value
 * @param {string} contentBase - content base URL for fetching markdown
 * @returns {Promise<string|null>} path of the discovered markdown or null
 */
async function tryDiscoverFromIndex(decoded, contentBase) {
  // attempt to locate a markdown file whose H1 slugifies to `decoded`
  const indexSet = new Set()
  // gather candidates from navbar links
// gather candidates from navbar links; this is not expected to fail
  const anchorsForIndex = document.querySelectorAll('.nimbi-site-navbar a, .navbar a, .nimbi-nav a')
  for (const linkEl of Array.from(anchorsForIndex || [])) {
    const href = linkEl.getAttribute('href') || ''
    if (!href) continue
    try {
      const u = new URL(href, location.href)
      if (u.origin !== location.origin) continue
      const mdMatch = (u.hash || u.pathname).match(/([^#?]+\.md)(?:$|[?#])/) || (u.pathname || '').match(/([^#?]+\.md)(?:$|[?#])/) 
      if (mdMatch) {
        let candidate = mdMatch[1].replace(/^\.\//, '')
        if (candidate.startsWith('/')) candidate = candidate.replace(/^\//, '')
        if (candidate) indexSet.add(candidate)
        continue
      }
      const p = u.pathname || ''
      if (p) {
        const contentBaseUrl = new URL(contentBase)
        const contentBasePath = contentBaseUrl.pathname.endsWith('/') ? contentBaseUrl.pathname : contentBaseUrl.pathname + '/'
        if (p.indexOf(contentBasePath) !== -1) {
          let rel = p.startsWith(contentBasePath) ? p.slice(contentBasePath.length) : p.replace(/^\//, '')
          rel = rel.replace(/^[\.\/]+/, '')
          if (rel && !rel.includes('.')) {
            indexSet.add(rel + '/index.md')
            indexSet.add(rel + '.md')
          }
        }
      }
    } catch (e) {
      // ignore malformed URLs
    }
  }

  for (const v of slugToMd.values()) if (v) indexSet.add(v)
  for (const v of mdToSlug.keys()) if (v) indexSet.add(v)
  // also consider every markdown path in the content directory so that
  // arbitrary slugs resolve even when the page isn't referenced in nav.
  for (const v of allMarkdownPaths) if (v) indexSet.add(v)

  // iterate through every candidate we collected; for modest numbers
  // of nav entries this is very cheap, and it ensures we can resolve
  // slugs that differ from the link text (e.g. 'tech-experiments' →
  // projects.md via its H1).
  for (const candidate of Array.from(indexSet)) {
    try {
      if (!candidate || !String(candidate).includes('.md')) continue
      const idxMd = await fetchMarkdown(candidate, contentBase)
      if (!idxMd || !idxMd.raw) continue
      const m = (idxMd.raw || '').match(/^#\s+(.+)$/m)
      if (m) {
        const h1 = (m[1] || '').trim()
        if (h1 && slugify(h1) === decoded) {
          return candidate
        }
      }
    } catch (e) { }
  }
  return null
}

/**
 * Given a resolved identifier (possibly slug, path, or HTML), produce an
 * ordered list of candidate markdown/html filenames to attempt fetching.
 *
 * @param {string} resolved
 * @returns {string[]}
 */
export function buildPageCandidates(resolved) {
  const pageCandidates = []
  if (String(resolved).includes('.md') || String(resolved).includes('.html')) {
    pageCandidates.push(resolved)
  } else {
    try {
      const dec = decodeURIComponent(String(resolved || ''))
      if (slugToMd.has(dec)) {
        pageCandidates.push(slugToMd.get(dec))
      } else {
        const underscore = '_' + dec + '.md'
        const indexPath = dec + '/index.md'
        try { if (mdToSlug.has(underscore)) pageCandidates.push(underscore) } catch (e) { }
        try { if (mdToSlug.has(indexPath)) pageCandidates.push(indexPath) } catch (e) { }
        if (pageCandidates.length === 0) {
          // final fallback: even if we have no prior mapping, treat the raw
          // slug as a direct markdown filename. this fixes cases such as
          // `?page=tech-experiments` when `tech-experiments.md` exists but was
          // never registered via the navbar or slug map.
          pageCandidates.push(dec + '.md')
        }
      }
    } catch (e) { }
  }
  return pageCandidates
}

// public API ---------------------------------------------------------------

/**
 * Resolve a raw `page` query value, fetch the corresponding markdown/html,
 * and return the normalized content data.
 *
 * This encapsulates slug lookup, nav/index discovery, candidate building and
 * caching of previous results.  It does **not** perform any DOM mutations; the
 * caller (usually `nimbi-cms.js`) handles rendering the returned `data`.
 *
 * @param {string} raw  - raw page string (e.g. from URLSearchParams)
 * @param {string} contentBase - base URL to pass to fetchMarkdown
 * @returns {Promise<{data:object,pagePath:string,anchor:string|null}>}
 */
export async function fetchPageData(raw, contentBase) {
  const hashAnchor = location.hash ? decodeURIComponent(location.hash.replace(/^#/, '')) : null
  let resolved = raw || ''
  let anchor = null

  // legacy anchor syntax
  if (resolved && String(resolved).includes('::')) {
    const parts = String(resolved).split('::', 2)
    resolved = parts[0]
    anchor = parts[1] || null
  }

  const cached = resolutionCacheGet(raw)
  if (cached) {
    resolved = cached.resolved
    anchor = cached.anchor || anchor
  } else {
    if (!String(resolved).includes('.md') && !String(resolved).includes('.html')) {
      const decoded = decodeURIComponent(String(resolved || ''))
      if (slugToMd.has(decoded)) {
        resolved = slugToMd.get(decoded)
      } else {
        const idx = await tryDiscoverFromIndex(decoded, contentBase)
        if (idx) resolved = idx
      }
    }
    resolutionCacheSet(raw, { resolved, anchor })
  }

  if (!anchor && hashAnchor) anchor = hashAnchor

  const pageCandidates = buildPageCandidates(resolved)

  let data = null
  let pagePath = null
  let lastErr = null
  for (const candidate of pageCandidates) {
    if (!candidate) continue
    try {
      const norm = String(candidate).replace(/^[\.\/]+/, '')
      data = await fetchMarkdown(norm, contentBase)
      pagePath = norm
      break
    } catch (e) {
      lastErr = e
    }
  }

  if (!data) {
    // throw here so caller can decide how to display not-found message
    throw lastErr || new Error('no page data')
  }

  return { data, pagePath, anchor }
}

// helpers exposed for unit tests
// Export internals used by the test-suite and other modules.

