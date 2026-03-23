/**
 * Runtime sitemap and feed generator.
 *
 * Generate sitemap JSON and RSS/Atom feeds from the runtime search index.
 *
 * @module runtimeSitemap
 */
import { allMarkdownPaths, allMarkdownPathsSet, slugToMd, mdToSlug, searchIndex, buildSearchIndex, fetchMarkdown, slugify, whenSearchIndexReady } from './slugManager.js'
import { normalizePath } from './utils/helpers.js'
import { debugLog, debugWarn } from './utils/debug.js'

// Backwards-compatible underscore-prefixed aliases used in older code paths
const _debugLog = debugLog
const _debugWarn = debugWarn

/**
 * Sitemap entry object.
 * @typedef {{
 *   loc: string,
 *   slug: string,
 *   title?: string,
 *   excerpt?: string,
 *   sourcePath?: string,
 *   lastmod?: string,
 *   _titleSource?: string,
 *   baseSlug?: string
 * }} SitemapEntry
 */

/**
 * Sitemap JSON structure returned by generators.
 * @typedef {{generatedAt:string, entries:Array<SitemapEntry>}} SitemapJson
 */

function _getBase() {
  try {
    if (typeof location !== 'undefined' && location && typeof location.pathname === 'string') {
      return String(location.origin + location.pathname.split('?')[0])
    }
  } catch {}
  return 'http://localhost/'
}

function _escapeXml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

function _humanizeSlug(slug) {
  try {
    if (!slug || typeof slug !== 'string') return ''
    // prefer the last path segment
    const last = slug.split('/').filter(Boolean).pop() || slug
    const withoutExt = last.replace(/\.[a-z0-9]+$/i, '')
    const parts = withoutExt.replace(/[-_]+/g, ' ').split(' ')
    return parts.map(p => p ? (p.charAt(0).toUpperCase() + p.slice(1)) : '').join(' ').trim()
  } catch { return String(slug) }
}

/**
 * Convert an index entry (or slug) to a canonical sitemap entry object.
 * Always produce `loc` using slug form: `base + '?page=' + encodeURIComponent(slug)`.
 * @param {string} baseNoQs - Base URL without a querystring (used as prefix for `loc`).
 * @param {Object} it - Index item object (should contain `slug`, optional `title`, `excerpt`, `path`).
 * @returns {SitemapEntry|null} sitemap entry or null when conversion fails.
 */
function makeEntryFromIndexItem(baseNoQs, it) {
  try {
    const slug = it && it.slug ? String(it.slug) : null
    if (!slug) return null
    const loc = baseNoQs + '?page=' + encodeURIComponent(slug)
    const ent = { loc, slug }
    if (it.title) ent.title = String(it.title)
    if (it.excerpt) ent.excerpt = String(it.excerpt)
    if (it.path) ent.sourcePath = normalizePath(String(it.path))
    return ent
  } catch { return null }
}

/**
 * Generate sitemap JSON from the runtime search index (or a provided snapshot).
 * @param {Object} [opts]
 * @param {boolean} [opts.includeAllMarkdown]
 * @param {Array} [opts.index] - optional snapshot array of index entries
 * @param {string} [opts.homePage]
 * @param {string} [opts.navigationPage]
 * @param {string} [opts.notFoundPage]
 * @returns {SitemapJson} sitemap JSON object
 */
