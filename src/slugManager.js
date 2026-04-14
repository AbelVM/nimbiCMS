/**
 * Slug and markdown mapping utilities.
 *
 * Manage slug generation, mapping, and runtime discovery for markdown content.
 *
 * @module slugManager
 */

import * as l10n from './l10nManager.js'
import { refreshIndexPaths, indexSet, isIndexPathsRefreshed } from './indexManager.js'
import { parseHrefToRoute } from './utils/urlHelper.js'
import { getSharedParser } from './utils/sharedDomParser.js'
import { normalizePath, trimTrailingSlash, ensureTrailingSlash, getWorkerPoolSize } from './utils/helpers.js'

import SlugWorker from './worker/slugWorker.js?worker&inline'

import { PowerCache, PowerMemoizer } from 'performance-helpers/powerCache'
import { PowerDeadline } from 'performance-helpers/powerDeadline'
import { PowerPool } from 'performance-helpers/powerPool'
import { PowerSemaphore } from 'performance-helpers/powerSemaphore'
import { debugLog, debugWarn, debugError, isDebug } from './utils/debug.js'
import { yieldIfNeeded } from './utils/idle.js'

/**
 * Localized slug mapping entry. When multilingual sites are configured the
 * value stored for a slug may be an object with a `default` path and a
 * `langs` map with per-language paths.
 * @typedef {{default?:string, langs?: Record<string,string>}} SlugEntry
 */

/**
 * Mapping from a slug (generated from title/H1) to either a markdown path
 * (string) or a localized mapping object (`SlugEntry`) when
 * `availableLanguages` is used.
 * Populated during nav construction, anchor rewriting, or on demand via
 * crawling.
 * @type {Map<string, string|SlugEntry>}
 */
export const slugToMd = new Map()

// Watchers for cold cosmetic hash route requests.
// Map: slug -> Array<string> of original cosmetic tokens (e.g. "#/slug#anchor?params")
const _coldRouteWatchers = new Map()

/**
 * Register interest in a cold cosmetic hash route request so the runtime
 * will print a console message the moment the corresponding slug is
 * added to the slug->md map.
 * @param {{type:string,page:string,anchor?:string,params?:string}} parsed - result from parseHrefToRoute
 */
export function watchForColdHashRoute(parsed) {
  try {
    if (!parsed) return
    let key = HOME_SLUG
    let full = ''
    if (parsed.type === 'cosmetic') {
      const hasPage = (parsed.page != null && String(parsed.page).trim() !== '')
      key = hasPage ? String(parsed.page) : HOME_SLUG
      full = '#/' + (hasPage ? String(parsed.page) : '')
      if (parsed.anchor) full += '#' + String(parsed.anchor)
      if (parsed.params) full += '?' + String(parsed.params)
    } else if (parsed.type === 'path') {
      const hasPage = (parsed.page != null && String(parsed.page).trim() !== '')
      key = hasPage ? String(parsed.page) : HOME_SLUG
      full = '/' + (hasPage ? String(parsed.page) : '')
      if (parsed.anchor) full += '#' + String(parsed.anchor)
      if (parsed.params) full += '?' + String(parsed.params)
    } else if (parsed.type === 'canonical') {
      if (parsed.page) {
        key = parsed.page
        full = '?page=' + encodeURIComponent(parsed.page)
        if (parsed.anchor) full += '#' + String(parsed.anchor)
        if (parsed.params) full += '?' + String(parsed.params)
      } else {
        key = HOME_SLUG
        try {
          full = (typeof location !== 'undefined' && location && location.pathname) ? String(location.pathname) : '/'
          if (typeof location !== 'undefined' && location.search) full += String(location.search)
          if (typeof location !== 'undefined' && location.hash) full += String(location.hash)
        } catch (_) { full = '/' }
      }
    } else {
      return
    }
    const existing = _coldRouteWatchers.get(key) || []
    existing.push(full)
    _coldRouteWatchers.set(key, existing)
  } catch (_) {}
}

function _notifyColdRouteWatchers(slug, rel) {
  try {
    const key = String(slug ?? '')
    const arr = _coldRouteWatchers.get(key)
    if (!arr || !arr.length) return
    try {
      const gh = (typeof globalThis !== 'undefined') ? globalThis : null
      if (gh) {
        try {
          if (!gh.__nimbiColdRouteResolved) gh.__nimbiColdRouteResolved = []
        } catch (_) {}
        for (const tok of arr) {
          try {
            const rec = { slug: key, token: tok, rel: String(rel ?? '') }
            try { gh.__nimbiColdRouteResolved.push(rec) } catch (_) {}
            try { if (gh && typeof gh.dispatchEvent === 'function') gh.dispatchEvent(new CustomEvent('nimbi.coldRouteResolved', { detail: rec })) } catch (_) {}
            try { if (gh && gh.__nimbiUI && typeof gh.__nimbiUI.renderByQuery === 'function') gh.__nimbiUI.renderByQuery().catch(() => {}) } catch (_) {}
          } catch (_) {}
        }
      }
    } catch (_) {}
    _coldRouteWatchers.delete(key)
  } catch (_) {}
}

// Override the instance `set` method to notify any cold-route watchers
// when a new slug key is added. Use the Map prototype methods to avoid
// recursive calls and preserve `instanceof Map` behavior for consumers.
try {
  slugToMd.set = function(k, v) {
    const existed = Map.prototype.has.call(this, k)
    const res = Map.prototype.set.call(this, k, v)
    try {
      if (!existed) {
        const relStr = typeof v === 'string' ? v : (v?.default ?? Object.values(v?.langs ?? {})[0] ?? '')
        _notifyColdRouteWatchers(k, relStr)
      }
    } catch (_) {}
    return res
  }
} catch (_) {}

/**
 * Result returned from `fetchMarkdown`.
 * @typedef {{raw:string,isHtml?:boolean,status?:number}} FetchResult
 */

/**
 * Configured available language codes for the site (e.g. ['en','fr']).
 * When non-empty, slug mappings may store language-specific paths.
 * @type {string[]}
 */
export let availableLanguages = []

/**
 * When true, skip crawling links inside repository-root README files
 * (e.g. `README.md`). If false, README files will be treated like any
 * other markdown page and their links may be discovered during index
 * building. Default: false (treat README like other pages by default).
 * @type {boolean}
 */
export let skipRootReadme = false

/**
 * Configure whether README files at the repository root should be
 * excluded from link discovery during crawling/index building.
 * @param {boolean} v - Truthy to skip root README files, falsy to include.
 * @returns {void} - No return value.
 */
export function setSkipRootReadme(v) { skipRootReadme = !!v }

/**
 * Set available language codes for multilingual sites.
 * @param {string[]} list - Array of language codes (e.g. ['en','fr']).
 * @returns {void} - No return value.
 */
export function setLanguages(list) {
  availableLanguages = Array.isArray(list) ? list.slice() : []
}
/**
 * Return the current list of configured available language codes.
 * @returns {string[]} - Array of available language codes.
 */
export function getLanguages() { return availableLanguages }

async function runWithConcurrency(items, worker, concurrency = 4) {
  if (!Array.isArray(items) || items.length === 0) return []
  const sem = new PowerSemaphore(Math.max(1, Number(concurrency) || 1))
  return Promise.all(items.map((item, idx) => sem.run(() => worker(item, idx))))
}

const poolSize = getWorkerPoolSize()
const slugAutoScaleOptions = {
  intervalMs: 750,
  targetMs: 120,
  hysteresis: 0.3,
  cooldownMs: 1000,
  stepUp: 1,
  stepDown: 1
}
const _slugPool = new PowerPool(SlugWorker, { size: poolSize, minSize: 2, autoScale: slugAutoScaleOptions })

function _slugShouldLog() {
  try { return isDebug() } catch (_e) { return false }
}

/**
 * Lazily return a worker instance used for slug-related background tasks.
 * @returns {Worker|null}
 */
export function initSlugWorker() { return _slugPool.workers?.[0]?.worker?._underlying ?? null }

function _sendToWorker(msg) {
  return _slugPool.postMessage(msg, undefined, { awaitResponse: true, timeout: 5000 })
    .then(result => {
      if (result && typeof result === 'object' && result.error) throw new Error(result.error)
      return result
    })
    .catch(e => {
      const m = e?.message || ''
      if (m.includes('postMessage response timeout')) throw new Error('worker timeout')
      throw e
    })
}

/**
 * Build the search index using the slug worker when available.
 * @param {string} contentBase - Base URL where markdown content is hosted
 * @returns {Promise<Array<{slug:string,title:string,excerpt:string,path:string}>>} - Resolved search index entries.
 */

export async function buildSearchIndexWorker(contentBase, indexDepth = 1, noIndexing = undefined) {
  const w = initSlugWorker && initSlugWorker()
  if (!w) throw new Error('slug worker required but unavailable')
  return await _sendToWorker({ type: 'buildSearchIndex', contentBase, indexDepth, noIndexing })
}



/**
 * Attempt to resolve a slug via the worker when available, otherwise fallback
 * to the main-thread `crawlForSlug` implementation.
 * @param {string} slug - slug to resolve
 * @param {string} base - base content URL used for discovery
 * @param {number} maxQueue - maximum concurrency/queue length for worker
 * @returns {Promise<string|null>} - Resolved markdown path or `null` if not found.
 */
export async function crawlForSlugWorker(slug, base, maxQueue) {
  const w = initSlugWorker && initSlugWorker()
  if (!w) throw new Error('slug worker required but unavailable')
  return _sendToWorker({ type: 'crawlForSlug', slug, base, maxQueue })
}

/**
 * Store a slug -> markdown path mapping, respecting configured languages.
 * @param {string} slug - Slug key to associate with a markdown path.
 * @param {string} rel - Markdown path (relative to content base) to associate with the slug.
 * @returns {void}
 */
