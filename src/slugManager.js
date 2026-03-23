/**
 * Slug and markdown mapping utilities.
 *
 * Manage slug generation, mapping, and runtime discovery for markdown content.
 *
 * @module slugManager
 */

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

import * as l10n from './l10nManager.js'
import { parseHrefToRoute } from './utils/urlHelper.js'

import slugWorkerCode from './worker/slugWorker.js?raw'

import { makeWorkerPool, createWorkerFromRaw } from './worker-manager.js'
import { debugLog, debugWarn, debugError, isDebug } from './utils/debug.js'

const poolSize = (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2
const _slugWorkerManager = makeWorkerPool(() => createWorkerFromRaw(slugWorkerCode), 'slugManager', poolSize)

// Use centralized debug helpers.
// Decide whether the slug manager should emit non-debug errors to console.
function _slugShouldLog() {
  try { if (isDebug()) return true } catch (_e) {}
  try { return (typeof notFoundPage === 'string' && notFoundPage) ? true : false } catch (_e) { return false }
}

function _debugLog(...args) { try { debugLog(...args) } catch (_) {} }

/**
 * Lazily return a worker instance used for slug-related background tasks.
 * @returns {Worker|null}
 */
export function initSlugWorker() { return _slugWorkerManager.get() }

function _sendToWorker(msg) { return _slugWorkerManager.send(msg, 5000) }

/**
 * Build the search index using the slug worker when available.
 * @param {string} contentBase - Base URL where markdown content is hosted
 * @returns {Promise<Array<{slug:string,title:string,excerpt:string,path:string}>>} - Resolved search index entries.
 */

export async function buildSearchIndexWorker(contentBase, indexDepth = 1, noIndexing = undefined) {
  const ns = await import('./slugManager.js')
  const w = ns.initSlugWorker && ns.initSlugWorker()
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
  const ns = await import('./slugManager.js')
  const w = ns.initSlugWorker && ns.initSlugWorker()
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
  if (availableLanguages && availableLanguages.length) {
    const parts = rel.split('/')
    const firstSeg = parts[0]
    const isLang = availableLanguages.includes(firstSeg)
    let entry = slugToMd.get(slug)
    if (!entry || typeof entry === 'string') {
      entry = { default: typeof entry === 'string' ? entry : undefined, langs: {} }
    }
    if (isLang) {
      entry.langs[firstSeg] = rel
    } else {
      entry.default = rel
    }
    slugToMd.set(slug, entry)
  } else {
    slugToMd.set(slug, rel)
  }
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
    // Allow callers to explicitly clear the configured not-found page
    // so the runtime can render an inline fallback instead of
    // attempting to load a `_404.md` file.
    notFoundPage = null
    return
  }
  notFoundPage = String(p || '')
}

/**
 * Set the home page path used when trying home-page fallbacks during
 * slug resolution. If unset, `_home.md` is used.
 * @param {string} p - path to use as the home page (relative to content base)
 * @returns {void} - No return value.
 */
