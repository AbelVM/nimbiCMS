import { slugToMd, mdToSlug, slugify, fetchMarkdown, allMarkdownPaths, ensureSlug, resolveSlugPath } from './slugManager.js'
import * as l10n from './l10nManager.js'
import { normalizePath, trimTrailingSlash, ensureTrailingSlash } from './utils/helpers.js'

// in-memory cache to avoid repeating slug resolution logic.  We employ a
// combination of size-based LRU eviction **and** a time-to-live so entries
// cannot remain in memory indefinitely during long‑running sessions.  This
// mirrors the behaviour of a small in‑browser store with sensible limits.

// maximum number of entries before the oldest are dropped.  Can be
// adjusted at runtime via `setResolutionCacheMax`; useful if a host page has
// known memory constraints or wants a larger cache for a high‑traffic site.
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
export function setResolutionCacheTtl(ms) {
  RESOLUTION_CACHE_TTL = ms
}

/**
 * Modify the resolution cache time‑to‑live at runtime.
 * @param {number} ms
 * @returns {void}
 */

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

// incremental index of known markdown paths for fallback lookups.  we
// populate this when paths or slug maps change.  keeping it lazy avoids the
// “cannot access before initialization” errors that occurred during test
// imports.
const indexSet = new Set()

/**
 * Add every value from a Map-like object to the internal `indexSet`.
 * Used by refreshIndexPaths and map-tracking helpers.
 *
 * @param {{values:()=>Iterable}} map - object providing a `values()` iterator.
 */
function _augmentIndexWithMap(map) {
  if (!map || typeof map.values !== 'function') return
  for (const v of map.values()) {
    if (v) indexSet.add(v)
  }
}

// test helper: clear the index cache completely (used by unit tests)
/**
 * Empties the internal markdown index set.  Only exposed for testing.
 * @returns {void}
 */
export function _clearIndexCache() {
  indexSet.clear()
  // indicate that the index has not been refreshed since clear
  if (refreshIndexPaths && typeof refreshIndexPaths === 'function') refreshIndexPaths._refreshed = false
}

// patch Map.prototype.set for our two slug maps so additions automatically
// update the index set.  We only care about values (markdown paths);
// keys are slugs which are not needed in the fallback search.
/**
 * Instrument a map so that any value inserted also populates the index set.
 * @param {{set:function}} map - a Map-like object whose `set` method will be
 *  wrapped.  No-op if `map.set` is not a function.
 * @returns {void}
 */
function _trackMap(map) {
  if (!map || typeof map.set !== 'function') return
  const orig = map.set
  map.set = function(k, v) {
    if (v) indexSet.add(v)
    return orig.call(this, k, v)
  }
}

let _mapsTracked = false
/**
 * Lazily install tracking wrappers on the slug maps; idempotent.
 * @returns {void}
 */
function _ensureMapsTracked() {
  if (_mapsTracked) return
  _trackMap(slugToMd)
  _trackMap(mdToSlug)
  _mapsTracked = true
}

// expose a helper so external code (slugManager) can refresh from
// `allMarkdownPaths` when that array is repopulated during setContentBase.
/**
 * Refresh the internal index set from `allMarkdownPaths` and current slug maps.
 * Useful when the content base or path list changes at runtime (tests/plugins).
 * @returns {void}
 */
export function refreshIndexPaths() {
  _ensureMapsTracked()
  // clear and repopulate; callers may choose to invoke this repeatedly.
  indexSet.clear()
  for (const v of allMarkdownPaths) {
    if (v) indexSet.add(v)
  }
  // also ingest any current slug mappings
  _augmentIndexWithMap(slugToMd)
  _augmentIndexWithMap(mdToSlug)
  // mark that the index has been refreshed so callers (tests) can rely on
  // the router having an up-to-date view of `allMarkdownPaths`.
  ;(refreshIndexPaths._refreshed = true)
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
    // expired, drop and signal miss
    resolutionCache.delete(key)
    return undefined
  }
  // refresh order by reinserting
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
export function resolutionCacheSet(key, value) {
  // optionally purge expired items on every write.  this keeps the map from
  // growing with stale entries if the TTL is enabled.
  _purgeExpiredEntries()
  resolutionCache.delete(key)
  resolutionCache.set(key, {value, ts: Date.now()})
  if (resolutionCache.size > RESOLUTION_CACHE_MAX) {
    const oldest = resolutionCache.keys().next().value
    if (oldest !== undefined) resolutionCache.delete(oldest)
  }
}



// internal helpers --------------------------------------------------------

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

// re-export for testing convenience and user access
/**
 * List of all markdown file paths collected at build time.  Useful for
 * programs that need to enumerate available pages.
 * @type {string[]}
 */