export function _storeSlugMapping(slug, rel) {
  if (!slug) return
  let relNorm = null
  try { relNorm = typeof rel === 'string' ? normalizePath(rel) : normalizePath(String(rel ?? '')) } catch (_) { relNorm = String(rel ?? '') }
  if (!relNorm) return

  try {
    if (availableLanguages && availableLanguages.length) {
      const parts = String(relNorm).split('/')
      const firstSeg = parts[0]
      const isLang = availableLanguages.includes(firstSeg)
      let entry = slugToMd.get(slug)
      if (!entry || typeof entry === 'string') {
        entry = { default: typeof entry === 'string' ? normalizePath(entry) : undefined, langs: {} }
      } else {
        try { if (entry.default) entry.default = normalizePath(entry.default) } catch (_) {}
      }
      if (isLang) {
        entry.langs[firstSeg] = relNorm
      } else {
        entry.default = relNorm
      }
      slugToMd.set(slug, entry)
    } else {
      const existing = slugToMd.has(slug) ? slugToMd.get(slug) : undefined
      if (!existing) {
        slugToMd.set(slug, relNorm)
      } else {
        let existingPath = null
        try {
          if (typeof existing === 'string') existingPath = normalizePath(existing)
          else if (existing && typeof existing === 'object') existingPath = existing.default ? normalizePath(existing.default) : null
        } catch (_) { existingPath = null }
        if (existingPath === relNorm) {
          slugToMd.set(slug, relNorm)
        } else {
          let candidate = null
          let i = 2
          while (true) {
            candidate = `${slug}-${i}`
            if (!slugToMd.has(candidate)) break
            let candExisting = slugToMd.get(candidate)
            let candPath = null
            try {
              if (typeof candExisting === 'string') candPath = normalizePath(candExisting)
              else if (candExisting && typeof candExisting === 'object') candPath = candExisting.default ? normalizePath(candExisting.default) : null
            } catch (_) { candPath = null }
            if (candPath === relNorm) {
              slug = candidate
              break
            }
            i += 1
            if (i > 10000) break
          }
          try {
            if (!slugToMd.has(candidate)) {
              slugToMd.set(candidate, relNorm)
              slug = candidate
            } else {
              if (slugToMd.get(candidate) === relNorm) slug = candidate
              else {
                const taken = new Set()
                for (const k of slugToMd.keys()) taken.add(k)
                const newSlug = typeof uniqueSlug === 'function' ? uniqueSlug(slug, taken) : `${slug}-2`
                slugToMd.set(newSlug, relNorm)
                slug = newSlug
              }
            }
          } catch (e) {
            debugWarn('[slugManager] slug collision resolution failed', e)
          }
        }
      }
    }
  } catch (_) {}

  try {
    if (relNorm) {
      try { mdToSlug.set(relNorm, slug) } catch (_) {}
      try {
        if (allMarkdownPathsSet && typeof allMarkdownPathsSet.has === 'function') {
          if (!allMarkdownPathsSet.has(relNorm)) {
            try { allMarkdownPathsSet.add(relNorm) } catch (_) {}
            try { if (Array.isArray(allMarkdownPaths)) allMarkdownPaths.push(relNorm) } catch (_) {}
          }
        } else {
          try { if (Array.isArray(allMarkdownPaths) && !allMarkdownPaths.includes(relNorm)) allMarkdownPaths.push(relNorm) } catch (_) {}
        }
      } catch (_) {}
    }
  } catch (_) {}
}

/**
 * Public alias for `_storeSlugMapping` used by UI/runtime modules.
 * @param {string} slug - Slug key to associate with a markdown path.
 * @param {string} rel - Markdown path (relative to content base) to associate with the slug.
 * @returns {void}
 */
export function storeSlugMapping(slug, rel) {
  return _storeSlugMapping(slug, rel)
}

/**
 * Set of custom slug resolver functions.
 * Each resolver is a function `(slug, contentBase)` that may return a
 * markdown path string or a Promise resolving to a string, or `null` if
 * the slug cannot be resolved.
 * @type {Set<Function>}
 */
export const slugResolvers = new Set()
/**
 * Register a custom resolver function. The function should accept a slug
 * string and return a markdown path (or promise thereof) or `null` if not
 * resolved.
 * @param {(slug:string,contentBase?:string)=>Promise<string|null>|string|null} fn - Resolver function to add.
 * @returns {void} - No return value.
 */
export function addSlugResolver(fn) { if (typeof fn === 'function') slugResolvers.add(fn) }
/**
 * Unregister a previously added resolver.
 * @param {(slug:string)=>void|null} fn - Previously registered resolver to remove.
 * @returns {void} - No return value.
 */
export function removeSlugResolver(fn) { if (typeof fn === 'function') slugResolvers.delete(fn) }
/**
 * Reverse mapping of `slugToMd` (markdown path -> slug).
 * @type {Map<string,string>}
 */
export const mdToSlug = new Map()

let _allMd = {}

/**
 * Array of discovered markdown/html paths (relative to content base).
 * Populated by `_setAllMd` or via `setContentBase` when an index is applied.
 * @type {string[]}
 */
export let allMarkdownPaths = []
/**
 * Derived Set for fast membership checks against `allMarkdownPaths`.
 * Consumers should prefer `allMarkdownPathsSet.has(path)` when checking
 * whether a path is known to avoid O(n) array scans.
 * @type {Set<string>}
 */
export const allMarkdownPathsSet = new Set()

/**
 * Path to the not-found (404) page relative to the content base.
 * Used as a fallback when requested markdown pages are missing.
 * @type {string}
 */
export let notFoundPage = '_404.md'

/**
 * Path to the home page relative to the content base.
 * Used as a fallback during slug resolution when appropriate.
 * @type {string}
 */
export let homePage = null

/**
 * Sentinel slug used internally to represent the site root when a slug
 * cannot be derived from a page title. Centralized here so callers avoid
 * hard-coding the literal `'_home'`.
 * @type {string}
 */
export const HOME_SLUG = '_home'

/**
 * Set the not-found page path used when `fetchMarkdown` encounters a
 * missing markdown file or an HTML response for a `.md` request.
 * @param {string} p - path to use as the not-found page (relative to content base)
 * @returns {void} - No return value.
 */
export function setNotFoundPage(p) {
  if (p == null) {
    notFoundPage = null
    return
  }
  notFoundPage = String(p ?? '')
}

/**
 * Set the home page path used when trying home-page fallbacks during
 * slug resolution. If unset, `_home.md` is used.
 * @param {string} p - path to use as the home page (relative to content base)
 * @returns {void} - No return value.
 */
export function setHomePage(p) {
  if (p == null) {
    homePage = null
    return
  }
  homePage = String(p ?? '')
  try {
    // Notify any cold-route watchers that were waiting for the site root
    // (cases where the cosmetic hash contained no slug and the host
    // intends the home page to be shown).
    try { _notifyColdRouteWatchers(HOME_SLUG, homePage) } catch (_) {}
  } catch (_) {}
}

/**
 * Internal helper to replace the in-memory mapping of slug -> markdown.
 * Intended for bulk updates from an indexer or worker.
 *
 * @param {Record<string,string>} mdMap - Mapping of slug (string) to markdown source.
 * @returns {void}
 */
export function _setAllMd(mdMap) {
  _allMd = mdMap || {}
}

/**
 * Replace the runtime `searchIndex` from an external caller.
 * Useful when a worker returns a prebuilt index and we want the
 * module export to reflect that value for diagnostics and consumers.
 * @param {Array} arr - Array of search index entries
 */
export function _setSearchIndex(arr) {
  try {
    if (!Array.isArray(searchIndex)) {
      searchIndex = []
    }
    if (!Array.isArray(arr)) return
      try {
        searchIndex.length = 0
        for (const it of arr) searchIndex.push(it)
        try {
          if (typeof window !== 'undefined') {
            try { window.__nimbiLiveSearchIndex = searchIndex } catch (_) { /* swallow */ }
          }
        } catch (_) {}
      } catch (e) {
        debugLog('[slugManager] replacing searchIndex by assignment fallback', e)
        try { searchIndex = Array.from(arr) } catch (_) { /* swallow */ }
      }
  } catch (e) {}
}

/** @type {Map<string,string>} */
export const listSlugCache = new Map()
/** @type {Set<string>} */
export const listPathsFetched = new Set()

/**
 * Clear caches used for directory list -> slug mappings and path fetch
 * tracking. Useful for tests and when rebuilding indexes.
 * @returns {void} - No return value.
 */
export function clearListCaches() { listSlugCache.clear(); listPathsFetched.clear() }

function _deriveCommonPrefix(paths) {
  if (!paths || paths.length === 0) return ''
  let prefix = paths[0]
  for (let i = 1; i < paths.length; i++) {
    const p = paths[i]
    let j = 0
    const max = Math.min(prefix.length, p.length)
    while (j < max && prefix[j] === p[j]) j++
    prefix = prefix.slice(0, j)
  }
  const lastSlash = prefix.lastIndexOf('/')
  return lastSlash === -1 ? prefix : prefix.slice(0, lastSlash + 1)
}

/**
 * Generate a URL-friendly slug from a text string (memoized LRU).
 * @param {string} s - Text to generate a URL-friendly slug from.
 * @returns {string}
 */
const _slugifyMemo = new PowerMemoizer(function(s) {
  const MAX_SLUG_LENGTH = 80 // reasonable default to avoid extremely long URLs
  let slug = String(s ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9\- ]/g, '')
    .replace(/ /g, '-')
  slug = slug.replace(/(?:-?)(?:md|html)$/, '')
  slug = slug.replace(/-+/g, '-')
  slug = slug.replace(/^-|-$/g, '')
  if (slug.length > MAX_SLUG_LENGTH) {
    slug = slug.slice(0, MAX_SLUG_LENGTH).replace(/-+$/g, '')
  }
  return slug
}, { keyResolver: (s) => s === undefined ? '__undefined' : String(s), cacheOptions: { maxEntries: 2000 } })

export const slugify = (s) => _slugifyMemo.run(s)

