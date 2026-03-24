/**
 * Routing and page resolution helpers.
 *
 * Utilities for resolving page slugs, caching resolution results, and
 * supporting SPA-style navigation within the runtime.
 *
 * @module router
 */
import { slugToMd, slugify, fetchMarkdown, ensureSlug, resolveSlugPath, notFoundPage } from './slugManager.js'
import * as l10n from './l10nManager.js'
import { parseHrefToRoute } from './utils/urlHelper.js'
import { markNotFound } from './seoManager.js'
import { normalizePath, trimTrailingSlash, ensureTrailingSlash } from './utils/helpers.js'
import { getSharedParser } from './utils/sharedDomParser.js'
import { isDebugLevel, incrementCounter, debugError, debugWarn, debugLog, syncLegacyCounter } from './utils/debug.js'
import { refreshIndexPaths, indexSet } from './indexManager.js'
export let RESOLUTION_CACHE_MAX = 100

/**
 * Change maximum cache size at runtime.
 * @param {number} n - Maximum number of cached resolution entries.
 * @returns {void}
 */
export function setResolutionCacheMax(n) {
  RESOLUTION_CACHE_MAX = n
}

// Gate router logs and optional probe behavior.
function _routerShouldLog() {
  try { if (isDebugLevel(2)) return true } catch (_e) {}
  try { return false } catch (_e) { return false }
}
/**
 * Time‑to‑live (TTL) for cache entries, in milliseconds.  After this duration
 * a stored resolution will be treated as if it does not exist, triggering a
 * fresh lookup.  Setting to a non‑positive number disables expiration.
 * This value is exported as a `let` so that callers (such as `initCMS`) can
 * override it dynamically if they need a different cache lifetime.
 * @type {number}
 */
export let RESOLUTION_CACHE_TTL = 5 * 60 * 1000 // five minutes

// Controller used to cancel the previous in-flight `fetchPageData` call
let _lastFetchPageDataController = null

// Compatibility wrapper for calling `fetchMarkdown` while optionally
// forwarding an AbortSignal. Some tests replace `fetchMarkdown` with a
// spy that expects only two arguments; to remain compatible call the
// original signature when the function reports a smaller `length`.
function _fetchMd(path, base, signal) {
  try {
    if (typeof fetchMarkdown === 'function' && typeof fetchMarkdown.length === 'number' && fetchMarkdown.length >= 3) {
      return fetchMarkdown(path, base, { signal })
    }
  } catch (_) {}
  return fetchMarkdown(path, base)
}

/**
 * Modify the resolution cache time‑to‑live at runtime.
 * Accepts a value in milliseconds; passing a non‑positive value disables
 * expiration.  This is the recommended API for external code rather than
 * mutating the namespace object directly (which is read‑only in ESM).
 * @param {number} ms - Time-to-live (milliseconds) for cached resolution entries.
 * @returns {void}
 */
export function setResolutionCacheTtl(ms) {
  RESOLUTION_CACHE_TTL = ms
}

/**
 * Resolution cache entry shape.
 * @typedef {{value:{resolved:string,anchor:string|null},ts:number}} ResolutionRecord
 */

/**
 * Resolution result value shape (convenience typedef).
 * @typedef {{resolved:string,anchor:string|null}} ResolutionValue
 */

/**
 * Runtime cache for recent page-resolution results.
 * Maps cacheKey -> {@link ResolutionRecord}
 * @type {Map<string, ResolutionRecord>}
 */
export const resolutionCache = new Map()



/**
 * Add every value from an array or Map-like object to the internal `indexSet`.
 * Used by refreshIndexPaths and map-tracking helpers.
 *
 * @param {Array|string[]|{values:()=>Iterable}} arrOrMap - array or object providing a `values()` iterator.
 * @returns {void}
 */
export function augmentIndexWithAllMarkdownPaths(arrOrMap) {
  indexSet.clear();
  if (Array.isArray(arrOrMap)) {
    for (const v of arrOrMap) {
      if (v) indexSet.add(v);
    }
  } else if (arrOrMap && typeof arrOrMap.values === 'function') {
    for (const v of arrOrMap.values()) {
      if (v) indexSet.add(v);
    }
  }
}
/**
 * Empties the internal markdown index set. Only exposed for testing.
 * @returns {void}
 */
export function _clearIndexCache() {
  indexSet.clear();
  try { refreshIndexPaths._refreshed = false } catch (e) { debugWarn('[router] _clearIndexCache: refreshIndexPaths reset failed', e) }
}

 

/**
 * Retrieve a cached resolution result and refresh its LRU position.
 * @param {string} key - Cache key string.
 * @returns {{resolved:string,anchor:string|null}|undefined}
 */