export { allMarkdownPaths } from './slugManager.js'

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
  // start with the pre-populated indexSet and clone it so we can add any
  // links discovered in the DOM without mutating the shared cache.
  const localCandidates = new Set(indexSet)
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
        let candidate = normalizePath(mdMatch[1])
        if (candidate) localCandidates.add(candidate)
        continue
      }
      const p = u.pathname || ''
      if (p) {
        // if the link points into the content base we can normalize it and
        // treat it as a candidate.  we do **not** attempt to guess
        // sibling/index filenames; the content build should always reference
        // the correct markdown path or rely on slug-based navigation.
        const contentBaseUrl = new URL(contentBase)
        const contentBasePath = ensureTrailingSlash(contentBaseUrl.pathname)
        if (p.indexOf(contentBasePath) !== -1) {
          let rel = p.startsWith(contentBasePath) ? p.slice(contentBasePath.length) : p
          rel = normalizePath(rel)
          if (rel) localCandidates.add(rel)
        }
      }
    } catch (e) {
      // ignore malformed URLs
      console.warn('[router] malformed URL while discovering index candidates', e)
    }
  }

  // iterate through every candidate we collected; for modest numbers
  // of nav entries this is very cheap, and it ensures we can resolve
  // slugs that differ from the link text (e.g. 'tech-experiments' →
  // projects.md via its H1).
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
export function buildPageCandidates(resolved) {
  // Given a resolved identifier, return exactly the candidates that make
  // sense under the current policy.  We no longer invent filenames out of
  // thin air: slugs must be explicitly mapped via `slugToMd` or discovered
  // from the index.  There is **no** fallback that appends `.md` or
  // `_home` prefixes, and literal `content` segments are not injected here
  // (the caller provides the full `contentBase`).
  const pageCandidates = []
  if (String(resolved).includes('.md') || String(resolved).includes('.html')) {
    // caller already supplied an explicit path; use it verbatim
    // Prevent index.html from being considered unless explicitly requested
    if (!/index\.html$/i.test(resolved)) {
      pageCandidates.push(resolved)
    }
  } else {
    try {
      const dec = decodeURIComponent(String(resolved || ''))
      if (slugToMd.has(dec)) {
        const val = resolveSlugPath(dec) || slugToMd.get(dec)
        if (val) {
          // If mapping lacks an explicit extension, also try the .html
          // variant after the mapped value so callers can fetch either a
          // raw path or an HTML file with the same base.
          if (!/\.(md|html?)$/i.test(val)) {
            pageCandidates.push(val)
            pageCandidates.push(val + '.html')
          } else if (!/index\.html$/i.test(val)) {
            pageCandidates.push(val)
          }
        }
      } else {
        // try to find a matching path anywhere in the indexed set of
        // markdown paths.  `refreshIndexPaths()` must be called to update
        // the internal `indexSet` from `allMarkdownPaths`; this prevents
        // accidental discovery when the external list changes but the
        // router has not been refreshed (tests rely on this behavior).
        if (indexSet && indexSet.size) {
          for (const p of indexSet) {
            const base = p.replace(/^.*\//, '').replace(/\.(md|html?)$/i, '')
            if (slugify(base) === dec && !/index\.html$/i.test(p)) {
              pageCandidates.push(p)
              break
            }
          }
        }
        // If we didn't discover any candidate from the manifest or slug
        // maps, probe common extensions for a bare slug.  Try `.html` first
        // for friendliness, then `.md`.  Do not add directory index variants
        // here (e.g. `foo/index.html`).
        if (!pageCandidates.length && dec && !/\.(md|html?)$/i.test(dec)) {
          pageCandidates.push(dec + '.html')
          pageCandidates.push(dec + '.md')
        }
      }
      // otherwise leave the list empty; fetchPageData will treat that as
      // a not-found condition rather than guessing a filename.
    } catch (e) { console.warn('[router] buildPageCandidates failed during slug handling', e) }
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

  // incorporate current UI language into cache key so that
  // switching languages yields different entries.  We use a separator
  // unlikely to appear in slugs.
  const lang = (typeof l10n !== 'undefined' && l10n.currentLang) ? l10n.currentLang : ''
  const cacheKey = `${raw}|||${lang}`
  const cached = resolutionCacheGet(cacheKey)
  if (cached) {
    resolved = cached.resolved
    anchor = cached.anchor || anchor
  } else {
    if (!String(resolved).includes('.md') && !String(resolved).includes('.html')) {
      let decoded = decodeURIComponent(String(resolved || ''))
      // strip leading/trailing slashes to match slugManager normalization
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
        } else if (refreshIndexPaths._refreshed || (typeof contentBase === 'string' && /^[a-z][a-z0-9+.-]*:\/\//i.test(contentBase))) {
            // Attempt manifest-based slug resolution when the index has been
            // explicitly refreshed (tests rely on this behaviour), or when
            // running against an absolute `contentBase` (e.g. a dev server
            // such as http://localhost:5173/) where crawling the live server
            // may succeed even without an embedded manifest.
            const found = await ensureSlug(decoded, contentBase)
            if (found) resolved = found
          }
      }
    }
    resolutionCacheSet(cacheKey, { resolved, anchor })
  }

  if (!anchor && hashAnchor) anchor = hashAnchor

  const pageCandidates = buildPageCandidates(resolved)

  // If the only candidate is index.html and the slug is unknown, trigger 404
  if (
    pageCandidates.length === 1 &&
    /index\.html$/i.test(pageCandidates[0]) &&
    (!slugToMd.has(resolved) && !slugToMd.has(decodeURIComponent(String(resolved || ''))))
  ) {
    throw new Error('Unknown slug: index.html fallback prevented')
  }

  let data = null
  let pagePath = null
  let lastErr = null
  for (const candidate of pageCandidates) {
    if (!candidate) continue
    try {
      const norm = normalizePath(candidate)
      data = await fetchMarkdown(norm, contentBase)
      pagePath = norm
      break
    } catch (e) {
      console.warn('[router] candidate fetch failed', e)
      lastErr = e
    }
  }

  if (!data) {
    // throw here so caller can decide how to display not-found message
    // Normalize errors to a consistent value for callers.
    throw new Error('no page data')
  }

  return { data, pagePath, anchor }
}

// helpers exposed for unit tests
// Export internals used by the test-suite and other modules.

