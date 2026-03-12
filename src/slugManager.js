// responsible for slug ↔ markdown mappings, slug generation, and related
// utilities such as on‑the‑fly discovery of slugs by crawling the content
// directory.  This module is the canonical home for anything dealing with
// slugs or markdown path resolution.

/**
 * mapping from a slug (generated from title/H1) to a markdown path.
 * Populated during nav construction, anchor rewriting, or on demand via
 * crawling.
 * @type {Map<string,string>}
 */
export const slugToMd = new Map()

// list of available language codes when running in a multilingual site.
// When non-empty, slug-to-path mappings are stored in a nested object
// so that each language can have its own file.  The option is populated by
// `setLanguages()` called from `initCMS()`.
export let availableLanguages = []

// helper for tests and plugins
export function setLanguages(list) {
  availableLanguages = Array.isArray(list) ? list.slice() : []
}
export function getLanguages() { return availableLanguages }

// import current UI language; slug resolution prefers this when available.
import * as l10n from './l10nManager.js'

// ------------------ worker support ----------------------------------------
// Slug worker runs from inlined source so the published bundle remains a single JS file.
let _slugWorker = null
import slugWorkerCode from './worker/slugWorker.js?raw'

/**
 * lazily create or return a singleton worker instance
 * @returns {Worker|null}
 */
export function initSlugWorker() {
  if (!_slugWorker) {
    try {
      let workerUrl = null
      if (typeof Blob !== 'undefined' && typeof URL !== 'undefined' && slugWorkerCode) {
        try {
          const blob = new Blob([slugWorkerCode], { type: 'application/javascript' })
          workerUrl = URL.createObjectURL(blob)
        } catch (_) {
          workerUrl = null
        }
      }
      if (workerUrl) {
        _slugWorker = new Worker(workerUrl, { type: 'module' })
      } else {
        _slugWorker = null
      }
    } catch (e) {
      // Worker may not be available in this environment
      console.warn('[slugManager] slug worker init failed', e)
      _slugWorker = null
    }
  }
  return _slugWorker
}

function _sendToWorker(msg) {
  return new Promise((resolve, reject) => {
    const w = initSlugWorker()
    if (!w) return reject(new Error('worker unavailable'))
    const id = String(Math.random())
    msg.id = id
    const handler = (ev) => {
      const data = ev.data || {}
      if (data.id !== id) return
      w.removeEventListener('message', handler)
      if (data.error) reject(new Error(data.error))
      else resolve(data.result)
    }
    w.addEventListener('message', handler)
    w.postMessage(msg)
  })
}

/**
 * Build search index using worker if available.
 */
export async function buildSearchIndexWorker(contentBase) {
  const w = initSlugWorker()
  if (w) return _sendToWorker({ type: 'buildSearchIndex', contentBase })
  return buildSearchIndex(contentBase)
}

/**
 * Crawl for slug using worker when possible.
 */
export async function crawlForSlugWorker(slug, base, maxQueue) {
  const w = initSlugWorker()
  if (w) return _sendToWorker({ type: 'crawlForSlug', slug, base, maxQueue })
  return crawlForSlug(slug, base, maxQueue)
}


// helper used internally to add slug ↔ path mappings respecting
// `availableLanguages`.  Normalizes existing entries to object form as
// needed.  Exposed here only for tests.
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

// external slug resolver hooks.  Plugins can register async functions that
// return a markdown path for a given slug.  These are checked before any
// fallback logic.
export const slugResolvers = new Set()
/**
 * Register a custom resolver function.  The function should accept a slug
 * string and return a markdown path (or promise thereof) or `null` if not
 * resolved.
 * @param {(slug:string,contentBase?:string)=>Promise<string|null>|string|null} fn
 * @returns {void}
 */
export function addSlugResolver(fn) { if (typeof fn === 'function') slugResolvers.add(fn) }
/**
 * Unregister a previously added resolver.
 * @param {(slug:string)=>any} fn
 * @returns {void}
 */
