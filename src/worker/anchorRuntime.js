import { getSharedParser } from '../utils/sharedDomParser.js'

function normalizePath(path) {
  return String(path ?? '').replace(/^[./]+/, '')
}

function trimTrailingSlash(value) {
  return String(value ?? '').replace(/\/+$/, '')
}

function ensureTrailingSlash(value) {
  return trimTrailingSlash(value) + '/'
}

function isExternalHref(href) {
  const value = String(href ?? '')
  return /^(https?:)?\/\//.test(value) || value.startsWith('mailto:') || value.startsWith('tel:')
}

function buildPageUrl(page, hash = null) {
  const encodedPage = encodeURIComponent(String(page ?? ''))
  return hash ? `?page=${encodedPage}#${encodeURIComponent(String(hash))}` : `?page=${encodedPage}`
}

function slugifyTitle(value) {
  return String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-\s]+/g, '')
    .replace(/\s+/g, '-')
}

function stripContentBasePrefix(rel, contentBasePath) {
  try {
    if (!rel) return rel
    const baseTrim = String(contentBasePath ?? '').replace(/^\/+|\/+$/g, '')
    if (!baseTrim) return String(rel ?? '')
    let out = String(rel ?? '').replace(/^\/+/, '')
    const prefix = baseTrim + '/'
    while (out.startsWith(prefix)) out = out.slice(prefix.length)
    return out === baseTrim ? '' : out
  } catch (_) {
    return String(rel ?? '')
  }
}

function createParser() {
  if (typeof DOMParser === 'undefined') return null
  const parser = getSharedParser()
  try {
    if (parser && parser.constructor === DOMParser) return parser
  } catch (_) {}
  return new DOMParser()
}