export function resolutionCacheGet(key) {
  if (!resolutionCache.has(key)) return undefined
  const record = resolutionCache.get(key)
  const now = Date.now()
  if (record.ts + RESOLUTION_CACHE_TTL < now) {
    resolutionCache.delete(key)
    return undefined
  }
  
  resolutionCache.delete(key)
  resolutionCache.set(key, record)
  return record.value
}
/**
 * Store a resolution result in the runtime resolution cache and evict the
 * oldest entries when the cache exceeds `RESOLUTION_CACHE_MAX`.
 * @exports resolutionCacheSet
 * @param {string} key - Cache key string.
 * @param {{resolved:string,anchor:string|null}} value - Resolution record to store.
 * @returns {void}
 */
export function resolutionCacheSet(key, value) {
  _purgeExpiredEntries()
  _purgeExpiredEntries()
  resolutionCache.delete(key)
  resolutionCache.set(key, {value, ts: Date.now()})
  if (resolutionCache.size > RESOLUTION_CACHE_MAX) {
    const oldest = resolutionCache.keys().next().value
    if (oldest !== undefined) resolutionCache.delete(oldest)
  }
}



 

/**
 * Remove expired entries from the `resolutionCache` according to `RESOLUTION_CACHE_TTL`.
 * This is a no-op when TTL is not configured or set to a non-positive value.
 * @returns {void}
 */
export function _purgeExpiredEntries() {
  if (!RESOLUTION_CACHE_TTL || RESOLUTION_CACHE_TTL <= 0) return
  const now = Date.now()
  for (const [k, record] of resolutionCache.entries()) {
    if (record.ts + RESOLUTION_CACHE_TTL < now) {
      resolutionCache.delete(k)
    }
  }
}

/**
 * List of all markdown file paths collected at build time.  Useful for
 * programs that need to enumerate available pages.
 * @type {string[]}
 */
export { allMarkdownPaths, allMarkdownPathsSet } from './slugManager.js'

 

 
/**
 * Search the navigation and site index for a page whose H1 slugifies to the
 * provided value.  This is a fallback when a slug doesn't directly map via
 * `slugToMd`.
 *
 * @param {string} decoded - decoded slug value
 * @param {string} contentBase - content base URL for fetching markdown
 * @returns {Promise<string|null>} path of the discovered markdown or null
 */
