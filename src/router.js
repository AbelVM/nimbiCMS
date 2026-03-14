import { slugToMd, slugify, fetchMarkdown, ensureSlug, resolveSlugPath } from './slugManager.js'
import * as l10n from './l10nManager.js'
import { normalizePath, trimTrailingSlash, ensureTrailingSlash } from './utils/helpers.js'
import { refreshIndexPaths, indexSet } from './indexManager.js'
/**
 * Maximum number of entries stored in the resolution cache before oldest
 * entries are evicted. Mutable at runtime via `setResolutionCacheMax`.
 * @type {number}
 */
export let RESOLUTION_CACHE_MAX = 100

/**
 * Change maximum cache size at runtime.
 * @param {number} n
 * @returns {void}
 */
export function setResolutionCacheMax(n) {
  RESOLUTION_CACHE_MAX = n
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

/**
 * Modify the resolution cache time‑to‑live at runtime.
 * Accepts a value in milliseconds; passing a non‑positive value disables
 * expiration.  This is the recommended API for external code rather than
 * mutating the namespace object directly (which is read‑only in ESM).
 * @param {number} ms
 */
/**
 * Modify the resolution cache time-to-live (milliseconds).
 * @param {number} ms
 */
export function setResolutionCacheTtl(ms) {
  RESOLUTION_CACHE_TTL = ms
}

/**
 * Resolution cache entry shape.
 * @typedef {{value:{resolved:string,anchor:string|null},ts:number}} ResolutionRecord
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
  try { refreshIndexPaths._refreshed = false } catch (e) { console.warn('[router] _clearIndexCache: refreshIndexPaths reset failed', e) }
}

 

/**
 * Retrieve a cached resolution result and refresh its LRU position.
 * @param {string} key
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
 * Store a resolution result in the runtime resolution cache. Evicts oldest
 * entries when the cache exceeds `RESOLUTION_CACHE_MAX`.
 * @param {string} key
 * @param {{resolved:string,anchor:string|null}} value
 * @returns {void}
 */
/**
 * Store a resolution in the runtime cache and evict oldest entries if needed.
 * @param {string} key
 * @param {{resolved:string,anchor:string|null}} value
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
 * Remove any stale entries from the cache based on TTL.  Called by
 * `resolutionCacheSet` and exposed for tests.
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
export { allMarkdownPaths } from './slugManager.js'

 

 
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
  const localCandidates = new Set(indexSet)
  const anchorsForIndex = document.querySelectorAll('.nimbi-site-navbar a, .navbar a, .nimbi-nav a')
  for (const linkEl of Array.from(anchorsForIndex || [])) {
    const href = linkEl.getAttribute('href') || ''
    if (!href) continue
    try {
      const u = new URL(href, location.href)
      if (u.origin !== location.origin) continue
      const mdMatch = (u.hash || u.pathname).match(/([^#?]+\.md)(?:$|[?#])/) || (u.pathname || '').match(/([^#?]+\.md)(?:$|[?#])/) 
      if (mdMatch) {
        let candidate = normalizePath(mdMatch[1])
        if (candidate) localCandidates.add(candidate)
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
      console.warn('[router] malformed URL while discovering index candidates', e)
    }
  }

  for (const candidate of localCandidates) {
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
    } catch (e) { console.warn('[router] fetchMarkdown during index discovery failed', e) }
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
/**
 * Given a resolved identifier, return ordered candidate filenames to fetch.
 * @param {string} resolved
 * @returns {string[]}
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
    } catch (e) { console.warn('[router] buildPageCandidates failed during slug handling', e) }
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
  const hashAnchor = location.hash ? decodeURIComponent(location.hash.replace(/^#/, '')) : null
  let resolved = raw || ''
  let anchor = null

  
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
        let idx = await tryDiscoverFromIndex(decoded, contentBase)
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

  if (!anchor && hashAnchor) anchor = hashAnchor

  const pageCandidates = buildPageCandidates(resolved)

  // If the caller provided an explicit path (contains .md or .html) we should
  // respect it even if it points to an `index.html`.  `buildPageCandidates`
  // historically filtered out `index.html` to prefer directory slugs, which
  // caused explicit links like `docs/index.html` to produce no candidates and
  // later throw `no page data`.  Allow explicit originals to be fetched.
  const originalWasExplicit = String(originalRaw || '').includes('.md') || String(originalRaw || '').includes('.html')
  if (originalWasExplicit && pageCandidates.length === 0 && (String(resolved).includes('.md') || String(resolved).includes('.html'))) {
    pageCandidates.push(resolved)
  }

  // If resolution produced an explicit markdown/html path (for example a
  // slug resolved to `docs/index.html`), ensure we attempt to fetch that
  // path even when the original request was a slug without an extension.
  // This handles cases where `ensureSlug()` or index discovery returns an
  // explicit file path.
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


  let fetchError = null;
  for (const candidate of pageCandidates) {
    if (!candidate) continue;
    try {
      const norm = normalizePath(candidate);
      data = await fetchMarkdown(norm, contentBase);
      pagePath = norm;
      break;
    } catch (e) {
      fetchError = e;
      try { console.warn('[router] candidate fetch failed', { candidate, contentBase, err: (e && e.message) || e }) } catch (_e) {}
    }
  }

  if (!data) {
    try { console.error('[router] fetchPageData: no page data for', { originalRaw, resolved, pageCandidates, contentBase, fetchError: (fetchError && (fetchError.message || String(fetchError))) || null }) } catch (_e) {}
    // If the original request was an explicit HTML path (e.g. "docs/index.html")
    // and fetching via the configured `contentBase` failed, try fetching the
    // absolute URL relative to the current page. This covers cases where the
    // nav links point to top-level HTML pages (like docs/index.html) that are
    // not served from the `contentBase` directory.
    try {
      if (originalWasExplicit && String(originalRaw || '').toLowerCase().includes('.html')) {
        try {
          const abs = new URL(String(originalRaw || ''), location.href).toString()
          console.warn('[router] attempting absolute HTML fetch fallback', abs)
          const res = await fetch(abs)
          if (res && res.ok) {
            const raw = await res.text()
            const ct = (res && res.headers && typeof res.headers.get === 'function') ? (res.headers.get('content-type') || '') : ''
            const rawLower = (raw || '').toLowerCase()
            const looksLikeHtml = (ct && ct.indexOf && ct.indexOf('text/html') !== -1) || rawLower.indexOf('<!doctype') !== -1 || rawLower.indexOf('<html') !== -1
            if (!looksLikeHtml) console.warn('[router] absolute fetch returned non-HTML', { abs, contentType: ct, snippet: rawLower.slice(0, 200) })
            if (looksLikeHtml) {
              try {
                const absUrl = abs
                const baseHref = new URL('.', absUrl).toString()
                try {
                  const parser = (typeof DOMParser !== 'undefined') ? new DOMParser() : null
                  if (parser) {
                    const doc = parser.parseFromString(raw || '', 'text/html')
                    // Rewrite asset URLs (src, srcset, link[href]) that are relative
                    const rewrite = (attr, el) => {
                      try {
                        const val = el.getAttribute(attr) || ''
                        if (!val) return
                        if (/^(https?:)?\/\//i.test(val)) return
                        if (val.startsWith('/')) return
                        if (val.startsWith('#')) return
                        // Resolve relative to the fetched document location
                        try {
                          const resolved = new URL(val, absUrl).toString()
                          el.setAttribute(attr, resolved)
                        } catch (err) { /* ignore */ }
                      } catch (err) { /* ignore */ }
                    }
                    const els = doc.querySelectorAll('[src],[href],[srcset],[xlink\:href],[poster]')
                    const rewritten = []
                    for (const el of Array.from(els || [])) {
                      try {
                        const tag = el.tagName ? el.tagName.toLowerCase() : ''
                        // Skip normal anchor links; those are handled by the SPA rewrite
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
                    try { if (rewritten && rewritten.length) console.warn('[router] rewritten asset refs', { abs, rewritten }) } catch (_e) {}
                    return { data: { raw: modified, isHtml: true }, pagePath: String(originalRaw || ''), anchor }
                  }
                } catch (e) { /* parsing failed, fall back */ }
                // Fallback: inject base tag so relative URLs without leading slash resolve
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
        } catch (err) {
          console.warn('[router] absolute HTML fetch fallback failed', err)
        }
      }
    } catch (_) { /* ignore fallback errors */ }

    throw new Error('no page data');
  }

  return { data, pagePath, anchor }
}

 

