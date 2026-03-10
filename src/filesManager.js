export const slugToMd = new Map()
export const mdToSlug = new Map()

export function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\- ]/g, '')
    .replace(/ /g, '-')
}

export async function fetchMarkdown(path, base) {
  if (!path) throw new Error('path required')
  const baseClean = base.endsWith('/') ? base.slice(0, -1) : base
  const url = `${baseClean}/${path}`
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
  if (trimmed.startsWith('<!doctype') || trimmed.startsWith('<html')) {
    console.error('fetchMarkdown expected markdown but received HTML:', { url, snippet: raw.trim().slice(0, 200) })
    throw new Error('expected markdown but received HTML — check contentPath and that the file exists')
  }
  return { raw }
}
