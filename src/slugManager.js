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

// external slug resolver hooks.  Plugins can register async functions that
// return a markdown path for a given slug.  These are checked before any
// fallback logic.
export const slugResolvers = new Set()
export function addSlugResolver(fn) { if (typeof fn === 'function') slugResolvers.add(fn) }
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
 * Set the content base URL (the runtime `contentPath`) and rebuild slug
 * maps and `allMarkdownPaths` relative to that base.
 * @param {string} [contentBase]
 */
import { refreshIndexPaths } from './router.js'

export function setContentBase(contentBase) {
  slugToMd.clear(); mdToSlug.clear(); allMarkdownPaths = []

  const keys = Object.keys(_allMd || {})
  if (!keys.length) return

  let prefix = ''
  try {
    if (contentBase) {
      try { prefix = new URL(contentBase).pathname } catch (_) { prefix = String(contentBase || '') }
      if (!prefix.endsWith('/')) prefix = prefix + '/'
    }
  } catch (_) { prefix = '' }

  if (!prefix) prefix = _deriveCommonPrefix(keys)

  for (const fullPath of keys) {
    let rel = fullPath
    if (prefix && fullPath.startsWith(prefix)) {
      rel = fullPath.slice(prefix.length).replace(/^\/+/, '')
    } else {
      rel = fullPath.replace(/^\.\//, '').replace(/^\//, '')
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
          try { slugToMd.set(slug, rel); mdToSlug.set(rel, slug) } catch (_e) { }
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
 * @param {any} s
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

// simple in-memory cache of fetchMarkdown responses keyed by the resolved URL
/**
 * @type {Map<string,Promise<any>>}
 */
export const fetchCache = new Map()
/**
 * Empty the in-memory markdown fetch cache.  Useful for tests or when the
 * consumer knows the underlying files have changed.
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
      const mapped = slugToMd.get(o)
      if (mapped && mapped !== path) {
        path = mapped
      }
    }
  } catch (_) {}
  const baseClean = base.endsWith('/') ? base.slice(0, -1) : base
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
      const body = await res.clone().text().catch(() => '')
      console.error('fetchMarkdown failed:', { url, status: res.status, statusText: res.statusText, body: body.slice(0, 200) })
      throw new Error('failed to fetch md')
    }
    const raw = await res.text()
    const trimmed = raw.trim().slice(0, 16).toLowerCase()
    const isHtml = trimmed.startsWith('<!doctype') || trimmed.startsWith('<html') || String(path || '').toLowerCase().endsWith('.html')
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
            href = href.replace(/^\.?\//, '')
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
            const path = (relDir + href).replace(/^\/+/, '')
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
    decoded = decoded.replace(/^\/+|\/+$/g, '')
  }
  if (slugToMd.has(decoded)) {
    const existing = slugToMd.get(decoded)
    try { console.log('[slug] cache', decoded, '->', existing) } catch (_) {}
    return existing
  }

  // allow external resolvers to override the slug before crawling
  for (const resolver of slugResolvers) {
    try {
      const res = await resolver(decoded, contentBase)
      if (res) {
        slugToMd.set(decoded, res)
        mdToSlug.set(res, decoded)
        try { console.log('[slug] resolver', decoded, '->', res) } catch(_) {}
        return res
      }
    } catch (_) { }
  }

  // manifest-based title lookup (lazy)
  if (allMarkdownPaths && allMarkdownPaths.length) {
    if (listSlugCache.has(decoded)) {
      const p = listSlugCache.get(decoded)
      try { console.log('[slug] list-cache', decoded, '->', p) } catch (_) {}
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
              try { console.log('[slug] list', decoded, '->', p) } catch (_) {}
              slugToMd.set(decoded, p); mdToSlug.set(p, decoded)
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
        try { console.log('[slug] index', decoded, '->', match.path) } catch(_) {}
        slugToMd.set(decoded, match.path)
        mdToSlug.set(match.path, decoded)
        return match.path
      }
    }
  } catch (_) {}

  // breadth-first crawl of directories
  try {
    const foundCrawl = await crawlForSlug(decoded, contentBase, maxQueue)
    if (foundCrawl) {
      try { console.log('[slug] crawl', decoded, '->', foundCrawl) } catch(_) {}
      slugToMd.set(decoded, foundCrawl)
      mdToSlug.set(foundCrawl, decoded)
      return foundCrawl
    }
  } catch (_) {}

  // attempt to resolve using an obvious filename guess (runtime-only)
  const candidates = [`${decoded}.md`, `${decoded}.html`, `${decoded}/index.md`, `${decoded}/index.html`]
  for (const cand of candidates) {
    try {
      const res = await fetchMarkdown(cand, contentBase)
      if (res && res.raw) {
        slugToMd.set(decoded, cand)
        mdToSlug.set(cand, decoded)
        try { console.log('[slug] guess', decoded, '->', cand) } catch(_) {}
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
          slugToMd.set(decoded, p)
          mdToSlug.set(p, decoded)
          try { console.log('[slug] allMd', decoded, '->', p) } catch(_) {}
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
          slugToMd.set(decoded, '_home.md')
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
