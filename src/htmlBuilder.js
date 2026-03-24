/**
 * HTML builder and article rendering helpers.
 *
 * Functions to parse markdown into article DOM, build TOC elements, and
 * prepare content for rendering inside the UI.
 *
 * @module htmlBuilder
 */
import { slugify, mdToSlug, slugToMd, _storeSlugMapping, fetchMarkdown, notFoundPage, homePage, allMarkdownPaths, allMarkdownPathsSet, HOME_SLUG, getFetchConcurrency } from './slugManager.js'
import * as md from './markdown.js'
import { hljs, SUPPORTED_HLJS_MAP, registerLanguage, observeCodeBlocks } from './codeblocksManager.js'
import { buildPageUrl, isExternalLink, normalizePath, safe, ensureTrailingSlash, trimTrailingSlash, decodeHtmlEntities } from './utils/helpers.js'
import { buildCosmeticUrl, parseHrefToRoute } from './utils/urlHelper.js'
import { markNotFound } from './seoManager.js'
import { debugWarn, debugInfo, isDebugLevel } from './utils/debug.js'
import { getSharedParser } from './utils/sharedDomParser.js'
import { runWithConcurrency } from './utils/concurrency.js'
import { rafThrottle, scheduleDOMWrite } from './utils/events.js'
// Prefix the current pathname to cosmetic URLs so we replace any existing
// `?page=` query instead of appending a hash to it.
/**
 * Build a cosmetic URL prefixed with the current pathname.
 * @param {string} page - slug or page token
 * @param {string|null} [anchor] - optional anchor id
 * @returns {string}
 */
function fullCosmetic(page, anchor = null) {
  try {
    const base = (typeof location !== 'undefined' && location && typeof location.pathname === 'string') ? (location.pathname || '/') : '/'
    return String(base) + buildCosmeticUrl(page, anchor)
  } catch (e) {
    return buildCosmeticUrl(page, anchor)
  }
}
import { registerThemedElement } from './bulmaManager.js'
import { makeWorkerManagerFromRaw } from './worker-manager.js'
import anchorWorkerCode from './worker/anchorWorker.js?raw'
import * as AnchorModule from './worker/anchorWorker.js'

function _hbWarn(...args) { try { debugWarn(...args) } catch (e) {} }
function _hbShouldProbe(contentBase) {
  try { if (isDebugLevel(3)) return true } catch (e) {}
  try { if (typeof notFoundPage === 'string' && notFoundPage) return true } catch (e) {}
  try { if (slugToMd && slugToMd.size) return true } catch (e) {}
  try { if (allMarkdownPathsSet && allMarkdownPathsSet.size) return true } catch (e) {}
  return false
}

// Helper to store slug mapping with a fallback for mocked slugManager
function storeSlugMapping(slug, rel) {
  try {
    if (typeof _storeSlugMapping === 'function') {
      try { _storeSlugMapping(slug, rel); return } catch (_) {}
    }
  } catch (_) {}
  try { if (slug && rel && slugToMd && typeof slugToMd.set === 'function' && !slugToMd.has(slug)) slugToMd.set(slug, rel) } catch (_) {}
  try { if (rel && mdToSlug && typeof mdToSlug.set === 'function') mdToSlug.set(rel, slug) } catch (_) {}
  try {
    // Prefer fast Set membership checks when available to avoid O(n) array scans.
    if (allMarkdownPathsSet && typeof allMarkdownPathsSet.has === 'function') {
      if (!allMarkdownPathsSet.has(rel)) {
        try { allMarkdownPathsSet.add(rel) } catch (_) {}
        try { if (Array.isArray(allMarkdownPaths) && !allMarkdownPaths.includes(rel)) allMarkdownPaths.push(rel) } catch (_) {}
      }
    } else {
      try { if (Array.isArray(allMarkdownPaths) && !allMarkdownPaths.includes(rel)) allMarkdownPaths.push(rel) } catch (_) {}
    }
  } catch (_) {}
}

/**
 * Resolve a path against a base URL and return the pathname portion.
 * @param {string} path - candidate path (may be relative)
 * @param {string} base - base URL or path to resolve against
 * @returns {string}
 */