export function setHomePage(p) {
  // Allow callers to explicitly clear the configured home page by
  // passing `null`/`undefined`. When cleared, `homePage` will be
  // `null` and the runtime will not fall back to `_home.md`.
  if (p == null) {
    homePage = null
    return
  }
  homePage = String(p || '')
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
      // ensure export exists as array
      searchIndex = []
    }
    if (!Array.isArray(arr)) return
      try {
        if (!Array.isArray(searchIndex)) searchIndex = []
        searchIndex.length = 0
        for (const it of arr) searchIndex.push(it)
        try {
          if (typeof window !== 'undefined') {
            try { window.__nimbiLiveSearchIndex = searchIndex } catch (_) { /* swallow */ }
          }
        } catch (_) {}
      } catch (e) {
        _debugLog('[slugManager] replacing searchIndex by assignment fallback', e)
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

import { refreshIndexPaths } from './indexManager.js'
import { normalizePath, trimTrailingSlash, ensureTrailingSlash } from './utils/helpers.js'
import { memoize } from './utils/memoize.js'

/**
 * Generate a URL-friendly slug from a text string (memoized LRU).
 * @param {string} s - Text to generate a URL-friendly slug from.
 * @returns {string}
 */
export const slugify = memoize(function(s) {
  const MAX_SLUG_LENGTH = 80 // reasonable default to avoid extremely long URLs
  let slug = String(s || '')
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
}, 2000)

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

  const keys = Object.keys(_allMd || {})
  if (!keys.length) return

  let prefix = ''
  try {
    if (contentBase) {
      try {
        if (/^[a-z][a-z0-9+.-]*:/i.test(String(contentBase))) {
          prefix = new URL(String(contentBase)).pathname
        } else {
          prefix = String(contentBase || '')
        }
      } catch (err) {
        prefix = String(contentBase || '')
        _debugLog('[slugManager] parse contentBase failed', err)
      }
      prefix = ensureTrailingSlash(prefix)
    }
  } catch (err) { prefix = ''; _debugLog('[slugManager] setContentBase prefix derivation failed', err) }

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
    try { refreshIndexPaths() } catch (err) { _debugLog('[slugManager] refreshIndexPaths failed', err) }

    const val = _allMd[fullPath]
    if (typeof val === 'string') {
      const m = (val || '').match(/^#\s+(.+)$/m)
      if (m && m[1]) {
        const slug = slugify(m[1].trim())
        if (slug) {
          try {
            let slugKey = slug
            if (!availableLanguages || !availableLanguages.length) {
              slugKey = uniqueSlug(slugKey, new Set(slugToMd.keys()))
            }

            if (availableLanguages && availableLanguages.length) {
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
            }
            mdToSlug.set(rel, slugKey)
          } catch (_e) { _debugLog('[slugManager] set slug mapping failed', _e) }
        }
      }
    }
  }
}

try { setContentBase() } catch (err) { _debugLog('[slugManager] initial setContentBase failed', err) }

// `slugify` is defined earlier and memoized to reduce repeated work.

/**
 * Ensure a candidate slug is unique against an existing set.
 * If `base` collides, a numeric suffix is appended ("-2", "-3", ...).
 *
 * @exports uniqueSlug
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
export const fetchCache = new Map()
/**
 * Clear internal fetch cache used by `fetchMarkdown`.
 * @returns {void} - No return value.
 */
export function clearFetchCache() { fetchCache.clear() }

/**
 * @type {(path: string, base?: string) => Promise<FetchResult>
 */