function getBaseName(path) {
  return String(path ?? '').replace(/^.*\//, '')
}

function getSnapshotMap(snapshot) {
  return new Map(Object.entries(snapshot?.pathToSlug || {}))
}

function rememberMapping(pathToSlug, learnedMappings, path, slug) {
  const key = String(path ?? '')
  const value = String(slug ?? '')
  if (!key || !value || pathToSlug.has(key)) return
  pathToSlug.set(key, value)
  learnedMappings.push({ path: key, slug: value })
}

async function fetchText(path, contentBase) {
  const url = new URL(String(path ?? ''), String(contentBase || (typeof location !== 'undefined' ? location.href : 'http://localhost/')))
  const res = await fetch(url.toString())
  if (!res || !res.ok) return null
  return await res.text()
}

function extractSlugFromText(raw, isHtml) {
  if (!raw) return null
  if (!isHtml) {
    const headingMatch = String(raw).match(/^#\s+(.+)$/m)
    return headingMatch?.[1] ? slugifyTitle(headingMatch[1].trim()) : null
  }
  try {
    const parser = createParser()
    if (!parser) return null
    const doc = parser.parseFromString(String(raw), 'text/html')
    const title = doc.querySelector('title')?.textContent?.trim()
    const h1 = doc.querySelector('h1')?.textContent?.trim()
    return slugifyTitle(title || h1 || '') || null
  } catch (_) {
    return null
  }
}

async function runWithConcurrency(items, limit, worker) {
  const values = Array.from(items || [])
  if (!values.length) return
  const size = Math.max(1, Number(limit) || 1)
  let index = 0
  const runners = Array.from({ length: Math.min(size, values.length) }, async () => {
    while (index < values.length) {
      const current = values[index]
      index += 1
      await worker(current)
    }
  })
  await Promise.all(runners)
}

export async function rewriteAnchorsHtml(html, contentBase, pagePath, snapshot = {}) {
  const parser = createParser()
  if (!parser) return { html: String(html ?? ''), mappings: [] }

  const doc = parser.parseFromString(String(html ?? ''), 'text/html')
  const article = doc.body
  const anchors = article.querySelectorAll('a')
  if (!anchors || !anchors.length) return { html: doc.body.innerHTML, mappings: [] }

  let contentBasePath = '/'
  try {
    const contentBaseUrl = new URL(String(contentBase ?? ''), typeof location !== 'undefined' ? location.href : 'http://localhost/')
    contentBasePath = ensureTrailingSlash(contentBaseUrl.pathname)
  } catch (_) {}

  const pathToSlug = getSnapshotMap(snapshot)
  const learnedMappings = []
  const pendingMd = new Set()
  const pendingHtml = new Set()
  const anchorInfo = []
  const htmlAnchorInfo = []
  const homeSlug = String(snapshot?.homeSlug || '_home')

  for (const anchor of Array.from(anchors)) {
    try {
      try { if (anchor.closest && anchor.closest('h1,h2,h3,h4,h5,h6')) continue } catch (_) {}
      const href = anchor.getAttribute('href') || ''
      if (!href || isExternalHref(href)) continue

      try {
        if ((href.startsWith('?') || href.includes('?')) && pagePath) {
          const tmpUrl = new URL(href, String(contentBase || (typeof location !== 'undefined' ? location.href : 'http://localhost/')))
          const pageParam = tmpUrl.searchParams.get('page')
          if (pageParam && !pageParam.includes('/')) {
            const dir = pagePath.includes('/') ? pagePath.slice(0, pagePath.lastIndexOf('/') + 1) : ''
            if (dir) {
              const nextPage = normalizePath(dir + pageParam)
              anchor.setAttribute('href', buildPageUrl(nextPage, tmpUrl.hash ? tmpUrl.hash.replace(/^#/, '') : null))
              continue
            }
          }
        }
      } catch (_) {}

      if (href.startsWith('/') && !href.endsWith('.md')) continue

      const mdMatch = href.match(/^([^#?]+\.md)(?:#(.+))?$/)
      if (mdMatch) {
        let mdPathRaw = mdMatch[1]
        const frag = mdMatch[2]
        if (!mdPathRaw.startsWith('/') && pagePath) {
          const dir = pagePath.includes('/') ? pagePath.slice(0, pagePath.lastIndexOf('/') + 1) : ''
          mdPathRaw = dir + mdPathRaw
        }
        const resolved = new URL(mdPathRaw, String(contentBase || (typeof location !== 'undefined' ? location.href : 'http://localhost/'))).pathname
        let rel = resolved.startsWith(contentBasePath) ? resolved.slice(contentBasePath.length) : resolved
        rel = normalizePath(stripContentBasePrefix(rel, contentBasePath))
        anchorInfo.push({ node: anchor, rel, frag })
        if (!pathToSlug.has(rel)) pendingMd.add(rel)
        continue
      }

      let toResolve = href
      if (!href.startsWith('/') && pagePath) {
        if (href.startsWith('#')) toResolve = pagePath + href
        else {
          const dir = pagePath.includes('/') ? pagePath.slice(0, pagePath.lastIndexOf('/') + 1) : ''
          toResolve = dir + href
        }
      }

      const full = new URL(toResolve, String(contentBase || (typeof location !== 'undefined' ? location.href : 'http://localhost/')))
      const pathname = full.pathname || ''
      if (!pathname || !pathname.includes(contentBasePath)) continue

      let rel = pathname.startsWith(contentBasePath) ? pathname.slice(contentBasePath.length) : pathname
      rel = normalizePath(stripContentBasePrefix(rel, contentBasePath))
      rel = trimTrailingSlash(rel)
      if (!rel) rel = homeSlug

      if (!rel.endsWith('.md')) {
        const baseName = getBaseName(rel)
        const slug = pathToSlug.get(rel) || pathToSlug.get(baseName)
        if (slug) {
          anchor.setAttribute('href', buildPageUrl(slug))
        } else {
          const htmlRel = /\.[^/]+$/.test(rel) ? rel : `${rel}.html`
          pendingHtml.add(htmlRel)
          htmlAnchorInfo.push({ node: anchor, rel: htmlRel, fallbackRel: rel })
        }
      }
    } catch (_) {}
  }

  if (snapshot?.allowProbe) {
    await runWithConcurrency(pendingMd, 6, async (rel) => {
      try {
        const slug = extractSlugFromText(await fetchText(rel, contentBase), false)
        if (!slug) return
        rememberMapping(pathToSlug, learnedMappings, rel, slug)
        rememberMapping(pathToSlug, learnedMappings, getBaseName(rel), slug)
      } catch (_) {}
    })

    await runWithConcurrency(pendingHtml, 5, async (rel) => {
      try {
        const slug = extractSlugFromText(await fetchText(rel, contentBase), true)
        if (!slug) return
        rememberMapping(pathToSlug, learnedMappings, rel, slug)
        rememberMapping(pathToSlug, learnedMappings, getBaseName(rel), slug)
      } catch (_) {}
    })
  } else {
    for (const rel of pendingMd) {
      const baseName = getBaseName(rel).replace(/\.md$/i, '')
      const slug = slugifyTitle(baseName)
      if (!slug) continue
      rememberMapping(pathToSlug, learnedMappings, rel, slug)
      rememberMapping(pathToSlug, learnedMappings, getBaseName(rel), slug)
    }
    for (const rel of pendingHtml) {
      const baseName = getBaseName(rel).replace(/\.html$/i, '')
      const slug = slugifyTitle(baseName)
      if (!slug) continue
      rememberMapping(pathToSlug, learnedMappings, rel, slug)
      rememberMapping(pathToSlug, learnedMappings, getBaseName(rel), slug)
    }
  }

  for (const info of anchorInfo) {
    const slug = pathToSlug.get(info.rel)
    info.node.setAttribute('href', buildPageUrl(slug || info.rel, info.frag || null))
  }

  for (const info of htmlAnchorInfo) {
    const slug = pathToSlug.get(info.rel) || pathToSlug.get(getBaseName(info.rel)) || pathToSlug.get(info.fallbackRel)
    info.node.setAttribute('href', buildPageUrl(slug || info.rel))
  }

  return { html: doc.body.innerHTML, mappings: learnedMappings }
}