function resolvePathWithBase(path, base) {
  try {
    const u = new URL(path, base)
    return u.pathname
  } catch (err) {
    try {
      const u2 = new URL(path, typeof location !== 'undefined' ? location.href : 'http://localhost/')
      return u2.pathname
    } catch (err2) {
      try {
        const joined = String((base || '')).replace(/\/$/, '') + '/' + String(path || '').replace(/^\//, '')
        return joined.replace(/\/\\+/g, '/')
      } catch (err3) {
        return String(path || '')
      }
    }
  }
}

/**
 * @typedef {{path:string,name:string,children?:NavItem[]}} NavItem
 * @typedef {{html:string,meta:Record<string, unknown>,toc:Array<{level:number,text:string,id?:string}>}} ParsedPage
 */

/**
 * @typedef {{article:HTMLElement,parsed:ParsedPage,toc:HTMLElement,topH1:HTMLElement|null,h1Text:string|null,slugKey:string|null}} ArticleResult
 */

/**
 * Build a navigation tree DOM element from a simple tree description.
 * @param {Function} t - localization function that returns translated strings
 * @param {Array<{path:string,name:string,children?:Array}>} tree - nav items
 * @returns {HTMLElement} aside menu element
 */
export function createNavTree(t, tree) {
  const nav = document.createElement('aside')
  nav.className = 'menu box nimbi-nav'
  const label = document.createElement('p')
  label.className = 'menu-label'
  label.textContent = t('navigation')
  nav.appendChild(label)
  const ul = document.createElement('ul')
  ul.className = 'menu-list';
  // Batch li creation into a DocumentFragment to minimize layout thrashing.
  try {
    const frag = document.createDocumentFragment()
    tree.forEach((item) => {
      const li = document.createElement('li')
      const a = document.createElement('a')
      try {
        const p = String(item.path || '')
        try {
          a.setAttribute('href', buildPageUrl(p))
        } catch (e) {
          if (p && p.indexOf('/') === -1) a.setAttribute('href', '#' + encodeURIComponent(p))
          else a.setAttribute('href', fullCosmetic(p))
        }
      } catch (e) { a.setAttribute('href', '#' + item.path) }
      a.textContent = item.name
      li.appendChild(a)
      if (item.children && item.children.length) {
        const subul = document.createElement('ul')
        item.children.forEach((c) => {
          const cli = document.createElement('li')
          const ca = document.createElement('a')
          try {
            const cp = String(c.path || '')
            try {
              ca.setAttribute('href', buildPageUrl(cp))
            } catch (e) {
              if (cp && cp.indexOf('/') === -1) ca.setAttribute('href', '#' + encodeURIComponent(cp))
              else ca.setAttribute('href', fullCosmetic(cp))
            }
          } catch (e) { ca.setAttribute('href', '#' + c.path) }
          ca.textContent = c.name
          cli.appendChild(ca)
          subul.appendChild(cli)
        })
        li.appendChild(subul)
      }
      frag.appendChild(li)
    })
    ul.appendChild(frag)
  } catch (err) {
    // Fallback to safe per-item append on error
    tree.forEach((item) => {
      try {
        const li = document.createElement('li')
        const a = document.createElement('a')
        try {
          const p = String(item.path || '')
          try { a.setAttribute('href', buildPageUrl(p)) } catch (e) { if (p && p.indexOf('/') === -1) a.setAttribute('href', '#' + encodeURIComponent(p)); else a.setAttribute('href', fullCosmetic(p)) }
        } catch (e) { a.setAttribute('href', '#' + item.path) }
        a.textContent = item.name
        li.appendChild(a)
        if (item.children && item.children.length) {
          const subul = document.createElement('ul')
          item.children.forEach((c) => {
            const cli = document.createElement('li')
            const ca = document.createElement('a')
            try {
              const cp = String(c.path || '')
              try { ca.setAttribute('href', buildPageUrl(cp)) } catch (e) { if (cp && cp.indexOf('/') === -1) ca.setAttribute('href', '#' + encodeURIComponent(cp)); else ca.setAttribute('href', fullCosmetic(cp)) }
            } catch (e) { ca.setAttribute('href', '#' + c.path) }
            ca.textContent = c.name
            cli.appendChild(ca)
            subul.appendChild(cli)
          })
          li.appendChild(subul)
        }
        ul.appendChild(li)
      } catch (e) { debugWarn('[htmlBuilder] createNavTree item failed', e) }
    })
  }
  nav.appendChild(ul)
  return nav
}

/**
 * Build a table-of-contents DOM element from parsed TOC entries.
 * @param {Function} t - localization function
 * @param {Array<{level:number,text:string,id?:string}>} toc - TOC entries
 * @param {string} [pagePath] - optional page path used for relative href normalization
 * @returns {HTMLElement} - The generated table-of-contents element.
 */
export function buildTocElement(t, toc, pagePath = '') {
  const aside = document.createElement('aside')
  aside.className = 'menu box nimbi-toc-inner is-hidden-mobile'
  const label = document.createElement('p')
  label.className = 'menu-label'
  label.textContent = t('onThisPage')
  aside.appendChild(label)
  const ul = document.createElement('ul')
  ul.className = 'menu-list';

  try {
    const lastLiAtLevel = {}
    ;(toc || []).forEach(item => {
      try {
        if (!item || item.level === 1) return
        const level = Number(item.level) >= 2 ? Number(item.level) : 2

        const li = document.createElement('li')
        const a = document.createElement('a')
        const text = decodeHtmlEntities(item.text || '')
        const slug = item.id || slugify(text)
        a.textContent = text
        try {
          const normPage = String(pagePath || '').replace(/^[\\.\\/]+/, '')
          const display = (normPage && mdToSlug && mdToSlug.has && mdToSlug.has(normPage)) ? mdToSlug.get(normPage) : normPage
            if (display) a.href = buildPageUrl(display, slug)
            else a.href = `#${encodeURIComponent(slug)}`
        } catch (err) {
            debugWarn('[htmlBuilder] buildTocElement href normalization failed', err)
          a.href = `#${encodeURIComponent(slug)}`
        }
        li.appendChild(a)

        if (level === 2) {
          ul.appendChild(li)
          lastLiAtLevel[2] = li
          Object.keys(lastLiAtLevel).forEach(k => { if (Number(k) > 2) delete lastLiAtLevel[k] })
          return
        }

        let parentLevel = level - 1
        while (parentLevel > 2 && !lastLiAtLevel[parentLevel]) parentLevel--
        if (parentLevel < 2) parentLevel = 2
        let parentLi = lastLiAtLevel[parentLevel]
        if (!parentLi) {
          ul.appendChild(li)
          lastLiAtLevel[level] = li
          return
        }

        let subUl = parentLi.querySelector('ul')
        if (!subUl) {
          subUl = document.createElement('ul')
          parentLi.appendChild(subUl)
        }
        subUl.appendChild(li)
        lastLiAtLevel[level] = li
      } catch (err) { debugWarn('[htmlBuilder] buildTocElement item failed', err, item) }
    })
  } catch (err) { debugWarn('[htmlBuilder] buildTocElement failed', err) }

  aside.appendChild(ul)
  const itemCount = ul.querySelectorAll('li').length
  if (itemCount <= 1) return null
  return aside
}

/**
 * Ensure every heading in the document has an id (slugified from text).
 * @param {Document|HTMLElement} doc - Document or element to scan and add heading ids to.
 * @returns {void}
 */
function addHeadingIds(doc) {
  const heads = doc.querySelectorAll('h1,h2,h3,h4,h5,h6')
  heads.forEach(h => { if (!h.id) h.id = slugify(h.textContent || '') })
}

/**
 * Resolve relative image `src` attributes against the content base and
 * mark them for lazy loading where appropriate.
 * @param {HTMLElement} el - Container element to search for images.
 * @param {string} pagePath - Page path used to compute relative image URLs.
 * @param {string} contentBase - Base URL or path for site content.
 * @returns {void}
 */
function lazyLoadImages(el, pagePath, contentBase) {
  try {
    const imgs = el.querySelectorAll('img')
    if (imgs && imgs.length) {
      const pageDirForImgs = pagePath && pagePath.includes('/') ? pagePath.substring(0, pagePath.lastIndexOf('/') + 1) : ''
      imgs.forEach((img) => {
        const src = img.getAttribute('src') || ''
        if (!src) return
        if (/^(https?:)?\/\//.test(src) || src.startsWith('/')) return
        try {
          const resolved = new URL(pageDirForImgs + src, contentBase).toString()
          img.src = resolved
          try { if (!img.getAttribute('loading')) img.setAttribute('data-want-lazy', '1') } catch (err) { debugWarn('[htmlBuilder] set image loading attribute failed', err) }
        } catch (err) { debugWarn('[htmlBuilder] resolve image src failed', err) }
      })
    }
  } catch (err) { debugWarn('[htmlBuilder] lazyLoadImages failed', err) }
}

/**
 * Rewrite relative asset URLs inside an article so they resolve against the
 * fetched page's directory. Handles `src`, `href` (for scripts/links),
 * `srcset`, `poster`, and SVG `use` (`href`/`xlink:href`).
 * @param {HTMLElement} el - Article/container element whose assets will be rewritten.
 * @param {string} pagePath - Page path used to resolve relative asset URLs.
 * @param {string} contentBase - Base URL or path for site content.
 */
function rewriteRelativeAssets(el, pagePath, contentBase) {
  try {
    const pageDir = pagePath && pagePath.includes('/') ? pagePath.substring(0, pagePath.lastIndexOf('/') + 1) : ''
    let baseForPage = null
    try {
      const contentBaseUrl = new URL(contentBase, location.href)
      baseForPage = new URL(pageDir || '.', contentBaseUrl).toString()
    } catch (err) {
      try { baseForPage = new URL(pageDir || '.', location.href).toString() } catch (e) { baseForPage = pageDir || './' }
    }
    let sel = null
    try {
      sel = el.querySelectorAll('[src],[href],[srcset],[poster]')
    } catch (errSel) {
      // Some parsers/environments reject certain attribute selectors
      // (notably namespaced attributes like xlink:href). Fall back to
      // collecting common element/tag sets and `[srcset]` nodes.
      const tmp = []
      try { tmp.push(...Array.from(el.getElementsByTagName('img') || [])) } catch (_) {}
      try { tmp.push(...Array.from(el.getElementsByTagName('link') || [])) } catch (_) {}
      try { tmp.push(...Array.from(el.getElementsByTagName('video') || [])) } catch (_) {}
      try { tmp.push(...Array.from(el.getElementsByTagName('use') || [])) } catch (_) {}
      try { tmp.push(...Array.from(el.querySelectorAll('[srcset]') || [])) } catch (_) {}
      sel = tmp
    }
    // Always include SVG <use> elements (they commonly use namespaced
    // `xlink:href`) since attribute selectors for namespaced attributes
    // may not match uniformly across environments.
    let nodes = Array.from(sel || [])
    try {
      const uses = Array.from(el.getElementsByTagName('use') || [])
      for (const u of uses) if (nodes.indexOf(u) === -1) nodes.push(u)
    } catch (_) {}

    for (const node of Array.from(nodes || [])) {
      try {
        const tag = node.tagName ? node.tagName.toLowerCase() : ''
        const rewriteAttr = (attr) => {
          try {
            const val = node.getAttribute(attr) || ''
            if (!val) return
            if (/^(https?:)?\/\//i.test(val) || val.startsWith('/')) return
            if (val.startsWith('#')) return
            try { node.setAttribute(attr, new URL(val, baseForPage).toString()) } catch (err) { debugWarn('[htmlBuilder] rewrite asset attribute failed', attr, val, err) }
          } catch (err) { debugWarn('[htmlBuilder] rewriteAttr failed', err) }
        }
        if (node.hasAttribute && node.hasAttribute('src')) rewriteAttr('src')
        if (node.hasAttribute && node.hasAttribute('href')) {
          if (tag !== 'a') rewriteAttr('href')
        }
        if (node.hasAttribute && node.hasAttribute('xlink:href')) rewriteAttr('xlink:href')
        if (node.hasAttribute && node.hasAttribute('poster')) rewriteAttr('poster')
        if (node.hasAttribute && node.hasAttribute('srcset')) {
          const rawSs = node.getAttribute('srcset') || ''
          const parts = rawSs.split(',').map(s => s.trim()).filter(Boolean)
          const mapped = parts.map(p => {
            const [urlPart, size] = p.split(/\s+/, 2)
            if (!urlPart) return p
            if (/^(https?:)?\/\//i.test(urlPart) || urlPart.startsWith('/')) return p
            try { const r = new URL(urlPart, baseForPage).toString(); return size ? `${r} ${size}` : r } catch (err) { return p }
          }).join(', ')
          node.setAttribute('srcset', mapped)
        }
      } catch (err) { debugWarn('[htmlBuilder] rewriteRelativeAssets node processing failed', err) }
    }
  } catch (err) { debugWarn('[htmlBuilder] rewriteRelativeAssets failed', err) }
}

let _lastContentBase = ''
let _lastContentBaseUrl = null
let _lastContentBasePath = ''

/**
 * Rewrite anchor hrefs in an article element to SPA `?page=` links where
 * applicable. Performs slug lookups and may fetch markdown titles.
 * @param {HTMLElement} article - Article element containing page HTML and anchors.
 * @param {string} contentBase - Base URL or path for site content.
 * @param {string} [pagePath] - Optional page path used for relative link resolution.
 * @returns {Promise<void>} - Resolves when anchor rewriting and any async title fetches complete.
 */
async function rewriteAnchors(article, contentBase, pagePath, opts = {}) {
  try {
    // default to canonical hrefs unless explicitly overridden
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
        try { contentBaseUrl = new URL(contentBase, location.href); contentBasePath = ensureTrailingSlash(contentBaseUrl.pathname) } catch (e) { contentBaseUrl = null; contentBasePath = '/'; }
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
        // Don't rewrite anchors that live inside heading elements —
        // links in headings are often intended as part of the heading
        // and rewriting them can break slug/title extraction and TOC mapping.
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
                } catch (err) { /* ignore URL parse errors */ }
          }
        } catch (err) { /* ignore pre-check errors */ }
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
            rel = normalizePath(rel)
            anchorInfo.push({ node: a, mdPathRaw, frag, rel })
            if (!mdToSlug.has(rel)) pending.add(rel)
          } catch (err) { debugWarn('[htmlBuilder] resolve mdPath failed', err) }
          continue
        }
        try {
          let toResolve = href
          if (!href.startsWith('/') && pagePath) {
            if (href.startsWith('#')) {
              toResolve = pagePath + href
            } else {
              const dir = pagePath.includes('/') ? pagePath.substring(0, pagePath.lastIndexOf('/') + 1) : ''
              toResolve = dir + href
            }
          }
          const full = new URL(toResolve, contentBase)
          const p = full.pathname || ''
            if (p && p.indexOf(contentBasePath) !== -1) {
            let rel = p.startsWith(contentBasePath) ? p.slice(contentBasePath.length) : p
            rel = normalizePath(rel)
            rel = trimTrailingSlash(rel)
            if (!rel) rel = HOME_SLUG
            if (!rel.endsWith('.md')) {
              let slugKey = null
              try {
                if (mdToSlug && mdToSlug.has && mdToSlug.has(rel)) {
                  slugKey = mdToSlug.get(rel)
                } else {
                    try {
                      const baseName = String(rel || '').replace(/^.*\//, '')
                      if (baseName && mdToSlug.has && mdToSlug.has(baseName)) slugKey = mdToSlug.get(baseName)
                    } catch (e) { debugWarn('[htmlBuilder] mdToSlug baseName check failed', e) }
                  }
                } catch (err) { debugWarn('[htmlBuilder] mdToSlug access check failed', err) }
              if (!slugKey) {
                try {
                  const baseName = String(rel || '').replace(/^.*\//, '')
                  for (const [k, v] of slugToMd || []) {
                    if (v === rel || v === baseName) { slugKey = k; break }
                  }
                } catch (err) { /* ignore iteration errors */ }
              }
              if (slugKey) {
                const urlVal = opts && opts.canonical ? buildPageUrl(slugKey, null) : fullCosmetic(slugKey)
                a.setAttribute('href', urlVal)
              } else {
                // If the resolved target has no file extension, try the
                // .html candidate when probing for titles. This avoids
                // issuing fetches for bare slug paths (e.g. `nimbicms`) which
                // would request `/nimbicms` from the origin and produce
                // confusing 404s on many static hosts. Store the HTML
                // candidate in the pending list and record it on the
                // anchor info so later mapping logic uses the canonical
                // path form.
                let htmlRel = rel
                try {
                  if (!/\.[^\/]+$/.test(String(rel || ''))) htmlRel = String(rel || '') + '.html'
                } catch (err) { htmlRel = rel }
                htmlPending.add(htmlRel)
                htmlAnchorInfo.push({ node: a, rel: htmlRel })
              }
            }
          }
        } catch (err) { debugWarn('[htmlBuilder] resolving href to URL failed', err) }
      } catch (err) { debugWarn('[htmlBuilder] processing anchor failed', err) }
    }

    if (pending.size) {
      if (!_hbShouldProbe(contentBase)) {
        try { debugWarn('[htmlBuilder] skipping md title probes (probing disabled)') } catch (e) {}
        // Create conservative slug mappings from filenames when probing is disabled
        for (const rel of Array.from(pending)) {
          try {
            const m = String(rel).match(/([^\/]+)\.md$/)
            const basename = m && m[1]
                if (basename) {
              const candidate = slugify(basename)
              if (candidate) {
                try { storeSlugMapping(candidate, rel) } catch (err) { debugWarn('[htmlBuilder] setting fallback slug mapping failed', err) }
              }
            }
          } catch (err) { /* ignore per-path fallback errors */ }
        }
      } else {
        await runWithConcurrency(Array.from(pending), async (rel) => {
        try {
          try {
            const m = String(rel).match(/([^\/]+)\.md$/)
            const basename = m && m[1]
            if (basename && slugToMd.has(basename)) {
              try {
                const mapped = slugToMd.get(basename)
                if (mapped) {
                  try {
                    const pathVal = (typeof mapped === 'string') ? mapped : (mapped && mapped.default ? mapped.default : null)
                    if (pathVal) storeSlugMapping(basename, pathVal)
                  } catch (err) { debugWarn('[htmlBuilder] _storeSlugMapping failed', err) }
                }
              } catch (err) { debugWarn('[htmlBuilder] reading slugToMd failed', err) }
              return
            }
          } catch (err) { debugWarn('[htmlBuilder] basename slug lookup failed', err) }

          const mdData = await fetchMarkdown(rel, contentBase)
            if (mdData && mdData.raw) {
            const m2 = (mdData.raw || '').match(/^#\s+(.+)$/m)
            if (m2 && m2[1]) {
              const candidate = slugify(m2[1].trim())
                if (candidate) {
                  try { storeSlugMapping(candidate, rel) } catch (err) { debugWarn('[htmlBuilder] setting slug mapping failed', err) }
                }
            }
          }
          } catch (err) { debugWarn('[htmlBuilder] fetchMarkdown during rewriteAnchors failed', err) }
        }, 6)
      }
    }

    if (htmlPending.size) {
      if (!_hbShouldProbe(contentBase)) {
        try { debugWarn('[htmlBuilder] skipping html title probes (probing disabled)') } catch (e) {}
        // Create conservative slug mappings from html filenames when probing disabled
        for (const rel of Array.from(htmlPending)) {
          try {
            const m = String(rel).match(/([^\/]+)\.html$/)
            const basename = m && m[1]
                if (basename) {
              const candidate = slugify(basename)
              if (candidate) {
                try { storeSlugMapping(candidate, rel) } catch (err) { debugWarn('[htmlBuilder] setting fallback html slug mapping failed', err) }
              }
            }
          } catch (err) { /* ignore per-path fallback errors */ }
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
                  try { storeSlugMapping(slugKey, rel) } catch (err) { debugWarn('[htmlBuilder] setting html slug mapping failed', err) }
                }
              }
            } catch (err) { debugWarn('[htmlBuilder] parse fetched HTML failed', err) }
          }
        } catch (err) { debugWarn('[htmlBuilder] fetchMarkdown for htmlPending failed', err) }
        }, 5)
      }
    }

    for (const info of anchorInfo) {
      const { node: a, frag, rel } = info
      let slug = null
      try { if (mdToSlug.has(rel)) slug = mdToSlug.get(rel) } catch (err) { debugWarn('[htmlBuilder] mdToSlug access failed', err) }
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
      try { if (mdToSlug.has(rel)) slug = mdToSlug.get(rel) } catch (err) { debugWarn('[htmlBuilder] mdToSlug access failed for htmlAnchorInfo', err) }
      if (!slug) {
        try { const baseName = String(rel || '').replace(/^.*\//, ''); if (mdToSlug.has(baseName)) slug = mdToSlug.get(baseName) } catch (err) { debugWarn('[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo', err) }
      }
      if (slug) {
        const urlVal = opts && opts.canonical ? buildPageUrl(slug, null) : fullCosmetic(slug)
        a.setAttribute('href', urlVal)
      } else {
        const urlVal = opts && opts.canonical ? buildPageUrl(rel, null) : fullCosmetic(rel)
        a.setAttribute('href', urlVal)
      }
    }
  } catch (err) { debugWarn('[htmlBuilder] rewriteAnchors failed', err) }
}

