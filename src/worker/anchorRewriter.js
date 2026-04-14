import {
  slugify,
  mdToSlug,
  slugToMd,
  storeSlugMapping,
  fetchMarkdown,
  allMarkdownPaths,
  allMarkdownPathsSet,
  HOME_SLUG,
} from '../slugManager.js'
import {
  buildPageUrl,
  isExternalLink,
  normalizePath,
  ensureTrailingSlash,
  trimTrailingSlash,
} from '../utils/helpers.js'
import { buildCosmeticUrl } from '../utils/urlHelper.js'
import { debugWarn, isDebugLevel } from '../utils/debug.js'
import { getSharedParser } from '../utils/sharedDomParser.js'
import { PowerSemaphore } from 'performance-helpers/powerSemaphore'

async function runWithConcurrency(items, worker, concurrency = 4) {
  if (!Array.isArray(items) || items.length === 0) return []
  const sem = new PowerSemaphore(Math.max(1, Number(concurrency) || 1))
  return Promise.all(items.map((item, idx) => sem.run(() => worker(item, idx))))
}

function fullCosmetic(page, anchor = null) {
  try {
    const base = (typeof location !== 'undefined' && location && typeof location.pathname === 'string') ? (location.pathname || '/') : '/'
    return String(base) + buildCosmeticUrl(page, anchor)
  } catch (e) {
    return buildCosmeticUrl(page, anchor)
  }
}

function _hbShouldProbe() {
  try { if (isDebugLevel(3)) return true } catch (e) {}
  try { if (slugToMd && slugToMd.size) return true } catch (e) {}
  try { if (allMarkdownPathsSet && allMarkdownPathsSet.size) return true } catch (e) {}
  return false
}

function stripContentBasePrefix(rel, contentBasePath) {
  try {
    if (!rel) return rel
    if (!contentBasePath) return String(rel ?? '')
    const baseTrim = String(contentBasePath ?? '').replace(/^\/+|\/+$/g, '')
    if (!baseTrim) return String(rel ?? '')
    let out = String(rel ?? '')
    out = out.replace(/^\/+/, '')
    const prefix = baseTrim + '/'
    while (out.startsWith(prefix)) out = out.slice(prefix.length)
    if (out === baseTrim) return ''
    return out
  } catch (e) { return String(rel ?? '') }
}

let _lastContentBase = ''
let _lastContentBaseUrl = null
let _lastContentBasePath = ''

