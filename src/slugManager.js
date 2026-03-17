/**
 * Responsible for slug ↔ markdown mappings, slug generation,
 * and runtime discovery.
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

let _slugWorker = null
import slugWorkerCode from './worker/slugWorker.js?raw'

import { makeWorkerManager, createWorkerFromRaw } from './worker-manager.js'

const _slugWorkerManager = makeWorkerManager(() => createWorkerFromRaw(slugWorkerCode), 'slugManager')

/**
 * Lazily return a worker instance used for slug-related background tasks.
 * @returns {Worker|null} - A Worker instance or null if workers are unavailable.
 */
export function initSlugWorker() {
  return _slugWorkerManager.get()
}

function _sendToWorker(msg) {
  return _slugWorkerManager.send(msg)
}

/**
 * Build the search index using the slug worker when available.
 * @param {string} contentBase - Base URL where markdown content is hosted
 * @returns {Promise<Array<{slug:string,title:string,excerpt:string,path:string}>>} - Resolved search index entries.
 */
export async function buildSearchIndexWorker(contentBase, indexDepth = 1, noIndexing = undefined) {
  const w = initSlugWorker()
  if (!w) return buildSearchIndex(contentBase, indexDepth, noIndexing)

  try {
    return await _sendToWorker({ type: 'buildSearchIndex', contentBase, indexDepth, noIndexing })
  } catch (err) {
    try {
      return await buildSearchIndex(contentBase, indexDepth, noIndexing)
    } catch (fallbackErr) {
      console.warn('[slugManager] buildSearchIndex fallback failed', fallbackErr)
      throw err
    }
  }
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
  const w = initSlugWorker()
  if (w) return _sendToWorker({ type: 'crawlForSlug', slug, base, maxQueue })
  return crawlForSlug(slug, base, maxQueue)
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

export const slugResolvers = new Set()
/**
 * Register a custom resolver function.  The function should accept a slug
 * string and return a markdown path (or promise thereof) or `null` if not
 * resolved.
 * @param {(slug:string,contentBase?:string)=>Promise<string|null>|string|null} fn - Resolver function to add.
 * @returns {void} - No return value.
 */
/**
 * Register a custom slug resolver function. The function should accept a
 * slug (string) and return a markdown path (or promise thereof) or `null`.
 * @param {(slug:string,contentBase?:string)=>Promise<string|null>|string|null} fn - fn parameter
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

export let allMarkdownPaths = []

export let notFoundPage = '_404.md'

export let homePage = '_home.md'

/**
 * Set the not-found page path used when `fetchMarkdown` encounters a
 * missing markdown file or an HTML response for a `.md` request.
 * @param {string} p - path to use as the not-found page (relative to content base)
 */
export function setNotFoundPage(p) {
  if (p == null) return
  notFoundPage = String(p || '')
}

/**
 * Set the home page path used when trying home-page fallbacks during
 * slug resolution. If unset, `_home.md` is used.
 * @param {string} p - path to use as the home page (relative to content base)
 */
export function setHomePage(p) {
  if (p == null) return
  homePage = String(p || '')
}

export function _setAllMd(obj) {
  _allMd = obj || {}
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

import { refreshIndexPaths, indexSet } from './indexManager.js'
import { normalizePath, trimTrailingSlash, ensureTrailingSlash } from './utils/helpers.js'

/**
 * Set the content base URL (the runtime `contentPath`) and rebuild slug
 * maps and `allMarkdownPaths` relative to that base.
 * @param {string} [contentBase] - Optional base URL where markdown content is hosted
 * @returns {void} - No return value.
 */
export function setContentBase(contentBase) {
  slugToMd.clear(); mdToSlug.clear(); allMarkdownPaths = []
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
        console.warn('[slugManager] parse contentBase failed', err)
      }
      prefix = ensureTrailingSlash(prefix)
    }
  } catch (err) { prefix = ''; console.warn('[slugManager] setContentBase prefix derivation failed', err) }

  if (!prefix) prefix = _deriveCommonPrefix(keys)

  for (const fullPath of keys) {
    let rel = fullPath
    if (prefix && fullPath.startsWith(prefix)) {
      rel = normalizePath(fullPath.slice(prefix.length))
    } else {
      rel = normalizePath(fullPath)
    }
    allMarkdownPaths.push(rel)
    try { refreshIndexPaths() } catch (err) { console.warn('[slugManager] refreshIndexPaths failed', err) }

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
          } catch (_e) { console.warn('[slugManager] set slug mapping failed', _e) }
        }
      }
    }
  }
}