/**
 * Compute and replace the current history state slug for the article.
 * Returns the detected top H1, its text, and the chosen slug key.
 *
 * @param {Object} parsed - Parsed page metadata including `meta` and other fields.
 * @param {HTMLElement} article - The article container element to parse.
 * @param {string} [pagePath] - Optional page path used to normalize relative links.
 * @param {string|null} [anchor] - Optional anchor id to scroll to after rendering.
 * @returns {{topH1:HTMLElement|null,h1Text:string|null,slugKey:string}}
 */
function computeSlug(parsed, article, pagePath, anchor) {
  const topH1 = article.querySelector('h1')
  const h1Text = topH1 ? (topH1.textContent || '').trim() : ''
  let slugKey = ''
  try {
    let displayTitle = ''
    try {
      if (parsed && parsed.meta && parsed.meta.title) displayTitle = String(parsed.meta.title).trim()
    } catch (e) { /* ignore */ }
    if (!displayTitle && h1Text) displayTitle = h1Text
    if (!displayTitle) {
      try {
        const h2 = article.querySelector('h2')
        if (h2 && h2.textContent) displayTitle = String(h2.textContent).trim()
      } catch (e) { /* ignore */ }
    }
    if (!displayTitle && pagePath) displayTitle = String(pagePath)
    if (displayTitle) slugKey = slugify(displayTitle)
    if (!slugKey) slugKey = HOME_SLUG
    // Persist a slug mapping for this page. `storeSlugMapping` may
    // choose a different (unique) slug when collisions occur; read
    // back the effective slug from `mdToSlug` so the URL we write to
    // history matches the actual mapping used by the runtime.
    try {
      if (pagePath) {
        try {
          storeSlugMapping(slugKey, pagePath)
        } catch (err) { debugWarn('[htmlBuilder] computeSlug set slug mapping failed', err) }
        try {
          const normPath = normalizePath(String(pagePath || ''))
          if (mdToSlug && typeof mdToSlug.has === 'function' && mdToSlug.has(normPath)) {
            slugKey = mdToSlug.get(normPath)
          } else {
            // Fallback: scan slugToMd for a key that maps to this path
            try {
              for (const [k, v] of slugToMd || []) {
                try {
                  const pathVal = (typeof v === 'string') ? v : (v && v.default ? v.default : null)
                  if (pathVal && normalizePath(String(pathVal)) === normPath) {
                    slugKey = k
                    break
                  }
                } catch (_) {}
              }
            } catch (_) {}
          }
        } catch (err) { /* ignore readback errors */ }
      }
    } catch (err) { debugWarn('[htmlBuilder] computeSlug set slug mapping failed', err) }
        try {
        // Prefer a normalized anchor extracted via `parseHrefToRoute`, but
        // avoid persisting an anchor from a different page when rendering a new page.
        let curHash = anchor || ''
        if (!curHash) {
          try {
            const parsedCurrent = parseHrefToRoute(typeof location !== 'undefined' ? location.href : '')
            // Only reuse the current anchor if it belongs to the same page slug.
            if (parsedCurrent && parsedCurrent.anchor && parsedCurrent.page && String(parsedCurrent.page) === String(slugKey)) {
              curHash = parsedCurrent.anchor
            } else {
              curHash = ''
            }
          } catch (err) {
            curHash = ''
          }
        }
        try {
          history.replaceState({ page: slugKey }, '', fullCosmetic(slugKey, curHash))
        } catch (err) { debugWarn('[htmlBuilder] computeSlug history replace failed', err) }
        } catch (err) { debugWarn('[htmlBuilder] computeSlug inner failed', err) }
      } catch (err) { debugWarn('[htmlBuilder] computeSlug failed', err) }
  try {
    if (parsed && parsed.meta && parsed.meta.title && topH1) {
      const metaTitle = String(parsed.meta.title).trim()
      if (metaTitle && metaTitle !== h1Text) {
        try {
          if (slugKey) topH1.id = slugKey
        } catch (e) { /* ignore DOM id assignment failures */ }
        try {
          if (Array.isArray(parsed.toc)) {
            for (const entry of parsed.toc) {
              try {
                if (entry && Number(entry.level) === 1 && String(entry.text).trim() === (h1Text || '').trim()) {
                  entry.id = slugKey
                  break
                }
              } catch (e) { /* ignore per-entry errors */ }
            }
          }
        } catch (e) { /* ignore parsed.toc update errors */ }
      }
    }
  } catch (e) { /* ignore final slug-to-h1 sync errors */ }
  return { topH1, h1Text, slugKey }
}

