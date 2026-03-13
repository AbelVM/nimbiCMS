/** Responsible for slug ↔ markdown mappings, slug generation, and runtime discovery. */
/**
 * Responsible for slug ↔ markdown mappings, slug generation,
 * and runtime discovery.
 */

/**
 * Mapping from a slug (generated from title/H1) to a markdown path or a
 * localized mapping object when `availableLanguages` is used. Values may be
 * a string (direct path) or an object with `{ default?: string, langs?: { [lang:string]: string } }`.
 * Populated during nav construction, anchor rewriting, or on demand via
 * crawling.
 * @type {Map<string, string|{default?:string,langs?:Object.<string,string>}>}
 */
export const slugToMd = new Map()

/**
 * Result returned from `fetchMarkdown`.
 * @typedef {{raw:string,isHtml?:boolean,status?:number}} FetchResult
 */

export let availableLanguages = []

/**
 * Set available language codes for multilingual sites.
 * @param {string[]} list
 * @returns {void}
 */
export function setLanguages(list) {
  availableLanguages = Array.isArray(list) ? list.slice() : []
}
export function getLanguages() { return availableLanguages }

import * as l10n from './l10nManager.js'

let _slugWorker = null
import slugWorkerCode from './worker/slugWorker.js?raw'

import { makeWorkerManager, createWorkerFromRaw } from './worker-manager.js'

const _slugWorkerManager = makeWorkerManager(() => createWorkerFromRaw(slugWorkerCode), 'slugManager')

/**
 * Lazily return a worker instance used for slug-related background tasks.
 * @returns {Worker|null}
 */
export function initSlugWorker() {
  return _slugWorkerManager.get()
}

function _sendToWorker(msg) {
  return _slugWorkerManager.send(msg)
}

/**
 * Build the search index using the slug worker when available.
 * @param {string} contentBase
 * @returns {Promise<Array<{slug:string,title:string,excerpt:string,path:string}>>}
 */
export async function buildSearchIndexWorker(contentBase) {
  const w = initSlugWorker()
  if (!w) return buildSearchIndex(contentBase)

  try {
    return await _sendToWorker({ type: 'buildSearchIndex', contentBase })
  } catch (err) {
    // If the worker fails, fall back to main thread index build.
    try {
      return await buildSearchIndex(contentBase)
    } catch (_) {
      // If that also fails, propagate the original worker error.
      throw err
    }
  }
}

/**
 * Attempt to resolve a slug via the worker when available, otherwise fallback
 * to the main-thread `crawlForSlug` implementation.
 * @param {string} slug
 * @param {string} base
 * @param {number} maxQueue
 * @returns {Promise<string|null>}
 */
export async function crawlForSlugWorker(slug, base, maxQueue) {
  const w = initSlugWorker()
  if (w) return _sendToWorker({ type: 'crawlForSlug', slug, base, maxQueue })
  return crawlForSlug(slug, base, maxQueue)
}

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
 * @param {(slug:string,contentBase?:string)=>Promise<string|null>|string|null} fn
 * @returns {void}
 */
/**
 * Register a custom slug resolver function. The function should accept a
 * slug (string) and return a markdown path (or promise thereof) or `null`.
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
 * Reverse mapping of `slugToMd` (markdown path -> slug).
 * @type {Map<string,string>}
 */
export const mdToSlug = new Map()

let _allMd = {}

export let allMarkdownPaths = []

/**
 * The path used for the site's not-found page (relative to content base).
 * Consumers may override via `setNotFoundPage()`; defaults to `_404.md`.
 * @type {string}
 */
export let notFoundPage = '_404.md'

/**
 * Set the not-found page path used when `fetchMarkdown` encounters a
 * missing markdown file or an HTML response for a `.md` request.
 * @param {string} p
 */
export function setNotFoundPage(p) {
  if (p == null) return
  notFoundPage = String(p || '')
}

/**
 * Replace internal manifest used by `setContentBase` with a custom object
 * (keyed by full path).  Intended for unit tests.
 * @param {Object<string,string>} obj
 */
/**
 * Replace internal manifest used by `setContentBase` with a custom object
 * (keyed by full path). Intended for unit tests.
 * @param {Object<string,string>} obj
 */
export function _setAllMd(obj) {
  _allMd = obj || {}
}

/** @type {Map<string,string>} */
export const listSlugCache = new Map()
/** @type {Set<string>} */
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

import { refreshIndexPaths, indexSet } from './indexManager.js'
import { normalizePath, trimTrailingSlash, ensureTrailingSlash } from './utils/helpers.js'

/**
 * Set the content base URL (the runtime `contentPath`) and rebuild slug
 * maps and `allMarkdownPaths` relative to that base.
 * @param {string} [contentBase]
 * @returns {void}
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
          } catch (_e) { console.warn('[slugManager] set slug mapping failed', _e) }
        }
      }
    }
  }
}

try { setContentBase() } catch (err) { console.warn('[slugManager] initial setContentBase failed', err) }

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
 * current UI language and available language list into account. If no
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
      } else {
        const leading = baseClean.startsWith('/') ? '' : '/'
        url = leading + baseClean.replace(/\/$/, '') + '/' + path.replace(/^\//, '')
      }
    } else {
      url = '/' + path.replace(/^\//, '')
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
 * @param {(path:string, base?:string)=>Promise<FetchResult>} fn
 */
export function setFetchMarkdown(fn) {
  if (typeof fn === 'function') {
    fetchMarkdown = fn
  }
}

export const crawlCache = new Map()

/** @type {Array<{slug:string,title:string,excerpt:string,path:string}>} */
export let searchIndex = []

let _indexPromise = null
export async function buildSearchIndex(contentBase) {
  if (searchIndex && searchIndex.length) return searchIndex
  if (_indexPromise) return _indexPromise

  _indexPromise = (async () => {
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
          console.warn('[slugManager] discovery fetch failed for', p, e)
        }
      }
    } catch (e) {
      console.warn('[slugManager] discovery loop failed', e)
    }

    const seen = new Set()
    paths = paths.filter(p => {
      if (!p || seen.has(p)) return false
      seen.add(p)
      return true
    })

    const idx = []
    for (const path of paths) {
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
            } catch (err) { console.warn('[slugManager] parsing HTML for index failed', err) }
          } else {
            const raw = md.raw
            const h1m = raw.match(/^#\s+(.+)$/m)
            title = h1m ? h1m[1].trim() : ''
            const parts = raw.split(/\r?\n\s*\r?\n/)
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
          } catch (err) { console.warn('[slugManager] mdToSlug access failed', err) }
          if (!slug) slug = slugify(title || path)
          idx.push({ slug, title, excerpt, path })
        }
      } catch (err) {
        console.warn('[slugManager] buildSearchIndex: entry fetch failed', err)
      }
    }
    searchIndex = idx
    return searchIndex
  })()
  try { await _indexPromise } catch (err) { console.warn('[slugManager] awaiting _indexPromise failed', err) }
  _indexPromise = null
  return searchIndex
}

export const CRAWL_MAX_QUEUE = 1000
export let defaultCrawlMaxQueue = CRAWL_MAX_QUEUE

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
 * @param {string} contentBase
 * @param {number} [maxQueue]
 * @returns {Promise<string[]>}
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
 * @param {string} decoded
 * @param {string} contentBase
 * @param {number} [maxQueue]
 * @returns {Promise<string|null>}
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
    console.warn('[slugManager] home page fetch failed', e)
  }
  return null
}