/**
 * Set the content base URL (the runtime `contentPath`) and rebuild slug
 * maps and `allMarkdownPaths` relative to that base.
 * @param {string} [contentBase] - Optional base URL where markdown content is hosted
 * @returns {void} - No return value.
 */
export function setContentBase(contentBase) {
  slugToMd.clear(); mdToSlug.clear(); allMarkdownPaths = []
  try { allMarkdownPathsSet.clear() } catch (e) {}
  availableLanguages = availableLanguages || []
  const isLocalized = !!(availableLanguages && availableLanguages.length)
  const takenSlugs = new Set()

  const keys = Object.keys(_allMd || {})
  if (!keys.length) return

  let prefix = ''
  try {
    if (contentBase) {
      try {
        if (/^[a-z][a-z0-9+.-]*:/i.test(String(contentBase))) {
          prefix = new URL(String(contentBase)).pathname
        } else {
          prefix = String(contentBase ?? '')
        }
      } catch (err) {
        prefix = String(contentBase ?? '')
        debugLog('[slugManager] parse contentBase failed', err)
      }
      prefix = ensureTrailingSlash(prefix)
    }
  } catch (err) { prefix = ''; debugLog('[slugManager] setContentBase prefix derivation failed', err) }

  if (!prefix) prefix = _deriveCommonPrefix(keys)

  for (const fullPath of keys) {
    let rel = fullPath
    if (prefix && fullPath.startsWith(prefix)) {
      rel = normalizePath(fullPath.slice(prefix.length))
    } else {
      rel = normalizePath(fullPath)
    }
    allMarkdownPaths.push(rel)
    try { allMarkdownPathsSet.add(rel) } catch (e) {}

    const val = _allMd[fullPath]
    if (typeof val === 'string') {
      const m = (val || '').match(/^#\s+(.+)$/m)
      if (m && m[1]) {
        const slug = slugify(m[1].trim())
        if (slug) {
          try {
            let slugKey = slug
            if (!isLocalized) {
              slugKey = uniqueSlug(slugKey, takenSlugs)
            }

            if (isLocalized) {
              const parts = rel.split('/')
              const firstSeg = parts[0]
              const isLang = availableLanguages.includes(firstSeg)
              let entry = slugToMd.get(slugKey)
              if (!entry || typeof entry === 'string') {
                entry = { default: typeof entry === 'string' ? entry : undefined, langs: {} }
              }
              if (isLang) {
                entry.langs[firstSeg] = rel
              } else {
                entry.default = rel
              }
              slugToMd.set(slugKey, entry)
            } else {
              slugToMd.set(slugKey, rel)
              takenSlugs.add(slugKey)
            }
            mdToSlug.set(rel, slugKey)
          } catch (_e) { debugLog('[slugManager] set slug mapping failed', _e) }
        }
      }
    }
  }

  try { refreshIndexPaths() } catch (err) { debugLog('[slugManager] refreshIndexPaths failed', err) }
}

try { setContentBase() } catch (err) { debugLog('[slugManager] initial setContentBase failed', err) }


/**
 * Ensure a candidate slug is unique against an existing set.
 * If `base` collides, a numeric suffix is appended ("-2", "-3", ...).
 *
 * @param {string} base - Candidate slug.
 * @param {Set<string>} existing - Set of already-used slugs.
 * @returns {string} - A slug that does not appear in `existing`.
 */
export function uniqueSlug(base, existing) {
  if (!existing.has(base)) return base
  let i = 2
  let candidate = `${base}-${i}`
  while (existing.has(candidate)) {
    i += 1
    candidate = `${base}-${i}`
  }
  return candidate
}

/**
 * Return true for links that point outside the site content (absolute
 * schemes, protocol-relative `//`, etc.). Centralizing this check avoids
 * inconsistencies across crawlers and indexers.
 * @param {string} href - The href to test for being external.
 * @returns {boolean} - True when the href points outside the site content.
 */
/**
 * Return true for links that point outside the site content (absolute
 * schemes, protocol-relative `//`, etc.). Centralized helper.
 * @param {string} href - href parameter
 * @returns {boolean} - True when the href points outside the site content.
 */
export function isExternalLink(href) {
  return isExternalLinkWithBase(href, undefined)
}

/**
 * Determine whether an href points outside of the provided contentBase.
 * If `contentBase` is omitted, this falls back to a conservative check
 * (protocol or protocol-relative URLs are considered external).
 *
 * @param {string} href - href parameter
 * @param {string} [contentBase] - optional absolute or relative content base
 * @returns {boolean} - True when the href points outside the provided content base.
 */
/**
 * Determine whether an href points outside of the provided contentBase.
 * @param {string} href - The href to test for being external.
 * @param {string} [contentBase] - Optional base URL to use when resolving absolute paths.
 * @returns {boolean} - True when the href points outside the provided content base.
 */
export function isExternalLinkWithBase(href, contentBase) {
  if (!href) return false
  if (href.startsWith('//')) return true
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
    if (contentBase && typeof contentBase === 'string') {
      try {
        const h = new URL(href)
        const base = new URL(contentBase)
        if (h.origin !== base.origin) return true
        return !h.pathname.startsWith(base.pathname)
      } catch (err) {
        return true
      }
    }
    return true
  }
  if (href.startsWith('/') && contentBase && typeof contentBase === 'string') {
    try {
      const abs = new URL(href, contentBase)
      const base = new URL(contentBase)
      if (abs.origin !== base.origin) return true
      return !abs.pathname.startsWith(base.pathname)
    } catch (err) {
      return true
    }
  }
  return false
}

/**
 * Unescape Markdown-escaped characters so search titles/excerpts show
 * natural text (e.g. "\\_clearHooks" -> "_clearHooks"). Only a small
 * set of escapable characters per CommonMark is handled here.
 * @param {string} s - Input string potentially containing Markdown escapes.
 * @returns {string} - The unescaped string.
 */
/**
 * Unescape a small set of Markdown-escaped characters.
 * @param {string} s - s parameter
 * @returns {string} - The unescaped string.
 */