/**
 * Given a collection of anchor elements pointing at HTML files, fetch each
 * document and extract a title or first H1.  This allows us to create
 * slug-to-path mappings up front so clicks on HTML links behave like
 * Markdown URLs.
 *
 * @param {NodeListOf<HTMLAnchorElement>} linkEls - Anchors to inspect for HTML titles.
 * @param {string} base - Base URL used for `fetchMarkdown` when resolving links.
 * @returns {Promise<void>} - Resolves when all title fetches and slug mappings have completed.
 */
export async function preScanHtmlSlugs(linkEls, base) {
  if (!linkEls || !linkEls.length) return

  const htmlPaths = new Set()
  for (const a of Array.from(linkEls || [])) {
      try {
        const href = a.getAttribute('href') || ''
        if (!href) continue
        const raw = normalizePath(href)
        const parts = raw.split(/::|#/, 2)
        let path = parts[0]
        try { const qi = path.indexOf('?'); if (qi !== -1) path = path.slice(0, qi) } catch (e) { /* ignore */ }
        if (!path) continue
        if (!path.includes('.')) {
          path = path + '.html'
        }
        if (!/\.html(?:$|[?#])/.test(path) && !path.toLowerCase().endsWith('.html')) continue
        const htmlPath = path
        try {
          if (mdToSlug && mdToSlug.has && mdToSlug.has(htmlPath)) continue
        } catch (err) { debugWarn('[htmlBuilder] mdToSlug check failed', err) }
        try {
          let already = false
          for (const v of slugToMd.values()) {
            if (v === htmlPath) { already = true; break }
          }
          if (already) continue
        } catch (err) { debugWarn('[htmlBuilder] slugToMd iteration failed', err) }
        htmlPaths.add(htmlPath)
      } catch (err) { debugWarn('[htmlBuilder] preScanHtmlSlugs anchor iteration failed', err) }
  }

  if (!htmlPaths.size) return

    if (!_hbShouldProbe(base)) {
    try { debugWarn('[htmlBuilder] skipping preScanHtmlSlugs (probing disabled)') } catch (e) {}
    // Create conservative mappings from html filenames when probing disabled
    for (const htmlPath of Array.from(htmlPaths)) {
      try {
        const m = String(htmlPath).match(/([^\/]+)\.html$/)
        const basename = m && m[1]
        if (basename) {
          const candidate = slugify(basename)
          if (candidate) {
              try { storeSlugMapping(candidate, htmlPath) } catch (err) { debugWarn('[htmlBuilder] setting fallback preScanHtmlSlugs mapping failed', err) }
          }
        }
      } catch (err) { /* ignore per-path errors */ }
    }
    return
  }

  const fetchAndExtract = async (htmlPath) => {
    try {
      const res = await fetchMarkdown(htmlPath, base)
      if (res && res.raw) {
        try {
            const parser = getSharedParser()
            const doc = parser.parseFromString(res.raw, 'text/html')
            const titleTag = doc.querySelector('title')
            const h1 = doc.querySelector('h1')
            const titleText = (titleTag && titleTag.textContent && titleTag.textContent.trim())
              ? titleTag.textContent.trim()
              : (h1 && h1.textContent ? h1.textContent.trim() : null)
            if (titleText) {
              const slugKey = slugify(titleText)
              if (slugKey) {
                try { storeSlugMapping(slugKey, htmlPath) } catch (err) { debugWarn('[htmlBuilder] set slugToMd/mdToSlug failed', err) }
              }
            }
          } catch (err) { debugWarn('[htmlBuilder] parse HTML title failed', err) }
      }
    } catch (err) { debugWarn('[htmlBuilder] fetchAndExtract failed', err) }
  }

  const paths = Array.from(htmlPaths)
  const concurrency = Math.max(1, Math.min(getFetchConcurrency(), paths.length || 1))
  await runWithConcurrency(paths, fetchAndExtract, concurrency)
}

/**
 * Map referenced markdown links to slugs by fetching titles where needed.
 * @param {NodeListOf<HTMLAnchorElement>|HTMLAnchorElement[]} linkEls - Anchors to inspect for markdown links.
 * @param {string} contentBase - Base URL used when resolving relative markdown paths.
 * @returns {Promise<void>} - Resolves once mapping and any title fetches are complete.
 */
export async function preMapMdSlugs(linkEls, contentBase) {
  if (!linkEls || !linkEls.length) return

  const anchorInfo = []
  const pending = new Set()
  let contentBasePath = ''
  try {
    const contentBaseUrl = new URL(contentBase, typeof location !== 'undefined' ? location.href : 'http://localhost/')
    contentBasePath = ensureTrailingSlash(contentBaseUrl.pathname)
  } catch (err) { contentBasePath = ''; debugWarn('[htmlBuilder] preMapMdSlugs parse base failed', err) }

  for (const a of Array.from(linkEls || [])) {
    try {
      const href = a.getAttribute('href') || ''
      if (!href) continue
      const mdMatch = href.match(/^([^#?]+\.md)(?:[#](.+))?$/)
      if (mdMatch) {
        let mdPathRaw = normalizePath(mdMatch[1])
          try {
            let resolved
            try {
              resolved = resolvePathWithBase(mdPathRaw, contentBase)
            } catch (err) {
              resolved = mdPathRaw
              debugWarn('[htmlBuilder] resolve mdPath URL failed', err)
            }
          const rel = (resolved && contentBasePath && resolved.startsWith(contentBasePath)) ? resolved.slice(contentBasePath.length) : String(resolved || '').replace(/^\//, '')
          anchorInfo.push({ rel })
          if (!mdToSlug.has(rel)) pending.add(rel)
        } catch (err) { debugWarn('[htmlBuilder] rewriteAnchors failed', err) }
        continue
      }
    } catch (err) { debugWarn('[htmlBuilder] preMapMdSlugs anchor iteration failed', err) }
  }

  if (pending.size) {
    if (!_hbShouldProbe(contentBase)) {
      try { debugWarn('[htmlBuilder] skipping preMapMdSlugs probes (probing disabled)') } catch (e) {}
    } else {
      await Promise.all(Array.from(pending).map(async rel => {
      try {
        const m = String(rel).match(/([^\/]+)\.md$/)
        const basename = m && m[1]
        if (basename && slugToMd.has(basename)) {
          try {
              const mapped = slugToMd.get(basename)
              if (mapped) {
                try {
                  const pathVal = (typeof mapped === 'string') ? mapped : (mapped && mapped.default ? mapped.default : null)
                  if (pathVal) storeSlugMapping(basename, pathVal)
                } catch (err) { debugWarn('[htmlBuilder] _storeSlugMapping failed', err) }
              }
              } catch (err) { debugWarn('[htmlBuilder] preMapMdSlugs slug map access failed', err) }
          return
        }
        } catch (err) { debugWarn('[htmlBuilder] preMapMdSlugs basename check failed', err) }

      try {
        const mdData = await fetchMarkdown(rel, contentBase)
        if (mdData && mdData.raw) {
          const m2 = (mdData.raw || '').match(/^#\s+(.+)$/m)
          if (m2 && m2[1]) {
            const candidate = slugify(m2[1].trim())
                if (candidate) {
                  try { storeSlugMapping(candidate, rel) } catch (err) { debugWarn('[htmlBuilder] preMapMdSlugs setting slug mapping failed', err) }
                }
          }
        }
      } catch (err) { debugWarn('[htmlBuilder] preMapMdSlugs fetch failed', err) }
      }))
    }
  }
}


/**
 * Parse raw HTML input and return the normalized "parsed" object used by the
 * rendering pipeline.
 *
 * @param {string} raw - HTML string to parse
 * @returns {ParsedPage}
 */
const HTML_PARSER = getSharedParser()

function parseHtml(raw) {
  try {
    const parser = getSharedParser()
    const doc = parser.parseFromString(raw || '', 'text/html')
    addHeadingIds(doc)
    try {
      const imgs = doc.querySelectorAll('img')
      imgs.forEach(img => { try { if (!img.getAttribute('loading')) img.setAttribute('data-want-lazy', '1') } catch (err) { debugWarn('[htmlBuilder] parseHtml set image loading attribute failed', err) } })
    } catch (err) { debugWarn('[htmlBuilder] parseHtml query images failed', err) }
    const codes = doc.querySelectorAll('pre code, code[class]')
    codes.forEach(codeEl => {
      try {
        const cls = (codeEl.getAttribute && codeEl.getAttribute('class')) || codeEl.className || ''
        const match = cls.match(/language-([a-zA-Z0-9_+-]+)/) || cls.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/)
        if (match && match[1]) {
          const l = (match[1] || '').toLowerCase()
          const canonical = (SUPPORTED_HLJS_MAP.size && (SUPPORTED_HLJS_MAP.get(l) || SUPPORTED_HLJS_MAP.get(String(l).toLowerCase()))) || l
          try {
            ;(async () => {
              try { await registerLanguage(canonical) } catch (err) { debugWarn('[htmlBuilder] registerLanguage failed', err) }
            })()
          } catch (err) { debugWarn('[htmlBuilder] schedule registerLanguage failed', err) }
        } else {
          try {
            if (hljs && typeof hljs.getLanguage === 'function' && hljs.getLanguage('plaintext')) {
              const out = hljs.highlight ? hljs.highlight(codeEl.textContent || '', { language: 'plaintext' }) : null
              if (out && out.value) {
                try {
                  if (typeof document !== 'undefined' && document.createRange && typeof document.createRange === 'function') {
                    const frag = document.createRange().createContextualFragment(out.value)
                    if (typeof codeEl.replaceChildren === 'function') codeEl.replaceChildren(...Array.from(frag.childNodes))
                    else {
                      while (codeEl.firstChild) codeEl.removeChild(codeEl.firstChild)
                      codeEl.appendChild(frag)
                    }
                  } else {
                    codeEl.innerHTML = out.value
                  }
                } catch (err) {
                  try { codeEl.innerHTML = out.value } catch (_) {}
                }
              }
            }
          } catch (err) { debugWarn('[htmlBuilder] plaintext highlight fallback failed', err) }
        }
      } catch (err) { debugWarn('[htmlBuilder] code element processing failed', err) }
    })
    const tocEntries = []
    const heads = doc.querySelectorAll('h1,h2,h3,h4,h5,h6')
    heads.forEach(h => {
      tocEntries.push({ level: Number(h.tagName.substring(1)), text: (h.textContent || '').trim(), id: h.id })
    })
    const metaObj = {}
    try {
      const titleTag = doc.querySelector('title')
      if (titleTag && titleTag.textContent && String(titleTag.textContent).trim()) metaObj.title = String(titleTag.textContent).trim()
    } catch (e) { /* ignore title extraction failures */ }
    return { html: doc.body.innerHTML, meta: metaObj, toc: tocEntries }
  } catch (err) { debugWarn('[htmlBuilder] parseHtml failed', err); return { html: raw || '', meta: {}, toc: [] } }
}

/**
 * Ensure highlight.js languages referenced in the markdown are registered.
 * This inspects fences, looks up the canonical mapping and invokes
 * `registerLanguage` as needed.  Errors are swallowed.
 *
 * @param {string} raw - markdown text to scan
 * @returns {Promise<void>}
 */
async function ensureLanguages(raw) {
  const langsArray = (md.detectFenceLanguagesAsync ? await md.detectFenceLanguagesAsync(raw || '', SUPPORTED_HLJS_MAP) : md.detectFenceLanguages(raw || '', SUPPORTED_HLJS_MAP))
  const langs = new Set(langsArray)
  const promises = []
  for (const l of langs) {
    try {
      const canonical = (SUPPORTED_HLJS_MAP.size && (SUPPORTED_HLJS_MAP.get(l) || SUPPORTED_HLJS_MAP.get(String(l).toLowerCase()))) || l
      try {
        promises.push(registerLanguage(canonical))
      } catch (err) { debugWarn('[htmlBuilder] ensureLanguages push canonical failed', err) }
      if (String(l) !== String(canonical)) {
        try {
          promises.push(registerLanguage(l))
        } catch (err) { debugWarn('[htmlBuilder] ensureLanguages push alias failed', err) }
      }
    } catch (err) { debugWarn('[htmlBuilder] ensureLanguages inner failed', err) }
  }
  try { await Promise.all(promises) } catch (err) { debugWarn('[htmlBuilder] ensureLanguages failed', err) }
}

/**
 * Convert markdown raw text to the normalized parsed object, registering
 * any required languages along the way.
 *
 * @param {string} raw - markdown source
 * @returns {Promise<ParsedPage>}
 */
async function parseMarkdown(raw) {
  await ensureLanguages(raw)
  if (md.parseMarkdownToHtml) {
    const parsed = await md.parseMarkdownToHtml(raw || '')
    if (!parsed || typeof parsed !== 'object') return { html: String(raw || ''), meta: {}, toc: [] }
    if (!Array.isArray(parsed.toc)) parsed.toc = []
    if (!parsed.meta) parsed.meta = {}
    return parsed
  }
  return { html: String(raw || ''), meta: {}, toc: [] }
}

/**
 * Given a page's fetched data, produce an <article> element, a TOC,
 * and slug calculations.  Handles HTML vs Markdown transparently.
 *
 * @param {Function} t - Localization function.
 * @param {{raw:string,isHtml?:boolean}} data - Data returned by `fetchMarkdown`.
 * @param {string} pagePath - Normalized path of the page (for link rewriting).
 * @param {string|null} anchor - Optional anchor to scroll to.
 * @param {string} contentBase - Base URL for resolving links and images.
 * @returns {Promise<ArticleResult>} - Promise resolving to the `ArticleResult` (article element, parsed data, toc, and slug info).
 */
export async function prepareArticle(t, data, pagePath, anchor, contentBase) {
  let parsed = null
  let streamingArticle = null
    if (data.isHtml) {
      try {
        const parser = getSharedParser()
        if (parser) {
          const doc = parser.parseFromString(data.raw || '', 'text/html')
          try { rewriteRelativeAssets(doc.body, pagePath, contentBase) } catch (err) { debugWarn('[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)', err) }
          parsed = parseHtml(doc.documentElement && doc.documentElement.outerHTML ? doc.documentElement.outerHTML : data.raw || '')
        } else {
          parsed = parseHtml(data.raw || '')
        }
      } catch (err) {
        parsed = parseHtml(data.raw || '')
      }
    } else {
      // Prefer streaming parse for very large markdown documents to keep
      // the main thread responsive. Falls back to the normal parse for
      // small documents or when streaming isn't available.
      const raw = data.raw || ''
      const STREAM_THRESHOLD = 64 * 1024
      if (raw && raw.length > STREAM_THRESHOLD && md.streamParseMarkdown) {
        try { await ensureLanguages(raw) } catch (e) {}
        streamingArticle = document.createElement('article')
        streamingArticle.className = 'nimbi-article content'
        const aggregatedToc = []
        let parsedMeta = {}
        try {
          await md.streamParseMarkdown(raw, (htmlChunk, info) => {
            try { if (info && info.meta) parsedMeta = Object.assign(parsedMeta, info.meta) } catch (e) {}
            try { if (info && Array.isArray(info.toc) && info.toc.length) aggregatedToc.push(...info.toc) } catch (e) {}
            try {
              scheduleDOMWrite(() => {
                try {
                  const parser = getSharedParser()
                  if (parser) {
                    const doc = parser.parseFromString(String(htmlChunk || ''), 'text/html')
                    const nodes = Array.from(doc.body.childNodes || [])
                    if (nodes.length) streamingArticle.append(...nodes)
                    else streamingArticle.insertAdjacentHTML('beforeend', htmlChunk || '')
                  } else {
                    const range = (document && typeof document.createRange === 'function') ? document.createRange() : null
                    if (range && typeof range.createContextualFragment === 'function') {
                      const frag = range.createContextualFragment(String(htmlChunk || ''))
                      streamingArticle.append(...Array.from(frag.childNodes))
                    } else {
                      streamingArticle.insertAdjacentHTML('beforeend', htmlChunk || '')
                    }
                  }
                } catch (e) { try { streamingArticle.insertAdjacentHTML('beforeend', htmlChunk || '') } catch (e2) {} }
              })
            } catch (e) {}
          }, { chunkSize: STREAM_THRESHOLD })
        } catch (e) { debugWarn('[htmlBuilder] streamParseMarkdown failed, falling back', e) }
        parsed = { html: streamingArticle.innerHTML, meta: parsedMeta || {}, toc: aggregatedToc }
      } else {
        parsed = await parseMarkdown(data.raw || '')
      }
    }

    let article
    if (streamingArticle) {
      article = streamingArticle
    } else {
      article = document.createElement('article')
      article.className = 'nimbi-article content'
      try {
        const _parser = getSharedParser && getSharedParser()
        if (_parser) {
          const doc = _parser.parseFromString(String(parsed.html || ''), 'text/html')
          const nodes = Array.from(doc.body.childNodes || [])
          if (nodes.length) article.replaceChildren(...nodes)
          else article.innerHTML = parsed.html
        } else {
          try {
            const range = (document && typeof document.createRange === 'function') ? document.createRange() : null
            if (range && typeof range.createContextualFragment === 'function') {
              const frag = range.createContextualFragment(String(parsed.html || ''))
              article.replaceChildren(...Array.from(frag.childNodes))
            } else {
              article.innerHTML = parsed.html
            }
          } catch (e) {
            article.innerHTML = parsed.html
          }
        }
      } catch (e) {
        try { article.innerHTML = parsed.html } catch (err) { debugWarn('[htmlBuilder] set article html failed', err) }
      }
    }
    try { rewriteRelativeAssets(article, pagePath, contentBase) } catch (err) { debugWarn('[htmlBuilder] rewriteRelativeAssets failed in prepareArticle', err) }
    try { addHeadingIds(article) } catch (err) { debugWarn('[htmlBuilder] addHeadingIds failed', err) }
    try {
      const codeEls = article.querySelectorAll('pre code, code[class]')
      codeEls.forEach(el => {
        try {
          const raw = (el.getAttribute && el.getAttribute('class')) || el.className || ''
          const cleaned = String(raw || '').replace(/\blanguage-undefined\b|\blang-undefined\b/g, '').trim()
          if (cleaned) {
            try { el.setAttribute && el.setAttribute('class', cleaned) } catch (err) { el.className = cleaned; debugWarn('[htmlBuilder] set element class failed', err) }
          } else {
            try { el.removeAttribute && el.removeAttribute('class') } catch (err) { el.className = ''; debugWarn('[htmlBuilder] remove element class failed', err) }
          }
        } catch (err) { debugWarn('[htmlBuilder] code element cleanup failed', err) }
      })
    } catch (err) { debugWarn('[htmlBuilder] processing code elements failed', err) }
    try { observeCodeBlocks(article) } catch (err) { debugWarn('[htmlBuilder] observeCodeBlocks failed', err) }

    lazyLoadImages(article, pagePath, contentBase)

    try {
      const imgs = article.querySelectorAll && article.querySelectorAll('img') || []
      imgs.forEach(img => {
        try {
          const parent = img.parentElement
          if (!parent || parent.tagName.toLowerCase() !== 'p') return
          if (parent.childNodes.length !== 1) return
          const figure = document.createElement('figure')
          figure.className = 'image'
          parent.replaceWith(figure)
          figure.appendChild(img)
        } catch (e) { /* ignore per-image failures */ }
      })
    } catch (err) { debugWarn('[htmlBuilder] wrap images in Bulma image helper failed', err) }

    try {
      const tables = article.querySelectorAll && article.querySelectorAll('table') || []
      tables.forEach(tb => {
        try {
          if (tb.classList) {
            if (!tb.classList.contains('table')) tb.classList.add('table')
          } else {
            const cur = tb.getAttribute && tb.getAttribute('class') ? tb.getAttribute('class') : ''
            const classes = String(cur || '').split(/\s+/).filter(Boolean)
            if (classes.indexOf('table') === -1) classes.push('table')
            try { tb.setAttribute && tb.setAttribute('class', classes.join(' ')) } catch (e) { tb.className = classes.join(' ') }
          }
        } catch (e) { /* ignore per-table failures */ }
      })
    } catch (err) { debugWarn('[htmlBuilder] add Bulma table class failed', err) }

    const { topH1, h1Text, slugKey } = computeSlug(parsed, article, pagePath, anchor)

    try {
      if (topH1 && parsed && parsed.meta && (parsed.meta.author || parsed.meta.date)) {
        const existing = topH1.parentElement && topH1.parentElement.querySelector && topH1.parentElement.querySelector('.nimbi-article-subtitle')
        if (!existing) {
          const author = parsed.meta.author ? String(parsed.meta.author).trim() : ''
          const dateRaw = parsed.meta.date ? String(parsed.meta.date).trim() : ''
          let dateText = ''
          try {
            const d = new Date(dateRaw)
            if (dateRaw && !isNaN(d.getTime())) dateText = d.toLocaleDateString()
            else dateText = dateRaw
          } catch (e) { dateText = dateRaw }
          const pieces = []
          if (author) pieces.push(author)
          if (dateText) pieces.push(dateText)
          if (pieces.length) {
              const sub = document.createElement('p')
              const authorClean = pieces[0] ? String(pieces[0]).replace(/"/g, '').trim() : ''
              const rest = pieces.slice(1)
              sub.className = 'nimbi-article-subtitle is-6 has-text-grey-light'

              // author on its own span
              if (authorClean) {
                const aSpan = document.createElement('span')
                aSpan.className = 'nimbi-article-author'
                aSpan.textContent = authorClean
                sub.appendChild(aSpan)
              }

              // remaining metadata (date) in its own span; reading-time will be appended by seoManager
              if (rest.length) {
                const metaSpan = document.createElement('span')
                metaSpan.className = 'nimbi-article-meta'
                metaSpan.textContent = rest.join(' • ')
                sub.appendChild(metaSpan)
              }

              try { topH1.parentElement.insertBefore(sub, topH1.nextSibling) } catch (e) { try { topH1.insertAdjacentElement('afterend', sub) } catch (e2) { /* ignore */ } }
          }
        }
      }
    } catch (e) { /* ignore subtitle insertion errors */ }

    try {
      await rewriteAnchorsWorker(article, contentBase, pagePath)
    } catch (err) {
      _hbWarn('[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread', err)
      await rewriteAnchors(article, contentBase, pagePath)
    }

    const toc = buildTocElement(t, parsed.toc, pagePath)
    return { article, parsed, toc, topH1, h1Text, slugKey }
  }

/**
 * Execute any script tags contained within an `article` element.
 * This should be called after the `article` is appended to the document
 * so that scripts which query the DOM find their target elements.
 * @param {HTMLElement} article - Article element containing script tags.
 * @returns {void}
 */
export function executeEmbeddedScripts(article) {
  if (!article || !article.querySelectorAll) return
  try {
    const scripts = Array.from(article.querySelectorAll('script'))
    for (const s of scripts) {
      try {
        const newScript = document.createElement('script')
        for (const attr of Array.from(s.attributes || [])) {
          try { newScript.setAttribute(attr.name, attr.value) } catch (e) {}
        }
        if (!s.src) {
          const inline = s.textContent || ''
          let executed = false
          try {
            const fn = new Function(inline)
            fn()
            executed = true
          } catch (e) {
            executed = false
          }
          if (executed) {
            s.parentNode && s.parentNode.removeChild(s)
            try { debugInfo('[htmlBuilder] executed inline script via Function') } catch (e) {}
            continue
          }
          try { newScript.type = 'module' } catch (e) {}
          newScript.textContent = inline
        }
        if (s.src) {
          try {
            const exists = document.querySelector && document.querySelector(`script[src="${s.src}"]`)
            if (exists) {
              s.parentNode && s.parentNode.removeChild(s)
              continue
            }
          } catch (e) { /* ignore query failures */ }
        }
        const srcLabel = s.src || '<inline>'
        newScript.addEventListener('error', (ev) => {
          try { debugWarn('[htmlBuilder] injected script error', { src: srcLabel, ev }) } catch (e) {}
        })
        newScript.addEventListener('load', () => {
          try { debugInfo('[htmlBuilder] injected script loaded', { src: srcLabel, hasNimbi: !!(window && window.nimbiCMS) }) } catch (e) {}
        })
        try {
          ;(document.head || document.body || document.documentElement).appendChild(newScript)
        } catch (appendErr) {
          try {
            try { newScript.type = 'text/javascript' } catch (e) {}
            ;(document.head || document.body || document.documentElement).appendChild(newScript)
          } catch (appendErr2) {
            try { debugWarn('[htmlBuilder] injected script append failed, skipping', { src: srcLabel, err: appendErr2 }) } catch (e) {}
          }
        }
        s.parentNode && s.parentNode.removeChild(s)
        try { debugInfo('[htmlBuilder] executed injected script', srcLabel) } catch (e) {}
      } catch (e) { debugWarn('[htmlBuilder] execute injected script failed', e) }
    }
  } catch (e) { /* ignore */ }
}

/**
 * Render a simple "not found" message into the provided container.
 * Placed immediately above export for TypeDoc.
 * @param {HTMLElement|null} contentWrap - Container where the message will be rendered; may be null.
 * @param {Function|null} t - Translation function that accepts a key and returns a localized string.
 * @param {Error|null} e - Optional error whose message may be displayed to the user.
 * @returns {void}
 */
export function renderNotFound(contentWrap, t, e) {
    if (contentWrap) {
      try {
        if (typeof contentWrap.replaceChildren === 'function') contentWrap.replaceChildren()
        else contentWrap.innerHTML = ''
      } catch (err) {
        try { contentWrap.innerHTML = '' } catch (_) {}
      }
    }
    const notFound = document.createElement('article')
    notFound.className = 'nimbi-article content nimbi-not-found'
    const h = document.createElement('h1')
    h.textContent = t ? t('notFound') || 'Page not found' : 'Page not found'
    const p = document.createElement('p')
    p.textContent = e && e.message ? String(e.message) : 'Failed to resolve the requested page.'
    notFound.appendChild(h)
    notFound.appendChild(p)
    if (contentWrap && contentWrap.appendChild) contentWrap.appendChild(notFound)
    // If hosts choose to disable the configured `notFoundPage` (set to
    // `null`), render a small inline helper linking back to the site's
    // home page so users can recover from a missing route without a
    // separate `_404.md` file.
    try {
      if (!notFoundPage) {
        try {
          const linkP = document.createElement('p')
          const label = t ? (t('goHome') || 'Go back to') : 'Go back to'
          linkP.textContent = label + ' '
          const a = document.createElement('a')
          try { a.href = buildPageUrl(homePage) } catch (err) { a.href = buildPageUrl(homePage || '') }
          a.textContent = t ? (t('home') || 'Home') : 'Home'
          linkP.appendChild(a)
          if (contentWrap && contentWrap.appendChild) contentWrap.appendChild(linkP)
        } catch (_) {}
      }
    } catch (_) {}
  try {
    try { markNotFound({ title: t ? (t('notFound') || 'Not Found') : 'Not Found', description: t ? (t('notFoundDescription') || '') : '' }, notFoundPage, t ? (t('notFound') || 'Not Found') : 'Not Found', t ? (t('notFoundDescription') || '') : '') } catch (err) {}
  } catch (err) {}
    try {
      // Optional client-side redirect to a known 404 path. Hosts can set
      // `window.__nimbiNotFoundRedirect = '/404.html'` (or similar) to enable.
      try {
        const redirectPath = (typeof window !== 'undefined' && window.__nimbiNotFoundRedirect) ? String(window.__nimbiNotFoundRedirect).trim() : null
        if (redirectPath) {
          try {
            const target = new URL(redirectPath, location.origin).toString()
            if ((location.href || '').split('#')[0] !== target) {
              try { location.replace(target) } catch (e) { location.href = target }
            }
          } catch (e) { /* invalid URL, ignore */ }
        }
      } catch (e) {}
    } catch (err) {}
  }

 
const _anchorManager = makeWorkerManagerFromRaw(anchorWorkerCode, AnchorModule && AnchorModule.handleAnchorWorkerMessage, 'anchor')

/**
 * @returns {Worker|null}
 */
export function initAnchorWorker() { return _anchorManager.get() }

function _sendToAnchorWorker(msg) { return _anchorManager.send(msg, 2000) }

/**
 * Rewrite anchors using the dedicated anchor worker. Enforce worker usage —
 * reject when the worker is unavailable to make bundling and tree-shaking
 * consistent.
 */
export async function rewriteAnchorsWorker(article, contentBase, pagePath) {
  const w = initAnchorWorker()
  if (!w) throw new Error('anchor worker unavailable')
  if (!article || typeof article.innerHTML !== 'string') throw new Error('invalid article element')
  const html = String(article.innerHTML)
  const res = await _sendToAnchorWorker({ type: 'rewriteAnchors', html, contentBase, pagePath })
  if (res && typeof res === 'string') {
    try {
      const _parser2 = getSharedParser && getSharedParser()
      if (_parser2) {
        const doc = _parser2.parseFromString(String(res || ''), 'text/html')
        const nodes = Array.from(doc.body.childNodes || [])
        if (nodes.length) article.replaceChildren(...nodes)
        else article.innerHTML = res
      } else {
        try {
          const range = (document && typeof document.createRange === 'function') ? document.createRange() : null
          if (range && typeof range.createContextualFragment === 'function') {
            const frag = range.createContextualFragment(String(res || ''))
            article.replaceChildren(...Array.from(frag.childNodes))
          } else {
            article.innerHTML = res
          }
        } catch (e) {
          article.innerHTML = res
        }
      }
    } catch (e) { debugWarn('[htmlBuilder] applying rewritten anchors failed', e) }
  }
}

 
/**
 * Exported helper aliases (intended for tests and advanced usage).
 *
 * `_parseHtml(raw)` -> Parse raw HTML into a `ParsedPage`.
 * `_parseMarkdown(raw)` -> Parse markdown source into a `ParsedPage` (async).
 * `_ensureLanguages(raw)` -> Register highlight.js languages referenced in markdown (async).
 * `_computeSlug(parsed, article, pagePath, anchor)` -> Compute article slug and update slug mappings.
 *
 * Note: these are thin aliases to the internal implementations above.
 */
/**
 * Parse raw HTML and return the normalized parsed page object.
 * @param {string} raw
 * @returns {ParsedPage}
 */
export { parseHtml as _parseHtml }

/**
 * Parse markdown source into a parsed page used by the renderer.
 * @param {string} raw
 * @returns {Promise<ParsedPage>}
 */
export { parseMarkdown as _parseMarkdown }

/**
 * Ensure highlight.js languages referenced in the parsed content are registered.
 * @param {ParsedPage} parsed
 * @returns {Promise<void>}
 */
export { ensureLanguages as _ensureLanguages }

/**
 * Rewrite anchors in an article element to SPA links.
 * @param {HTMLElement} article
 * @param {string} contentBase
 * @param {string} [pagePath]
 * @returns {Promise<void>}
 */
export { rewriteAnchors }

/**
 * Alias of `rewriteAnchors` for test/advanced usage.
 * @returns {Promise<void>}
 */
export { rewriteAnchors as _rewriteAnchors }

/**
 * Compute an article slug and update slug mappings as needed.
 * @param {ParsedPage} parsed
 * @param {HTMLElement} article
 * @param {string} pagePath
 * @param {string|null} anchor
 * @returns {string}
 */
export { computeSlug as _computeSlug }

/**
 * Worker-based anchor rewrite helper export.
 * @returns {Worker|null}
 */
export { rewriteAnchorsWorker as _rewriteAnchorsWorker }



/**
 * Attach a click handler to a generated TOC so clicks perform SPA navigation.
 * @param {HTMLElement} toc - Table-of-contents element to attach SPA navigation handlers to.
 * @returns {void}
 */
export function attachTocClickHandler(toc) {
    try {
      toc.addEventListener('click', (ev) => {
        const a = ev.target && ev.target.closest ? ev.target.closest('a') : null
        if (!a) return
        const href = a.getAttribute('href') || ''
        try {
          // Use the central href parser so we correctly handle both canonical
          // and cosmetic forms (e.g. "?page=foo" and "#/foo#anchor?x=1").
          const parsedHref = parseHrefToRoute(href)
          const pageParam = parsedHref && parsedHref.page ? parsedHref.page : null
          const hash = parsedHref && parsedHref.anchor ? parsedHref.anchor : null
          if (!pageParam && !hash) return
          ev.preventDefault()

          let currentPage = null
          try { if (history && history.state && history.state.page) currentPage = history.state.page } catch (err) { currentPage = null; debugWarn('[htmlBuilder] access history.state failed', err) }
          try { if (!currentPage) currentPage = (new URL(location.href)).searchParams.get('page') } catch (err) { debugWarn('[htmlBuilder] parse current location failed', err) }

          if ((!pageParam && hash) || (pageParam && currentPage && String(pageParam) === String(currentPage))) {
            try {
              if (!pageParam && hash) {
                try { history.replaceState(history.state, '', (location.pathname || '') + (location.search || '') + (hash ? '#' + encodeURIComponent(hash) : '')) } catch (err) { debugWarn('[htmlBuilder] history.replaceState failed', err) }
              } else {
                try { history.replaceState({ page: currentPage || pageParam }, '', fullCosmetic(currentPage || pageParam, hash)) } catch (err) { debugWarn('[htmlBuilder] history.replaceState failed', err) }
              }
            } catch (err) { debugWarn('[htmlBuilder] update history for anchor failed', err) }
            try { ev.stopImmediatePropagation && ev.stopImmediatePropagation(); ev.stopPropagation && ev.stopPropagation() } catch (err) { debugWarn('[htmlBuilder] stopPropagation failed', err) }
            try { scrollToAnchorOrTop(hash) } catch (err) { debugWarn('[htmlBuilder] scrollToAnchorOrTop failed', err) }
            return
          }

          history.pushState({ page: pageParam }, '', fullCosmetic(pageParam, hash))
          try {
            if (typeof window !== 'undefined' && typeof window.renderByQuery === 'function') {
              try { window.renderByQuery() } catch (err) { debugWarn('[htmlBuilder] window.renderByQuery failed', err) }
            } else if (typeof window !== 'undefined') {
              try { window.dispatchEvent(new PopStateEvent('popstate')) } catch (err) { debugWarn('[htmlBuilder] dispatch popstate failed', err) }
            } else {
              try { renderByQuery() } catch (err) { debugWarn('[htmlBuilder] renderByQuery failed', err) }
            }
          } catch (err) { debugWarn('[htmlBuilder] SPA navigation invocation failed', err) }
        } catch (err) { /* ignore non-URL hrefs */ debugWarn('[htmlBuilder] non-URL href in attachTocClickHandler', err) }
      })
    } catch (e) { debugWarn('[htmlBuilder] attachTocClickHandler failed', e) }
  }



/**
 * Scroll the primary CMS container to either the top or to a specific
 * element with the given `id`.  When an anchor is supplied the helper
 * attempts to position the element at the top of the scroll viewport;
 * otherwise it simply resets the scroll offset to zero.  A small delay is
 * used to ensure the DOM has been updated before performing the scroll.
 *
 * @param {string|null} anchor - element id (without '#') or `null` to scroll
 *                               to the top.
 */
/**
 * Scroll to a specific anchor ID inside the CMS container or to top.
 * @param {string|null} anchor - Element id (without '#') or null to scroll to top.
 * @returns {void}
 */
export function scrollToAnchorOrTop(anchor) {
    const containerEl = document.querySelector('.nimbi-cms') || null
    if (anchor) {
      const el = document.getElementById(anchor)
      if (el) {
        try {
          const doScroll = () => {
              try {
                if (containerEl && containerEl.scrollTo && containerEl.contains(el)) {
                  const top = el.getBoundingClientRect().top - containerEl.getBoundingClientRect().top + containerEl.scrollTop
                  containerEl.scrollTo({ top, behavior: 'smooth' })
                  } else {
                  try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }) } catch (err) { try { el.scrollIntoView() } catch (err2) { debugWarn('[htmlBuilder] scrollIntoView failed', err2) } }
                }
              } catch (err) {
                try { el.scrollIntoView() } catch (err2) { debugWarn('[htmlBuilder] final scroll fallback failed', err2) }
              }
          }
          try { requestAnimationFrame(() => setTimeout(doScroll, 50)) } catch (err) { debugWarn('[htmlBuilder] scheduling scroll failed', err); setTimeout(doScroll, 50) }
        } catch (err) { try { el.scrollIntoView() } catch (err2) { debugWarn('[htmlBuilder] final scroll fallback failed', err2) } ; debugWarn('[htmlBuilder] doScroll failed', err) }
      }
    } else {
      try {
        if (containerEl && containerEl.scrollTo) containerEl.scrollTo({ top: 0, behavior: 'smooth' })
        else window.scrollTo(0, 0)
      } catch (err) { try { window.scrollTo(0, 0) } catch (err2) { debugWarn('[htmlBuilder] window.scrollTo failed', err2) } ; debugWarn('[htmlBuilder] scroll to top failed', err) }
    }
  }

/**
 * Create or update a scroll-to-top button and toggle TOC/menu label
 * visibility. Observes the supplied `topH1` element if present; on pages
 * without a top heading we fall back to a simple scroll-position listener.
 *
 * @param {HTMLElement} article - The article element produced by `prepareArticle`.
 * @param {HTMLElement|null} topH1 - The top-level H1 element for the article, if present.
 * @param {object} opts - Options object controlling rendering behavior.
 * @returns {void}
 */
export function ensureScrollTopButton(article, topH1, { mountOverlay = null, container = null, mountEl = null, navWrap = null, t = null } = {}) {
  try {
    const tFn = t || (k => (typeof k === 'string' ? k : ''))
    const containerEl = container || document.querySelector('.nimbi-cms')
    const mountElLocal = mountEl || document.querySelector('.nimbi-mount')
    const mountOverlayEl = mountOverlay || document.querySelector('.nimbi-overlay')
    const navWrapEl = navWrap || document.querySelector('.nimbi-nav-wrap')
    const existingBtn = document.querySelector('.nimbi-scroll-top')
    let btn = existingBtn

    if (!btn) {
      btn = document.createElement('button')
      btn.className = 'nimbi-scroll-top button is-primary is-rounded is-small'
      btn.setAttribute('aria-label', tFn('scrollToTop'))
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>'
      try {
        if (mountOverlayEl && mountOverlayEl.appendChild) mountOverlayEl.appendChild(btn)
        else if (containerEl && containerEl.appendChild) containerEl.appendChild(btn)
        else if (mountElLocal && mountElLocal.appendChild) mountElLocal.appendChild(btn)
        else document.body.appendChild(btn)
      } catch (err) {
        try { document.body.appendChild(btn) } catch (err2) { debugWarn('[htmlBuilder] append scroll top button failed', err2) }
      }
      try {
        try { registerThemedElement(btn) } catch (e) { /* ignore */ }
      } catch (err) { debugWarn('[htmlBuilder] set scroll-top button theme registration failed', err) }
      btn.addEventListener('click', () => {
        try {
          if (container && container.scrollTo) container.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
          else if (mountEl && mountEl.scrollTo) mountEl.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
          else window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        } catch (err) {
          try { if (container) container.scrollTop = 0 } catch (e2) { debugWarn('[htmlBuilder] fallback container scrollTop failed', e2) }
          try { if (mountEl) mountEl.scrollTop = 0 } catch (e3) { debugWarn('[htmlBuilder] fallback mountEl scrollTop failed', e3) }
          try { document.documentElement.scrollTop = 0 } catch (e4) { debugWarn('[htmlBuilder] fallback document scrollTop failed', e4) }
        }
      })
    }

    const tocLabel = (navWrapEl && navWrapEl.querySelector) ? navWrapEl.querySelector('.menu-label') : null
    if (!topH1) {
      btn.classList.remove('show')
      if (tocLabel) tocLabel.classList.remove('show')
      const root = (container instanceof Element) ? container : ((mountEl instanceof Element) ? mountEl : window)
      const onScroll = () => {
        try {
          const scrollTop = (root === window) ? window.scrollY : (root.scrollTop || 0)
          const shouldShow = scrollTop > 10
          if (shouldShow) {
            btn.classList.add('show')
            if (tocLabel) tocLabel.classList.add('show')
          } else {
            btn.classList.remove('show')
            if (tocLabel) tocLabel.classList.remove('show')
          }
        } catch (err) { debugWarn('[htmlBuilder] onScroll handler failed', err) }
      }
      safe(() => root.addEventListener('scroll', rafThrottle(onScroll)))
      onScroll()
    } else {
      if (!btn._nimbiObserver) {
        if (typeof globalThis !== 'undefined' && typeof globalThis.IntersectionObserver !== 'undefined') {
          const ObsCtor = globalThis.IntersectionObserver
          const obs = new ObsCtor((entries) => {
            for (const entry of entries) {
              if (entry.target instanceof Element) {
                if (entry.isIntersecting) {
                  btn.classList.remove('show')
                  if (tocLabel) tocLabel.classList.remove('show')
                } else {
                  btn.classList.add('show')
                  if (tocLabel) tocLabel.classList.add('show')
                }
              }
            }
          }, { root: (container instanceof Element) ? container : ((mountEl instanceof Element) ? mountEl : null), threshold: 0 })
          btn._nimbiObserver = obs
        } else {
          // No IntersectionObserver available in this environment; mark observer as null
          btn._nimbiObserver = null
        }
      }
      try { if (btn._nimbiObserver && typeof btn._nimbiObserver.disconnect === 'function') btn._nimbiObserver.disconnect() } catch (err) { debugWarn('[htmlBuilder] observer disconnect failed', err) }
      try { if (btn._nimbiObserver && typeof btn._nimbiObserver.observe === 'function') btn._nimbiObserver.observe(topH1) } catch (err) { debugWarn('[htmlBuilder] observer observe failed', err) }
      try {
        const checkIntersect = () => {
          try {
            const rootRect = (containerEl instanceof Element) ? containerEl.getBoundingClientRect() : { top: 0, bottom: window.innerHeight }
            const elRect = topH1.getBoundingClientRect()
            const isIntersecting = !(elRect.bottom < rootRect.top || elRect.top > rootRect.bottom)
            if (isIntersecting) {
              btn.classList.remove('show')
              if (tocLabel) tocLabel.classList.remove('show')
            } else {
              btn.classList.add('show')
              if (tocLabel) tocLabel.classList.add('show')
            }
          } catch (err) { debugWarn('[htmlBuilder] checkIntersect failed', err) }
        }
        checkIntersect()
        if (!(typeof globalThis !== 'undefined' && typeof globalThis.IntersectionObserver !== 'undefined')) {
          setTimeout(checkIntersect, 100)
        }
      } catch (err) { debugWarn('[htmlBuilder] checkIntersect outer failed', err) }
    }
  } catch (err) { debugWarn('[htmlBuilder] ensureScrollTopButton failed', err) }
}