export async function generateSitemapJson(opts = {}) {
  const {
    includeAllMarkdown = true,
    index: providedIndex,
    homePage,
    navigationPage,
    notFoundPage
  } = opts || {}

  const base = _getBase().split('?')[0]
  const baseNoQs = base

  // Prefer the live module `searchIndex` object used by the search UI.
  // Fall back to any provided snapshot `providedIndex` if the module index
  // is not yet populated. If both are present, merge but prefer module
  // entries when slugs collide.
  let idx = (Array.isArray(searchIndex) && searchIndex.length) ? searchIndex : (Array.isArray(providedIndex) ? providedIndex : [])
  if (Array.isArray(providedIndex) && providedIndex.length && Array.isArray(searchIndex) && searchIndex.length) {
    const bySlug = new Map()
    try {
      for (const it of providedIndex) { try { if (it && it.slug) bySlug.set(String(it.slug), it) } catch {} }
      for (const it of searchIndex) { try { if (it && it.slug) bySlug.set(String(it.slug), it) } catch {} }
    } catch {}
    idx = Array.from(bySlug.values())
  }

  const excludedPaths = new Set()
  try { if (typeof notFoundPage === 'string' && notFoundPage.trim()) excludedPaths.add(normalizePath(String(notFoundPage))) } catch {}
  try { if (typeof navigationPage === 'string' && navigationPage.trim()) excludedPaths.add(normalizePath(String(navigationPage))) } catch {}

  // Also compute excluded slugs for notFoundPage so we never include a
  // page derived from the site's 404 content (title 'Not Found' etc.). We
  // attempt to resolve a slug for the configured notFoundPage via the
  // `mdToSlug` mapping or by fetching the notFoundPage and slugifying its
  // H1. This prevents accidental inclusion when servers return fallback
  // HTML for missing pages.
  const excludedSlugs = new Set()
  try {
    if (typeof notFoundPage === 'string' && notFoundPage.trim()) {
      const nfPath = normalizePath(String(notFoundPage))
      try {
            if (mdToSlug && typeof mdToSlug.has === 'function' && mdToSlug.has(nfPath)) {
              try { excludedSlugs.add(mdToSlug.get(nfPath)) } catch {}
            } else {
              try {
                const nfRes = await fetchMarkdown(nfPath, opts && opts.contentBase ? opts.contentBase : undefined)
                if (nfRes && nfRes.raw) {
                  try {
                    let h = null
                    if (nfRes.isHtml) {
                      try {
                        const parser = new DOMParser()
                        const doc = parser.parseFromString(nfRes.raw, 'text/html')
                        const h1 = doc.querySelector('h1') || doc.querySelector('title')
                        if (h1 && h1.textContent) h = h1.textContent.trim()
                      } catch {}
                    } else {
                      const m = (nfRes.raw || '').match(/^#\s+(.+)$/m)
                      if (m && m[1]) h = m[1].trim()
                    }
                    if (h) excludedSlugs.add(slugify(h))
                  } catch {}
                }
              } catch {
                /* ignore fetch failures for notFoundPage */
              }
            }
          } catch {}
    }
  } catch {}

  const seenSlugs = new Set()
  const entries = []

  // Build a title/excerpt map from the index so we can enrich slugs
  const titleMap = new Map()
  const pathMap = new Map()
  // Helper: determine whether a normalized markdown path is known to the
  // runtime (manifest, slug maps, or index-derived pathMap). This avoids
  // unnecessary fetches for files the server doesn't expose and reduces
  // noisy 404s when crawling links.
  const _isKnownPath = (p) => {
    try {
      if (!p || typeof p !== 'string') return false
      const np = normalizePath(String(p))
      try { if (allMarkdownPathsSet && typeof allMarkdownPathsSet.has === 'function' && allMarkdownPathsSet.has(np)) return true } catch {}
      try { if (mdToSlug && typeof mdToSlug.has === 'function' && mdToSlug.has(np)) return true } catch {}
      try { if (pathMap && pathMap.has(np)) return true } catch {}
      try {
        for (const v of slugToMd.values()) {
          try {
            if (!v) continue
            if (typeof v === 'string') {
              if (normalizePath(String(v)) === np) return true
            } else if (v && typeof v === 'object') {
              if (v.default && normalizePath(String(v.default)) === np) return true
              const langs = v.langs || {}
              for (const lk of Object.keys(langs || {})) {
                try { if (langs[lk] && normalizePath(String(langs[lk])) === np) return true } catch {}
              }
            }
          } catch {}
        }
      } catch {}
    } catch {}
    return false
  }
  if (Array.isArray(idx) && idx.length) {
    for (const it of idx) {
      try {
        if (!it || !it.slug) continue
        const slugKey = String(it.slug)
        const slugBaseKey = String(slugKey).split('::')[0]
        if (excludedSlugs.has(slugBaseKey)) continue
        const p = it.path ? normalizePath(String(it.path)) : null
        if (p && excludedPaths.has(p)) continue
        // Prefer the entry's own title (this is often the H1/H2 used in search results)
        const entryTitle = it.title ? String(it.title) : (it.parentTitle ? String(it.parentTitle) : undefined)
        titleMap.set(slugKey, { title: entryTitle || undefined, excerpt: it.excerpt ? String(it.excerpt) : undefined, path: p, source: 'index' })
        if (p) pathMap.set(p, { title: entryTitle || undefined, excerpt: it.excerpt ? String(it.excerpt) : undefined, slug: slugKey })
        const ent = makeEntryFromIndexItem(baseNoQs, it)
        if (!ent || !ent.slug) continue
        if (seenSlugs.has(ent.slug)) continue
        seenSlugs.add(ent.slug)
        if (titleMap.has(ent.slug)) {
          const t = titleMap.get(ent.slug)
          if (t && t.title) { ent.title = t.title; ent._titleSource = 'index' }
          if (t && t.excerpt) ent.excerpt = t.excerpt
        }
        entries.push(ent)
      } catch { continue }
    }
  }

  // Optionally add all slugs discoverable from slugToMd / allMarkdownPaths
  if (includeAllMarkdown) {
    try {
      for (const [slug, mdVal] of slugToMd.entries()) {
        try {
          if (!slug) continue
          const slugBase = String(slug).split('::')[0]
          if (seenSlugs.has(slug)) continue
          if (excludedSlugs.has(slugBase)) continue
          // determine path for exclusion checks
          let mappedPath = null
          if (typeof mdVal === 'string') mappedPath = normalizePath(String(mdVal))
          else if (mdVal && typeof mdVal === 'object') mappedPath = normalizePath(String(mdVal.default || ''))
          if (mappedPath && excludedPaths.has(mappedPath)) continue
          const loc = baseNoQs + '?page=' + encodeURIComponent(slug)
          const ent = { loc, slug }
          if (titleMap.has(slug)) {
            const t = titleMap.get(slug)
            if (t && t.title) { ent.title = t.title; ent._titleSource = 'index' }
            if (t && t.excerpt) ent.excerpt = t.excerpt
          } else if (mappedPath) {
            // try path->title fallback
            const pm = pathMap.get(mappedPath)
            if (pm && pm.title) {
              ent.title = pm.title
              ent._titleSource = 'path'
              if (!ent.excerpt && pm.excerpt) ent.excerpt = pm.excerpt
            }
          }
          seenSlugs.add(slug)
          if (typeof slug === 'string') {
            const looksLikePath = slug.indexOf('/') !== -1 || /\.(md|html?)$/i.test(slug)
            const titleLooksLikePath = ent.title && typeof ent.title === 'string' && (ent.title.indexOf('/') !== -1 || /\.(md|html?)$/i.test(ent.title))
            if (!ent.title || titleLooksLikePath || looksLikePath) {
              ent.title = _humanizeSlug(slug)
              ent._titleSource = 'humanize'
            }
          }
          entries.push(ent)
        } catch { /* per-slug ignore */ }
      }

      // Ensure homePage is present (use mdToSlug lookup)
      try {
        if (homePage && typeof homePage === 'string') {
          const hp = normalizePath(String(homePage))
          let hpSlug = null
          try { if (mdToSlug && mdToSlug.has(hp)) hpSlug = mdToSlug.get(hp) } catch {}
          if (!hpSlug) hpSlug = hp
          const hpBase = String(hpSlug).split('::')[0]
          if (!seenSlugs.has(hpSlug) && !excludedPaths.has(hp) && !excludedSlugs.has(hpBase)) {
            const ent = { loc: baseNoQs + '?page=' + encodeURIComponent(hpSlug), slug: hpSlug }
            if (titleMap.has(hpSlug)) {
              const t = titleMap.get(hpSlug)
              if (t && t.title) { ent.title = t.title; ent._titleSource = 'index' }
              if (t && t.excerpt) ent.excerpt = t.excerpt
            }
            seenSlugs.add(hpSlug)
            entries.push(ent)
          }
        }
      } catch {}
    } catch {}
  }

  // Expand sitemap by crawling linked pages found in indexed/source markdown
  try {
    const seenAdd = new Set()
    const existingSlugs = new Set(entries.map(e => String(e && e.slug ? e.slug : '')))
    const sourcePaths = new Set()
    for (const it of entries) {
      try { if (it && it.sourcePath) sourcePaths.add(String(it.sourcePath)) } catch {}
    }
    // Limit to a reasonable number to avoid blowing up runtime
    const MAX_SOURCE_FETCH = 30
    let fetched = 0
    for (const sp of sourcePaths) {
      if (fetched >= MAX_SOURCE_FETCH) break
      try {
        if (!sp || typeof sp !== 'string') continue
        // Avoid fetching unknown files: check manifest, slug maps, and
        // index-derived paths before issuing a network request.
        if (!_isKnownPath(sp)) continue
        fetched += 1
        const mdRes = await fetchMarkdown(sp, opts && opts.contentBase ? opts.contentBase : undefined)
        // Skip if empty or if server returned a 404 fallback page — we don't
        // want to parse the site's 404 HTML as real content.
        if (!mdRes || !mdRes.raw) continue
        if (mdRes && typeof mdRes.status === 'number' && mdRes.status === 404) continue
        const raw = mdRes.raw
        const clean = (function(r) {
          try { return String(r || '') } catch { return '' }
        })(raw)
        const hrefs = []
        const mdLinkRe = /\[[^\]]+\]\(([^)]+)\)/g
        let m
        while ((m = mdLinkRe.exec(clean))) { try { if (m && m[1]) hrefs.push(m[1]) } catch {} }
        const htmlLinkRe = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi
        while ((m = htmlLinkRe.exec(clean))) { try { if (m && m[1]) hrefs.push(m[1]) } catch {} }

        for (const href of hrefs) {
          try {
            if (!href) continue
            // page query param -> slug
            if (href.indexOf('?') !== -1 || href.indexOf('=') !== -1) {
              try {
                const u = new URL(href, baseNoQs)
                const p = u.searchParams.get('page')
                if (p) {
                  const slug = String(p)
                  if (!existingSlugs.has(slug) && !seenAdd.has(slug)) {
                    seenAdd.add(slug)
                    entries.push({ loc: baseNoQs + '?page=' + encodeURIComponent(slug), slug })
                  }
                  continue
                }
              } catch {}
            }
            // md/html path -> try normalize and map via mdToSlug
            let candidate = String(href).split(/[?#]/)[0]
            // strip leading ./ or /\
            candidate = candidate.replace(/^\.\//, '').replace(/^\//, '')
            if (!candidate) continue
            if (!/\.(md|html?)$/i.test(candidate)) continue
            try {
              const norm = normalizePath(candidate)
              if (mdToSlug && mdToSlug.has(norm)) {
                const s = mdToSlug.get(norm)
                const sBase = String(s).split('::')[0]
                if (s && !existingSlugs.has(s) && !seenAdd.has(s) && !excludedSlugs.has(sBase) && !excludedPaths.has(norm)) {
                  seenAdd.add(s)
                  entries.push({ loc: baseNoQs + '?page=' + encodeURIComponent(s), slug: s, sourcePath: norm })
                }
                continue
              }
              // Try fetching the target to derive a slug from its H1
              try {
                // Check whether the target path is known before attempting fetch.
                if (!_isKnownPath(norm)) continue
                const target = await fetchMarkdown(norm, opts && opts.contentBase ? opts.contentBase : undefined)
                // Skip fallback 404 responses
                if (target && typeof target.status === 'number' && target.status === 404) continue
                if (target && target.raw) {
                  const hh = (target.raw || '').match(/^#\s+(.+)$/m)
                  const title = hh && hh[1] ? hh[1].trim() : ''
                  const s2 = title ? slugify(title) : slugify(norm)
                  const s2Base = String(s2).split('::')[0]
                  if (s2 && !existingSlugs.has(s2) && !seenAdd.has(s2) && !excludedSlugs.has(s2Base)) {
                    seenAdd.add(s2)
                    entries.push({ loc: baseNoQs + '?page=' + encodeURIComponent(s2), slug: s2, sourcePath: norm, title: title || undefined })
                  }
                }
              } catch {}
            } catch (_) {}
          } catch (_) {}
        }
      } catch (_) { /* ignore per-source failures */ }
    }
  } catch (_) { /* ignore expansion errors */ }

  // Ensure each base slug (strip any '::' anchor) has a page-level entry.
  try {
    const entriesBySlug = new Map()
    for (const e of entries) {
      try {
        if (!e || !e.slug) continue
        entriesBySlug.set(String(e.slug), e)
      } catch (_) {}
    }

    // Collect bases that appear only as anchors and ensure a page-level entry exists
    const basesNeeded = new Set()
    for (const e of entries) {
      try {
        if (!e || !e.slug) continue
        const slugStr = String(e.slug)
        const base = slugStr.split('::')[0]
        if (!base) continue
        if (slugStr !== base && !entriesBySlug.has(base)) basesNeeded.add(base)
      } catch (_) {}
    }

    for (const base of basesNeeded) {
      try {
        let ent = null
        if (titleMap.has(base)) {
          const t = titleMap.get(base)
          ent = { loc: baseNoQs + '?page=' + encodeURIComponent(base), slug: base }
          if (t && t.title) { ent.title = t.title; ent._titleSource = 'index' }
          if (t && t.excerpt) ent.excerpt = t.excerpt
          if (t && t.path) ent.sourcePath = t.path
        } else if (pathMap && slugToMd && slugToMd.has(base)) {
          const mdVal = slugToMd.get(base)
          let mappedPath = null
          if (typeof mdVal === 'string') mappedPath = normalizePath(String(mdVal))
          else if (mdVal && typeof mdVal === 'object') mappedPath = normalizePath(String(mdVal.default || ''))
          ent = { loc: baseNoQs + '?page=' + encodeURIComponent(base), slug: base }
          if (mappedPath && pathMap.has(mappedPath)) {
            const pm = pathMap.get(mappedPath)
            if (pm && pm.title) { ent.title = pm.title; ent._titleSource = 'path' }
            if (pm && pm.excerpt) ent.excerpt = pm.excerpt
            ent.sourcePath = mappedPath
          }
        }
        if (!ent) {
          ent = { loc: baseNoQs + '?page=' + encodeURIComponent(base), slug: base, title: _humanizeSlug(base) }
          ent._titleSource = 'humanize'
        }
        if (!entriesBySlug.has(base)) {
          entries.push(ent)
          entriesBySlug.set(base, ent)
        }
      } catch (_) {}
    }
  } catch (_) {}

  // Filter out anchor-level entries (keep only page-level slugs without '::')
  const final = []
  try {
    const seenFinal = new Set()
    for (const e of entries) {
      try {
        if (!e || !e.slug) continue
        const s = String(e.slug)
        const base = String(s).split('::')[0]
        if (excludedSlugs.has(base)) continue
        if (s.indexOf('::') !== -1) continue
        if (seenFinal.has(s)) continue
        seenFinal.add(s)
        final.push(e)
      } catch (_) {}
    }
  } catch (_) {}

  try {
    try { _debugLog('[runtimeSitemap] generateSitemapJson finalEntries.titleSource:', JSON.stringify(final.map(e => ({ slug: e.slug, title: e.title, titleSource: e._titleSource || null })), null, 2)) } catch (e) {}
  } catch (_) {}

  // Attempt to fetch H1 titles for entries that did not come from the live index.
  try {
    const MAX_FETCH_CONCURRENCY = 4
    let _nextIndex = 0
    const total = final.length
    const workers = Array.from({ length: Math.min(MAX_FETCH_CONCURRENCY, total) }).map(async () => {
      while (true) {
        const i = _nextIndex++
        if (i >= total) break
        const e = final[i]
        try {
          if (!e || !e.slug) continue
          const eBase = String(e.slug).split('::')[0]
          if (excludedSlugs.has(eBase)) continue
          if (e._titleSource === 'index') continue
          // Resolve a candidate path for this slug
          let candidatePath = null
          try {
            if (slugToMd && slugToMd.has(e.slug)) {
              const mv = slugToMd.get(e.slug)
              if (typeof mv === 'string') candidatePath = normalizePath(String(mv))
              else if (mv && typeof mv === 'object') candidatePath = normalizePath(String(mv.default || ''))
            }
            if (!candidatePath && e.sourcePath) candidatePath = e.sourcePath
          } catch (_) { continue }
          if (!candidatePath) continue
          if (excludedPaths.has(candidatePath)) continue
          if (!_isKnownPath(candidatePath)) continue
          try {
            const md = await fetchMarkdown(candidatePath, opts && opts.contentBase ? opts.contentBase : undefined)
            if (!md || !md.raw) continue
            if (md && typeof md.status === 'number' && md.status === 404) continue
            if (md && md.raw) {
              const hh = (md.raw || '').match(/^#\s+(.+)$/m)
              const title = hh && hh[1] ? hh[1].trim() : ''
              if (title) {
                e.title = title
                e._titleSource = 'fetched'
              }
            }
          } catch (err) { _debugLog('[runtimeSitemap] fetch title failed for', candidatePath, err) }
        } catch (err) { _debugLog('[runtimeSitemap] worker loop failure', err) }
      }
    })
    await Promise.all(workers)
  } catch (err) { _debugLog('[runtimeSitemap] title enrichment failed', err) }

  return { generatedAt: new Date().toISOString(), entries: final }
}

/**
 * Render sitemap JSON to XML sitemap format.
 * @param {{generatedAt:string,entries:Array}|Array} json - sitemap JSON or entries array
 * @returns {string} XML sitemap string
 */
export function generateSitemapXml(json) {
  const entries = (json && Array.isArray(json.entries)) ? json.entries : (Array.isArray(json) ? json : [])

  let s = '<?xml version="1.0" encoding="UTF-8"?>\n'
  s += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  for (const e of entries) {
    try {
      s += '  <url>\n'
      s += `    <loc>${_escapeXml(String(e.loc || ''))}</loc>\n`
      s += '  </url>\n'
    } catch (_) {}
  }
  s += '</urlset>\n'
  return s
}

/**
 * Render sitemap JSON to an RSS 2.0 feed.
 * @param {{generatedAt:string,entries:Array}|Array} json - sitemap JSON or entries array
 * @returns {string} RSS XML string
 */
export function generateRssXml(json) {
  const entries = (json && Array.isArray(json.entries)) ? json.entries : (Array.isArray(json) ? json : [])
  const base = _getBase().split('?')[0]
  let s = '<?xml version="1.0" encoding="UTF-8"?>\n'
  s += '<rss version="2.0">\n'
  s += '<channel>\n'
  s += `<title>${_escapeXml('Sitemap RSS')}</title>\n`
  s += `<link>${_escapeXml(base)}</link>\n`
  s += `<description>${_escapeXml('RSS feed generated from site index')}</description>\n`
  s += `<lastBuildDate>${_escapeXml((json && json.generatedAt) ? new Date(json.generatedAt).toUTCString() : new Date().toUTCString())}</lastBuildDate>\n`
  for (const e of entries) {
    try {
      const loc = String(e.loc || '')
      s += '<item>\n'
      s += `<title>${_escapeXml(String(e.title || e.slug || e.loc || ''))}</title>\n`
      if (e.excerpt) s += `<description>${_escapeXml(String(e.excerpt))}</description>\n`
      s += `<link>${_escapeXml(loc)}</link>\n`
      s += `<guid>${_escapeXml(loc)}</guid>\n`
      s += '</item>\n'
    } catch (_) {}
  }
  s += '</channel>\n'
  s += '</rss>\n'
  return s
}

/**
 * Render sitemap JSON to an Atom feed.
 * @param {{generatedAt:string,entries:Array}|Array} json - sitemap JSON or entries array
 * @returns {string} Atom XML string
 */
export function generateAtomXml(json) {
  const entries = (json && Array.isArray(json.entries)) ? json.entries : (Array.isArray(json) ? json : [])
  const base = _getBase().split('?')[0]
  const updated = (json && json.generatedAt) ? new Date(json.generatedAt).toISOString() : new Date().toISOString()
  let s = '<?xml version="1.0" encoding="utf-8"?>\n'
  s += '<feed xmlns="http://www.w3.org/2005/Atom">\n'
  s += `<title>${_escapeXml('Sitemap Atom')}</title>\n`
  s += `<link href="${_escapeXml(base)}" />\n`
  s += `<updated>${_escapeXml(updated)}</updated>\n`
  s += `<id>${_escapeXml(base)}</id>\n`
  for (const e of entries) {
    try {
      const loc = String(e.loc || '')
      const entryUpdated = (e && e.lastmod) ? (new Date(e.lastmod).toISOString()) : updated
      s += '<entry>\n'
      s += `<title>${_escapeXml(String(e.title || e.slug || e.loc || ''))}</title>\n`
      if (e.excerpt) s += `<summary>${_escapeXml(String(e.excerpt))}</summary>\n`
      s += `<link href="${_escapeXml(loc)}" />\n`
      s += `<id>${_escapeXml(loc)}</id>\n`
      s += `<updated>${_escapeXml(entryUpdated)}</updated>\n`
      s += '</entry>\n'
    } catch (_) {}
  }
  s += '</feed>\n'
  return s
}

function _writeXmlToDocument(xml, mimeType = 'application/xml') {
  try {
    try { document.open(mimeType, 'replace') } catch (_) { try { document.open() } catch (_) {} }
    document.write(xml)
    document.close()
    try {
      if (typeof Blob !== 'undefined' && typeof URL !== 'undefined' && URL.createObjectURL) {
        const blob = new Blob([xml], { type: mimeType })
        const blobUrl = URL.createObjectURL(blob)
        try { location.href = blobUrl } catch (_) { try { window.open(blobUrl, '_self') } catch (_) {} }
        setTimeout(() => { try { URL.revokeObjectURL(blobUrl) } catch (_) {} }, 5000)
      }
    } catch (_) {}
  } catch (e) {
    try { document.body.innerHTML = '<pre>' + _escapeXml(xml) + '</pre>' } catch (_) {}
  }
}

// Generate a minimal HTML representation of the sitemap JSON.
function _generateHtmlFromJson(finalJson) {
  try {
    const entries = (finalJson && Array.isArray(finalJson.entries)) ? finalJson.entries : (Array.isArray(finalJson) ? finalJson : [])
    let html = '<!doctype html><html><head><meta charset="utf-8"><title>Sitemap</title></head><body>'
    html += '<h1>Sitemap</h1><ul>'
    for (const e of entries) {
      try {
        html += `<li><a href="${_escapeXml(String(e && e.loc ? e.loc : ''))}">${_escapeXml(String((e && (e.title || e.slug)) || e && e.loc || ''))}</a></li>`
      } catch (_) {}
    }
    html += '</ul></body></html>'
    return html
  } catch (_) {
    return '<!doctype html><html><body><pre>failed to render sitemap</pre></body></html>'
  }
}

// Schedule a sitemap write so multiple concurrent calls don't race and
// overwrite a larger sitemap with a smaller one. The scheduler keeps the
// largest pending `finalJson` and performs a single write shortly after
// the burst of calls completes.
function _scheduleSitemapWrite(finalJson, mimeType = 'application/xml') {
  try {
    if (typeof window === 'undefined') {
      // fallback: immediate write
      try {
        let out = null
        if (mimeType === 'application/rss+xml') out = generateRssXml(finalJson)
        else if (mimeType === 'application/atom+xml') out = generateAtomXml(finalJson)
        else if (mimeType === 'text/html') {
          out = _generateHtmlFromJson(finalJson)
        } else out = generateSitemapXml(finalJson)
        _writeXmlToDocument(out, mimeType)
        try { if (typeof window !== 'undefined') { window.__nimbiSitemapRenderedAt = Date.now(); window.__nimbiSitemapJson = finalJson; window.__nimbiSitemapFinal = finalJson.entries || [] } } catch {}
      } catch (_) {}
      return
    }

    const newLen = Array.isArray(finalJson && finalJson.entries) ? finalJson.entries.length : 0
    try {
      const pending = window.__nimbiSitemapPendingWrite || null
      if (!pending || (typeof pending.len === 'number' && pending.len < newLen)) {
        window.__nimbiSitemapPendingWrite = { finalJson, mimeType, len: newLen }
      }
      if (window.__nimbiSitemapWriteTimer) return
      window.__nimbiSitemapWriteTimer = setTimeout(() => {
        try {
          const p = window.__nimbiSitemapPendingWrite
          if (!p) return
          let out = null
          if (p.mimeType === 'application/rss+xml') out = generateRssXml(p.finalJson)
          else if (p.mimeType === 'application/atom+xml') out = generateAtomXml(p.finalJson)
          else if (p.mimeType === 'text/html') {
            out = _generateHtmlFromJson(p.finalJson)
          } else out = generateSitemapXml(p.finalJson)

          try { _writeXmlToDocument(out, p.mimeType) } catch (e) {}
          try { window.__nimbiSitemapRenderedAt = Date.now(); window.__nimbiSitemapJson = p.finalJson; window.__nimbiSitemapFinal = p.finalJson.entries || [] } catch {}
        } catch (e) {}
        try { clearTimeout(window.__nimbiSitemapWriteTimer) } catch (_) {}
        window.__nimbiSitemapWriteTimer = null
        window.__nimbiSitemapPendingWrite = null
      }, 40)
    } catch (e) {}
  } catch (e) {}
}

/**
 * Handle runtime requests for /sitemap, ?sitemap, ?rss, ?atom, etc.
 * opts should be the same options that `init()` used (we expect init to
 * pass `indexDepth` and `noIndexing` so rebuild uses the same params).
 */
/**
 * Handle runtime requests for sitemap/rss/atom/html. When run in a
 * browser context this may write the generated XML/HTML to the document.
 * @param {Object} [opts] - options forwarded from init (contentBase, indexDepth, noIndexing, index, etc.)
 * @returns {Promise<boolean>} true when the request was handled (output written)
 */
export async function handleSitemapRequest(opts = {}) {
  try {
    if (typeof document === 'undefined' || typeof location === 'undefined') return false

    // Detect requested format
    let wantXml = false, wantRss = false, wantAtom = false, wantHtml = false
    try {
      const sp = new URLSearchParams(location.search || '')
      if (sp.has('sitemap')) {
        let only = true
        for (const k of sp.keys()) if (k !== 'sitemap') only = false
        if (only) wantXml = true
      }
      if (sp.has('rss')) {
        let only = true
        for (const k of sp.keys()) if (k !== 'rss') only = false
        if (only) wantRss = true
      }
      if (sp.has('atom')) {
        let only = true
        for (const k of sp.keys()) if (k !== 'atom') only = false
        if (only) wantAtom = true
      }
    } catch (_) {}
    if (!wantXml && !wantRss && !wantAtom) {
      const pathname = (location.pathname || '/').replace(/\/\/+/g, '/')
      const name = pathname.split('/').filter(Boolean).pop() || ''
      if (!name) return false
      wantXml = /^(sitemap|sitemap\.xml)$/i.test(name)
      wantRss = /^(rss|rss\.xml)$/i.test(name)
      wantAtom = /^(atom|atom\.xml)$/i.test(name)
      wantHtml = /^(sitemap|sitemap\.html)$/i.test(name)
      if (!wantXml && !wantRss && !wantAtom && !wantHtml) return false
    }

    // Prefer the authoritative live `searchIndex`: always await readiness
    // (and start a build when necessary) so sitemap generation uses the
    // same fully-built array the search UI relies on. Fall back to any
    // provided snapshot in `opts.index` when waiting times out or is
    // unavailable.
    let idx = []
    const waitMs = (typeof opts.waitForIndexMs === 'number') ? opts.waitForIndexMs : Infinity
    try {
      if (typeof whenSearchIndexReady === 'function') {
        try {
          const live = await whenSearchIndexReady({ timeoutMs: waitMs, contentBase: opts && opts.contentBase, indexDepth: opts && opts.indexDepth, noIndexing: opts && opts.noIndexing, startBuild: true })
          if (Array.isArray(live) && live.length) {
            // Merge provided snapshot with live index, preferring live entries
            if (Array.isArray(opts.index) && opts.index.length) {
              const bySlug = new Map()
              try {
                for (const it of opts.index) { try { if (it && it.slug) bySlug.set(String(it.slug), it) } catch (_) {} }
                for (const it of live) { try { if (it && it.slug) bySlug.set(String(it.slug), it) } catch (_) {} }
              } catch (_) {}
              idx = Array.from(bySlug.values())
            } else {
              idx = live
            }
          } else {
            idx = (Array.isArray(opts.index) && opts.index.length) ? opts.index : ((Array.isArray(searchIndex) && searchIndex.length) ? searchIndex : [])
          }
        } catch (e) {
          idx = (Array.isArray(opts.index) && opts.index.length) ? opts.index : ((Array.isArray(searchIndex) && searchIndex.length) ? searchIndex : [])
        }
      } else {
        idx = (Array.isArray(searchIndex) && searchIndex.length) ? searchIndex : (Array.isArray(opts.index) && opts.index.length ? opts.index : [])
      }
    } catch (e) {
      idx = (Array.isArray(opts.index) && opts.index.length) ? opts.index : ((Array.isArray(searchIndex) && searchIndex.length) ? searchIndex : [])
    }

    // Debug: if a provided index was passed, log the full array deduped
    // by the base slug (strip anchor parts after '::') so consumers can
    // verify what will be used. Keep this wrapped to avoid throwing.
    try {
      if (Array.isArray(opts.index) && opts.index.length) {
        try {
          const map = new Map()
          for (const it of opts.index) {
            try {
              if (!it || !it.slug) continue
              const base = String(it.slug).split('::')[0]
              if (!map.has(base)) map.set(base, it)
              else {
                const prev = map.get(base)
                if (prev && String(prev.slug || '').indexOf('::') !== -1 && String(it.slug || '').indexOf('::') === -1) {
                  map.set(base, it)
                }
              }
            } catch (_e) {}
          }
          try { _debugLog('[runtimeSitemap] providedIndex.dedupedByBase:', JSON.stringify(Array.from(map.values()), null, 2)) } catch (e) { _debugLog('[runtimeSitemap] providedIndex.dedupedByBase (count):', map.size) }
        } catch (e) { _debugWarn('[runtimeSitemap] logging provided index failed', e) }
      }
    } catch (e) {}

    // NOTE: polling removed. We rely on `whenSearchIndexReady({... startBuild: true })`
    // which will start/await an index build when necessary and return the
    // authoritative `searchIndex` array. This avoids race conditions and
    // removes arbitrary timeouts/polling loops.

    if ((!Array.isArray(idx) || !idx.length) && typeof buildSearchIndex === 'function') {
      try {
        const waitMs2 = (typeof opts.waitForIndexMs === 'number') ? opts.waitForIndexMs : Infinity
        let maybe = null
        try {
          if (typeof whenSearchIndexReady === 'function') {
            maybe = await whenSearchIndexReady({ timeoutMs: waitMs2, contentBase: opts && opts.contentBase, indexDepth: opts && opts.indexDepth, noIndexing: opts && opts.noIndexing, startBuild: true })
          }
        } catch (_) { maybe = null }
        if (Array.isArray(maybe) && maybe.length) {
          idx = maybe
        } else {
          const indexDepth = (typeof opts.indexDepth === 'number') ? opts.indexDepth : 3
          const noIndexing = Array.isArray(opts.noIndexing) ? opts.noIndexing : undefined
          const seeds = []
          if (opts && opts.homePage) seeds.push(opts.homePage)
          if (opts && opts.navigationPage) seeds.push(opts.navigationPage)
          idx = await buildSearchIndex(opts && opts.contentBase ? opts.contentBase : undefined, indexDepth, noIndexing, seeds.length ? seeds : undefined)
        }
      } catch (e) {
        _debugWarn('[runtimeSitemap] rebuild index failed', e)
        idx = Array.isArray(searchIndex) && searchIndex.length ? searchIndex : []
      }
    }

    // Debug: log the full index used to build the sitemap so we can verify
    // which pages/anchors are available at runtime.
    try {
      const len = Array.isArray(idx) ? idx.length : 0
      try { _debugLog('[runtimeSitemap] usedIndex.full.length (before rebuild):', len) } catch (e) {}
      try { _debugLog('[runtimeSitemap] usedIndex.full (before rebuild):', JSON.stringify(idx, null, 2)) } catch (e) { /* ignore stringify errors */ }
    } catch (e) {}

    // Rebuild the search index on-demand to ensure we include all pages
    // discoverable by the indexer (this follows the rule: when serving
    // sitemap/rss/atom, prefer a fresh authoritative index). Try worker
    // build first (if available) then fall back to `buildSearchIndex`.
    try {
      const rebuildSeeds = []
      if (opts && opts.homePage) rebuildSeeds.push(opts.homePage)
      if (opts && opts.navigationPage) rebuildSeeds.push(opts.navigationPage)
      const rebuildDepth = (typeof opts.indexDepth === 'number') ? opts.indexDepth : 3
      const rebuildNoIndexing = Array.isArray(opts.noIndexing) ? opts.noIndexing : undefined
      let rebuilt = null
      try {
        const workerFn = (typeof globalThis !== 'undefined' && typeof globalThis.buildSearchIndexWorker === 'function') ? globalThis.buildSearchIndexWorker : undefined
        if (typeof workerFn === 'function') {
          try { rebuilt = await workerFn(opts && opts.contentBase ? opts.contentBase : undefined, rebuildDepth, rebuildNoIndexing) } catch (e) { rebuilt = null }
        }
      } catch (e) { rebuilt = null }

      if ((!rebuilt || !rebuilt.length) && typeof buildSearchIndex === 'function') {
        try { rebuilt = await buildSearchIndex(opts && opts.contentBase ? opts.contentBase : undefined, rebuildDepth, rebuildNoIndexing, rebuildSeeds.length ? rebuildSeeds : undefined) } catch (e) { rebuilt = null }
      }

      if (Array.isArray(rebuilt) && rebuilt.length) {
        // Merge rebuilt entries with any existing idx, preferring rebuilt
        const bySlug = new Map()
        try {
          for (const it of idx) { try { if (it && it.slug) bySlug.set(String(it.slug), it) } catch (_) {} }
          for (const it of rebuilt) { try { if (it && it.slug) bySlug.set(String(it.slug), it) } catch (_) {} }
        } catch (_) {}
        idx = Array.from(bySlug.values())
      }
    } catch (e) {
      try { _debugWarn('[runtimeSitemap] rebuild index call failed', e) } catch (_) {}
    }

    // Debug: log the full index after optional rebuild
    try {
      const len2 = Array.isArray(idx) ? idx.length : 0
        try { _debugLog('[runtimeSitemap] usedIndex.full.length (after rebuild):', len2) } catch (e) {}
      try { _debugLog('[runtimeSitemap] usedIndex.full (after rebuild):', JSON.stringify(idx, null, 2)) } catch (e) { /* ignore stringify errors */ }
    } catch (e) {}

    // Generate JSON using the gathered index
    const json = await generateSitemapJson(Object.assign({}, opts, { index: idx }))

    // Debug: log the final entries deduped by base slug (strip anchors)
    let deduped = []
    try {
      const seen = new Set()
      const entriesArr = Array.isArray(json && json.entries) ? json.entries : []
      for (const e of entriesArr) {
        try {
          let slug = null
          if (e && e.slug) slug = String(e.slug)
          else if (e && e.loc) {
            try { const u = new URL(String(e.loc)); slug = u.searchParams.get('page') } catch {}
          }
          if (!slug) continue
          const base = String(slug).split('::')[0]
          if (!seen.has(base)) {
            seen.add(base)
            const copy = Object.assign({}, e)
            copy.baseSlug = base
            deduped.push(copy)
          }
        } catch {}
      }
      try { _debugLog('[runtimeSitemap] finalEntries.dedupedByBase:', JSON.stringify(deduped, null, 2)) } catch (e) { _debugLog('[runtimeSitemap] finalEntries.dedupedByBase (count):', deduped.length) }
    } catch (e) {
      try { deduped = Array.isArray(json && json.entries) ? json.entries.slice(0) : [] } catch (_) { deduped = [] }
    }

    // Construct a final JSON object that uses the deduped page-level
    // entries for all generators so ?sitemap, ?rss and ?atom are
    // consistent and use the same data set.
    const finalJson = Object.assign({}, json || {}, { entries: Array.isArray(deduped) ? deduped : (Array.isArray(json && json.entries) ? json.entries : []) })

    try {
      if (typeof window !== 'undefined') {
        try {
          window.__nimbiSitemapJson = finalJson
          window.__nimbiSitemapFinal = deduped
        } catch {}
      }
    } catch {}

    if (wantRss) {
      const newLen = Array.isArray(finalJson && finalJson.entries) ? finalJson.entries.length : 0
      let existingRenderedLen = -1
      try { if (typeof window !== 'undefined' && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt === 'number') existingRenderedLen = window.__nimbiSitemapFinal.length } catch {}
      if (existingRenderedLen > newLen) {
        try { _debugLog('[runtimeSitemap] skip RSS write: existing rendered sitemap larger', existingRenderedLen, newLen) } catch {}
        return true
      }
      _scheduleSitemapWrite(finalJson, 'application/rss+xml')
      return true
    }
    if (wantAtom) {
      const newLen = Array.isArray(finalJson && finalJson.entries) ? finalJson.entries.length : 0
      let existingRenderedLen = -1
      try { if (typeof window !== 'undefined' && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt === 'number') existingRenderedLen = window.__nimbiSitemapFinal.length } catch {}
      if (existingRenderedLen > newLen) {
        try { _debugLog('[runtimeSitemap] skip Atom write: existing rendered sitemap larger', existingRenderedLen, newLen) } catch {}
        return true
      }
      _scheduleSitemapWrite(finalJson, 'application/atom+xml')
      return true
    }
    if (wantXml) {
      const newLen = Array.isArray(finalJson && finalJson.entries) ? finalJson.entries.length : 0
      let existingRenderedLen = -1
      try { if (typeof window !== 'undefined' && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt === 'number') existingRenderedLen = window.__nimbiSitemapFinal.length } catch {}
      if (existingRenderedLen > newLen) {
        try { _debugLog('[runtimeSitemap] skip XML write: existing rendered sitemap larger', existingRenderedLen, newLen) } catch {}
        return true
      }
      _scheduleSitemapWrite(finalJson, 'application/xml')
      return true
    }

    if (wantHtml) {
      try {
        const entriesForHtml = Array.isArray(finalJson && finalJson.entries) ? finalJson.entries : []
        const newLen = entriesForHtml.length
        let existingRenderedLen = -1
        try { if (typeof window !== 'undefined' && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt === 'number') existingRenderedLen = window.__nimbiSitemapFinal.length } catch {}
        if (existingRenderedLen > newLen) {
          try { _debugLog('[runtimeSitemap] skip HTML write: existing rendered sitemap larger', existingRenderedLen, newLen) } catch {}
          return true
        }
        _scheduleSitemapWrite(finalJson, 'text/html')
        return true
      } catch (e) { _debugWarn('[runtimeSitemap] render HTML failed', e); return false }
    }

    return false
  } catch (e) {
    _debugWarn('[runtimeSitemap] handleSitemapRequest failed', e)
    return false
  }
}

/**
 * Build sitemap JSON and expose it on `window` for debugging/consumers.
 * This runs the same generator used by `handleSitemapRequest` but
 * deliberately does not attempt to write XML to the document.
 */
/**
 * Generate sitemap JSON and expose `window.__nimbiSitemapJson` and
 * `window.__nimbiSitemapFinal` for diagnostics. Does not write XML to the document.
 * @param {Object} [opts]
 * @returns {Promise<{json:Object,deduped:Array}|null>} generated JSON and deduped entries
 */
export async function exposeSitemapGlobals(opts = {}) {
  try {
    const waitMs = (typeof opts.waitForIndexMs === 'number') ? opts.waitForIndexMs : Infinity
    let idx = []
    try {
      if (typeof whenSearchIndexReady === 'function') {
        try {
          const live = await whenSearchIndexReady({ timeoutMs: waitMs, contentBase: opts && opts.contentBase, indexDepth: opts && opts.indexDepth, noIndexing: opts && opts.noIndexing, startBuild: true })
          if (Array.isArray(live) && live.length) idx = live
        } catch (_) {
          /* ignore */
        }
      }
    } catch (_) {}
    if ((!Array.isArray(idx) || !idx.length) && Array.isArray(searchIndex) && searchIndex.length) idx = searchIndex
    if ((!Array.isArray(idx) || !idx.length) && Array.isArray(opts.index) && opts.index.length) idx = opts.index

    const json = await generateSitemapJson(Object.assign({}, opts, { index: idx }))

    // dedupe entries by base slug
    let deduped = []
    try {
      const seen = new Set()
      const entriesArr = Array.isArray(json && json.entries) ? json.entries : []
      for (const e of entriesArr) {
        try {
          let slug = null
          if (e && e.slug) slug = String(e.slug)
          else if (e && e.loc) {
            try { const u = new URL(String(e.loc)); slug = u.searchParams.get('page') } catch (_) { slug = null }
          }
          if (!slug) continue
          const base = String(slug).split('::')[0]
          if (!seen.has(base)) {
            seen.add(base)
            const copy = Object.assign({}, e)
            copy.baseSlug = base
            deduped.push(copy)
          }
        } catch (_) {}
      }
    } catch (e) {
      try { deduped = Array.isArray(json && json.entries) ? json.entries.slice(0) : [] } catch (_) { deduped = [] }
    }

    // Ensure the exposed JSON matches the deduped page-level entries
    const finalJson = Object.assign({}, json || {}, { entries: Array.isArray(deduped) ? deduped : (Array.isArray(json && json.entries) ? json.entries : []) })
    try {
      if (typeof window !== 'undefined') {
        try {
          window.__nimbiSitemapJson = finalJson
          window.__nimbiSitemapFinal = deduped
        } catch {}
      }
    } catch {}

    return { json: finalJson, deduped }
  } catch (e) {
    return null
  }
}