try { setContentBase() } catch (err) { console.warn('[slugManager] initial setContentBase failed', err) }

/**
 * Generate a URL-friendly slug from a text string.
 * @param {string} s - Text to generate a URL-friendly slug from.
 * @returns {string} - The generated slug string.
 */
export function slugify(s) {
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
}

/**
 * Generate a unique slug by appending a numeric suffix if needed.
 * @param {string} base
 * @param {Set<string>} existing
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

export const fetchCache = new Map()
/**
 * Clear internal fetch cache used by `fetchMarkdown`.
 * @returns {void} - No return value.
 */
export function clearFetchCache() { fetchCache.clear() }

/**
 * @type {(path: string, base?: string) => Promise<FetchResult>
 */
export let fetchMarkdown = async function(path, base) {
  if (!path) throw new Error('path required')
  try {
    const o = (String(path || '').match(/([^\/]+)\.md(?:$|[?#])/) || [])[1]
    if (o && slugToMd.has(o)) {
      const mapped = resolveSlugPath(o) || slugToMd.get(o)
      if (mapped && mapped !== path) {
        path = mapped
      }
    }
  } catch (err) { console.warn('[slugManager] slug mapping normalization failed', err) }
  const baseClean = base == null ? '' : trimTrailingSlash(String(base))
  let url = ''
  try {
    if (baseClean) {
      if (/^[a-z][a-z0-9+.-]*:/i.test(baseClean)) {
        url = baseClean.replace(/\/$/, '') + '/' + path.replace(/^\//, '')
      } else if (baseClean.startsWith('/')) {
        url = baseClean.replace(/\/$/, '') + '/' + path.replace(/^\//, '')
      } else {
        const origin = (typeof location !== 'undefined' && location.origin) ? location.origin : 'http://localhost'
        const basePath = baseClean.startsWith('/') ? baseClean : ('/' + baseClean)
        url = origin + basePath.replace(/\/$/, '') + '/' + path.replace(/^\//, '')
      }
    } else {
      const origin = (typeof location !== 'undefined' && location.origin) ? location.origin : 'http://localhost'
      url = origin + '/' + path.replace(/^\//, '')
    }
  } catch (err) {
    url = '/' + path.replace(/^\//, '')
  }
  if (fetchCache.has(url)) {
    return fetchCache.get(url)
  }

  const promise = (async () => {
    const res = await fetch(url)
    if (!res || typeof res.ok !== 'boolean' || !res.ok) {
      if (res && res.status === 404) {
        try {
          const p404 = `${baseClean}/${notFoundPage}`
          const r404 = await globalThis.fetch(p404)
          if (r404 && typeof r404.ok === 'boolean' && r404.ok) {
            const raw404 = await r404.text()
            return { raw: raw404, status: 404 }
          }
        } catch (_ee) { console.warn('[slugManager] fetching fallback 404 failed', _ee) }
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
        console.warn('[slugManager] reading error body failed', err)
      }
      console.error('fetchMarkdown failed:', { url, status: res ? res.status : undefined, statusText: res ? res.statusText : undefined, body: body.slice(0, 200) })
      throw new Error('failed to fetch md')
    }
    const raw = await res.text()
    const trimmed = raw.trim().slice(0, 16).toLowerCase()
    const looksLikeHtml = trimmed.startsWith('<!doctype') || trimmed.startsWith('<html')
    const isHtml = looksLikeHtml || String(path || '').toLowerCase().endsWith('.html')

    if (looksLikeHtml && String(path || '').toLowerCase().endsWith('.md')) {
      try {
        const p404 = `${baseClean}/${notFoundPage}`
        const r404 = await globalThis.fetch(p404)
        if (r404.ok) {
          const raw404 = await r404.text()
          return { raw: raw404, status: 404 }
        }
      } catch (_ee) { console.warn('[slugManager] fetching fallback 404 failed', _ee) }
      console.error('fetchMarkdown: server returned HTML for .md request', url)
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
 */
export function setFetchMarkdown(fn) {
  if (typeof fn === 'function') {
    fetchMarkdown = fn
  }
}

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

let _indexPromise = null
export async function buildSearchIndex(contentBase, indexDepth = 1, noIndexing = undefined) {
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
    if (allMarkdownPaths && allMarkdownPaths.length) {
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
    } catch (err) { console.warn('[slugManager] crawlAllMarkdown during buildSearchIndex failed', err) }

    try {
      const visited = new Set(paths)
      const queue = [...paths]
      if (visited.size === 0) {
      }
      while (queue.length && visited.size <= defaultCrawlMaxQueue) {
        const p = queue.shift()
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
              } catch (err) { console.warn('[slugManager] href processing failed', href, err) }
            }
          }
        } catch (e) {
          console.warn('[slugManager] discovery fetch failed for', p, e)
        }
      }
    } catch (e) {
      console.warn('[slugManager] discovery loop failed', e)
    }

    const seen = new Set()
    paths = paths.filter(p => {
      if (!p || seen.has(p)) return false
      if (isExcluded(p)) return false
      seen.add(p)
      return true
    })

    const idx = []
    for (const path of paths) {
      if (!/\.(?:md|html?)(?:$|[?#])/i.test(path)) continue
      try {
        const md = await fetchMarkdown(path, contentBase)
        if (md && md.raw) {
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
                    } catch (err) { console.warn('[slugManager] indexing H2 failed', err) }
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
                        } catch (err) { console.warn('[slugManager] indexing H3 failed', err) }
                      }
                    } catch (err) { console.warn('[slugManager] collect H3s failed', err) }
                  }
                } catch (err) { console.warn('[slugManager] collect H2s failed', err) }
              }
            } catch (err) { console.warn('[slugManager] parsing HTML for index failed', err) }
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
                  } catch (err) { console.warn('[slugManager] indexing markdown H2 failed', err) }
                }
              } catch (err) { console.warn('[slugManager] collect markdown H2s failed', err) }
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
                    } catch (err) { console.warn('[slugManager] indexing markdown H3 failed', err) }
                  }
                } catch (err) { console.warn('[slugManager] collect markdown H3s failed', err) }
              }
            }
          }
          let slug = ''
          try {
            if (mdToSlug.has(path)) slug = mdToSlug.get(path)
          } catch (err) { console.warn('[slugManager] mdToSlug access failed', err) }
          if (!slug) slug = slugify(title || path)
          idx.push({ slug, title, excerpt, path })
        }
      } catch (err) {
        console.warn('[slugManager] buildSearchIndex: entry fetch failed', err)
      }
    }
    try {
      const finalIdx = idx.filter(entry => {
        try { return !isExcluded(String(entry.path || '')) } catch (_) { return true }
      })
      searchIndex = finalIdx
    } catch (err) {
      console.warn('[slugManager] filtering index by excludes failed', err)
      searchIndex = idx
    }
    return searchIndex
  })()
  try { await _indexPromise } catch (err) { console.warn('[slugManager] awaiting _indexPromise failed', err) }
  _indexPromise = null
  return searchIndex
}