export function unescapeMarkdown(s) {
  if (s == null) return s
  return String(s).replace(/\\([\\`*_{}\[\]()#+\-.!])/g, (_m, ch) => ch)
}

/**
 * Given a slug, return the most appropriate markdown path taking the
 * current UI language and available language list into account. If no
 * mapping exists the return value is `null`.
 *
 * @param {string} slug - slug parameter
 * @returns {string|null} - The resolved markdown path for the slug, or `null` if not found.
 */
/**
 * Given a slug, return the most appropriate markdown path taking the
 * current UI language into account.
 * @param {string} slug - slug parameter
 * @returns {string|null} - The resolved markdown path for the slug, or `null` if not found.
 */
export function resolveSlugPath(slug) {
  if (!slug || !slugToMd.has(slug)) return null
  const entry = slugToMd.get(slug)
  if (!entry) return null
  if (typeof entry === 'string') return entry
  if (availableLanguages && availableLanguages.length && l10n.currentLang) {
    if (entry.langs && entry.langs[l10n.currentLang]) {
      return entry.langs[l10n.currentLang]
    }
  }
  if (entry.default) return entry.default
  if (entry.langs) {
    const keys = Object.keys(entry.langs)
    if (keys.length) return entry.langs[keys[0]]
  }
  return null
}

/**
 * Cache of ongoing or completed `fetchMarkdown` promises keyed by resolved URL.
 * Maps absolute URL string -> Promise<FetchResult>.
 * @type {Map<string, Promise<FetchResult>>}
 */
export const fetchCache = new PowerCache({ maxEntries: 2000 })
/**
 * Clear internal fetch cache used by `fetchMarkdown`.
 * @returns {void} - No return value.
 */
export function clearFetchCache() { fetchCache.clear(); negativeFetchCache.clear() }

/**
 * Short-term negative cache for failed fetches. Maps absolute URL -> expiresAt (ms).
 * When a URL is present and not expired, `fetchMarkdown` will reject immediately
 * without issuing a network request.
 * @type {Map<string, number>}
 */
export const negativeFetchCache = new PowerCache({ maxEntries: 2000 })

let NEGATIVE_CACHE_TTL_MS = 60 * 1000 // 1 minute default

/**
 * Adjust the negative-cache TTL (milliseconds). Useful for tests.
 * @param {number} ms - Milliseconds to use for negative caching.
 * @returns {void}
 */
export function setFetchNegativeCacheTTL(ms) {
  NEGATIVE_CACHE_TTL_MS = Number(ms) || 0
}

/**
 * Adjust the fetch cache max size used by `fetchCache` (LRU entries).
 * Useful for tuning memory vs. hit-rate in constrained environments.
 * @param {number} n - Maximum number of entries to retain (>= 0)
 */
export function setFetchCacheMaxSize(n) {
  try {
    const v = Math.max(0, Number(n) || 0)
    if (fetchCache && typeof fetchCache.maxEntries !== 'undefined') fetchCache.maxEntries = v
  } catch (_) {}
}

/**
 * Adjust the fetch cache TTL (ms) used by `fetchCache` if supported.
 * @param {number} ms - Milliseconds to use as TTL for entries (>= 0)
 */
export function setFetchCacheTTL(ms) {
  try {
    const v = Math.max(0, Number(ms) || 0)
    if (fetchCache && typeof fetchCache.defaultTTL !== 'undefined') fetchCache.defaultTTL = v
  } catch (_) {}
}

/**
 * Adjust the negative-fetch cache max size used by `negativeFetchCache`.
 * @param {number} n - Maximum number of entries to retain (>= 0)
 */
export function setNegativeFetchCacheMaxSize(n) {
  try {
    const v = Math.max(0, Number(n) || 0)
    if (negativeFetchCache && typeof negativeFetchCache.maxEntries !== 'undefined') negativeFetchCache.maxEntries = v
  } catch (_) {}
}

let FETCH_CONCURRENCY = Math.max(1, Math.min(poolSize, 5))

/**
 * Set the maximum concurrent fetches used by the runtime indexer/crawler.
 * @param {number} n - Maximum concurrent fetches (must be >= 1)
 * @returns {void}
 */
export function setFetchConcurrency(n) {
  try { FETCH_CONCURRENCY = Math.max(1, Number(n) || 1) } catch (e) { FETCH_CONCURRENCY = 1 }
}

/**
 * Get the currently configured fetch concurrency.
 * @returns {number}
 */
export function getFetchConcurrency() { return FETCH_CONCURRENCY }

/**
 * Fetch markdown content by path.
 * Accepts cosmetic or canonical hrefs and extracts page token for internal fetches.
 * @param {string} path - Path or cosmetic/canonical href (may contain query/hash).
 * @param {string} [base] - Optional base content URL (relative or absolute).
 * @param {{force?:boolean}} [opts] - Options object ({force:true} bypasses guard).
 * @returns {Promise<FetchResult>} Resolves with the fetched content or rejects on failure.
 */
export let fetchMarkdown = async function(path, base, opts) {
  if (!path) throw new Error('path required')
  try {
    if (typeof path === 'string' && (path.indexOf('?page=') !== -1 || path.startsWith('?') || path.startsWith('#/') || path.indexOf('#/') !== -1)) {
      try {
        const parsed = parseHrefToRoute(path)
        if (parsed && parsed.page) path = parsed.page
      } catch (e) {}
    }
  } catch (e) {}
  try {
    const o = (String(path ?? '').match(/([^\/]+)\.md(?:$|[?#])/) || [])[1]
    const isBare = typeof path === 'string' && String(path).indexOf('/') === -1
    const wasPageToken = false
    if (o && (isBare || wasPageToken) && slugToMd.has(o)) {
      const mapped = resolveSlugPath(o) || slugToMd.get(o)
      if (mapped && mapped !== path) {
        path = mapped
      }
    }
  } catch (err) { debugLog('[slugManager] slug mapping normalization failed', err) }
  try {
    if (typeof path === 'string' && path.indexOf('::') !== -1) {
      const left = String(path).split('::', 1)[0]
      if (left) {
        try {
          if (slugToMd.has(left)) {
            const mapped = resolveSlugPath(left) || slugToMd.get(left)
            if (mapped) path = mapped
            else path = left
          } else {
            path = left
          }
        } catch (_) {
          path = left
        }
      }
    }
  } catch (err) { debugLog('[slugManager] path sanitize failed', err) }
  // If a content `base` was provided and the `path` accidentally
  // includes the base's pathname (for example when links were authored
  // as "nimbiCMS_pre/assets/..." or "/nimbiCMS_pre/...' in a site
  // served under that subpath), strip the leading base pathname so
  // subsequent resolution does not duplicate the pageDir.
  try {
    if (base) {
      try {
        const baseUrl = (/^[a-z][a-z0-9+.-]*:/i.test(String(base))) ? new URL(String(base)) : new URL(String(base), (typeof location !== 'undefined' ? location.origin : 'http://localhost'))
        let bp = (baseUrl.pathname || '')
        bp = bp.replace(/^\/+|\/+$/g, '') // trim slashes
        if (bp) {
          try {
            const pRaw = String(path ?? '')
            // If path is an absolute URL, don't modify it
            if (!/^[a-z][a-z0-9+.-]*:/i.test(pRaw)) {
              let p = pRaw.replace(/^\/+/, '')
              if (p === bp) {
                path = ''
              } else if (p.startsWith(bp + '/')) {
                path = p.slice(bp.length + 1)
              } else {
                path = p
              }
            }
          } catch (_) {}
        }
      } catch (_) {}
    }
  } catch (_) {}

  const allowFetch = (opts && opts.force === true) || (typeof notFoundPage === 'string' && notFoundPage) || (slugToMd && slugToMd.size) || (allMarkdownPathsSet && allMarkdownPathsSet.size) || isDebug()
  if (!allowFetch) {
    throw new Error('failed to fetch md')
  }
  const baseClean = base == null ? '' : trimTrailingSlash(String(base))
  let url = ''
  try {
    const origin = (typeof location !== 'undefined' && location.origin) ? location.origin : 'http://localhost'
    // Build a consistent absolute base URL to resolve the `path` against.
    // Prefer `base` when it's an absolute URL; otherwise compose an
    // absolute base using the current origin so `new URL()` can correctly
    // handle absolute/relative `path` values without manual string ops.
    let baseForResolve = origin.replace(/\/$/, '') + '/'
    if (baseClean) {
      if (/^[a-z][a-z0-9+.-]*:/i.test(baseClean)) {
        baseForResolve = baseClean.replace(/\/$/, '') + '/'
      } else if (baseClean.startsWith('/')) {
        baseForResolve = origin.replace(/\/$/, '') + baseClean.replace(/\/$/, '') + '/'
      } else {
        baseForResolve = origin.replace(/\/$/, '') + '/' + baseClean.replace(/\/$/, '') + '/'
      }
    }
    try {
      url = new URL(path.replace(/^\//, ''), baseForResolve).toString()
    } catch (err) {
      // Fallback to a conservative concatenation if URL resolution fails.
      url = origin.replace(/\/$/, '') + '/' + path.replace(/^\//, '')
    }
  } catch (err) {
    url = (typeof location !== 'undefined' && location.origin ? location.origin : 'http://localhost') + '/' + path.replace(/^\//, '')
  }
  const signal = opts && opts.signal
  const fetchWithDeadline = async (targetUrl) => {
    if (PowerDeadline && typeof PowerDeadline.run === 'function') {
      return await PowerDeadline.run(
        () => fetch(targetUrl, signal ? { signal } : undefined),
        { attemptTimeout: 10_000, maxAttempts: 1, signal: signal || null }
      )
    }
    let mergedSignal = signal || null
    try {
      if (!mergedSignal && typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
        mergedSignal = AbortSignal.timeout(10_000)
      } else if (mergedSignal && typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function' && typeof AbortSignal.any === 'function') {
        mergedSignal = AbortSignal.any([mergedSignal, AbortSignal.timeout(10_000)])
      }
    } catch (_) {}
    return await fetch(targetUrl, mergedSignal ? { signal: mergedSignal } : undefined)
  }

  try {
    const neg = negativeFetchCache.get(url)
    if (neg && neg > Date.now()) {
      return Promise.reject(new Error('failed to fetch md'))
    }
    if (neg) negativeFetchCache.delete(url)
  } catch (_) {}

  if (fetchCache.has(url)) {
    return fetchCache.get(url)
  }

  const promise = (async () => {
    const res = await fetchWithDeadline(url)
    if (!res || typeof res.ok !== 'boolean' || !res.ok) {
      if (res && res.status === 404) {
          if (typeof notFoundPage === 'string' && notFoundPage) {
            try {
              const p404 = `${baseClean}/${notFoundPage}`
              const r404 = await fetchWithDeadline(p404)
              if (r404 && typeof r404.ok === 'boolean' && r404.ok) {
                const raw404 = await r404.text()
                return { raw: raw404, status: 404 }
              }
            } catch (_ee) { debugLog('[slugManager] fetching fallback 404 failed', _ee) }
          }
        }
      let body = ''
      try {
        if (res && typeof res.clone === 'function') {
          body = await res.clone().text()
        } else if (res && typeof res.text === 'function') {
          body = await res.text()
        } else {
          body = ''
        }
      } catch (err) {
        body = ''
        debugLog('[slugManager] reading error body failed', err)
      }
      try {
        const status = res ? res.status : undefined
        if (status === 404) {
          try { debugWarn('fetchMarkdown failed (404):', () => ({ url, status, statusText: res ? res.statusText : undefined, body: body.slice(0, 200) })) } catch (e) {}
        } else {
          try { debugError('fetchMarkdown failed:', () => ({ url, status, statusText: res ? res.statusText : undefined, body: body.slice(0, 200) })) } catch (e) {}
        }
      } catch (e) {}
      throw new Error('failed to fetch md')
      throw new Error('failed to fetch md')
    }
    const raw = await res.text()
    const trimmed = raw.trim().slice(0, 128).toLowerCase()
    const looksLikeHtml = /^(?:<!doctype|<html|<title|<h1)/.test(trimmed)
    const isHtml = looksLikeHtml || String(path ?? '').toLowerCase().endsWith('.html')

    if (looksLikeHtml && String(path ?? '').toLowerCase().endsWith('.md')) {
      try {
        if (typeof notFoundPage === 'string' && notFoundPage) {
          const p404 = `${baseClean}/${notFoundPage}`
          const r404 = await fetchWithDeadline(p404)
          if (r404.ok) {
            const raw404 = await r404.text()
            return { raw: raw404, status: 404 }
          }
        }
      } catch (_ee) { debugLog('[slugManager] fetching fallback 404 failed', _ee) }
      if (_slugShouldLog()) debugError('fetchMarkdown: server returned HTML for .md request', url)
      throw new Error('failed to fetch md')
    }

    return isHtml ? { raw, isHtml: true } : { raw }
  })()

  const tracked = promise.catch(err => {
    if (err && (err.name === 'AbortError' || err.code === 'EABORT' || err.code === 'EDEADLINE')) {
      try { fetchCache.delete(url) } catch (_) {}
      throw err
    }
    try { negativeFetchCache.set(url, Date.now() + NEGATIVE_CACHE_TTL_MS) } catch (_) {}
    try { fetchCache.delete(url) } catch (_) {}
    throw err
  })

  fetchCache.set(url, tracked)
  return tracked
}

/**
 * Override the internal fetchMarkdown implementation. Useful for tests
 * or when consumers want to provide a bespoke fetch strategy.
 * @param {(path:string, base?:string)=>Promise<FetchResult>} fn - Custom fetch function used to load markdown. Receives `(path, base)` and must return a `FetchResult` promise.
 * @returns {void} - No return value.
 */
export function setFetchMarkdown(fn) {
  if (typeof fn === 'function') {
    fetchMarkdown = fn
  }
}

/**
 * Cache used by `crawlForSlug` to memoize results keyed by decoded slug.
 * Values are the resolved path string or `null` when not found.
 * @type {Map<string,string|null>}
 */
export const crawlCache = new Map()

/**
 * Remove code blocks, inline code, and HTML comments from markdown
 * to avoid extracting links that appear only inside code or comments.
 * @param {string} raw - Raw markdown/HTML text to strip code blocks and comments from.
 * @returns {string} - The input with code blocks, inline code, and HTML comments removed.
 */
function _stripCodeAndComments(raw) {
  if (!raw || typeof raw !== 'string') return ''
  let s = raw.replace(/```[\s\S]*?```/g, '')
  s = s.replace(/<pre[\s\S]*?<\/pre>/gi, '')
  s = s.replace(/<code[\s\S]*?<\/code>/gi, '')
  s = s.replace(/<!--([\s\S]*?)-->/g, '')
  s = s.replace(/^ {4,}.*$/gm, '')
  s = s.replace(/`[^`]*`/g, '')
  return s
}

/** @type {Array<{slug:string,title:string,excerpt:string,path:string}>} */
export let searchIndex = []

/**
 * Return the live `searchIndex` array (not a copy).
 * Consumers should avoid mutating the returned array directly.
 * @returns {Array}
 */
export function getSearchIndex() { return searchIndex }

try {
  if (typeof window !== 'undefined') {
    try {
      Object.defineProperty(window, '__nimbiSearchIndex', {
        get() { return searchIndex },
        enumerable: true,
        configurable: true
      })
    } catch (e) {
      try { window.__nimbiSearchIndex = searchIndex } catch (_) {}
    }
  }
} catch (_) {}

try {
  if (typeof window !== 'undefined') {
    try {
      Object.defineProperty(window, '__nimbiIndexReady', {
        get() { return awaitSearchIndex },
        enumerable: true,
        configurable: true
      })
    } catch (e) {
      try { window.__nimbiIndexReady = awaitSearchIndex } catch (_) {}
    }
  }
} catch (_) {}

let _indexPromise = null

/**
 * Build the runtime search index by scanning known markdown/html paths
 * and crawling where necessary. The returned array is the authoritative
 * `searchIndex` used by runtime sitemap and search consumers.
 *
 * @param {string} [contentBase] - Base URL where content is hosted.
 * @param {number} [indexDepth=1] - Depth of indexing (1=page, 2=include H2s, 3=include H3s).
 * @param {Array<string>|undefined} [noIndexing] - Paths to exclude from indexing.
 * @param {Array<string>|undefined} [seedPaths] - Optional seed paths to prioritize.
 * @returns {Promise<Array<{slug:string,title:string,excerpt:string,path:string}>>} - Resolves to the authoritative search index.
 */
export async function buildSearchIndex(contentBase, indexDepth = 1, noIndexing = undefined, seedPaths = undefined) {
  const earlyExcludes = Array.isArray(noIndexing) ? Array.from(new Set((noIndexing || []).map(p => normalizePath(String(p ?? ''))))) : []
  try {
    const nf = normalizePath(String(notFoundPage ?? ''))
    if (nf && !earlyExcludes.includes(nf)) earlyExcludes.push(nf)
  } catch (err) {}

  if (searchIndex && searchIndex.length && indexDepth === 1) {
    const containsExcluded = searchIndex.some(e => {
      try { return earlyExcludes.includes(normalizePath(String(e.path ?? ''))) } catch (_) { return false }
    })
    if (!containsExcluded) return searchIndex
  }
  if (_indexPromise) return _indexPromise

  _indexPromise = (async () => {
    let excludes = Array.isArray(noIndexing) ? Array.from(new Set((noIndexing || []).map(p => normalizePath(String(p ?? ''))))) : []
    try {
      const nf = normalizePath(String(notFoundPage ?? ''))
      if (nf && !excludes.includes(nf)) excludes.push(nf)
    } catch (err) { /* ignore normalization errors */ }

    const isExcluded = (p) => {
      if (!excludes || !excludes.length) return false
      for (const ex of excludes) {
        if (!ex) continue
        if (p === ex) return true
        if (p.startsWith(ex + '/')) return true
      }
      return false
    }

    let paths = []
    try {
      if (Array.isArray(seedPaths) && seedPaths.length) {
        for (const p of seedPaths) {
          try {
            const n = normalizePath(String(p ?? ''))
            if (n) paths.push(n)
          } catch (_) {}
        }
      }
    } catch (_) {}
    if (Array.isArray(allMarkdownPaths) && allMarkdownPaths.length) {
      paths = Array.from(allMarkdownPaths)
    }
    if (!paths.length) {
      if (mdToSlug && typeof mdToSlug.size === 'number' && mdToSlug.size) {
        try { paths = Array.from(mdToSlug.keys()) } catch (_) { paths = [] }
      } else {
        for (const v of slugToMd.values()) {
          if (!v) continue
          if (typeof v === 'string') {
            paths.push(v)
          } else if (v && typeof v === 'object') {
            if (v.default) paths.push(v.default)
            const langs = v.langs || {}
            for (const k of Object.keys(langs || {})) {
              try { if (langs[k]) paths.push(langs[k]) } catch (_) {}
            }
          }
        }
      }
    }
    try {
      const crawled = await crawlAllMarkdown(contentBase)
      if (crawled && crawled.length) {
        paths = paths.concat(crawled)
      }
    } catch (err) { debugLog('[slugManager] crawlAllMarkdown during buildSearchIndex failed', err) }

    try {
      const visited = new Set(paths)
      const queue = [...paths]

      const fetchConcurrency = Math.max(1, Math.min(getFetchConcurrency(), queue.length || getFetchConcurrency()))

      let workerYieldCount = 0
      const worker = async () => {
        while (true) {
          if (visited.size > defaultCrawlMaxQueue) break
          const p = queue.shift()
          if (!p) break
          try {
            const md = await fetchMarkdown(p, contentBase)
            if (md && md.raw) {
              if (md.status === 404) continue
              let raw = md.raw
              const hrefs = []
              const baseName = String(p ?? '').replace(/^.*\//, '')
              if (/^readme(?:\.md)?$/i.test(baseName)) {
                if (skipRootReadme) {
                  if (!p || !p.includes('/')) {
                    continue
                  }
                }
              }
              const clean = _stripCodeAndComments(raw)
              const mdLinkRe = /\[[^\]]+\]\(([^)]+)\)/g
              let m
              while ((m = mdLinkRe.exec(clean))) {
                hrefs.push(m[1])
              }
              const htmlLinkRe = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi
              while ((m = htmlLinkRe.exec(clean))) {
                hrefs.push(m[1])
              }
              const pageDirForLinks = (p && p.includes('/')) ? p.substring(0, p.lastIndexOf('/') + 1) : ''
              for (let href of hrefs) {
                try {
                  if (isExternalLinkWithBase(href, contentBase)) continue
                  if (href.startsWith('..') || href.indexOf('/../') !== -1) continue
                  if (pageDirForLinks && !href.startsWith('./') && !href.startsWith('/') && !href.startsWith('../')) {
                    href = pageDirForLinks + href
                  }
                  href = normalizePath(href)
                  if (!/\.(md|html?)(?:$|[?#])/i.test(href)) continue
                  href = href.split(/[?#]/)[0]
                  if (isExcluded(href)) continue
                  if (!visited.has(href)) {
                    visited.add(href)
                    queue.push(href)
                    paths.push(href)
                  }
                } catch (err) { debugLog('[slugManager] href processing failed', href, err) }
              }
            }
          } catch (e) {
            debugLog('[slugManager] discovery fetch failed for', p, e)
          }
          try { workerYieldCount++; await yieldIfNeeded(workerYieldCount, 32) } catch (_) {}
        }
      }

      const workers = []
      for (let i = 0; i < fetchConcurrency; i++) workers.push(worker())
      await Promise.all(workers)
    } catch (e) {
      debugLog('[slugManager] discovery loop failed', e)
    }

    const seen = new Set()
    paths = paths.filter(p => {
      if (!p || seen.has(p)) return false
      if (isExcluded(p)) return false
      seen.add(p)
      return true
    })
    const idx = []

    const pathMdMap = new Map()
    const pathsToFetch = paths.filter(p => /\.(?:md|html?)(?:$|[?#])/i.test(p))
    const fetchConcurrency = Math.max(1, Math.min(getFetchConcurrency(), pathsToFetch.length || 1))
    const fetchQueue = pathsToFetch.slice()
    const fetchWorkers = []
    for (let i = 0; i < fetchConcurrency; i++) {
      fetchWorkers.push((async () => {
        while (fetchQueue.length) {
          const p = fetchQueue.shift()
          if (!p) break
          try {
            const md = await fetchMarkdown(p, contentBase)
            pathMdMap.set(p, md)
          } catch (err) {
            debugLog('[slugManager] buildSearchIndex: entry fetch failed', p, err)
            pathMdMap.set(p, null)
          }
        }
      })())
    }
    await Promise.all(fetchWorkers)

    let processYieldCount = 0
    for (const path of paths) {
      try { processYieldCount++; await yieldIfNeeded(processYieldCount, 16) } catch (_) {}
      if (!/\.(?:md|html?)(?:$|[?#])/i.test(path)) continue
      try {
        const md = pathMdMap.get(path)
        if (!md || !md.raw) continue
        if (md.status === 404) continue
        let title = ''
        let excerpt = ''
        let pageSlug = null
        if (md.isHtml) {
          try {
            const parser = getSharedParser()
            const doc = parser ? parser.parseFromString(md.raw, 'text/html') : null
            const titleEl = doc ? (doc.querySelector('title') || doc.querySelector('h1')) : null
            if (titleEl && titleEl.textContent) title = titleEl.textContent.trim()
            const p = doc ? doc.querySelector('p') : null
            if (p && p.textContent) excerpt = p.textContent.trim()
              if (indexDepth >= 2) {
              try {
                const topH1 = doc ? doc.querySelector('h1') : null
                const parentTitle = topH1 && topH1.textContent ? topH1.textContent.trim() : (title || '')
                try {
                  const existing = (mdToSlug && typeof mdToSlug.has === 'function' && mdToSlug.has(path)) ? mdToSlug.get(path) : null
                  if (existing) {
                    pageSlug = existing
                  } else {
                    let cand = slugify(title || path)
                    const taken = new Set()
                    try { for (const k of slugToMd.keys()) taken.add(k) } catch (_) {}
                    try {
                      for (const it of idx) {
                        if (it && it.slug) taken.add(String(it.slug).split('::')[0])
                      }
                    } catch (_) {}
                    let belongs = false
                    try {
                      if (slugToMd.has(cand)) {
                        const val = slugToMd.get(cand)
                        if (typeof val === 'string') {
                          if (val === path) belongs = true
                        } else if (val && typeof val === 'object') {
                          if (val.default === path) belongs = true
                          for (const k of Object.keys(val.langs || {})) { if (val.langs[k] === path) { belongs = true; break } }
                        }
                      }
                    } catch (_) {}
                    if (!belongs && taken.has(cand)) {
                      cand = uniqueSlug(cand, taken)
                    }
                    pageSlug = cand
                    try { if (!mdToSlug.has(path)) _storeSlugMapping(pageSlug, path) } catch (_) {}
                  }
                } catch (err) { debugLog('[slugManager] derive pageSlug failed', err) }
                const h2s = Array.from(doc.querySelectorAll('h2'))
                for (const h2 of h2s) {
                  try {
                    const h2Text = (h2.textContent || '').trim()
                    if (!h2Text) continue
                    const anchor = h2.id ? h2.id : slugify(h2Text)
                    const h2Slug = pageSlug ? `${pageSlug}::${anchor}` : `${slugify(path)}::${anchor}`
                    let h2Excerpt = ''
                    let sib = h2.nextElementSibling
                    while (sib && sib.tagName && sib.tagName.toLowerCase() === 'script') sib = sib.nextElementSibling
                    if (sib && sib.textContent) h2Excerpt = String(sib.textContent).trim()
                    idx.push({ slug: h2Slug, title: h2Text, excerpt: h2Excerpt, path, parentTitle })
                  } catch (err) { debugLog('[slugManager] indexing H2 failed', err) }
                }
                if (indexDepth === 3) {
                  try {
                    const h3s = Array.from(doc.querySelectorAll('h3'))
                    for (const h3 of h3s) {
                      try {
                        const h3Text = (h3.textContent || '').trim()
                        if (!h3Text) continue
                        const anchor3 = h3.id ? h3.id : slugify(h3Text)
                        const h3Slug = pageSlug ? `${pageSlug}::${anchor3}` : `${slugify(path)}::${anchor3}`
                        let h3Excerpt = ''
                        let sib3 = h3.nextElementSibling
                        while (sib3 && sib3.tagName && sib3.tagName.toLowerCase() === 'script') sib3 = sib3.nextElementSibling
                        if (sib3 && sib3.textContent) h3Excerpt = String(sib3.textContent).trim()
                        idx.push({ slug: h3Slug, title: h3Text, excerpt: h3Excerpt, path, parentTitle })
                      } catch (err) { debugLog('[slugManager] indexing H3 failed', err) }
                    }
                  } catch (err) { debugLog('[slugManager] collect H3s failed', err) }
                }
              } catch (err) { debugLog('[slugManager] collect H2s failed', err) }
            }
          } catch (err) { debugLog('[slugManager] parsing HTML for index failed', err) }
        } else {
          const raw = md.raw
          const h1m = raw.match(/^#\s+(.+)$/m)
          title = h1m ? h1m[1].trim() : ''
          try { title = unescapeMarkdown(title) } catch (_) {}
          const parts = raw.split(/\r?\n\s*\r?\n/)
          if (parts.length > 1) {
            for (let i = 1; i < parts.length; i++) {
              const p = parts[i].trim()
              if (p && !/^#/.test(p)) { excerpt = p.replace(/\r?\n/g, ' '); break }
            }
          }
            if (indexDepth >= 2) {
            let parentTitle = ''
            try {
              const h1 = (raw.match(/^#\s+(.+)$/m) || [])[1]
              parentTitle = h1 ? h1.trim() : ''
              try {
                const existing = (mdToSlug && typeof mdToSlug.has === 'function' && mdToSlug.has(path)) ? mdToSlug.get(path) : null
                if (existing) {
                  pageSlug = existing
                } else {
                  let cand = slugify(title || path)
                  const taken = new Set()
                  try { for (const k of slugToMd.keys()) taken.add(k) } catch (_) {}
                  try {
                    for (const it of idx) {
                      if (it && it.slug) taken.add(String(it.slug).split('::')[0])
                    }
                  } catch (_) {}
                  let belongs = false
                  try {
                    if (slugToMd.has(cand)) {
                      const val = slugToMd.get(cand)
                      if (typeof val === 'string') {
                        if (val === path) belongs = true
                      } else if (val && typeof val === 'object') {
                        if (val.default === path) belongs = true
                        for (const k of Object.keys(val.langs || {})) { if (val.langs[k] === path) { belongs = true; break } }
                      }
                    }
                  } catch (_) {}
                  if (!belongs && taken.has(cand)) {
                    cand = uniqueSlug(cand, taken)
                  }
                  pageSlug = cand
                  try { if (!mdToSlug.has(path)) _storeSlugMapping(pageSlug, path) } catch (_) {}
                }
              } catch (err) { debugLog('[slugManager] derive pageSlug failed', err) }
              const h2re = /^##\s+(.+)$/gm
              let m2
              while ((m2 = h2re.exec(raw))) {
                try {
                  const h2Text = (m2[1] || '').trim()
                    const unescH2 = unescapeMarkdown(h2Text)
                  if (!h2Text) continue
                  const anchor = slugify(h2Text)
                  const h2Slug = pageSlug ? `${pageSlug}::${anchor}` : `${slugify(path)}::${anchor}`
                  const after = raw.slice(h2re.lastIndex)
                  const paraMatch = after.match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/)
                  const h2Excerpt = paraMatch && paraMatch[1] ? String(paraMatch[1]).trim().split(/\r?\n/).join(' ').slice(0, 300) : ''
                    idx.push({ slug: h2Slug, title: unescH2, excerpt: h2Excerpt, path, parentTitle })
                } catch (err) { debugLog('[slugManager] indexing markdown H2 failed', err) }
              }
            } catch (err) { debugLog('[slugManager] collect markdown H2s failed', err) }
            if (indexDepth === 3) {
              try {
                const h3re = /^###\s+(.+)$/gm
                let m3
                while ((m3 = h3re.exec(raw))) {
                  try {
                    const h3Text = (m3[1] || '').trim()
                      const unescH3 = unescapeMarkdown(h3Text)
                    if (!h3Text) continue
                    const anchor3 = slugify(h3Text)
                    const h3Slug = pageSlug ? `${pageSlug}::${anchor3}` : `${slugify(path)}::${anchor3}`
                    const after3 = raw.slice(h3re.lastIndex)
                    const paraMatch3 = after3.match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/)
                    const h3Excerpt = paraMatch3 && paraMatch3[1] ? String(paraMatch3[1]).trim().split(/\r?\n/).join(' ').slice(0, 300) : ''
                      idx.push({ slug: h3Slug, title: unescH3, excerpt: h3Excerpt, path, parentTitle })
                  } catch (err) { debugLog('[slugManager] indexing markdown H3 failed', err) }
                }
              } catch (err) { debugLog('[slugManager] collect markdown H3s failed', err) }
            }
          }
        }
        let slug = ''
        try {
          if (mdToSlug.has(path)) slug = mdToSlug.get(path)
        } catch (err) { debugLog('[slugManager] mdToSlug access failed', err) }

        if (!slug) {
          try {
            if (!pageSlug) {
              const existing = (mdToSlug && typeof mdToSlug.has === 'function' && mdToSlug.has(path)) ? mdToSlug.get(path) : null
              if (existing) {
                pageSlug = existing
              } else {
                let cand = slugify(title || path)
                const taken = new Set()
                try { for (const k of slugToMd.keys()) taken.add(k) } catch (_) {}
                try {
                  for (const it of idx) {
                    if (it && it.slug) taken.add(String(it.slug).split('::')[0])
                  }
                } catch (_) {}
                let belongs = false
                try {
                  if (slugToMd.has(cand)) {
                    const val = slugToMd.get(cand)
                    if (typeof val === 'string') {
                      if (val === path) belongs = true
                    } else if (val && typeof val === 'object') {
                      if (val.default === path) belongs = true
                      for (const k of Object.keys(val.langs || {})) { if (val.langs[k] === path) { belongs = true; break } }
                    }
                  }
                } catch (_) {}
                if (!belongs && taken.has(cand)) {
                  cand = uniqueSlug(cand, taken)
                }
                pageSlug = cand
                try { if (!mdToSlug.has(path)) _storeSlugMapping(pageSlug, path) } catch (_) {}
              }
            }
          } catch (err) { debugLog('[slugManager] derive pageSlug failed', err) }
          slug = pageSlug || slugify(title || path)
        }
        idx.push({ slug, title, excerpt, path })
      } catch (err) {
        debugLog('[slugManager] buildSearchIndex: entry processing failed', err)
      }
    }
    try {
      const finalIdx = idx.filter(entry => {
        try { return !isExcluded(String(entry.path ?? '')) } catch (_) { return true }
      })
      try {
        if (!Array.isArray(searchIndex)) searchIndex = []
        searchIndex.length = 0
        for (const it of finalIdx) searchIndex.push(it)
      } catch (e) {
        try { searchIndex = Array.from(finalIdx) } catch (_) { searchIndex = finalIdx }
      }
      try {
        if (typeof window !== 'undefined') {
          try { window.__nimbiResolvedIndex = searchIndex } catch (e) {}
          try {
            const dedup = []
            const seenBase = new Set()
            for (const it of searchIndex) {
              try {
                if (!it || !it.slug) continue
                const base = String(it.slug).split('::')[0]
                if (seenBase.has(base)) continue
                seenBase.add(base)
                const entry = { slug: base }
                if (it.title) entry.title = String(it.title)
                else if (it.parentTitle) entry.title = String(it.parentTitle)
                if (it.path) entry.path = String(it.path)
                dedup.push(entry)
              } catch (_) {}
            }
            try { window.__nimbiSitemapJson = { generatedAt: new Date().toISOString(), entries: dedup } } catch (_) {}
            try { window.__nimbiSitemapFinal = dedup } catch (_) {}
          } catch (_) {}
        }
      } catch (e) {}
    } catch (err) {
      debugLog('[slugManager] filtering index by excludes failed', err)
      try {
        if (!Array.isArray(searchIndex)) searchIndex = []
        searchIndex.length = 0
        for (const it of idx) searchIndex.push(it)
      } catch (e) {
        try { searchIndex = Array.from(idx) } catch (_) { searchIndex = idx }
      }
      try {
        if (typeof window !== 'undefined') {
          try { window.__nimbiResolvedIndex = searchIndex } catch (e) {}
        }
      } catch (e) {}
    }
    return searchIndex
  })()
  try { await _indexPromise } catch (err) { debugLog('[slugManager] awaiting _indexPromise failed', err) }
  _indexPromise = null
  return searchIndex
}

/**
 * Wait for the runtime `searchIndex` to be populated. If an index build is
 * already in progress this will await it; otherwise it will optionally kick
 * off a build (worker-first) and await completion. Returns the live
 * `searchIndex` array (possibly empty on timeout).
 *
 * @param {{timeoutMs?:number,contentBase?:string,indexDepth?:number,noIndexing?:string[],seedPaths?:string[],startBuild?:boolean}} opts
 * @returns {Promise<Array>} resolves to the live `searchIndex` array
 */
export async function whenSearchIndexReady(opts = {}) {
  try {
    const timeoutMs = (typeof opts.timeoutMs === 'number') ? opts.timeoutMs : 8000
    const contentBase = opts.contentBase
    const indexDepth = (typeof opts.indexDepth === 'number') ? opts.indexDepth : 1
    const noIndexing = Array.isArray(opts.noIndexing) ? opts.noIndexing : undefined
    const seedPaths = Array.isArray(opts.seedPaths) ? opts.seedPaths : undefined
    const startBuild = (typeof opts.startBuild === 'boolean') ? opts.startBuild : true

    if (Array.isArray(searchIndex) && searchIndex.length && !_indexPromise && !startBuild) return searchIndex

    if (_indexPromise) {
      try { await _indexPromise } catch (_) {}
      return searchIndex
    }

    if (startBuild) {
      try {
        if (typeof buildSearchIndexWorker === 'function') {
          try {
            const res = await buildSearchIndexWorker(contentBase, indexDepth, noIndexing, seedPaths)
            if (Array.isArray(res) && res.length) {
              try { _setSearchIndex(res) } catch (_) {}
              return searchIndex
            }
          } catch (_) {}
        }
      } catch (_) {}
      try {
        await buildSearchIndex(contentBase, indexDepth, noIndexing, seedPaths)
        return searchIndex
      } catch (_) {}
    }

    const start = Date.now()
    while (Date.now() - start < timeoutMs) {
      if (Array.isArray(searchIndex) && searchIndex.length) return searchIndex
       
      await new Promise(r => setTimeout(r, 150))
    }
    return searchIndex
  } catch (e) {
    return searchIndex
  }
}

  /**
   * Await the runtime `searchIndex` without a timeout. This wrapper ensures
   * the canonical index is built (worker-first) and will wait indefinitely
   * until the index is available or a build completes. Callers that must
   * not use timeouts should use this API instead of `whenSearchIndexReady`.
   *
  * @param {{contentBase?:string,indexDepth?:number,noIndexing?:string[],seedPaths?:string[],startBuild?:boolean,timeoutMs?:number}} opts
   * @returns {Promise<Array>} resolves to the live `searchIndex` array
   */
  export async function awaitSearchIndex(opts = {}) {
    try {
      const o = Object.assign({}, opts)
      if (typeof o.startBuild !== 'boolean') o.startBuild = true
      if (typeof o.timeoutMs !== 'number') o.timeoutMs = Infinity
      try {
        return await whenSearchIndexReady(o)
      } catch (_) {
        return searchIndex
      }
    } catch (e) {
      return searchIndex
    }
  }

/**
 * Default maximum number of entries the crawler queue will accept. This is
 * used as a safety cap to avoid unbounded crawling on poorly-behaved sites.
 * @type {number}
 */
export const CRAWL_MAX_QUEUE = 1000

/**
 * Mutable default used by crawler functions; may be changed via
 * `setDefaultCrawlMaxQueue` to tune crawling behavior at runtime.
 * @type {number}
 */
export let defaultCrawlMaxQueue = CRAWL_MAX_QUEUE

/**
 * Set the default maximum crawl queue size used by crawlers.
 * @param {number} n - Maximum crawl queue size to set.
 * @returns {void} - No return value.
 */
export function setDefaultCrawlMaxQueue(n) {
  if (typeof n === 'number' && n >= 0) defaultCrawlMaxQueue = n
}

const _crawlParser = getSharedParser()
const _crawlLinkSelector = 'a[href]'

/**
 * Crawl the content directory looking for a markdown whose H1 slug produces
 * the provided decoded value.  This uses directory listings (HTML) to
 * discover files; if the server does not expose listings the crawl will
 * simply fail gracefully.
 *
 * This is exported as a `let` so that tests can override or spy on it; the
 * router and `ensureSlug` call the mutable binding instead of a fixed
 * function so mocks take effect.
 *
 * @type {(decoded: string, contentBase: string, maxQueue?: number) => Promise<string|null>}
 */
export let crawlForSlug = async function(decoded, contentBase, maxQueue = defaultCrawlMaxQueue) {
  if (crawlCache.has(decoded)) return crawlCache.get(decoded)
  let found = null
  const seenDirs = new Set()
  const queue = ['']

  const origin = (typeof location !== 'undefined' && location.origin) ? location.origin : 'http://localhost'
  let baseForResolve = origin + '/'
  try {
    if (contentBase) {
      if (/^[a-z][a-z0-9+.-]*:/i.test(String(contentBase))) {
        baseForResolve = String(contentBase).replace(/\/$/, '') + '/'
      } else if (String(contentBase).startsWith('/')) {
        baseForResolve = origin + String(contentBase).replace(/\/$/, '') + '/'
      } else {
        baseForResolve = origin + '/' + String(contentBase).replace(/\/$/, '') + '/'
      }
    }
  } catch (err) { baseForResolve = origin + '/' }

  const concurrency = Math.max(1, Math.min(poolSize, 6))
  while (queue.length && !found) {
    if (queue.length > maxQueue) break
    const batch = queue.splice(0, concurrency)
    await runWithConcurrency(batch, async (relDir) => {
      if (relDir == null) return
      if (seenDirs.has(relDir)) return
      seenDirs.add(relDir)
      let url = ''
      try {
        url = new URL(relDir || '', baseForResolve).toString()
      } catch (err) {
        url = (String(contentBase ?? '') || origin) + '/' + String(relDir ?? '').replace(/^\//, '')
      }
      try {
        let res
        try {
          res = await globalThis.fetch(url)
        } catch (errFetch) {
          debugLog('[slugManager] crawlForSlug: fetch failed', { url, error: errFetch })
          return
        }
        if (!res || !res.ok) {
          if (res && !res.ok) debugLog('[slugManager] crawlForSlug: directory fetch non-ok', { url, status: res.status })
          return
        }
        const text = await res.text()
        const doc = _crawlParser.parseFromString(text, 'text/html')
        let links = []
        try {
          if (doc && typeof doc.getElementsByTagName === 'function') {
            links = doc.getElementsByTagName('a')
          } else if (doc && typeof doc.querySelectorAll === 'function') {
            links = doc.querySelectorAll(_crawlLinkSelector)
          } else {
            links = []
          }
        } catch (err) {
          try { links = doc.getElementsByTagName ? doc.getElementsByTagName('a') : [] } catch (_) { links = [] }
        }
        const linkBase = url
        for (const a of links) {
          try {
            if (found) break
            let href = a.getAttribute('href') || ''
            if (!href) continue
            if (isExternalLinkWithBase(href, contentBase) || href.startsWith('..') || href.indexOf('/../') !== -1) continue
            if (href.endsWith('/')) {
              try {
                const resolved = new URL(href, linkBase)
                const basePath = new URL(baseForResolve).pathname
                const sub = resolved.pathname.startsWith(basePath) ? resolved.pathname.slice(basePath.length) : resolved.pathname.replace(/^\//, '')
                const subNorm = ensureTrailingSlash(normalizePath(sub))
                if (!seenDirs.has(subNorm)) queue.push(subNorm)
              } catch (err) {
                const sub = normalizePath(relDir + href)
                if (!seenDirs.has(sub)) queue.push(sub)
              }
              continue
            }
            if (href.toLowerCase().endsWith('.md')) {
              let path = ''
              try {
                const resolved = new URL(href, linkBase)
                const basePath = new URL(baseForResolve).pathname
                path = (resolved.pathname.startsWith(basePath) ? resolved.pathname.slice(basePath.length) : resolved.pathname.replace(/^\//, ''))
              } catch (err) {
                path = (relDir + href).replace(/^\//, '')
              }
              path = normalizePath(path)
              try {
                if (mdToSlug.has(path)) {
                  continue
                }
                for (const v of slugToMd.values()) {
                  if (v === path) { continue }
                }
              } catch (err) { debugLog('[slugManager] slug map access failed', err) }
              try {
                const md = await fetchMarkdown(path, contentBase)
                if (md && md.raw) {
                  const m = (md.raw || '').match(/^#\s+(.+)$/m)
                  if (m && m[1] && slugify(m[1].trim()) === decoded) {
                    found = path
                    break
                  }
                }
              } catch (err) { debugLog('[slugManager] crawlForSlug: fetchMarkdown failed', err) }
            }
          } catch (err) { debugLog('[slugManager] crawlForSlug: link iteration failed', err) }
        }
      } catch (err) { debugLog('[slugManager] crawlForSlug: directory fetch failed', err) }
    }, concurrency)
  }
  crawlCache.set(decoded, found)
  return found
}

/**
 * Crawl the content directory collecting all markdown and HTML pages.
 * @param {string} contentBase - Base URL to crawl for markdown/html pages.
 * @param {number} [maxQueue] - Optional maximum queue size for crawling.
 * @returns {Promise<string[]>} - Promise resolving to an array of discovered markdown/html paths.
 */
export async function crawlAllMarkdown(contentBase, maxQueue = defaultCrawlMaxQueue) {
  const result = new Set()

  const seenDirs = new Set()
  const queue = ['']

  const origin = (typeof location !== 'undefined' && location.origin) ? location.origin : 'http://localhost'
  let baseForResolve = origin + '/'
  try {
    if (contentBase) {
      if (/^[a-z][a-z0-9+.-]*:/i.test(String(contentBase))) {
        baseForResolve = String(contentBase).replace(/\/$/, '') + '/'
      } else if (String(contentBase).startsWith('/')) {
        baseForResolve = origin + String(contentBase).replace(/\/$/, '') + '/'
      } else {
        baseForResolve = origin + '/' + String(contentBase).replace(/\/$/, '') + '/'
      }
    }
  } catch (err) { baseForResolve = origin + '/' }

  const concurrency = Math.max(1, Math.min(poolSize, 6))
  let crawlBatchYieldCount = 0
  while (queue.length) {
    if (queue.length > maxQueue) break
    const batch = queue.splice(0, concurrency)
    await runWithConcurrency(batch, async (relDir) => {
      if (relDir == null) return
      if (seenDirs.has(relDir)) return
      seenDirs.add(relDir)
      let url = ''
      try {
        url = new URL(relDir || '', baseForResolve).toString()
      } catch (err) {
        url = (String(contentBase ?? '') || origin) + '/' + String(relDir ?? '').replace(/^\//, '')
      }
      try {
        let res
        try {
          res = await globalThis.fetch(url)
        } catch (errFetch) {
          debugLog('[slugManager] crawlAllMarkdown: fetch failed', { url, error: errFetch })
          return
        }
        if (!res || !res.ok) {
          if (res && !res.ok) debugLog('[slugManager] crawlAllMarkdown: directory fetch non-ok', { url, status: res.status })
          return
        }
        const text = await res.text()
        const doc = _crawlParser.parseFromString(text, 'text/html')
        let links = []
        try {
          if (doc && typeof doc.getElementsByTagName === 'function') {
            links = doc.getElementsByTagName('a')
          } else if (doc && typeof doc.querySelectorAll === 'function') {
            links = doc.querySelectorAll(_crawlLinkSelector)
          } else {
            links = []
          }
        } catch (err) {
          try { links = doc.getElementsByTagName ? doc.getElementsByTagName('a') : [] } catch (_) { links = [] }
        }
        const linkBase = url
        for (const a of links) {
          try {
            let href = a.getAttribute('href') || ''
            if (!href) continue
            if (isExternalLinkWithBase(href, contentBase) || href.startsWith('..') || href.indexOf('/../') !== -1) continue
            if (href.endsWith('/')) {
              try {
                const resolved = new URL(href, linkBase)
                const basePath = new URL(baseForResolve).pathname
                const sub = resolved.pathname.startsWith(basePath) ? resolved.pathname.slice(basePath.length) : resolved.pathname.replace(/^\//, '')
                const subNorm = ensureTrailingSlash(normalizePath(sub))
                if (!seenDirs.has(subNorm)) queue.push(subNorm)
              } catch (err) {
                const sub = relDir + href
                if (!seenDirs.has(sub)) queue.push(sub)
              }
              continue
            }
            let path = ''
            try {
              const resolved = new URL(href, linkBase)
              const basePath = new URL(baseForResolve).pathname
              path = (resolved.pathname.startsWith(basePath) ? resolved.pathname.slice(basePath.length) : resolved.pathname.replace(/^\//, ''))
            } catch (err) {
              path = (relDir + href).replace(/^\//, '')
            }
            path = normalizePath(path)
            if (/\.(md|html?)$/i.test(path)) {
              result.add(path)
            }
          } catch (err) { debugLog('[slugManager] crawlAllMarkdown: link iteration failed', err) }
        }
      } catch (err) { debugLog('[slugManager] crawlAllMarkdown: directory fetch failed', err) }
    }, concurrency)
  }

  return Array.from(result)
}

/**
 * Ensure the given slug is mapped to a markdown path. Attempts manifest
 * lookup, search-index, crawling, and other fallbacks in order.
 * @param {string} decoded - Decoded slug value to resolve (string without encoding).
 * @param {string} contentBase - Base URL used for discovery and fetching.
 * @param {number} [maxQueue] - Optional maximum queue size for crawling.
 * @returns {Promise<string|null>} - Promise resolving to the markdown path or `null` if not found.
 */
export async function ensureSlug(decoded, contentBase, maxQueue) {
  if (decoded && typeof decoded === 'string') {
    decoded = normalizePath(decoded)
    decoded = trimTrailingSlash(decoded)
  }
  if (slugToMd.has(decoded)) {
    return resolveSlugPath(decoded) || slugToMd.get(decoded)
  }

  try {
    const allowCandidateProbing = (typeof notFoundPage === 'string' && notFoundPage) || slugToMd.has(decoded) || (allMarkdownPathsSet && allMarkdownPathsSet.size) || isIndexPathsRefreshed() || (typeof contentBase === 'string' && /^[a-z][a-z0-9+.-]*:\/\//i.test(contentBase))
    if (!allowCandidateProbing) return null
  } catch (_e) {}

  for (const resolver of slugResolvers) {
    try {
      const res = await resolver(decoded, contentBase)
        if (res) {
          _storeSlugMapping(decoded, res)
          return res
        }
    } catch (err) { debugLog('[slugManager] slug resolver failed', err) }
  }

  if (allMarkdownPathsSet && allMarkdownPathsSet.size) {
    // Fast path: resolve slug from known file names before doing expensive
    // markdown fetches, index builds, or crawls.
    for (const p of allMarkdownPaths) {
      try {
        const name = String(p ?? '').replace(/^.*\//, '').replace(/\.(md|html?)$/i, '')
        if (name && slugify(name) === decoded) {
          _storeSlugMapping(decoded, p)
          return p
        }
      } catch (err) { debugLog('[slugManager] filename fast-path match failed', err) }
    }

    if (listSlugCache.has(decoded)) {
      const p = listSlugCache.get(decoded)
      _storeSlugMapping(decoded, p)
      return p
    }
    for (const p of allMarkdownPaths) {
      if (listPathsFetched.has(p)) continue
      try {
        const md = await fetchMarkdown(p, contentBase)
        if (md && md.raw) {
          const m = (md.raw || '').match(/^#\s+(.+)$/m)
          if (m && m[1]) {
            const cand = slugify(m[1].trim())
            listPathsFetched.add(p)
            if (cand) listSlugCache.set(cand, p)
            if (cand === decoded) {
              _storeSlugMapping(decoded, p)
              return p
            }
          }
        }
      } catch (err) { debugLog('[slugManager] manifest title fetch failed', err) }
    }
    try { crawlBatchYieldCount++; await yieldIfNeeded(crawlBatchYieldCount, 8) } catch (_) {}
  }

  // Fast direct probe: when the route looks like a filename slug, try the
  // two most likely concrete paths before expensive index/crawl work.
  const candidates = [`${decoded}.html`, `${decoded}.md`]
  for (const cand of candidates) {
    try {
      const res = await fetchMarkdown(cand, contentBase)
      if (res && res.raw) {
        _storeSlugMapping(decoded, cand)
        return cand
      }
    } catch (err) { debugLog('[slugManager] candidate fetch failed', err) }
  }

  try {
    const idx = await buildSearchIndex(contentBase)
    if (idx && idx.length) {
      const match = idx.find(e => e.slug === decoded)
      if (match) {
        _storeSlugMapping(decoded, match.path)
        return match.path
      }
    }
  } catch (err) { debugLog('[slugManager] buildSearchIndex lookup failed', err) }

  try {
    const foundCrawl = await crawlForSlug(decoded, contentBase, maxQueue)
    if (foundCrawl) {
      _storeSlugMapping(decoded, foundCrawl)
      return foundCrawl
    }
  } catch (err) { debugLog('[slugManager] crawlForSlug lookup failed', err) }

  if (allMarkdownPathsSet && allMarkdownPathsSet.size) {
    for (const p of allMarkdownPaths) {
      try {
        const name = p.replace(/^.*\//, '').replace(/\.(md|html?)$/i, '')
        if (slugify(name) === decoded) {
          _storeSlugMapping(decoded, p)
          return p
        }
      } catch (err) { debugLog('[slugManager] build-time filename match failed', err) }
    }
  }

  try {
    if (homePage && typeof homePage === 'string' && homePage.trim()) {
      try {
        const home = await fetchMarkdown(homePage, contentBase)
        if (home && home.raw) {
          const mhome = (home.raw || '').match(/^#\s+(.+)$/m)
          if (mhome && mhome[1]) {
            const homeSlug = slugify(mhome[1].trim())
            if (homeSlug === decoded) {
              _storeSlugMapping(decoded, homePage)
              return homePage
            }
          }
        }
      } catch (e) {
        debugLog('[slugManager] home page fetch failed', e)
      }
    }
  } catch (e) {
    debugLog('[slugManager] home page fetch failed', e)
  }
  return null
}
