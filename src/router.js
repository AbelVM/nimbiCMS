import { slugToMd, mdToSlug, slugify, fetchMarkdown } from './filesManager.js'
import { detectFenceLanguages, parseMarkdownToHtml } from './markdown.js'

// in-memory cache to avoid repeating expensive slug resolution logic;
// maps the original `raw` page string (from the URL) to an object with the
// normalized `resolved` path and any extracted `anchor`.  This speeds up
// repeated navigations to the same slug (common when the user clicks around).
const resolutionCache = new Map()

// helpers scoped to this module ------------------------------------------------

async function tryFindInNav(decoded) {
  try {
    const nodes = document.querySelectorAll('.nimbi-site-navbar a, .navbar a, .nimbi-nav a')
    for (const n of Array.from(nodes || [])) {
      try {
        const txt = (n.textContent || '').trim()
        if (!txt) continue
        if (slugify(txt) === decoded) {
          const href = n.getAttribute('href') || ''
          try {
            const u = new URL(href, location.href)
            const p = u.searchParams.get('page')
            if (p) {
              return decodeURIComponent(p)
            }
          } catch (e) { /* ignore malformed href */ }
        }
      } catch (e) { }
    }
  } catch (e) { }
  return null
}

async function tryDiscoverFromIndex(decoded, contentBase) {
  // attempt to locate a markdown file whose H1 slugifies to `decoded`
  const indexSet = new Set()
  // gather candidates from navbar links
  try {
    const anchorsForIndex = document.querySelectorAll('.nimbi-site-navbar a, .navbar a, .nimbi-nav a')
    for (const linkEl of Array.from(anchorsForIndex || [])) {
      try {
        const href = linkEl.getAttribute('href') || ''
        if (!href) continue
        try {
          const u = new URL(href, location.href)
          if (u.origin !== location.origin) continue
          const mdMatch = (u.hash || u.pathname).match(/([^#?]+\.md)(?:$|[?#])/) || (u.pathname || '').match(/([^#?]+\.md)(?:$|[?#])/)
          if (mdMatch) {
            let candidate = mdMatch[1].replace(/^\.\//, '')
            if (candidate.startsWith('/')) candidate = candidate.replace(/^\//, '')
            if (candidate) indexSet.add(candidate)
            continue
          }
          const p = u.pathname || ''
          if (p) {
            const contentBaseUrl = new URL(contentBase)
            const contentBasePath = contentBaseUrl.pathname.endsWith('/') ? contentBaseUrl.pathname : contentBaseUrl.pathname + '/'
            if (p.indexOf(contentBasePath) !== -1) {
              let rel = p.startsWith(contentBasePath) ? p.slice(contentBasePath.length) : p.replace(/^\//, '')
              rel = rel.replace(/^[\.\/]+/, '')
              if (rel && !rel.includes('.')) {
                indexSet.add(rel + '/index.md')
                indexSet.add(rel + '.md')
              }
            }
          }
        } catch (e) { }
      } catch (e) { }
    }
  } catch (e) { }

  try { for (const v of Array.from(slugToMd.values())) { if (v) indexSet.add(v) } } catch (e) { }
  try { for (const v of Array.from(mdToSlug.keys())) { if (v) indexSet.add(v) } } catch (e) { }

  if (indexSet.size && indexSet.size > 6) {
    return null
  }

  for (const candidate of Array.from(indexSet)) {
    try {
      if (!candidate || !String(candidate).includes('.md')) continue
      const idxMd = await fetchMarkdown(candidate, contentBase)
      if (!idxMd || !idxMd.raw) continue
      const m = (idxMd.raw || '').match(/^#\s+(.+)$/m)
      if (m) {
        const h1 = (m[1] || '').trim()
        if (h1 && slugify(h1) === decoded) {
          return candidate
        }
      }
    } catch (e) { }
  }
  return null
}

function buildPageCandidates(resolved) {
  const pageCandidates = []
  if (String(resolved).includes('.md') || String(resolved).includes('.html')) {
    pageCandidates.push(resolved)
  } else {
    try {
      const dec = decodeURIComponent(String(resolved || ''))
      if (slugToMd.has(dec)) {
        pageCandidates.push(slugToMd.get(dec))
      } else {
        const underscore = '_' + dec + '.md'
        const indexPath = dec + '/index.md'
        try { if (mdToSlug.has(underscore)) pageCandidates.push(underscore) } catch (e) { }
        try { if (mdToSlug.has(indexPath)) pageCandidates.push(indexPath) } catch (e) { }
        if (pageCandidates.length === 0) {
          // final fallback: even if we have no prior mapping, treat the raw
          // slug as a direct markdown filename. this fixes cases such as
          // `?page=tech-experiments` when `tech-experiments.md` exists but was
          // never registered via the navbar or slug map.
          pageCandidates.push(dec + '.md')
        }
      }
    } catch (e) { }
  }
  return pageCandidates
}

// public API ---------------------------------------------------------------

/**
 * Resolve a raw `page` query value, fetch the corresponding markdown/html,
 * and return the normalized content data.
 *
 * This encapsulates slug lookup, nav/index discovery, candidate building and
 * caching of previous results.  It does **not** perform any DOM mutations; the
 * caller (usually `nimbi-cms.js`) handles rendering the returned `data`.
 *
 * @param {string} raw  - raw page string (e.g. from URLSearchParams)
 * @param {string} contentBase - base URL to pass to fetchMarkdown
 * @returns {Promise<{data:object,pagePath:string,anchor:string|null}>}
 */
export async function fetchPageData(raw, contentBase) {
  const hashAnchor = location.hash ? decodeURIComponent(location.hash.replace(/^#/, '')) : null
  let resolved = raw || ''
  let anchor = null

  // legacy anchor syntax
  if (resolved && String(resolved).includes('::')) {
    const parts = String(resolved).split('::', 2)
    resolved = parts[0]
    anchor = parts[1] || null
  }

  if (resolutionCache.has(raw)) {
    const cached = resolutionCache.get(raw)
    resolved = cached.resolved
    anchor = cached.anchor || anchor
  } else {
    if (!String(resolved).includes('.md') && !String(resolved).includes('.html')) {
      const decoded = decodeURIComponent(String(resolved || ''))
      if (slugToMd.has(decoded)) {
        resolved = slugToMd.get(decoded)
      } else {
        const navMatch = await tryFindInNav(decoded)
        if (navMatch) resolved = navMatch
        else {
          const idx = await tryDiscoverFromIndex(decoded, contentBase)
          if (idx) resolved = idx
        }
      }
    }
    resolutionCache.set(raw, { resolved, anchor })
  }

  if (!anchor && hashAnchor) anchor = hashAnchor

  const pageCandidates = buildPageCandidates(resolved)

  let data = null
  let pagePath = null
  let lastErr = null
  for (const candidate of pageCandidates) {
    if (!candidate) continue
    try {
      const norm = String(candidate).replace(/^[\.\/]+/, '')
      data = await fetchMarkdown(norm, contentBase)
      pagePath = norm
      break
    } catch (e) {
      lastErr = e
    }
  }

  if (!data) {
    // throw here so caller can decide how to display not-found message
    throw lastErr || new Error('no page data')
  }

  return { data, pagePath, anchor }
}

