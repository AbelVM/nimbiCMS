export const slugToMd = new Map()
export const mdToSlug = new Map()

// gather all markdown file paths via Vite glob at build time; this allows slug
// resolution to work even for files not linked from the navigation.
// paths are relative to the content base (e.g. 'blog/foo.md').
const _allMd = import.meta.glob('/example/content/**/*.md', { as: 'raw', eager: true })
export const allMarkdownPaths = Object.keys(_allMd).map(p => p.replace(/^\/example\/content\//, ''))

export function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\- ]/g, '')
    .replace(/ /g, '-')
}

// simple in-memory cache of fetchMarkdown responses keyed by the resolved URL
export const fetchCache = new Map()

export function clearFetchCache() {
  fetchCache.clear()
}

export async function fetchMarkdown(path, base) {
  if (!path) throw new Error('path required')
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
        } catch (ee) { }
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