async function tryDiscoverFromIndex(decoded, contentBase, signal) {
  const localCandidates = new Set(indexSet)
  let anchorsForIndex = []
  try {
    if (typeof document !== 'undefined' && document.getElementsByClassName) {
      const addFrom = (cls) => {
        const nodes = document.getElementsByClassName(cls)
        for (let i = 0; i < nodes.length; i++) {
          const as = nodes[i].getElementsByTagName('a')
          for (let j = 0; j < as.length; j++) anchorsForIndex.push(as[j])
        }
      }
      addFrom('nimbi-site-navbar'); addFrom('navbar'); addFrom('nimbi-nav')
    } else {
      anchorsForIndex = Array.from(document.querySelectorAll('.nimbi-site-navbar a, .navbar a, .nimbi-nav a'))
    }
  } catch (err) {
    try { anchorsForIndex = Array.from(document.querySelectorAll('.nimbi-site-navbar a, .navbar a, .nimbi-nav a')) } catch (_) { anchorsForIndex = [] }
  }
  for (const linkEl of Array.from(anchorsForIndex || [])) {
    const href = linkEl.getAttribute('href') || ''
    if (!href) continue
    try {
      // Normalize known cosmetic/canonical forms first
      try {
        const parsed = parseHrefToRoute(href)
        if (parsed) {
          if (parsed.type === 'canonical' && parsed.page) {
            const candidate = normalizePath(parsed.page)
            if (candidate) { localCandidates.add(candidate); continue }
          }
          if (parsed.type === 'cosmetic' && parsed.page) {
            const slug = parsed.page
            if (slugToMd.has(slug)) {
              const mapped = slugToMd.get(slug)
              if (mapped) return mapped
            }
            // no mapping yet; skip to next anchor
            continue
          }
        }
      } catch (_e) {}

      const u = new URL(href, location.href)
      if (u.origin !== location.origin) continue
      const mdMatch = (u.hash || u.pathname).match(/([^#?]+\.md)(?:$|[?#])/) || (u.pathname || '').match(/([^#?]+\.md)(?:$|[?#])/) 
      if (mdMatch) {
        let candidate = normalizePath(mdMatch[1])
        if (candidate) localCandidates.add(candidate)
        continue
      }
      const linkText = (linkEl.textContent || '').trim()
      const baseName = (u.pathname || '').replace(/^.*\//, '')
      if (linkText && slugify(linkText) === decoded) return u.toString()
      if (baseName && slugify(baseName.replace(/\.(html?|md)$/i, '')) === decoded) return u.toString()
      if (/\.(html?)$/i.test(u.pathname)) {
        let rel = u.pathname.replace(/^\//, '')
        localCandidates.add(rel)
        continue
      }
      const p = u.pathname || ''
      if (p) {
        const contentBaseUrl = new URL(contentBase)
        const contentBasePath = ensureTrailingSlash(contentBaseUrl.pathname)
        if (p.indexOf(contentBasePath) !== -1) {
          let rel = p.startsWith(contentBasePath) ? p.slice(contentBasePath.length) : p
          rel = normalizePath(rel)
          if (rel) localCandidates.add(rel)
        }
      }
      } catch (e) {
      debugWarn('[router] malformed URL while discovering index candidates', e)
    }
  }

  for (const candidate of localCandidates) {
    try {
      if (!candidate || !String(candidate).includes('.md')) continue
      const idxMd = await _fetchMd(candidate, contentBase, signal)
      if (!idxMd || !idxMd.raw) continue
      const m = (idxMd.raw || '').match(/^#\s+(.+)$/m)
      if (m) {
        const h1 = (m[1] || '').trim()
        if (h1 && slugify(h1) === decoded) {
          return candidate
        }
      }
    } catch (e) { debugWarn('[router] fetchMarkdown during index discovery failed', e) }
  }
  return null
}

/**
 * Given a resolved identifier (possibly slug, path, or HTML), produce an
 * ordered list of candidate markdown/html filenames to attempt fetching.
 * @param {string} resolved - resolved parameter
 * @returns {string[]} - Array of candidate filenames to attempt fetching.
 */
export function buildPageCandidates(resolved) {
  
  const pageCandidates = []
  if (String(resolved).includes('.md') || String(resolved).includes('.html')) {
    
    if (!/index\.html$/i.test(resolved)) {
      pageCandidates.push(resolved)
    }
  } else {
    try {
      const dec = decodeURIComponent(String(resolved || ''))
      if (slugToMd.has(dec)) {
        const val = resolveSlugPath(dec) || slugToMd.get(dec)
        if (val) {
          if (!/\.(md|html?)$/i.test(val)) {
            pageCandidates.push(val)
            pageCandidates.push(val + '.html')
          } else if (!/index\.html$/i.test(val)) {
            pageCandidates.push(val)
          }
        }
      } else {
        if (indexSet && indexSet.size) {
          for (const p of indexSet) {
            const base = p.replace(/^.*\//, '').replace(/\.(md|html?)$/i, '')
            if (slugify(base) === dec && !/index\.html$/i.test(p)) {
              pageCandidates.push(p)
              break
            }
          }
        }
        if (!pageCandidates.length && dec && !/\.(md|html?)$/i.test(dec)) {
          pageCandidates.push(dec + '.html')
          pageCandidates.push(dec + '.md')
        }
      }
    } catch (e) { debugWarn('[router] buildPageCandidates failed during slug handling', e) }
  }
  return pageCandidates
}

 

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
  const originalRaw = raw || ''
  try {
    try { incrementCounter('fetchPageData') } catch (_) {}
    try { syncLegacyCounter('fetchPageData') } catch (_) {}
  } catch (_) {}
  // Cancel any previous in-flight fetchPageData and create a fresh controller
  try {
    if (_lastFetchPageDataController && typeof _lastFetchPageDataController.abort === 'function') {
      try { _lastFetchPageDataController.abort() } catch (_) {}
    }
  } catch (_) {}
  _lastFetchPageDataController = (typeof AbortController !== 'undefined') ? new AbortController() : null
  const _fetchController = _lastFetchPageDataController
  // Extract a parsed anchor from the current location in a robust way.
  // Use `parseHrefToRoute` so cosmetic hashes like "#/slug#anchor?x=1" are
  // normalized to just the anchor value instead of the raw hash payload.
  let hashAnchor = null
  try {
    const parsedCurrent = parseHrefToRoute(typeof location !== 'undefined' ? location.href : '')
    if (parsedCurrent && parsedCurrent.anchor) hashAnchor = parsedCurrent.anchor
  } catch (e) {
    try {
      hashAnchor = location && location.hash ? decodeURIComponent(location.hash.replace(/^#/, '')) : null
    } catch (_e) {
      hashAnchor = null
    }
  }
  let resolved = raw || ''
  let anchor = null

  // Whether the original request explicitly referenced a .md or .html
  // resource. Used to avoid rejecting intentionally requested HTML pages.
  const originalWasExplicitEarly = String(originalRaw || '').includes('.md') || String(originalRaw || '').includes('.html')

  
  if (resolved && String(resolved).includes('::')) {
    const parts = String(resolved).split('::', 2)
    resolved = parts[0]
    anchor = parts[1] || null
  }

  
  const lang = (typeof l10n !== 'undefined' && l10n.currentLang) ? l10n.currentLang : ''
  const cacheKey = `${raw}|||${lang}`
  const cached = resolutionCacheGet(cacheKey)
  if (cached) {
    resolved = cached.resolved
    anchor = cached.anchor || anchor
  } else {
    if (!String(resolved).includes('.md') && !String(resolved).includes('.html')) {
      let decoded = decodeURIComponent(String(resolved || ''))
      
      if (decoded && typeof decoded === 'string') {
        decoded = normalizePath(decoded)
        decoded = trimTrailingSlash(decoded)
      }
      if (slugToMd.has(decoded)) {
        resolved = resolveSlugPath(decoded) || slugToMd.get(decoded)
      } else {
        let idx = await tryDiscoverFromIndex(decoded, contentBase, _fetchController ? _fetchController.signal : undefined)
        if (idx) {
          resolved = idx
        } else if ((refreshIndexPaths._refreshed && indexSet && indexSet.size) || (typeof contentBase === 'string' && /^[a-z][a-z0-9+.-]*:\/\//i.test(contentBase))) {
          const found = await ensureSlug(decoded, contentBase)
          if (found) resolved = found
        }
      }
    }
    resolutionCacheSet(cacheKey, { resolved, anchor })
  }

  // Compute whether we should attempt network probing for candidates.
  // Do this early so we can avoid absolute fetches/site-shell probes
  // when the runtime intends to render an inline not-found fallback.
  let allowCandidateProbing = true
  try {
    const explicitResolved = String(resolved || '').includes('.md') || String(resolved || '').includes('.html') || (resolved && (resolved.startsWith('http://') || resolved.startsWith('https://') || resolved.startsWith('/')))
    allowCandidateProbing = (typeof notFoundPage === 'string' && notFoundPage) || slugToMd.has(resolved) || (indexSet && indexSet.size) || refreshIndexPaths._refreshed || originalWasExplicitEarly || explicitResolved
  } catch (_e) {
    allowCandidateProbing = true
  }

  if (!anchor && hashAnchor) anchor = hashAnchor

  try {
    if (allowCandidateProbing && resolved && (resolved.startsWith('http://') || resolved.startsWith('https://') || resolved.startsWith('/'))) {
      const abs = resolved.startsWith('/') ? new URL(resolved, location.origin).toString() : resolved
      try {
        const res = await fetch(abs, _fetchController ? { signal: _fetchController.signal } : undefined)
        if (res && res.ok) {
          const raw = await res.text()
          const ct = (res && res.headers && typeof res.headers.get === 'function') ? (res.headers.get('content-type') || '') : ''
          const rawLower = (raw || '').toLowerCase()
          const looksLikeHtml = (ct && ct.indexOf && ct.indexOf('text/html') !== -1) || rawLower.indexOf('<!doctype') !== -1 || rawLower.indexOf('<html') !== -1
          if (looksLikeHtml) {
            // If the original request did not explicitly ask for an HTML
            // resource, be conservative: prefer a sibling `.md` or the
            // configured `notFoundPage` before accepting an absolute HTML
            // response. This prevents static hosts' index.html from being
            // treated as page content for unknown slugs.
            if (!originalWasExplicitEarly) {
              try {
                let relPath = abs
                try { relPath = new URL(abs).pathname.replace(/^\//, '') } catch (_) { relPath = String(abs || '').replace(/^\//, '') }
                const alt = relPath.replace(/\.html$/i, '.md')
                try {
                  const mdData = await _fetchMd(alt, contentBase, _fetchController ? _fetchController.signal : undefined)
                  if (mdData && mdData.raw) {
                    return { data: mdData, pagePath: alt, anchor }
                  }
                } catch (_e) { /* ignore md probe failure */ }
                if (typeof notFoundPage === 'string' && notFoundPage) {
                  try {
                    const nf = await _fetchMd(notFoundPage, contentBase, _fetchController ? _fetchController.signal : undefined)
                    if (nf && nf.raw) {
                          try { markNotFound(nf.meta || {}, notFoundPage) } catch (_e) {}
                          return { data: nf, pagePath: notFoundPage, anchor }
                        }
                  } catch (_e) { /* ignore notFoundPage probe */ }
                }

                try { fetchError = new Error('site shell detected (absolute fetch)') } catch (_e) {}
                // fall through — don't return the absolute HTML; allow
                // outer fallbacks to handle not-found rendering
              } catch (_e) { /* ignore heuristics errors */ }
            }

            // Heuristic: detect SPA/site-shell responses (index.html) so we
            // don't mistakenly render the homepage for an unknown path.
            // Also keep the existing heuristic as an additional check.
            const looksLikeSiteShell = rawLower.indexOf('<div id="app"') !== -1
              || rawLower.indexOf('nimbi-cms') !== -1
              || rawLower.indexOf('nimbi-mount') !== -1
              || rawLower.indexOf('nimbi-') !== -1
              || rawLower.indexOf('initcms(') !== -1
              || rawLower.indexOf('window.nimbi') !== -1
              || /\bnimbi\b/.test(rawLower)
            if (looksLikeSiteShell) {
              try {
                let relPath = abs
                try { relPath = new URL(abs).pathname.replace(/^\//, '') } catch (_) { relPath = String(abs || '').replace(/^\//, '') }
                const alt = relPath.replace(/\.html$/i, '.md')
                try {
                  const mdData = await _fetchMd(alt, contentBase, _fetchController ? _fetchController.signal : undefined)
                  if (mdData && mdData.raw) {
                    return { data: mdData, pagePath: alt, anchor }
                  }
                } catch (_e) {
                  // ignore md probe failure
                }
                if (typeof notFoundPage === 'string' && notFoundPage) {
                  try {
                    const nf = await _fetchMd(notFoundPage, contentBase, _fetchController ? _fetchController.signal : undefined)
                    if (nf && nf.raw) {
                          try { markNotFound(nf.meta || {}, notFoundPage) } catch (_e) {}
                          return { data: nf, pagePath: notFoundPage, anchor }
                        }
                  } catch (_e) { /* ignore notFoundPage probe */ }
                }

                try { fetchError = new Error('site shell detected (absolute fetch)') } catch (_e) {}
                // fall through — don't return the absolute HTML; allow
                // outer fallbacks to handle not-found rendering
              } catch (_e) { /* ignore heuristics errors */ }
            }
          }
        }
      } catch (_e) { /* ignore absolute fetch failures */ }
    }
  } catch (_e) { /* ignore */ }

  const pageCandidates = buildPageCandidates(resolved)
  try {
    if (_routerShouldLog()) {
      try { debugLog('[router-debug] fetchPageData candidates', { originalRaw, resolved, pageCandidates }) } catch (_e) {}
    }
  } catch (_e) {}

  const originalWasExplicit = String(originalRaw || '').includes('.md') || String(originalRaw || '').includes('.html')
  // If the request was a bare slug (no .md/.html), capture a
  // normalized slug form to validate fetched pages against their H1
  // title. This helps avoid accepting an unrelated page (e.g. the
  // home page) when the slug resolver or cache returned an overly
  // permissive mapping.
  let requestedSlug = null
  if (!originalWasExplicit) {
    try {
      let dec = decodeURIComponent(String(originalRaw || ''))
      dec = normalizePath(dec)
      dec = trimTrailingSlash(dec)
      if (dec && !/\.(md|html?)$/i.test(dec)) requestedSlug = dec
    } catch (_e) {
      requestedSlug = null
    }
  }
  if (originalWasExplicit && pageCandidates.length === 0 && (String(resolved).includes('.md') || String(resolved).includes('.html'))) {
    pageCandidates.push(resolved)
  }

  if (pageCandidates.length === 0 && (String(resolved).includes('.md') || String(resolved).includes('.html'))) {
    pageCandidates.push(resolved)
  }

  
  if (
    pageCandidates.length === 1 &&
    /index\.html$/i.test(pageCandidates[0]) &&
    (!originalWasExplicit && !slugToMd.has(resolved) && !slugToMd.has(decodeURIComponent(String(resolved || ''))) && !String(resolved || '').includes('/'))
  ) {
    throw new Error('Unknown slug: index.html fallback prevented')
  }

  let data = null
  let pagePath = null


  let fetchError = null
  // When no explicit `notFoundPage` is configured and we don't have
  // an index mapping or slug mapping available, avoid issuing a flood
  // of network probes for guessed candidates (e.g. `bad_slug.html`,
  // `bad_slug.md`) — render the inline 404 instead. This keeps the
  // console and network quieter for the common case where hosts want
  // the client to show an inline fallback without exhausting probes.
  try {
    // Re-evaluate the probe gate in case resolution changed; do not
    // enable probing simply because `contentBase` is absolute.
    const explicitResolvedLater = String(resolved || '').includes('.md') || String(resolved || '').includes('.html') || (resolved && (resolved.startsWith('http://') || resolved.startsWith('https://') || resolved.startsWith('/')))
    allowCandidateProbing = (typeof notFoundPage === 'string' && notFoundPage) || slugToMd.has(resolved) || (indexSet && indexSet.size) || refreshIndexPaths._refreshed || originalWasExplicit || explicitResolvedLater
  } catch (_e) {
    allowCandidateProbing = true
  }

  if (!allowCandidateProbing) {
    // Short-circuit: do not attempt candidate fetches for unknown slugs.
    fetchError = new Error('no page data')
  } else {
    for (const candidate of pageCandidates) {
      if (!candidate) continue
      try {
        const norm = normalizePath(candidate)
        data = await _fetchMd(norm, contentBase, _fetchController ? _fetchController.signal : undefined)
        pagePath = norm

        // Defensive check: if the user requested a bare slug (e.g. "potato")
        // and there is no explicit `slugToMd` mapping for that slug, ensure
        // the fetched page's H1/title actually slugifies to the requested
        // value. This prevents accidental resolution of unrelated pages
        // (commonly the site's home page) for mistyped slugs.
        if (requestedSlug && !slugToMd.has(requestedSlug)) {
          try {
            let title = ''
                if (data && data.isHtml) {
              try {
                const parser = getSharedParser()
                if (parser) {
                  const doc = parser.parseFromString(data.raw || '', 'text/html')
                  const h1 = doc.querySelector('h1') || doc.querySelector('title')
                  if (h1 && h1.textContent) title = h1.textContent.trim()
                }
              } catch (_e) { /* ignore parse errors */ }
            } else {
              const m = (data && data.raw || '').match(/^#\s+(.+)$/m)
              if (m && m[1]) title = m[1].trim()
            }
            if (title) {
              const titleSlug = slugify(title)
              if (titleSlug !== requestedSlug) {
                // If this was an HTML candidate and a sibling `.md` candidate
                // exists, attempt to probe the `.md` sibling before rejecting
                // the candidate. This helps accept the real markdown page when
                // the HTML looked like an index or unrelated shell.
                try {
                  if (/\.html$/i.test(norm)) {
                    const alt = norm.replace(/\.html$/i, '.md')
                    if (pageCandidates.includes(alt)) {
                      try {
                        const mdData = await _fetchMd(alt, contentBase, _fetchController ? _fetchController.signal : undefined)
                        if (mdData && mdData.raw) {
                          data = mdData
                          pagePath = alt
                        } else {
                          if (typeof notFoundPage === 'string' && notFoundPage) {
                            try {
                              const nf = await _fetchMd(notFoundPage, contentBase, _fetchController ? _fetchController.signal : undefined)
                              if (nf && nf.raw) {
                                data = nf
                                pagePath = notFoundPage
                              } else {
                                data = null
                                pagePath = null
                                fetchError = new Error('slug mismatch for candidate')
                                continue
                              }
                            } catch (_e) {
                              data = null
                              pagePath = null
                              fetchError = new Error('slug mismatch for candidate')
                              continue
                            }
                          } else {
                            data = null
                            pagePath = null
                            fetchError = new Error('slug mismatch for candidate')
                            continue
                          }
                        }
                      } catch (_e) {
                        try {
                          const nf = await _fetchMd(notFoundPage, contentBase, _fetchController ? _fetchController.signal : undefined)
                          if (nf && nf.raw) {
                            data = nf
                            pagePath = notFoundPage
                          } else {
                            data = null
                            pagePath = null
                            fetchError = new Error('slug mismatch for candidate')
                            continue
                          }
                        } catch (_e2) {
                          data = null
                          pagePath = null
                          fetchError = new Error('slug mismatch for candidate')
                          continue
                        }
                      }
                    } else {
                      data = null
                      pagePath = null
                      fetchError = new Error('slug mismatch for candidate')
                      continue
                    }
                  } else {
                    data = null
                    pagePath = null
                    fetchError = new Error('slug mismatch for candidate')
                    continue
                  }
                } catch (_e) {
                  data = null
                  pagePath = null
                  fetchError = new Error('slug mismatch for candidate')
                  continue
                }
              }
            }
          } catch (_e) { /* ignore validation errors */ }
        }

        // If we just fetched an HTML candidate that was generated for a
        // bare slug (i.e. the original request did not explicitly ask for
        // an HTML file) and a sibling `.md` candidate exists, probe the
        // `.md` candidate and prefer it if available. This avoids cases
        // where servers return the site `index.html` for unknown paths
        // which would otherwise render the homepage instead of the
        // site's not-found page.
        try {
          if (!originalWasExplicit && /\.html$/i.test(norm)) {
            const alt = norm.replace(/\.html$/i, '.md')
            if (pageCandidates.includes(alt)) {
              try {
                const rawSnippetFull = String((data && data.raw) || '').trim()
                const rawSnippet = rawSnippetFull.slice(0, 128).toLowerCase()
                const looksLikeHtml = (data && data.isHtml) || /^(?:<!doctype|<html|<title|<h1)/i.test(rawSnippet) || rawSnippet.indexOf('<div id="app"') !== -1 || rawSnippet.indexOf('nimbi-') !== -1 || rawSnippet.indexOf('nimbi') !== -1 || rawSnippet.indexOf('initcms(') !== -1
                if (looksLikeHtml) {
                  let accepted = false
                  try {
                    const mdData = await _fetchMd(alt, contentBase, _fetchController ? _fetchController.signal : undefined)
                    if (mdData && mdData.raw) {
                      data = mdData
                      pagePath = alt
                      accepted = true
                    } else {
                      if (typeof notFoundPage === 'string' && notFoundPage) {
                        try {
                          const nf = await _fetchMd(notFoundPage, contentBase, _fetchController ? _fetchController.signal : undefined)
                          if (nf && nf.raw) {
                            data = nf
                            pagePath = notFoundPage
                            accepted = true
                          }
                        } catch (_e) {
                          /* ignore notFoundPage probe failure */
                        }
                      }
                    }
                  } catch (_e) {
                    try {
                      const nf = await _fetchMd(notFoundPage, contentBase, _fetchController ? _fetchController.signal : undefined)
                      if (nf && nf.raw) {
                        data = nf
                        pagePath = notFoundPage
                        accepted = true
                      }
                    } catch (_e2) { /* ignore */ }
                  }

                  if (!accepted) {
                    data = null
                    pagePath = null
                    fetchError = new Error('site shell detected (candidate HTML rejected)')
                    continue
                  }
                }
              } catch (_e) { /* ignore probe errors */ }
            }
          }
        } catch (_e) { /* ignore probe errors */ }

        try {
          if (_routerShouldLog()) {
            try { debugLog('[router-debug] fetchPageData accepted candidate', { candidate: norm, pagePath, isHtml: data && data.isHtml, snippet: (data && data.raw ? String(data.raw).slice(0,160) : null) }) } catch (_e) {}
          }
        } catch (_e) {}
        break
        } catch (e) {
        fetchError = e
        try { if (_routerShouldLog()) debugWarn('[router] candidate fetch failed', { candidate, contentBase, err: (e && e.message) || e }) } catch (_e) {}
      }
    }
  }

  if (!data) {
    const fetchErrMsg = (fetchError && (fetchError.message || String(fetchError))) || null
    const isExpectedMissing = fetchErrMsg && /failed to fetch md|site shell detected/i.test(fetchErrMsg)
    try { if (_routerShouldLog()) { try { debugLog('[router-debug] fetchPageData no data', { originalRaw, resolved, pageCandidates, fetchError: fetchErrMsg }) } catch (_e) {} } } catch (_e) {}
    if (isExpectedMissing) {
      try { if (_routerShouldLog()) { try { debugWarn('[router] fetchPageData: no page data (expected)', { originalRaw, resolved, pageCandidates, contentBase, fetchError: fetchErrMsg }) } catch (_e) {} } } catch (_e) {}
    } else {
      try { if (_routerShouldLog()) { try { debugError('[router] fetchPageData: no page data for', { originalRaw, resolved, pageCandidates, contentBase, fetchError: fetchErrMsg }) } catch (_e) {} } } catch (_e) {}
    }
    // Conservative fallback: if no candidate produced content, prefer the
    // configured notFoundPage when available so we don't render the site
    // shell (homepage) for missing slugs.
                    if (typeof notFoundPage === 'string' && notFoundPage) {
                      try {
                        const nf = await _fetchMd(notFoundPage, contentBase, _fetchController ? _fetchController.signal : undefined)
                        if (nf && nf.raw) {
                          try { markNotFound(nf.meta || {}, notFoundPage) } catch (_e) {}
                          return { data: nf, pagePath: notFoundPage, anchor }
                        }
                      } catch (_e) { /* ignore notFoundPage probe errors */ }
                    }
    try {
      if (originalWasExplicit && String(originalRaw || '').toLowerCase().includes('.html')) {
          try {
          const abs = new URL(String(originalRaw || ''), location.href).toString()
          if (_routerShouldLog()) debugWarn('[router] attempting absolute HTML fetch fallback', abs)
          const res = await fetch(abs, _fetchController ? { signal: _fetchController.signal } : undefined)
          if (res && res.ok) {
            const raw = await res.text()
            const ct = (res && res.headers && typeof res.headers.get === 'function') ? (res.headers.get('content-type') || '') : ''
            const rawLower = (raw || '').toLowerCase()
            const looksLikeHtml = (ct && ct.indexOf && ct.indexOf('text/html') !== -1) || rawLower.indexOf('<!doctype') !== -1 || rawLower.indexOf('<html') !== -1
            if (!looksLikeHtml && _routerShouldLog()) {
              try { debugWarn('[router] absolute fetch returned non-HTML', () => ({ abs, contentType: ct, snippet: rawLower.slice(0, 200) })) } catch (_e) {}
            }
            if (looksLikeHtml) {
              const rawLowerForDir = (raw || '').toLowerCase()
              const looksLikeDirListing = /<title>\s*index of\b/i.test(raw) || /<h1>\s*index of\b/i.test(raw) || rawLowerForDir.indexOf('parent directory') !== -1 || /<title>\s*directory listing/i.test(raw) || /<h1>\s*directory listing/i.test(raw)
              if (looksLikeDirListing) {
                try { if (_routerShouldLog()) debugWarn('[router] absolute fetch returned directory listing; treating as not found', { abs }) } catch (_e) {}
              } else {
                try {
                  const absUrl = abs
                  const baseHref = new URL('.', absUrl).toString()
                  try {
                    const parser = getSharedParser()
                    if (parser) {
                      const doc = parser.parseFromString(raw || '', 'text/html')
                      const rewrite = (attr, el) => {
                        try {
                          const val = el.getAttribute(attr) || ''
                          if (!val) return
                          if (/^(https?:)?\/\//i.test(val)) return
                          if (val.startsWith('/')) return
                          if (val.startsWith('#')) return
                          try {
                            const resolved = new URL(val, absUrl).toString()
                            el.setAttribute(attr, resolved)
                          } catch (err) { debugWarn('[router] rewrite attribute failed', attr, err) }
                        } catch (err) { debugWarn('[router] rewrite helper failed', err) }
                      }
                      const els = doc.querySelectorAll('[src],[href],[srcset],[xlink\:href],[poster]')
                      const rewritten = []
                      for (const el of Array.from(els || [])) {
                        try {
                          const tag = el.tagName ? el.tagName.toLowerCase() : ''
                          if (tag === 'a') continue
                          if (el.hasAttribute('src')) {
                            const before = el.getAttribute('src')
                            rewrite('src', el)
                            const after = el.getAttribute('src')
                            if (before !== after) rewritten.push({ attr: 'src', tag, before, after })
                          }
                          if (el.hasAttribute('href') && tag === 'link') {
                            const before = el.getAttribute('href')
                            rewrite('href', el)
                            const after = el.getAttribute('href')
                            if (before !== after) rewritten.push({ attr: 'href', tag, before, after })
                          }
                          if (el.hasAttribute('href') && tag !== 'link') {
                            const before = el.getAttribute('href')
                            rewrite('href', el)
                            const after = el.getAttribute('href')
                            if (before !== after) rewritten.push({ attr: 'href', tag, before, after })
                          }
                          if (el.hasAttribute('xlink:href')) {
                            const before = el.getAttribute('xlink:href')
                            rewrite('xlink:href', el)
                            const after = el.getAttribute('xlink:href')
                            if (before !== after) rewritten.push({ attr: 'xlink:href', tag, before, after })
                          }
                          if (el.hasAttribute('poster')) {
                            const before = el.getAttribute('poster')
                            rewrite('poster', el)
                            const after = el.getAttribute('poster')
                            if (before !== after) rewritten.push({ attr: 'poster', tag, before, after })
                          }
                          if (el.hasAttribute('srcset')) {
                            const rawSs = el.getAttribute('srcset') || ''
                            const parts = rawSs.split(',').map(s => s.trim()).filter(Boolean)
                            const mapped = parts.map(p => {
                              const [urlPart, size] = p.split(/\s+/, 2)
                              if (!urlPart) return p
                              if (/^(https?:)?\/\//i.test(urlPart) || urlPart.startsWith('/')) return p
                              try { const r = new URL(urlPart, absUrl).toString(); return size ? `${r} ${size}` : r } catch (err) { return p }
                            }).join(', ')
                            el.setAttribute('srcset', mapped)
                          }
                        } catch (err) { /* ignore per-element failures */ }
                      }
                      const modified = doc.documentElement && doc.documentElement.outerHTML ? doc.documentElement.outerHTML : raw
                      try { if (_routerShouldLog() && rewritten && rewritten.length) debugWarn('[router] rewritten asset refs', { abs, rewritten }) } catch (_e) {}
                      return { data: { raw: modified, isHtml: true }, pagePath: String(originalRaw || ''), anchor }
                    }
                  } catch (e) { /* parsing failed, fall back */ }
                  let rawWithBase = raw
                  if (!/<base\s+[^>]*>/i.test(raw)) {
                    if (/<head[^>]*>/i.test(raw)) {
                      rawWithBase = raw.replace(/(<head[^>]*>)/i, `$1<base href="${baseHref}">`)
                    } else {
                      rawWithBase = `<base href="${baseHref}">` + raw
                    }
                  }
                  return { data: { raw: rawWithBase, isHtml: true }, pagePath: String(originalRaw || ''), anchor }
                } catch (e) {
                  return { data: { raw, isHtml: true }, pagePath: String(originalRaw || ''), anchor }
                }
              }
            }
          }
                } catch (err) {
          if (_routerShouldLog()) debugWarn('[router] absolute HTML fetch fallback failed', err)
        }
      }
    } catch (_) { /* ignore fallback errors */ }

    try {
      const dec = decodeURIComponent(String(resolved || ''))
      if (dec && !/\.(md|html?)$/i.test(dec)) {
        // Only probe the `/assets/...` fallbacks when a configured
        // `notFoundPage` exists (or debugging explicitly enabled). This
        // prevents extra 404 asset requests when using the inline
        // not-found fallback.
        const shouldProbeAssets = (typeof notFoundPage === 'string' && notFoundPage)
        if (shouldProbeAssets && _routerShouldLog()) {
          const candidates = [
            `/assets/${dec}.html`,
            `/assets/${dec}/index.html`
          ]
          for (const abs of candidates) {
            try {
              const res = await fetch(abs, Object.assign({ method: 'GET' }, _fetchController ? { signal: _fetchController.signal } : {}))
              if (res && res.ok) {
                const raw = await res.text()
                return { data: { raw, isHtml: true }, pagePath: abs.replace(/^\//, ''), anchor }
              }
            } catch (e) {
              /* ignore single-candidate failures */
            }
          }
        }
      }
    } catch (e) { if (_routerShouldLog()) debugWarn('[router] assets fallback failed', e) }

    throw new Error('no page data');
  }

  return { data, pagePath, anchor }
}

 

