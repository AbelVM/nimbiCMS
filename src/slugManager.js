// responsible for slug ↔ markdown mappings, slug generation, and related
// utilities such as on‑the‑fly discovery of slugs by crawling the content
// directory.  This module is the canonical home for anything dealing with
// slugs or markdown path resolution.

/* eslint-env browser */

/**
 * mapping from a slug (generated from title/H1) to a markdown path.
 * Populated during nav construction, anchor rewriting, or on demand via
 * crawling.
 * @type {Map<string,string>}
 */
export const slugToMd = new Map()
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
let _allMd = {}
export let allMarkdownPaths = []

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
  if (slugToMd.has(decoded)) return slugToMd.get(decoded)
  // first try crawling
  let found
  try { found = await crawlForSlug(decoded, contentBase, maxQueue) } catch (e) {
    found = null
  }
  if (found) {
    slugToMd.set(decoded, found)
    mdToSlug.set(found, decoded)
    return found
  }
  // last-ditch home attempt
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
