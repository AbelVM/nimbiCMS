/**
 * mapping from a slug (generated from title/H1) to a markdown path.
 * Populated during nav construction and anchor rewriting.
 * @type {Map<string,string>}
 */
export const slugToMd = new Map()
/**
 * reverse mapping of `slugToMd` (markdown path -> slug).
 * @type {Map<string,string>}
 */
export const mdToSlug = new Map()

// gather all markdown file paths via Vite glob at build time; this allows slug
// resolution to work even for files not linked from the navigation.
// paths are relative to the content base (e.g. 'blog/foo.md').
let _allMd = {}
try {
  if (import.meta && typeof import.meta.glob === 'function') {
    _allMd = import.meta.glob('/example/content/**/*.md', { as: 'raw', eager: true })
  }
} catch (_) {
  // fall back to empty object in non-Vite environments (tests)
}
/**
 * List of all markdown file paths gathered at build time by Vite globbing.
 * @type {string[]}
 */
export let allMarkdownPaths = [];

// Build initial slug <-> markdown mappings based on each file's first H1.
// This runs at module load time so even before any navigation or rendering
// occurs the maps contain every page's slug.  It relies on the eager glob
// having loaded the raw content for all md files.
/*
 * Initialize slug mappings relative to a content base.  The build-time
 * glob keys in `_allMd` can contain project-specific prefixes; callers
 * should pass the `contentBase` (full URL or path) used at runtime so
 * we can compute consistent relative paths. If no `contentBase` is
 * provided we derive a sensible common prefix from the glob keys.
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
  // trim to last slash so we don't cut partial segment
  const lastSlash = prefix.lastIndexOf('/')
  return lastSlash === -1 ? prefix : prefix.slice(0, lastSlash + 1)
}

/**
 * Set the content base URL (the runtime `contentPath`) and rebuild slug
 * maps and `allMarkdownPaths` relative to that base.
 * @param {string} [contentBase]
 */
export function setContentBase(contentBase) {
  // clear existing maps
  slugToMd.clear(); mdToSlug.clear(); allMarkdownPaths = []

  const keys = Object.keys(_allMd || {})
  if (!keys.length) return

  // If a contentBase URL was provided, prefer its pathname as the strip
  // prefix; otherwise derive a common prefix from the glob keys.
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

    const raw = _allMd[fullPath] || ''
    const m = (raw || '').match(/^#\s+(.+)$/m)
    if (m && m[1]) {
      const slug = slugify(m[1].trim())
      if (slug) {
        try { slugToMd.set(slug, rel); mdToSlug.set(rel, slug) } catch (_e) { }
      }
    }
  }
}

// run an initial populate using whatever information is available at module
// load time. This avoids breaking tests that expect `allMarkdownPaths` to be
// populated even if `initCMS` hasn't been called yet.
try { setContentBase() } catch (_) { }

/**
 * Convert a string to a URL-friendly slug (lowercase, dashes).
 * @param {any} s
 * @returns {string}
 */
export function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\- ]/g, '')
    .replace(/ /g, '-')
}

// simple in-memory cache of fetchMarkdown responses keyed by the resolved URL
export const fetchCache = new Map()

function clearFetchCache() {
  fetchCache.clear()
}

/**
 * Fetch a markdown (or HTML) file from the content base, caching the
 * promise.  Returns an object `{ raw, isHtml? }`.
 * @param {string} path
 * @param {string} base
 * @returns {Promise<{raw:string,isHtml?:boolean,status?:number}>}
 */
export async function fetchMarkdown(path, base) {
  if (!path) throw new Error('path required')
  // if the caller supplied a slug-like filename (basename.md), and we've
  // already mapped that slug to a canonical path, rewrite before fetching.
  try {
    const o = (String(path || '').match(/([^\/]+)\.md(?:$|[?#])/) || [])[1]
    if (o && slugToMd.has(o)) {
      const mapped = slugToMd.get(o)
      if (mapped && mapped !== path) {
        path = mapped
      }
    }
  } catch (_) {
    // ignore failures, proceed with original path
  }
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
          const r404 = await fetch(p404)
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
    // Allow HTML files in the content directory — return them as-is and mark as HTML
    const isHtml = trimmed.startsWith('<!doctype') || trimmed.startsWith('<html') || String(path || '').toLowerCase().endsWith('.html')
    return isHtml ? { raw, isHtml: true } : { raw }
  })()

  fetchCache.set(url, promise)
  return promise
}