export const CRAWL_MAX_QUEUE = 1000
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

  while (queue.length && !found) {
    if (queue.length > maxQueue) {
      break
    }
    const relDir = queue.shift()
    if (seenDirs.has(relDir)) continue
    seenDirs.add(relDir)
    let url = contentBase
    if (!url.endsWith('/')) url += '/'
    url += relDir
    try {
      let res
      try {
        res = await globalThis.fetch(url)
      } catch (errFetch) {
        console.warn('[slugManager] crawlAllMarkdown: fetch failed', { url, error: errFetch })
        continue
      }
      if (!res || !res.ok) {
        if (res && !res.ok) console.warn('[slugManager] crawlAllMarkdown: directory fetch non-ok', { url, status: res.status })
        continue
      }
      const text = await res.text()
      const doc = _crawlParser.parseFromString(text, 'text/html')
      const links = doc.querySelectorAll(_crawlLinkSelector)
          for (const a of links) {
        try {
          let href = a.getAttribute('href') || ''
          if (!href) continue
          if (isExternalLinkWithBase(href, contentBase) || href.startsWith('..') || href.indexOf('/../') !== -1) continue
          if (href.endsWith('/')) {
            const sub = relDir + href
            if (!seenDirs.has(sub)) queue.push(sub)
            continue
          }
          if (href.toLowerCase().endsWith('.md')) {
            const path = normalizePath(relDir + href)
            try {
              if (mdToSlug.has(path)) {
                continue
              }
              for (const v of slugToMd.values()) {
                if (v === path) { continue }
              }
            } catch (err) { console.warn('[slugManager] slug map access failed', err) }
            try {
              const md = await fetchMarkdown(path, contentBase)
              if (md && md.raw) {
                const m = (md.raw || '').match(/^#\s+(.+)$/m)
                if (m && m[1] && slugify(m[1].trim()) === decoded) {
                  found = path
                  break
                }
              }
            } catch (err) { console.warn('[slugManager] crawlForSlug: fetchMarkdown failed', err) }
          }
        } catch (err) { console.warn('[slugManager] crawlForSlug: link iteration failed', err) }
      }
    } catch (err) { console.warn('[slugManager] crawlForSlug: directory fetch failed', err) }
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

  while (queue.length) {
    if (queue.length > maxQueue) break
    const relDir = queue.shift()
    if (seenDirs.has(relDir)) continue
    seenDirs.add(relDir)
    let url = contentBase
    if (!url.endsWith('/')) url += '/'
    url += relDir
    try {
      let res
      try {
        res = await globalThis.fetch(url)
      } catch (errFetch) {
        console.warn('[slugManager] crawlAllMarkdown: fetch failed', { url, error: errFetch })
        continue
      }
      if (!res || !res.ok) {
        if (res && !res.ok) console.warn('[slugManager] crawlAllMarkdown: directory fetch non-ok', { url, status: res.status })
        continue
      }
      const text = await res.text()
      const doc = _crawlParser.parseFromString(text, 'text/html')
      const links = doc.querySelectorAll(_crawlLinkSelector)
      for (const a of links) {
        try {
          let href = a.getAttribute('href') || ''
          if (!href) continue
          if (isExternalLinkWithBase(href, contentBase) || href.startsWith('..') || href.indexOf('/../') !== -1) continue
          if (href.endsWith('/')) {
            const sub = relDir + href
            if (!seenDirs.has(sub)) queue.push(sub)
            continue
          }
          const path = (relDir + href).replace(/^\/+/, '')
          if (/\.(md|html?)$/i.test(path)) {
            result.add(path)
          }
        } catch (err) { console.warn('[slugManager] crawlAllMarkdown: link iteration failed', err) }
      }
    } catch (err) { console.warn('[slugManager] crawlAllMarkdown: directory fetch failed', err) }
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

  for (const resolver of slugResolvers) {
    try {
      const res = await resolver(decoded, contentBase)
      if (res) {
        _storeSlugMapping(decoded, res)
        mdToSlug.set(res, decoded)
        return res
      }
    } catch (err) { console.warn('[slugManager] slug resolver failed', err) }
  }

  if (allMarkdownPaths && allMarkdownPaths.length) {
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
      } catch (err) { console.warn('[slugManager] manifest title fetch failed', err) }
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
  } catch (err) { console.warn('[slugManager] buildSearchIndex lookup failed', err) }

  try {
    const foundCrawl = await crawlForSlug(decoded, contentBase, maxQueue)
    if (foundCrawl) {
      _storeSlugMapping(decoded, foundCrawl)
      mdToSlug.set(foundCrawl, decoded)
      return foundCrawl
    }
  } catch (err) { console.warn('[slugManager] crawlForSlug lookup failed', err) }

  const candidates = [`${decoded}.html`, `${decoded}.md`]
  for (const cand of candidates) {
    try {
      const res = await fetchMarkdown(cand, contentBase)
      if (res && res.raw) {
        _storeSlugMapping(decoded, cand)
        mdToSlug.set(cand, decoded)
        return cand
      }
    } catch (err) { console.warn('[slugManager] candidate fetch failed', err) }
  }

  if (allMarkdownPaths && allMarkdownPaths.length) {
    for (const p of allMarkdownPaths) {
      try {
        const name = p.replace(/^.*\//, '').replace(/\.(md|html?)$/i, '')
        if (slugify(name) === decoded) {
          _storeSlugMapping(decoded, p)
          mdToSlug.set(p, decoded)
          return p
        }
      } catch (err) { console.warn('[slugManager] build-time filename match failed', err) }
    }
  }

  try {
    const homeCandidates = []
    if (homePage && typeof homePage === 'string' && homePage.trim()) homeCandidates.push(homePage)
    if (!homeCandidates.includes('_home.md')) homeCandidates.push('_home.md')
    for (const hp of homeCandidates) {
      try {
        const home = await fetchMarkdown(hp, contentBase)
        if (home && home.raw) {
          const mhome = (home.raw || '').match(/^#\s+(.+)$/m)
          if (mhome && mhome[1]) {
            const homeSlug = slugify(mhome[1].trim())
            if (homeSlug === decoded) {
              _storeSlugMapping(decoded, hp)
              mdToSlug.set(hp, decoded)
              return hp
            }
          }
        }
      } catch (e) {
      }
    }
  } catch (e) {
    console.warn('[slugManager] home page fetch failed', e)
  }
  return null
}