export function removeSlugResolver(fn) { if (typeof fn === 'function') slugResolvers.delete(fn) }
/**
 * reverse mapping of `slugToMd` (markdown path -> slug).
 * @type {Map<string,string>}
 */
export const mdToSlug = new Map()

// build-time glob placeholder.  In a library build we intentionally keep
// this empty to avoid bundling actual markdown; the `allMarkdownPaths`
// array may still be populated by the build when running the example
// application, which gives us a cheap way to resolve slugs for pages that
// aren't linked in the navigation.
//
// build-time glob placeholder.  In a library build we intentionally keep
// this empty to avoid bundling actual markdown; the `allMarkdownPaths`
// array may still be populated by the build when running the example
// application, which gives us a cheap way to resolve slugs for pages that
// aren't linked in the navigation.
//
// Historically the example harness used a Vite plugin to embed the list of
// all content files into the bundle so that the search index could be
// pre‑populated at startup.  The user has opted to perform indexing at
// runtime only, so that plugin is no longer used; `_allMd` stays empty in
// normal operation.

let _allMd = {}

export let allMarkdownPaths = []

// helper used by tests to simulate injection of markdown data
/**
 * Replace internal manifest used by `setContentBase` with a custom object
 * (keyed by full path).  Intended for unit tests.
 * @param {Object<string,string>} obj
 */
export function _setAllMd(obj) {
  _allMd = obj || {}
}

// cache mapping discovered slugs from the `allMarkdownPaths` manifest to
// their markdown path.  This is populated lazily when we fetch titles from
// the manifest entries; storing it avoids repeated fetches during tests or
// runtime lookups.
export const listSlugCache = new Map()
// set of manifest paths we've already inspected and recorded in
// `listSlugCache` so we don't re-fetch them.
export const listPathsFetched = new Set()
/**
 * Clear any cached slug lookups derived from the build-time manifest.
 * Useful in tests when `_allMd` is re‑injected.
 * @returns {void}
 */
export function clearListCaches() { listSlugCache.clear(); listPathsFetched.clear() }

/**
 * Derive the longest common directory prefix from an array of paths.
 * @param {string[]} paths
 * @returns {string}
 */
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
 * Set the content base URL (the runtime `contentPath`) and rebuild slug
 * maps and `allMarkdownPaths` relative to that base.
 * @param {string} [contentBase]
 * @returns {void}
 */
import { refreshIndexPaths } from './router.js'
import { normalizePath, trimTrailingSlash, ensureTrailingSlash } from './utils/helpers.js'

export function setContentBase(contentBase) {
  slugToMd.clear(); mdToSlug.clear(); allMarkdownPaths = []
  availableLanguages = availableLanguages || []

  const keys = Object.keys(_allMd || {})
  if (!keys.length) return

  let prefix = ''
  try {
    if (contentBase) {
      try { prefix = new URL(contentBase).pathname } catch (_) { prefix = String(contentBase || '') }
      prefix = ensureTrailingSlash(prefix)
    }
  } catch (_) { prefix = '' }

  if (!prefix) prefix = _deriveCommonPrefix(keys)

  for (const fullPath of keys) {
    let rel = fullPath
    if (prefix && fullPath.startsWith(prefix)) {
      rel = normalizePath(fullPath.slice(prefix.length))
    } else {
      rel = normalizePath(fullPath)
    }
    allMarkdownPaths.push(rel)
    // keep router index up to date with newly discovered markdown
    try { refreshIndexPaths() } catch (_) {}

    const val = _allMd[fullPath]
    if (typeof val === 'string') {
      const m = (val || '').match(/^#\s+(.+)$/m)
      if (m && m[1]) {
        const slug = slugify(m[1].trim())
        if (slug) {
          try {
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
            mdToSlug.set(rel, slug)
          } catch (_e) { }
        }
      }
    }
  }
}

// run an initial populate using whatever information is available at module
// load time.  This avoids breaking tests that expect `allMarkdownPaths` to be
// populated even if `initCMS` hasn't been called yet.
try { setContentBase() } catch (_) { }

/**
 * Convert a string to a URL-friendly slug (lowercase, dashes).  In
 * addition to removing illegal characters we also strip any trailing
 * "md" or "html" segment to ensure that slugs never resemble filenames
 * (see tests and user documentation).
 * @param {string} s
 * @returns {string}
 */
export function slugify(s) {
  let slug = String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\- ]/g, '')
    .replace(/ /g, '-')
  slug = slug.replace(/(?:-?)(?:md|html)$/, '')
  return slug
}