export let fetchMarkdown = async function(path, base, opts) {
  if (!path) throw new Error('path required')
  // Accept cosmetic or canonical hrefs and extract page token for internal fetches
  try {
    if (typeof path === 'string' && (path.indexOf('?page=') !== -1 || path.startsWith('?') || path.startsWith('#/') || path.indexOf('#/') !== -1)) {
      try {
        const parsed = parseHrefToRoute(path)
        if (parsed && parsed.page) path = parsed.page
      } catch (e) {}
    }
  } catch (e) {}
  try {
    const o = (String(path || '').match(/([^\/]+)\.md(?:$|[?#])/) || [])[1]
    if (o && slugToMd.has(o)) {
      const mapped = resolveSlugPath(o) || slugToMd.get(o)
      if (mapped && mapped !== path) {
        path = mapped
      }
    }
  } catch (err) { _debugLog('[slugManager] slug mapping normalization failed', err) }
  // If a notFoundPage is not configured and we have no index/mappings,
  // avoid issuing network probes for guessed candidates. This prevents
  // spurious requests like `/bad_slug`, `/bad_slug.md`, or `_home.md`
  // when the runtime intends to render an inline 404 fallback.
  const allowFetch = (opts && opts.force === true) || (typeof notFoundPage === 'string' && notFoundPage) || (slugToMd && slugToMd.size) || (allMarkdownPathsSet && allMarkdownPathsSet.size) || isDebug()
  if (!allowFetch) {
    throw new Error('failed to fetch md')
  }
  const baseClean = base == null ? '' : trimTrailingSlash(String(base))
  let url = ''
  try {
    const origin = (typeof location !== 'undefined' && location.origin) ? location.origin : 'http://localhost'
    // If content base is a root-relative path (e.g. '/base'), preserve
    // the relative URL form so consumers/tests that expect a leading
    // slash can assert on the fetch argument.
    if (baseClean && baseClean.startsWith('/') && !/^[a-z][a-z0-9+.-]*:/i.test(baseClean)) {
      // Resolve root-relative content bases to an absolute URL so Node's fetch
      // (undici) receives a valid absolute URL. In browser environments this
      // will match location.origin; in tests we fall back to http://localhost.
      const rel = baseClean.replace(/\/$/, '') + '/' + path.replace(/^\//, '')
      const origin = (typeof location !== 'undefined' && location && location.origin) ? location.origin : 'http://localhost'
      url = origin.replace(/\/$/, '') + rel
    } else {
      // Resolve to an absolute URL for other base forms so Node fetch works.
      let baseForResolve = origin + '/'
      if (baseClean) {
        if (/^[a-z][a-z0-9+.-]*:/i.test(baseClean)) {
          baseForResolve = baseClean.replace(/\/$/, '') + '/'
        } else if (baseClean.startsWith('/')) {
          baseForResolve = origin + baseClean.replace(/\/$/, '') + '/'
        } else {
          baseForResolve = origin + '/' + baseClean.replace(/\/$/, '') + '/'
        }
      }
      // Use URL resolution to preserve slashes and avoid duplicate segments
      url = new URL(path.replace(/^\//, ''), baseForResolve).toString()
    }
  } catch (err) {
    url = (typeof location !== 'undefined' && location.origin ? location.origin : 'http://localhost') + '/' + path.replace(/^\//, '')
  }
  if (fetchCache.has(url)) {
    return fetchCache.get(url)
  }

  const promise = (async () => {
    const res = await fetch(url)
    if (!res || typeof res.ok !== 'boolean' || !res.ok) {
      if (res && res.status === 404) {
          if (typeof notFoundPage === 'string' && notFoundPage) {
            try {
              const p404 = `${baseClean}/${notFoundPage}`
              const r404 = await globalThis.fetch(p404)
              if (r404 && typeof r404.ok === 'boolean' && r404.ok) {
                const raw404 = await r404.text()
                return { raw: raw404, status: 404 }
              }
            } catch (_ee) { _debugLog('[slugManager] fetching fallback 404 failed', _ee) }
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
        _debugLog('[slugManager] reading error body failed', err)
      }
      try {
        const status = res ? res.status : undefined
        if (status === 404) {
          try { debugWarn('fetchMarkdown failed (404):', { url, status, statusText: res ? res.statusText : undefined, body: body.slice(0, 200) }) } catch (e) {}
        } else {
          try { debugError('fetchMarkdown failed:', { url, status, statusText: res ? res.statusText : undefined, body: body.slice(0, 200) }) } catch (e) {}
        }
      } catch (e) {}
      throw new Error('failed to fetch md')
      throw new Error('failed to fetch md')
    }
    const raw = await res.text()
    const trimmed = raw.trim().slice(0, 128).toLowerCase()
    // Detect common HTML responses including directory listings which may
    // start with `<title>` or `<h1>` rather than `<html>` or `<!doctype>`.
    const looksLikeHtml = /^(?:<!doctype|<html|<title|<h1)/.test(trimmed)
    const isHtml = looksLikeHtml || String(path || '').toLowerCase().endsWith('.html')

    if (looksLikeHtml && String(path || '').toLowerCase().endsWith('.md')) {
      try {
        if (typeof notFoundPage === 'string' && notFoundPage) {
          const p404 = `${baseClean}/${notFoundPage}`
          const r404 = await globalThis.fetch(p404)
          if (r404.ok) {
            const raw404 = await r404.text()
            return { raw: raw404, status: 404 }
          }
        }
      } catch (_ee) { _debugLog('[slugManager] fetching fallback 404 failed', _ee) }
      if (_slugShouldLog()) debugError('fetchMarkdown: server returned HTML for .md request', url)
      throw new Error('failed to fetch md')
    }

    return isHtml ? { raw, isHtml: true } : { raw }
  })()

  fetchCache.set(url, promise)
  return promise
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

// Expose a stable global getter so external tools (tests/headless scripts)
// can observe the same live array instance used by the runtime.
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

// Expose a callable helper on `window` so external test harnesses can await
// the completion of the runtime index build.
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
  const earlyExcludes = Array.isArray(noIndexing) ? Array.from(new Set((noIndexing || []).map(p => normalizePath(String(p || ''))))) : []
  try {
    const nf = normalizePath(String(notFoundPage || ''))
    if (nf && !earlyExcludes.includes(nf)) earlyExcludes.push(nf)
  } catch (err) {}

  if (searchIndex && searchIndex.length && indexDepth === 1) {
    const containsExcluded = searchIndex.some(e => {
      try { return earlyExcludes.includes(normalizePath(String(e.path || ''))) } catch (_) { return false }
    })
    if (!containsExcluded) return searchIndex
  }
  if (_indexPromise) return _indexPromise

  _indexPromise = (async () => {
    let excludes = Array.isArray(noIndexing) ? Array.from(new Set((noIndexing || []).map(p => normalizePath(String(p || ''))))) : []
    try {
      const nf = normalizePath(String(notFoundPage || ''))
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
    // Prefer any explicit seed paths provided by callers (e.g. home/navigation)
    try {
      if (Array.isArray(seedPaths) && seedPaths.length) {
        for (const p of seedPaths) {
          try {
            const n = normalizePath(String(p || ''))
            if (n) paths.push(n)
          } catch (_) {}
        }
      }
    } catch (_) {}
    if (Array.isArray(allMarkdownPaths) && allMarkdownPaths.length) {
      paths = Array.from(allMarkdownPaths)
    }
    if (!paths.length) {
      for (const v of slugToMd.values()) {
        if (v) paths.push(v)
      }
    }
    try {
      const crawled = await crawlAllMarkdown(contentBase)
      if (crawled && crawled.length) {
        paths = paths.concat(crawled)
      }
    } catch (err) { _debugLog('[slugManager] crawlAllMarkdown during buildSearchIndex failed', err) }

    try {
      const visited = new Set(paths)
      const queue = [...paths]

      const fetchConcurrency = Math.max(1, poolSize)

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
              const baseName = String(p || '').replace(/^.*\//, '')
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
                } catch (err) { _debugLog('[slugManager] href processing failed', href, err) }
              }
            }
          } catch (e) {
            _debugLog('[slugManager] discovery fetch failed for', p, e)
          }
        }
      }

      const workers = []
      for (let i = 0; i < fetchConcurrency; i++) workers.push(worker())
      await Promise.all(workers)
    } catch (e) {
      _debugLog('[slugManager] discovery loop failed', e)
    }

    const seen = new Set()
    paths = paths.filter(p => {
      if (!p || seen.has(p)) return false
      if (isExcluded(p)) return false
      seen.add(p)
      return true
    })
    const idx = []

    // Concurrently fetch page bodies but preserve original path ordering
    // when generating the index entries. We fetch pages in parallel up to
    // `fetchConcurrency`, then process them sequentially so tests and
    // consumers that rely on deterministic ordering remain stable.
    const pathMdMap = new Map()
    const pathsToFetch = paths.filter(p => /\.(?:md|html?)(?:$|[?#])/i.test(p))
    const fetchConcurrency = Math.max(1, Math.min(poolSize, pathsToFetch.length || 1))
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
            _debugLog('[slugManager] buildSearchIndex: entry fetch failed', p, err)
            pathMdMap.set(p, null)
          }
        }
      })())
    }
    await Promise.all(fetchWorkers)

    for (const path of paths) {
      if (!/\.(?:md|html?)(?:$|[?#])/i.test(path)) continue
      try {
        const md = pathMdMap.get(path)
        if (!md || !md.raw) continue
        if (md.status === 404) continue
        let title = ''
        let excerpt = ''
        if (md.isHtml) {
          try {
            const parser = new DOMParser()
            const doc = parser.parseFromString(md.raw, 'text/html')
            const titleEl = doc.querySelector('title') || doc.querySelector('h1')
            if (titleEl && titleEl.textContent) title = titleEl.textContent.trim()
            const p = doc.querySelector('p')
            if (p && p.textContent) excerpt = p.textContent.trim()
              if (indexDepth >= 2) {
              try {
                const topH1 = doc.querySelector('h1')
                const parentTitle = topH1 && topH1.textContent ? topH1.textContent.trim() : (title || '')
                const pageSlug = (() => {
                  try { if (mdToSlug.has(path)) return mdToSlug.get(path) } catch (err) { /* ignore */ }
                  return slugify(title || path)
                })()
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
                  } catch (err) { _debugLog('[slugManager] indexing H2 failed', err) }
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
                      } catch (err) { _debugLog('[slugManager] indexing H3 failed', err) }
                    }
                  } catch (err) { _debugLog('[slugManager] collect H3s failed', err) }
                }
              } catch (err) { _debugLog('[slugManager] collect H2s failed', err) }
            }
          } catch (err) { _debugLog('[slugManager] parsing HTML for index failed', err) }
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
            let pageSlug = ''
            try {
              const h1 = (raw.match(/^#\s+(.+)$/m) || [])[1]
              parentTitle = h1 ? h1.trim() : ''
              pageSlug = (function() { try { if (mdToSlug.has(path)) return mdToSlug.get(path) } catch (err) { } return slugify(title || path) })()
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
                } catch (err) { _debugLog('[slugManager] indexing markdown H2 failed', err) }
              }
            } catch (err) { _debugLog('[slugManager] collect markdown H2s failed', err) }
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
                  } catch (err) { _debugLog('[slugManager] indexing markdown H3 failed', err) }
                }
              } catch (err) { _debugLog('[slugManager] collect markdown H3s failed', err) }
            }
          }
        }
        let slug = ''
        try {
          if (mdToSlug.has(path)) slug = mdToSlug.get(path)
        } catch (err) { _debugLog('[slugManager] mdToSlug access failed', err) }
        if (!slug) slug = slugify(title || path)
        idx.push({ slug, title, excerpt, path })
      } catch (err) {
        _debugLog('[slugManager] buildSearchIndex: entry processing failed', err)
      }
    }
    try {
      const finalIdx = idx.filter(entry => {
        try { return !isExcluded(String(entry.path || '')) } catch (_) { return true }
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
            // Expose a minimal sitemap view derived directly from the
            // authoritative search index so consumers that don't request
            // `?rss` can still inspect the runtime sitemap shape.
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
      _debugLog('[slugManager] filtering index by excludes failed', err)
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
  try { await _indexPromise } catch (err) { _debugLog('[slugManager] awaiting _indexPromise failed', err) }
  _indexPromise = null
  return searchIndex
}

/**
 * Wait for the runtime `searchIndex` to be populated. If an index build is
 * already in progress this will await it; otherwise it will optionally kick
 * off a build (worker-first) and await completion. Returns the live
 * `searchIndex` array (possibly empty on timeout).
 *
 * @param {{timeoutMs?:number,contentBase?:string,indexDepth?:number,noIndexing?:Array<string>,seedPaths?:Array<string>,startBuild?:boolean}} opts
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

    // If an index build is currently in progress, prefer awaiting that
    // build so callers receive the authoritative, stable array. Only
    // return early if the array is populated and no build promise is
    // active _and_ the caller did not request a fresh build. When
    // `startBuild` is true we must avoid short-circuiting on a partial
    // in-memory `searchIndex` so a fresh authoritative build will be
    // initiated instead.
    if (Array.isArray(searchIndex) && searchIndex.length && !_indexPromise && !startBuild) return searchIndex

    if (_indexPromise) {
      try { await _indexPromise } catch (_) {}
      return searchIndex
    }

    if (startBuild) {
      // Prefer worker-based builder when available
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
      // Fallback to main-thread builder (this will set _indexPromise)
      try {
        await buildSearchIndex(contentBase, indexDepth, noIndexing, seedPaths)
        return searchIndex
      } catch (_) {}
    }

    // Last resort: poll for a populated array until timeout
    const start = Date.now()
    while (Date.now() - start < timeoutMs) {
      if (Array.isArray(searchIndex) && searchIndex.length) return searchIndex
      // eslint-disable-next-line no-await-in-loop
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
   * @param {{contentBase?:string,indexDepth?:number,noIndexing?:Array<string>,seedPaths?:Array<string>,startBuild?:boolean,timeoutMs?:number}} opts
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

const _crawlParser = new DOMParser()
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

  // Prepare a base URL for resolution so hrefs like '/content/...' are
  // resolved relative to the content base origin and path.
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
  // Process directories in batches to avoid workers exiting before newly
  // discovered directories are enqueued. This preserves discovery completeness
  // while bounding concurrency.
  while (queue.length && !found) {
    if (queue.length > maxQueue) break
    const batch = queue.splice(0, concurrency)
    await Promise.all(batch.map(async (relDir) => {
      if (relDir == null) return
      if (seenDirs.has(relDir)) return
      seenDirs.add(relDir)
      let url = ''
      try {
        url = new URL(relDir || '', baseForResolve).toString()
      } catch (err) {
        url = (String(contentBase || '') || origin) + '/' + String(relDir || '').replace(/^\//, '')
      }
      try {
        let res
        try {
          res = await globalThis.fetch(url)
        } catch (errFetch) {
          _debugLog('[slugManager] crawlForSlug: fetch failed', { url, error: errFetch })
          return
        }
        if (!res || !res.ok) {
          if (res && !res.ok) _debugLog('[slugManager] crawlForSlug: directory fetch non-ok', { url, status: res.status })
          return
        }
        const text = await res.text()
        const doc = _crawlParser.parseFromString(text, 'text/html')
        const links = doc.querySelectorAll(_crawlLinkSelector)
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
              } catch (err) { _debugLog('[slugManager] slug map access failed', err) }
              try {
                const md = await fetchMarkdown(path, contentBase)
                if (md && md.raw) {
                  const m = (md.raw || '').match(/^#\s+(.+)$/m)
                  if (m && m[1] && slugify(m[1].trim()) === decoded) {
                    found = path
                    break
                  }
                }
              } catch (err) { _debugLog('[slugManager] crawlForSlug: fetchMarkdown failed', err) }
            }
          } catch (err) { _debugLog('[slugManager] crawlForSlug: link iteration failed', err) }
        }
      } catch (err) { _debugLog('[slugManager] crawlForSlug: directory fetch failed', err) }
    }))
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

  // Prepare base URL for resolution so absolute or root-anchored hrefs
  // are resolved relative to the content base origin and path.
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
  // Process directories in batches so newly-discovered directories are
  // handled in subsequent iterations rather than risking worker exit.
  while (queue.length) {
    if (queue.length > maxQueue) break
    const batch = queue.splice(0, concurrency)
    await Promise.all(batch.map(async (relDir) => {
      if (relDir == null) return
      if (seenDirs.has(relDir)) return
      seenDirs.add(relDir)
      let url = ''
      try {
        url = new URL(relDir || '', baseForResolve).toString()
      } catch (err) {
        url = (String(contentBase || '') || origin) + '/' + String(relDir || '').replace(/^\//, '')
      }
      try {
        let res
        try {
          res = await globalThis.fetch(url)
        } catch (errFetch) {
          _debugLog('[slugManager] crawlAllMarkdown: fetch failed', { url, error: errFetch })
          return
        }
        if (!res || !res.ok) {
          if (res && !res.ok) _debugLog('[slugManager] crawlAllMarkdown: directory fetch non-ok', { url, status: res.status })
          return
        }
        const text = await res.text()
        const doc = _crawlParser.parseFromString(text, 'text/html')
        const links = doc.querySelectorAll(_crawlLinkSelector)
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
          } catch (err) { _debugLog('[slugManager] crawlAllMarkdown: link iteration failed', err) }
        }
      } catch (err) { _debugLog('[slugManager] crawlAllMarkdown: directory fetch failed', err) }
    }))
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

  // Short-circuit aggressive candidate probing when the host did not
  // configure a `notFoundPage` and we don't have any index/mapping data
  // available. This avoids unnecessary network requests for guessed
  // candidates like `slug.html`/`slug.md` when the runtime will render
  // an inline 404 instead.
  try {
    const allowCandidateProbing = (typeof notFoundPage === 'string' && notFoundPage) || slugToMd.has(decoded) || (allMarkdownPathsSet && allMarkdownPathsSet.size) || refreshIndexPaths._refreshed || (typeof contentBase === 'string' && /^[a-z][a-z0-9+.-]*:\/\//i.test(contentBase))
    if (!allowCandidateProbing) return null
  } catch (_e) {}

  for (const resolver of slugResolvers) {
    try {
      const res = await resolver(decoded, contentBase)
      if (res) {
        _storeSlugMapping(decoded, res)
        mdToSlug.set(res, decoded)
        return res
      }
    } catch (err) { _debugLog('[slugManager] slug resolver failed', err) }
  }

  if (allMarkdownPathsSet && allMarkdownPathsSet.size) {
    if (listSlugCache.has(decoded)) {
      const p = listSlugCache.get(decoded)
      slugToMd.set(decoded, p); mdToSlug.set(p, decoded)
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
              _storeSlugMapping(decoded, p); mdToSlug.set(p, decoded)
              return p
            }
          }
        }
      } catch (err) { _debugLog('[slugManager] manifest title fetch failed', err) }
    }
  }

  try {
    const idx = await buildSearchIndex(contentBase)
    if (idx && idx.length) {
      const match = idx.find(e => e.slug === decoded)
      if (match) {
        _storeSlugMapping(decoded, match.path)
        mdToSlug.set(match.path, decoded)
        return match.path
      }
    }
  } catch (err) { _debugLog('[slugManager] buildSearchIndex lookup failed', err) }

  try {
    const foundCrawl = await crawlForSlug(decoded, contentBase, maxQueue)
    if (foundCrawl) {
      _storeSlugMapping(decoded, foundCrawl)
      mdToSlug.set(foundCrawl, decoded)
      return foundCrawl
    }
  } catch (err) { _debugLog('[slugManager] crawlForSlug lookup failed', err) }

  const candidates = [`${decoded}.html`, `${decoded}.md`]
  for (const cand of candidates) {
    try {
      const res = await fetchMarkdown(cand, contentBase)
      if (res && res.raw) {
        _storeSlugMapping(decoded, cand)
        mdToSlug.set(cand, decoded)
        return cand
      }
    } catch (err) { _debugLog('[slugManager] candidate fetch failed', err) }
  }

  if (allMarkdownPathsSet && allMarkdownPathsSet.size) {
    for (const p of allMarkdownPaths) {
      try {
        const name = p.replace(/^.*\//, '').replace(/\.(md|html?)$/i, '')
        if (slugify(name) === decoded) {
          _storeSlugMapping(decoded, p)
          mdToSlug.set(p, decoded)
          return p
        }
      } catch (err) { _debugLog('[slugManager] build-time filename match failed', err) }
    }
  }

  try {
    // Only consider an explicitly configured `homePage`. Do NOT fall
    // back to a hard-coded `_home.md` file — the runtime should not
    // guess or probe for `_home.md` automatically.
    if (homePage && typeof homePage === 'string' && homePage.trim()) {
      try {
        const home = await fetchMarkdown(homePage, contentBase)
        if (home && home.raw) {
          const mhome = (home.raw || '').match(/^#\s+(.+)$/m)
          if (mhome && mhome[1]) {
            const homeSlug = slugify(mhome[1].trim())
            if (homeSlug === decoded) {
              _storeSlugMapping(decoded, homePage)
              mdToSlug.set(homePage, decoded)
              return homePage
            }
          }
        }
      } catch (e) {
        _debugLog('[slugManager] home page fetch failed', e)
      }
    }
  } catch (e) {
    _debugLog('[slugManager] home page fetch failed', e)
  }
  return null
}