export async function rewriteAnchors(article, contentBase, pagePath, opts = {}) {
  try {
    opts = opts || {}
    if (typeof opts.canonical === 'undefined') opts.canonical = true
    const anchors = article.querySelectorAll('a')
    if (!anchors || !anchors.length) return

    let contentBaseUrl, contentBasePath
    if (contentBase === _lastContentBase && _lastContentBaseUrl) {
      contentBaseUrl = _lastContentBaseUrl
      contentBasePath = _lastContentBasePath
    } else {
      try {
        contentBaseUrl = new URL(contentBase, location.href)
        contentBasePath = ensureTrailingSlash(contentBaseUrl.pathname)
      } catch (err) {
        try { contentBaseUrl = new URL(contentBase, location.href); contentBasePath = ensureTrailingSlash(contentBaseUrl.pathname) } catch (e) { contentBaseUrl = null; contentBasePath = '/' }
      }
      _lastContentBase = contentBase
      _lastContentBaseUrl = contentBaseUrl
      _lastContentBasePath = contentBasePath
    }

    const pending = new Set()
    const anchorInfo = []
    const htmlPending = new Set()
    const htmlAnchorInfo = []

    for (const a of Array.from(anchors)) {
      try {
        try { if (a.closest && a.closest('h1,h2,h3,h4,h5,h6')) continue } catch (e) {}
        const href = a.getAttribute('href') || ''
        if (!href) continue
        if (isExternalLink(href)) continue
        try {
          if (href.startsWith('?') || href.indexOf('?') !== -1) {
            try {
              const tmpUrl = new URL(href, contentBase || location.href)
              const pageParam = tmpUrl.searchParams.get('page')
              if (pageParam && pageParam.indexOf('/') === -1 && pagePath) {
                const dir = pagePath.includes('/') ? pagePath.substring(0, pagePath.lastIndexOf('/') + 1) : ''
                if (dir) {
                  const newRel = normalizePath(dir + pageParam)
                  const urlVal = opts && opts.canonical ? buildPageUrl(newRel, tmpUrl.hash ? tmpUrl.hash.replace(/^#/, '') : null) : fullCosmetic(newRel, tmpUrl.hash ? tmpUrl.hash.replace(/^#/, '') : null)
                  a.setAttribute('href', urlVal)
                  continue
                }
              }
            } catch (err) {}
          }
        } catch (err) {}
        if (href.startsWith('/') && !href.endsWith('.md')) continue
        const mdMatch = href.match(/^([^#?]+\.md)(?:[#](.+))?$/)
        if (mdMatch) {
          let mdPathRaw = mdMatch[1]
          const frag = mdMatch[2]
          if (!mdPathRaw.startsWith('/') && pagePath) {
            const dir = pagePath.includes('/') ? pagePath.substring(0, pagePath.lastIndexOf('/') + 1) : ''
            mdPathRaw = dir + mdPathRaw
          }
          try {
            const resolved = new URL(mdPathRaw, contentBase).pathname
            let rel = resolved.startsWith(contentBasePath) ? resolved.slice(contentBasePath.length) : resolved
            rel = stripContentBasePrefix(rel, contentBasePath)
            rel = normalizePath(rel)
            anchorInfo.push({ node: a, frag, rel })
            if (!mdToSlug.has(rel)) pending.add(rel)
          } catch (err) { debugWarn('[anchorRewriter] resolve mdPath failed', err) }
          continue
        }
        try {
          let toResolve = href
          if (!href.startsWith('/') && pagePath) {
            if (href.startsWith('#')) toResolve = pagePath + href
            else {
              const dir = pagePath.includes('/') ? pagePath.substring(0, pagePath.lastIndexOf('/') + 1) : ''
              toResolve = dir + href
            }
          }
          const full = new URL(toResolve, contentBase)
          const p = full.pathname || ''
          if (p && p.indexOf(contentBasePath) !== -1) {
            let rel = p.startsWith(contentBasePath) ? p.slice(contentBasePath.length) : p
            rel = stripContentBasePrefix(rel, contentBasePath)
            rel = normalizePath(rel)
            rel = trimTrailingSlash(rel)
            if (!rel) rel = HOME_SLUG
            if (!rel.endsWith('.md')) {
              let slugKey = null
              try {
                if (mdToSlug && mdToSlug.has && mdToSlug.has(rel)) slugKey = mdToSlug.get(rel)
                else {
                  try {
                    const baseName = String(rel ?? '').replace(/^.*\//, '')
                    if (baseName && mdToSlug.has && mdToSlug.has(baseName)) slugKey = mdToSlug.get(baseName)
                  } catch (e) { debugWarn('[anchorRewriter] mdToSlug baseName check failed', e) }
                }
              } catch (err) { debugWarn('[anchorRewriter] mdToSlug access check failed', err) }
              if (!slugKey) {
                try {
                  const baseName = String(rel ?? '').replace(/^.*\//, '')
                  for (const [k, v] of slugToMd || []) {
                    if (v === rel || v === baseName) { slugKey = k; break }
                  }
                } catch (err) {}
              }
              if (slugKey) {
                const urlVal = opts && opts.canonical ? buildPageUrl(slugKey, null) : fullCosmetic(slugKey)
                a.setAttribute('href', urlVal)
              } else {
                let htmlRel = rel
                try {
                  if (!/\.[^\/]+$/.test(String(rel ?? ''))) htmlRel = String(rel ?? '') + '.html'
                } catch (err) { htmlRel = rel }
                htmlPending.add(htmlRel)
                htmlAnchorInfo.push({ node: a, rel: htmlRel })
              }
            }
          }
        } catch (err) { debugWarn('[anchorRewriter] resolving href to URL failed', err) }
      } catch (err) { debugWarn('[anchorRewriter] processing anchor failed', err) }
    }

    if (pending.size) {
      if (!_hbShouldProbe(contentBase)) {
        for (const rel of Array.from(pending)) {
          try {
            const m = String(rel).match(/([^\/]+)\.md$/)
            const basename = m && m[1]
            if (basename) {
              const candidate = slugify(basename)
              if (candidate) {
                try { storeSlugMapping(candidate, rel) } catch (err) { debugWarn('[anchorRewriter] fallback slug mapping failed', err) }
              }
            }
          } catch (err) {}
        }
      } else {
        await runWithConcurrency(Array.from(pending), async (rel) => {
          try {
            const mdData = await fetchMarkdown(rel, contentBase)
            if (mdData && mdData.raw) {
              const m2 = (mdData.raw || '').match(/^#\s+(.+)$/m)
              if (m2 && m2[1]) {
                const candidate = slugify(m2[1].trim())
                if (candidate) {
                  try { storeSlugMapping(candidate, rel) } catch (err) { debugWarn('[anchorRewriter] set slug mapping failed', err) }
                }
              }
            }
          } catch (err) { debugWarn('[anchorRewriter] fetchMarkdown for md pending failed', err) }
        }, 6)
      }
    }

    if (htmlPending.size) {
      if (!_hbShouldProbe(contentBase)) {
        for (const rel of Array.from(htmlPending)) {
          try {
            const m = String(rel).match(/([^\/]+)\.html$/)
            const basename = m && m[1]
            if (basename) {
              const candidate = slugify(basename)
              if (candidate) {
                try { storeSlugMapping(candidate, rel) } catch (err) { debugWarn('[anchorRewriter] fallback html slug mapping failed', err) }
              }
            }
          } catch (err) {}
        }
      } else {
        await runWithConcurrency(Array.from(htmlPending), async (rel) => {
          try {
            const res = await fetchMarkdown(rel, contentBase)
            if (res && res.raw) {
              try {
                const parser = getSharedParser()
                const doc = parser ? parser.parseFromString(res.raw, 'text/html') : null
                const titleTag = doc ? doc.querySelector('title') : null
                const h1 = doc ? doc.querySelector('h1') : null
                const titleText = (titleTag && titleTag.textContent && titleTag.textContent.trim())
                  ? titleTag.textContent.trim()
                  : (h1 && h1.textContent ? h1.textContent.trim() : null)
                if (titleText) {
                  const slugKey = slugify(titleText)
                  if (slugKey) {
                    try { storeSlugMapping(slugKey, rel) } catch (err) { debugWarn('[anchorRewriter] set html slug mapping failed', err) }
                  }
                }
              } catch (err) { debugWarn('[anchorRewriter] parse fetched HTML failed', err) }
            }
          } catch (err) { debugWarn('[anchorRewriter] fetchMarkdown for html pending failed', err) }
        }, 5)
      }
    }

    for (const info of anchorInfo) {
      const { node: a, frag, rel } = info
      let slug = null
      try { if (mdToSlug.has(rel)) slug = mdToSlug.get(rel) } catch (err) { debugWarn('[anchorRewriter] mdToSlug access failed', err) }
      if (slug) {
        const urlVal = opts && opts.canonical ? buildPageUrl(slug, frag) : fullCosmetic(slug, frag)
        a.setAttribute('href', urlVal)
      } else {
        const urlVal = opts && opts.canonical ? buildPageUrl(rel, frag) : fullCosmetic(rel, frag)
        a.setAttribute('href', urlVal)
      }
    }

    for (const info of htmlAnchorInfo) {
      const { node: a, rel } = info
      let slug = null
      try { if (mdToSlug.has(rel)) slug = mdToSlug.get(rel) } catch (err) { debugWarn('[anchorRewriter] mdToSlug access failed for html anchor', err) }
      if (!slug) {
        try {
          const baseName = String(rel ?? '').replace(/^.*\//, '')
          if (mdToSlug.has(baseName)) slug = mdToSlug.get(baseName)
        } catch (err) { debugWarn('[anchorRewriter] mdToSlug baseName access failed for html anchor', err) }
      }
      if (slug) {
        const urlVal = opts && opts.canonical ? buildPageUrl(slug, null) : fullCosmetic(slug)
        a.setAttribute('href', urlVal)
      } else {
        const urlVal = opts && opts.canonical ? buildPageUrl(rel, null) : fullCosmetic(rel)
        a.setAttribute('href', urlVal)
      }
    }
  } catch (err) { debugWarn('[anchorRewriter] rewriteAnchors failed', err) }
}