/**
 * Given a slug, return the most appropriate markdown path taking the
 * current UI language and available language list into account.  If no
 * mapping exists the return value is `null`.
 *
 * @param {string} slug
 * @returns {string|null}
 */
export function resolveSlugPath(slug) {
  if (!slug || !slugToMd.has(slug)) return null
  const entry = slugToMd.get(slug)
  if (!entry) return null
  if (typeof entry === 'string') return entry
  // entry is object with {default?, langs?}
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

// simple in-memory cache of fetchMarkdown responses keyed by the resolved URL
/**
 * @type {Map<string,Promise<any>>}
 */
export const fetchCache = new Map()
/**
 * Empty the in-memory markdown fetch cache.  Useful for tests or when the
 * consumer knows the underlying files have changed.
 * @returns {void}
 */
export function clearFetchCache() { fetchCache.clear() }

/**
 * Fetch a markdown (or HTML) file from the content base, caching the
 * promise.  Returns an object `{ raw, isHtml? }`.
 * @param {string} path
 * @param {string} base
 * @returns {Promise<{raw:string,isHtml?:boolean,status?:number}>}
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
  } catch (_) {}  const baseClean = trimTrailingSlash(base)
  const url = `${baseClean}/${path}`
  if (fetchCache.has(url)) {
    return fetchCache.get(url)
  }

  const promise = (async () => {
    const res = await fetch(url)
    if (!res.ok) {
      if (res.status === 404) {
          try {
          const p404 = `${baseClean}/_404.md`
          const r404 = await globalThis.fetch(p404)
          if (r404.ok) {
            const raw404 = await r404.text()
            return { raw: raw404, status: 404 }
          }
        } catch (_ee) { }
      }
      let body = ''
      try {
        body = await res.clone().text()
      } catch (_) {
        body = ''
      }
      console.error('fetchMarkdown failed:', { url, status: res.status, statusText: res.statusText, body: body.slice(0, 200) })
      throw new Error('failed to fetch md')
    }
    const raw = await res.text()
    const trimmed = raw.trim().slice(0, 16).toLowerCase()
    const looksLikeHtml = trimmed.startsWith('<!doctype') || trimmed.startsWith('<html')
    const isHtml = looksLikeHtml || String(path || '').toLowerCase().endsWith('.html')

    // If the request was for a `.md` file but the server returned HTML (often
    // due to a SPA fallback like index.html), treat this as a missing markdown
    // page rather than a successful fetch. In that case, try to load the
    // site's `_404.md` and return it if available so the CMS can render a
    // proper 404 page instead of showing the site's index HTML.
    if (looksLikeHtml && String(path || '').toLowerCase().endsWith('.md')) {
      try {
        const p404 = `${baseClean}/_404.md`
        const r404 = await globalThis.fetch(p404)
        if (r404.ok) {
          const raw404 = await r404.text()
          return { raw: raw404, status: 404 }
        }
      } catch (_ee) { }
      console.error('fetchMarkdown: server returned HTML for .md request', url)
      throw new Error('failed to fetch md')
    }

    return isHtml ? { raw, isHtml: true } : { raw }
  })()

  fetchCache.set(url, promise)
  return promise
}

// cache results from crawl attempts so we don't re-scan directories
export const crawlCache = new Map()

// simple client-side search index generated from headings.  Populated by
// `buildSearchIndex`; stored here so UI components can query it directly.
export let searchIndex = []

/**
 * Build a lightweight search index by fetching every markdown page and
 * extracting the first H1 title plus a brief excerpt (first non-heading
 * paragraph).  Results are cached in `searchIndex` for subsequent queries.
 *
 * `contentBase` should be the same URL passed to `fetchMarkdown`.
 *
 * @param {string} contentBase
 * @returns {Promise<Array<{slug:string,title:string,excerpt:string,path:string}>>}
 */
let _indexPromise = null
export async function buildSearchIndex(contentBase) {
  // if we've already built the index, just return it
  if (searchIndex && searchIndex.length) return searchIndex
  // if a build is in progress, reuse its promise
  if (_indexPromise) return _indexPromise

  _indexPromise = (async () => {
    // compile list of markdown paths to index.  normally this comes from
  // `allMarkdownPaths`, which is populated at build time for the example and
  // test harness.  library consumers ship without embedded content, so the
  // array is empty; fall back to any paths we've learned via the slug maps
  // (populated during navigation or crawling).
  let paths = []
  if (allMarkdownPaths && allMarkdownPaths.length) {
    paths = Array.from(allMarkdownPaths)
  }
  if (!paths.length) {
    for (const v of slugToMd.values()) {
      if (v) paths.push(v)
    }
  }
  // always crawl the content directory as a fallback.  this handles cases
  // where navigation is empty or the site has pages that aren’t linked.
  try {
    const crawled = await crawlAllMarkdown(contentBase)
    if (crawled && crawled.length) {
      paths = paths.concat(crawled)
    }
  } catch (_) {}

  // now attempt to discover additional pages by following links in the
  // content paths we already know about.  this allows the index to grow
  // beyond the strict navigation list while still respecting the caller's
  // `crawlMaxQueue` limit (default 1000).
  try {
    const visited = new Set(paths)
    const queue = [...paths]
    if (visited.size === 0) {
      // nothing to crawl
    }
    while (queue.length && visited.size <= defaultCrawlMaxQueue) {
      const p = queue.shift()
      try {
        const md = await fetchMarkdown(p, contentBase)
        if (md && md.raw) {
          let raw = md.raw
          const hrefs = []
          const mdLinkRe = /\[[^\]]+\]\(([^)]+)\)/g
          let m
          while ((m = mdLinkRe.exec(raw))) {
            hrefs.push(m[1])
          }
          const htmlLinkRe = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi
          while ((m = htmlLinkRe.exec(raw))) {
            hrefs.push(m[1])
          }
          for (let href of hrefs) {
            if (/^[a-z][a-z0-9+.-]*:/i.test(href)) continue
            href = normalizePath(href)
            if (!/\.(md|html?)(?:$|[?#])/i.test(href)) continue
            href = href.split(/[?#]/)[0]
            if (!visited.has(href)) {
              visited.add(href)
              queue.push(href)
              paths.push(href)
            }
          }
        }
      } catch (e) {
        // swallow
      }
    }
  } catch (e) {
    // swallow
  }
  // dedupe in-case the same file appears multiple times
  const seen = new Set()
  paths = paths.filter(p => {
    if (!p || seen.has(p)) return false
    seen.add(p)
    return true
  })

  const idx = []
  for (const path of paths) {
    // only process markdown or html pages
    if (!/\.(?:md|html?)(?:$|[?#])/i.test(path)) continue
    try {
      const md = await fetchMarkdown(path, contentBase)
      if (md && md.raw) {
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
          } catch (_) {}
        } else {
          const raw = md.raw
          const h1m = raw.match(/^#\s+(.+)$/m)
          title = h1m ? h1m[1].trim() : ''
          const parts = raw.split(/\r?\n\s*\r?\n/)
          // first paragraph after the heading
          if (parts.length > 1) {
            for (let i = 1; i < parts.length; i++) {
              const p = parts[i].trim()
              if (p && !/^#/.test(p)) { excerpt = p.replace(/\r?\n/g, ' '); break }
            }
          }
        }
        let slug = ''
        try {
          if (mdToSlug.has(path)) slug = mdToSlug.get(path)
        } catch (_) {}
        if (!slug) slug = slugify(title || path)
        idx.push({ slug, title, excerpt, path })
      }
    } catch (err) {
      // ignore failures, continue index
    }
  }
  searchIndex = idx
  return searchIndex
})()
  // once finished, clear the promise so subsequent calls can rebuild if
  // the cache is cleared externally.
  try { await _indexPromise } catch (_) {}
  _indexPromise = null
  return searchIndex
}

// maximum number of pending directories we'll track during a crawl.  a
// pathological site could expose an infinite or very deep tree, so we guard
// against runaway memory usage by aborting once the queue grows past this
// threshold.  callers can override by passing a lower value to
// `crawlForSlug`.
export const CRAWL_MAX_QUEUE = 1000

// runtime-configurable default for the maximum queue length used by
// `crawlForSlug`.  Consumers (e.g. initCMS) may override this via
// `setDefaultCrawlMaxQueue()`; tests can modify it as well for edge cases.
export let defaultCrawlMaxQueue = CRAWL_MAX_QUEUE

/**
 * Change the default queue limit used by `crawlForSlug` when no explicit
 * `maxQueue` argument is provided.  Useful for controlling memory usage from
 * application code (e.g. via `initCMS` options).
 * @param {number} n
 * @returns {void}
 */
export function setDefaultCrawlMaxQueue(n) {
  if (typeof n === 'number' && n >= 0) defaultCrawlMaxQueue = n
}

// performance micro-optimizations used by crawlForSlug
// a single DOMParser can be reused safely across calls and avoids allocating
// a fresh one on every directory listing.
const _crawlParser = new DOMParser()
// predefine selector string so we don't rebuild it each time
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
 * @param {string} decoded
 * @param {string} contentBase
 * @returns {Promise<string|null>} relative markdown path or null
 */
export let crawlForSlug = async function(decoded, contentBase, maxQueue = defaultCrawlMaxQueue) {
  if (crawlCache.has(decoded)) return crawlCache.get(decoded)
  let found = null
  const seenDirs = new Set()
  const queue = ['']

  while (queue.length && !found) {
    if (queue.length > maxQueue) {
      // abort early to avoid excessive memory use; record failure so
      // subsequent calls won't replay the same expensive crawl.
      break
    }
    const relDir = queue.shift()
    if (seenDirs.has(relDir)) continue
    seenDirs.add(relDir)
    let url = contentBase
    if (!url.endsWith('/')) url += '/'
    url += relDir
    try {
      const res = await globalThis.fetch(url)
      if (!res.ok) continue
      const text = await res.text()
      const doc = _crawlParser.parseFromString(text, 'text/html')
      const links = doc.querySelectorAll(_crawlLinkSelector)
      for (const a of links) {
        try {
          let href = a.getAttribute('href') || ''
          if (!href) continue
          if (href.endsWith('/')) {
            const sub = relDir + href
            if (!seenDirs.has(sub)) queue.push(sub)
            continue
          }
          if (href.toLowerCase().endsWith('.md')) {
            const path = normalizePath(relDir + href)
            // avoid re-fetching files we already know the slug for; if the
            // recorded slug doesn't match the one we're seeking there is no
            // reason to load the file again.  the mapping might exist either
            // as a key in mdToSlug or as a value in slugToMd, so check both.
            try {
              if (mdToSlug.has(path)) {
                continue
              }
              // also skip if slugToMd contains this path as one of its values
              for (const v of slugToMd.values()) {
                if (v === path) { continue }
              }
            } catch (_e) {}
            try {
              const md = await fetchMarkdown(path, contentBase)
              if (md && md.raw) {
                const m = (md.raw || '').match(/^#\s+(.+)$/m)
                if (m && m[1] && slugify(m[1].trim()) === decoded) {
                  found = path
                  break
                }
              }
            } catch (_) {}
          }
        } catch (_) {}
      }
    } catch (_) {}
  }
  crawlCache.set(decoded, found)
  return found
}

/**
 * Crawl the content directory collecting all markdown and HTML pages.  Uses
 * the same directory‑listing traversal logic as `crawlForSlug` but does not
 * stop early; it simply records any links ending in `.md` or `.html`.
 *
 * This is useful for building a search index over the entire site when the
 * navigation only covers a subset of pages.
 *
 * @param {string} contentBase
 * @param {number} [maxQueue]
 * @returns {Promise<string[]>} list of relative paths
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
      const res = await globalThis.fetch(url)
      if (!res.ok) continue
      const text = await res.text()
      const doc = _crawlParser.parseFromString(text, 'text/html')
      const links = doc.querySelectorAll(_crawlLinkSelector)
      for (const a of links) {
        try {
          let href = a.getAttribute('href') || ''
          if (!href) continue
          if (href.endsWith('/')) {
            const sub = relDir + href
            if (!seenDirs.has(sub)) queue.push(sub)
            continue
          }
          // record markdown or html pages
          const path = (relDir + href).replace(/^\/+/, '')
          if (/\.(md|html?)$/i.test(path)) {
            result.add(path)
          }
        } catch (_) {}
      }
    } catch (_) {}
  }

  return Array.from(result)
}

/**
 * Ensure the given slug is mapped to a markdown path.  This will return an
 * existing mapping if one is available, otherwise it will attempt discovery
 * via navigation index, crawling, and finally the home file as a special
 * case.
 *
 * @param {string} decoded
 * @param {string} contentBase
 * @returns {Promise<string|null>}
 */
export async function ensureSlug(decoded, contentBase, maxQueue) {
  // strip leading/trailing slashes which may come from URL path fragments
  if (decoded && typeof decoded === 'string') {
    decoded = normalizePath(decoded)
    decoded = trimTrailingSlash(decoded)
  }
  if (slugToMd.has(decoded)) {
    return resolveSlugPath(decoded) || slugToMd.get(decoded)
  }

  // allow external resolvers to override the slug before crawling
  for (const resolver of slugResolvers) {
    try {
      const res = await resolver(decoded, contentBase)
      if (res) {
        _storeSlugMapping(decoded, res)
        mdToSlug.set(res, decoded)
        return res
      }
    } catch (_) { }
  }

  // manifest-based title lookup (lazy)
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
      } catch (_) { }
    }
  }

  // search-index lookup (may await ongoing build)
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
  } catch (_) {}

  // breadth-first crawl of directories
  try {
    const foundCrawl = await crawlForSlug(decoded, contentBase, maxQueue)
    if (foundCrawl) {
      _storeSlugMapping(decoded, foundCrawl)
      mdToSlug.set(foundCrawl, decoded)
      return foundCrawl
    }
  } catch (_) {}

  // attempt to resolve using an obvious filename guess (runtime-only)
  // Do not guess directory index files (index.md/index.html) for unknown
  // slugs; doing so caused unknown slugs to resolve to index.html and
  // prevented 404 handling. Only try direct filename guesses.
  const candidates = [`${decoded}.md`, `${decoded}.html`]
  for (const cand of candidates) {
    try {
      const res = await fetchMarkdown(cand, contentBase)
      if (res && res.raw) {
        _storeSlugMapping(decoded, cand)
        mdToSlug.set(cand, decoded)
        return cand
      }
    } catch (_) { /* ignore failures */ }
  }

  // optional build-time filename match
  if (allMarkdownPaths && allMarkdownPaths.length) {
    for (const p of allMarkdownPaths) {
      try {
        const name = p.replace(/^.*\//, '').replace(/\.(md|html?)$/i, '')
        if (slugify(name) === decoded) {
          _storeSlugMapping(decoded, p)
          mdToSlug.set(p, decoded)
          return p
        }
      } catch (_) {}
    }
  }

  // last-ditch attempt via home page
  try {
    const home = await fetchMarkdown('_home.md', contentBase)
    if (home && home.raw) {
      const mhome = (home.raw || '').match(/^#\s+(.+)$/m)
      if (mhome && mhome[1]) {
        const homeSlug = slugify(mhome[1].trim())
        if (homeSlug === decoded) {
          _storeSlugMapping(decoded, '_home.md')
          mdToSlug.set('_home.md', decoded)
          return '_home.md'
        }
      }
    }
  } catch (e) {
    // ignore failures
  }
  return null
}
