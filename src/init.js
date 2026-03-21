/* Initialization logic extracted from nimbi-cms.js to keep the top-level
 * entrypoint small.  This module exports the `initCMS` function which is
 * responsible for validating options, constructing the DOM scaffolding, and
 * delegating navigation and UI behaviour to helper modules.
 */

import { fetchMarkdown, setContentBase, setNotFoundPage, setLanguages } from './slugManager.js'
import * as router from './router.js'
import { parseMarkdownToHtml } from './markdown.js'
import * as markdown from './markdown.js'
import { buildNav } from './nav.js'
import { createUI } from './ui.js'
import { parseHrefToRoute } from './utils/urlHelper.js'
import { injectSeoForPage, setSeoMap } from './seoManager.js'
import { runHooks } from './hookManager.js'
import { t, loadL10nFile, setLang } from './l10nManager.js'
import { ensureBulma, setStyle, registerThemedElement } from './bulmaManager.js'

/**
 * Parse well-known `initCMS` options from the current page URL's query
 * string. Values are converted to the expected types where possible.
 *
 * Supported query params:
 * - `contentPath` (string)
 * - `searchIndex` (boolean: true|false|1|0)
 * - `searchIndexMode` ('eager'|'lazy')
 * - `defaultStyle` ('light'|'dark')
 * - `bulmaCustomize` (string)
 * - `lang` (string)
 * - `l10nFile` (string or 'null')
 * - `cacheTtlMinutes` (number)
 * - `cacheMaxEntries` (integer)
 * - `homePage` (string)
 * - `notFoundPage` (string)
 * - `availableLanguages` (comma-separated list)
 *
 * The returned object contains only keys for params that were present and
 * successfully parsed.
 *
 * @param {string} [queryString] optional query string (for tests); defaults to window.location.search
 * @returns {Object} - Parsed options object containing any recognized and parsed query parameters.
 */
export function parseInitOptionsFromQuery(queryString) {
  try {
    let qs = typeof queryString === 'string' ? queryString : (typeof window !== 'undefined' && window.location ? window.location.search : '')

  if (!qs && typeof window !== 'undefined' && window.location && window.location.hash) {
    try {
      const parsed = parseHrefToRoute(window.location.href)
      if (parsed && parsed.params) qs = parsed.params.startsWith('?') ? parsed.params : ('?' + parsed.params)
      else {
        const hash = window.location.hash
        const idx = hash.indexOf('?')
        if (idx !== -1) qs = hash.slice(idx)
      }
    } catch (e) {
      const hash = window.location.hash
      const idx = hash.indexOf('?')
      if (idx !== -1) qs = hash.slice(idx)
    }
  }

  if (!qs) return {}
  const params = new URLSearchParams(qs.startsWith('?') ? qs.slice(1) : qs)
    const out = {}

    const parseBool = (v) => {
      if (v == null) return undefined
      const s = String(v).toLowerCase()
      if (s === '1' || s === 'true' || s === 'yes') return true
      if (s === '0' || s === 'false' || s === 'no') return false
      return undefined
    }

    if (params.has('contentPath')) out.contentPath = params.get('contentPath')
    if (params.has('searchIndex')) {
      const b = parseBool(params.get('searchIndex'))
      if (typeof b === 'boolean') out.searchIndex = b
    }
    if (params.has('searchIndexMode')) {
      const v = params.get('searchIndexMode')
      if (v === 'eager' || v === 'lazy') out.searchIndexMode = v
    }
    if (params.has('defaultStyle')) {
      const v = params.get('defaultStyle')
      if (v === 'light' || v === 'dark' || v === 'system') out.defaultStyle = v
    }
    if (params.has('bulmaCustomize')) {
      out.bulmaCustomize = params.get('bulmaCustomize')
    }
    if (params.has('lang')) out.lang = params.get('lang')
    if (params.has('l10nFile')) {
      const v = params.get('l10nFile')
      out.l10nFile = v === 'null' ? null : v
    }
    if (params.has('cacheTtlMinutes')) {
      const n = Number(params.get('cacheTtlMinutes'))
      if (Number.isFinite(n) && n >= 0) out.cacheTtlMinutes = n
    }
    if (params.has('cacheMaxEntries')) {
      const n = Number(params.get('cacheMaxEntries'))
      if (Number.isInteger(n) && n >= 0) out.cacheMaxEntries = n
    }
    if (params.has('homePage')) out.homePage = params.get('homePage')
    if (params.has('navigationPage')) out.navigationPage = params.get('navigationPage')
    if (params.has('notFoundPage')) out.notFoundPage = params.get('notFoundPage')
    if (params.has('availableLanguages')) {
      out.availableLanguages = params.get('availableLanguages').split(',').map(s => s.trim()).filter(Boolean)
    }
    if (params.has('indexDepth')) {
      const n = Number(params.get('indexDepth'))
      if (Number.isInteger(n) && (n === 1 || n === 2 || n === 3)) out.indexDepth = n
    }
    if (params.has('noIndexing')) {
      const v = params.get('noIndexing') || ''
      const arr = v.split(',').map(s => s.trim()).filter(Boolean)
      if (arr.length) out.noIndexing = arr
    }

    return out
  } catch (err) {
    return {}
  }
}

/**
 * Rejects suspicious paths that could lead to path traversal or external URLs.
 * Returns true if the path is safe to use as a content path segment.
 * Safe rules:
 *  - must be a string
 *  - must not contain ".." segments
 *  - must not be an absolute URL (protocol://) or start with //
 *  - must not start with a leading slash (we normalize to relative)
 */
function isSafeContentPath(p) {
  if (typeof p !== 'string') return false
  if (!p.trim()) return false
  if (p.includes('..')) return false
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(p)) return false // protocol://
  if (p.startsWith('//')) return false
  if (p.startsWith('/') || /^[A-Za-z]:\\/.test(p)) return false
  return true
}

/**
 * Validates a page path for `homePage` / `notFoundPage`.
 * Rules:
 *  - must be a string
 *  - must not contain ".." segments
 *  - must not be an absolute URL (protocol://) or start with //
 *  - must not start with a leading slash (we normalize to relative)
 *  - path segments may include A-Za-z0-9._- and may contain single-level
 *    subpaths (e.g. "assets/brochure.md").
 */
function isSafePagePath(name) {
  if (typeof name !== 'string') return false
  const s = name.trim()
  if (!s) return false
  if (s.includes('..')) return false
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(s)) return false // protocol://
  if (s.startsWith('//')) return false
  if (s.startsWith('/') || /^[A-Za-z]:\\/.test(s)) return false
  const normalized = s.replace(/^\.\//, '')
  if (!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(normalized)) return false
  return true
}


/**
 * Currently selected highlight theme name. Mutable export for runtime
 * customization; changes affect subsequent codeblock rendering.
 * @type {string}
 */
export let currentHighlightTheme = 'monokai'
/**
 * Document title at initialization time. Useful for restoring title on navigation.
 * @type {string}
 */
export let initialDocumentTitle = ''

/**
 * Initialize the CMS in a host page.
 *
 * Throws a `TypeError` when options are of the wrong type so configuration
 * mistakes are surfaced early (e.g. passing a number for `contentPath`).
 *
 * @param {Record<string,unknown>} [options={}] - Initialization options provided by the caller.
 * @param {boolean} [options.allowUrlPathOverrides=false] - advanced opt-in that
 *   allows `contentPath`, `homePage`, and `notFoundPage` to be overridden via
 *   URL query parameters. This is disabled by default for security; enabling
 *   it should only be done by trusted host pages.
 * @param {string|Element} options.el - mount point selector or element
 * @param {string} [options.contentPath='/content'] - URL path to content
 * @param {number} [options.crawlMaxQueue=1000] - maximum directory queue length for slug crawling (see docs)
 * @param {boolean} [options.searchIndex=true] - build a client-side search index (adds search box to navbar)
 * @param {('eager'|'lazy')} [options.searchIndexMode='eager'] - when to build the search index
 * @param {('light'|'dark')} [options.defaultStyle='light'] - initial light/dark mode
 * @param {string} [options.bulmaCustomize='none'] - Bulma customization flag
 * @param {string} [options.lang] - UI language code
 * @param {string|null} [options.l10nFile] - path to localization file
 * @param {number} [options.cacheTtlMinutes=5] - resolution cache time‑to‑live in minutes
 * @param {number} [options.cacheMaxEntries] - maximum number of resolution cache entries (defaults to module constant)
 * @param {Array<Record<string,unknown>>} [options.markdownExtensions] - list of marked extensions to register on init
 * @param {string} [options.homePage] - Sets the site’s home page. Can be a `.md` or `.html` file. If not set, falls back to `'_home.md'`.
 * @param {string} [options.notFoundPage] - Sets the site's not-found page. Can be a `.md` or `.html` file. If not set, defaults to `'_404.md'`.
 * @param {boolean} [options.skipRootReadme=false] - when true, the indexer will skip link discovery inside a repository-root `README.md`; set to `false` to treat the root README like other content pages.
 * @returns {Promise<void>} resolves once the initial page has rendered
 */
export async function initCMS(options = {}) {
  const debug = typeof window !== 'undefined' && window.__nimbiCMSDebug
  if (debug) {
    try {
      console.info('[nimbi-cms] initCMS called', { options })
    } catch (_) {}
  }

  if (!options || typeof options !== 'object') {
    throw new TypeError('initCMS(options): options must be an object')
  }

  const queryOpts = parseInitOptionsFromQuery()
    if (queryOpts && (queryOpts.contentPath || queryOpts.homePage || queryOpts.notFoundPage || queryOpts.navigationPage)) {
    if (options && options.allowUrlPathOverrides === true) {
      try {
        console.warn('[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage/navigationPage')
      } catch (e) { console.warn('[nimbi-cms] allowUrlPathOverrides logging failed', e) }
    } else {
      try {
        console.warn('[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage/navigationPage')
      } catch (e) { console.warn('[nimbi-cms] logging ignore of URL overrides failed', e) }
      delete queryOpts.contentPath
      delete queryOpts.homePage
      delete queryOpts.notFoundPage
        delete queryOpts.navigationPage
    }
  }
  const finalOptions = Object.assign({}, queryOpts, options)
  if (queryOpts && typeof queryOpts.bulmaCustomize === 'string' && queryOpts.bulmaCustomize.trim()) {
    finalOptions.bulmaCustomize = queryOpts.bulmaCustomize
  }

  let {
    el,
    contentPath = '/content',
          crawlMaxQueue = 1000,
    searchIndex: searchEnabled = true,
    searchIndexMode = 'eager',
    indexDepth = 1,
    noIndexing = undefined,
    defaultStyle = 'light',
    bulmaCustomize = 'none',
    lang = undefined,
    l10nFile = null,
    cacheTtlMinutes = 5,
    cacheMaxEntries,
    markdownExtensions,
    availableLanguages,
    homePage = '_home.md',
    notFoundPage = '_404.md',
    navigationPage = '_navigation.md',
    exposeSitemap = true
  } = finalOptions

  try {
    if (typeof homePage === 'string' && homePage.startsWith('./')) homePage = homePage.replace(/^\.\//, '')
  } catch (_e) {}
  try {
    if (typeof notFoundPage === 'string' && notFoundPage.startsWith('./')) notFoundPage = notFoundPage.replace(/^\.\//, '')
  } catch (_e) {}
  try {
    if (typeof navigationPage === 'string' && navigationPage.startsWith('./')) navigationPage = navigationPage.replace(/^[.]\//, '')
  } catch (_e) {}

  

  const { navbarLogo = 'favicon' } = finalOptions

  const { skipRootReadme = false } = finalOptions

  const renderInitError = (err) => {
    try {
      const mount = document.querySelector(el)
      if (mount && mount instanceof Element) {
        mount.innerHTML = `<div style="padding:1rem;font-family:system-ui, sans-serif;color:#b00;background:#fee;border:1px solid #b00;">` +
          `<strong>NimbiCMS failed to initialize:</strong><br><pre style="white-space:pre-wrap;">${String(err)}</pre></div>`
      }
    } catch (_e) {
    }
  }

  if (finalOptions.contentPath != null) {
    if (!isSafeContentPath(finalOptions.contentPath)) {
      throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns')
    }
  }
  if (homePage != null) {
    if (!isSafePagePath(homePage)) {
      throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html')
    }
  }
  if (notFoundPage != null) {
    if (!isSafePagePath(notFoundPage)) {
      throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html')
    }
  }
  if (navigationPage != null) {
    if (!isSafePagePath(navigationPage)) {
      throw new TypeError('initCMS(options): "navigationPage" must be a relative path (no leading "/") ending with .md or .html')
    }
  }

  if (!el) {
    throw new Error('el is required')
  }

  let mountEl = el
  if (typeof el === 'string') {
    mountEl = document.querySelector(el)
    if (!mountEl) throw new Error(`el selector "${el}" did not match any element`)
  } else if (!(el instanceof Element)) {
    throw new TypeError('el must be a CSS selector string or a DOM element')
  }

  if (typeof contentPath !== 'string' || !contentPath.trim()) {
    throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided')
  }

  if (typeof searchEnabled !== 'boolean') {
    throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided')
  }

  if (searchIndexMode != null && searchIndexMode !== 'eager' && searchIndexMode !== 'lazy') {
    throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided')
  }

  if (indexDepth != null && (indexDepth !== 1 && indexDepth !== 2 && indexDepth !== 3)) {
    throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided')
  }

  if (defaultStyle !== 'light' && defaultStyle !== 'dark' && defaultStyle !== 'system') {
    throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"')
  }

  if (bulmaCustomize != null && typeof bulmaCustomize !== 'string') {
    throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided')
  }

  if (lang != null && typeof lang !== 'string') {
    throw new TypeError('initCMS(options): "lang" must be a string when provided')
  }

  if (l10nFile != null && typeof l10nFile !== 'string') {
    throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided')
  }

  if (cacheTtlMinutes != null && (typeof cacheTtlMinutes !== 'number' || !Number.isFinite(cacheTtlMinutes) || cacheTtlMinutes < 0)) {
    throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided')
  }

  if (cacheMaxEntries != null && (typeof cacheMaxEntries !== 'number' || !Number.isInteger(cacheMaxEntries) || cacheMaxEntries < 0)) {
    throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided')
  }

  if (markdownExtensions != null && (!Array.isArray(markdownExtensions) || markdownExtensions.some(ext => !ext || typeof ext !== 'object'))) {
    throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided')
  }

  if (availableLanguages != null && (!Array.isArray(availableLanguages) || availableLanguages.some(l => typeof l !== 'string' || !l.trim()))) {
    throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided')
  }
  if (noIndexing != null && (!Array.isArray(noIndexing) || noIndexing.some(p => typeof p !== 'string' || !p.trim()))) {
    throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided')
  }

  if (skipRootReadme != null && typeof skipRootReadme !== 'boolean') {
    throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided')
  }

  if (homePage != null && (typeof homePage !== 'string' || !homePage.trim() || !/\.(md|html)$/.test(homePage))) {
    throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html')
  }

  if (notFoundPage != null && (typeof notFoundPage !== 'string' || !notFoundPage.trim() || !/\.(md|html)$/.test(notFoundPage))) {
    throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html')
  }

  const effectiveSearchEnabled = !!searchEnabled

  try {
    import('./slugManager.js').then(m => {
      try { if (m && typeof m.setSkipRootReadme === 'function') m.setSkipRootReadme(!!skipRootReadme) } catch (e2) { console.warn('[nimbi-cms] setSkipRootReadme failed', e2) }
    }).catch(e => { /* ignore dynamic import errors for tests */ })
  } catch (e) { console.warn('[nimbi-cms] setSkipRootReadme dynamic import failed', e) }

  try {
    
    // Configure SEO map and inject minimal SEO metadata early (library-level injection)
    try {
      if (finalOptions && finalOptions.seoMap && typeof finalOptions.seoMap === 'object') setSeoMap(finalOptions.seoMap)
    } catch (e) {}
    // Attach a lightweight runtime error/rejection logger for debugging render issues.
    try {
      if (typeof window !== 'undefined') {
        if (!window.__nimbiRenderingErrors__) window.__nimbiRenderingErrors__ = []
        window.addEventListener('error', function(ev) {
          try {
            const rec = { type: 'error', message: ev && ev.message ? String(ev.message) : '', filename: ev && ev.filename ? String(ev.filename) : '', lineno: ev && ev.lineno ? ev.lineno : null, colno: ev && ev.colno ? ev.colno : null, stack: ev && ev.error && ev.error.stack ? ev.error.stack : null, time: Date.now() }
            try { console.warn('[nimbi-cms] runtime error', rec.message) } catch (_) {}
            window.__nimbiRenderingErrors__.push(rec)
          } catch (_) {}
        })
        window.addEventListener('unhandledrejection', function(ev) {
          try {
            const rec = { type: 'unhandledrejection', reason: ev && ev.reason ? String(ev.reason) : '', time: Date.now() }
            try { console.warn('[nimbi-cms] unhandledrejection', rec.reason) } catch (_) {}
            window.__nimbiRenderingErrors__.push(rec)
          } catch (_) {}
        })
      }
    } catch (e) {}
    try {
      const parsedForSeo = parseHrefToRoute(typeof window !== 'undefined' ? window.location.href : '')
      const pageForSeo = (parsedForSeo && parsedForSeo.page) ? parsedForSeo.page : (homePage || '_home.md')
      try { injectSeoForPage(pageForSeo, initialDocumentTitle || '') } catch (e) {}
    } catch (e) {}

    await (async () => {

  try {
    mountEl.classList.add('nimbi-mount')
  } catch (e) { console.warn('[nimbi-cms] mount element setup failed', e) }

  const sectionEl = document.createElement('section')
  sectionEl.className = 'section'

  const container = document.createElement('div')
  container.className = 'container nimbi-cms'
  try {
  } catch (e) { console.warn('[nimbi-cms] container style setup failed', e) }

  const cols = document.createElement('div')
  cols.className = 'columns'

  const navCol = document.createElement('div')
  navCol.className = 'column is-hidden-mobile is-3-tablet nimbi-nav-wrap'
  navCol.setAttribute('role', 'navigation')
  try {
    const label = (typeof t === 'function') ? t('navigation') : null
    if (label) navCol.setAttribute('aria-label', label)
  } catch (e) {
    console.warn('[nimbi-cms] set nav aria-label failed', e)
  }
  cols.appendChild(navCol)

  const contentCol = document.createElement('main')
  contentCol.className = 'column nimbi-content'
  contentCol.setAttribute('role', 'main')
  cols.appendChild(contentCol)

  container.appendChild(cols)

  sectionEl.appendChild(container)

  const navWrap = navCol
  const contentWrap = contentCol

  mountEl.appendChild(sectionEl)

  let mountOverlay = null
  try {
    mountOverlay = mountEl.querySelector('.nimbi-overlay')
    if (!mountOverlay) {
      mountOverlay = document.createElement('div')
      mountOverlay.className = 'nimbi-overlay'
      mountEl.appendChild(mountOverlay)
    }
  } catch (e) {
    mountOverlay = null
    console.warn('[nimbi-cms] mount overlay setup failed', e)
  }

  const pagePath = location.pathname || '/'
  // Normalize pageDir: if the path ends with '/' it's a directory already.
  // If it doesn't end with '/' and doesn't look like a file (no dot in last segment),
  // treat it as a directory (convert '/example' -> '/example/'). Otherwise
  // treat it as a file path and take its directory portion.
  let pageDir
  if (pagePath.endsWith('/')) {
    pageDir = pagePath
  } else {
    const lastSeg = pagePath.substring(pagePath.lastIndexOf('/') + 1)
    if (lastSeg && !lastSeg.includes('.')) {
      pageDir = pagePath + '/'
    } else {
      pageDir = pagePath.substring(0, pagePath.lastIndexOf('/') + 1)
    }
  }
  try { initialDocumentTitle = document.title || '' } catch (e) { initialDocumentTitle = ''; console.warn('[nimbi-cms] read initial document title failed', e) }
  let cp = contentPath
  const contentPathWasProvided = Object.prototype.hasOwnProperty.call(finalOptions, 'contentPath')
  const origin = (typeof location !== 'undefined' && location.origin) ? location.origin : 'http://localhost'
  // pageRoot is the site-rooted folder for this page (origin + pageDir)
  const pageRoot = new URL(pageDir, origin).toString()
  // '.' and './' are page-relative (same as empty)
  if (cp === '.' || cp === './') cp = ''

  // Normalize cp into a page-relative segment without leading slash,
  // always ensuring a trailing slash when non-empty.
  try { cp = String(cp || '').replace(/\\/g, '/') } catch (_e) { cp = String(cp || '') }
  if (cp.startsWith('/')) cp = cp.replace(/^\/+/, '')
  if (cp && !cp.endsWith('/')) cp = cp + '/'

  // If the configured contentPath already includes the pageDir (common when
  // authors provide a site-rooted path like '/example/content'), remove the
  // leading pageDir segment so we don't duplicate it when building
  // `${origin}${pageDir}${cp}` below.
  try {
    if (cp && pageDir && pageDir !== '/') {
      const pd = pageDir.replace(/^\/+/, '').replace(/\/+$/, '') + '/'
      if (pd && cp.startsWith(pd)) {
        cp = cp.slice(pd.length)
      }
    }
  } catch (_e) {
    /* ignore normalization errors */
  }

  // Compute contentBase as origin + pageDir + cp (always preserve pageDir/site subpath).
  // This yields: `${location.origin}${location.pathname}${contentPath}` when cp non-empty,
  // or `${location.origin}${location.pathname}` when cp is empty.
  try {
    if (cp) {
      var contentBase = new URL(cp, pageRoot.endsWith('/') ? pageRoot : (pageRoot + '/')).toString()
    } else {
      var contentBase = pageRoot
    }
  } catch (e) {
    // Fallback: origin + '/' + cp
    try {
      if (cp) var contentBase = new URL('/' + cp, origin).toString()
      else var contentBase = new URL(pageDir, origin).toString()
    } catch (_e) {
      var contentBase = origin
    }
  }
  try {
    import('./slugManager.js').then(m => {
      try { if (m && typeof m.setHomePage === 'function') m.setHomePage(homePage) } catch (e2) { console.warn('[nimbi-cms] setHomePage failed', e2) }
    }).catch(e => { /* ignore dynamic import errors for tests */ })
  } catch (e) { console.warn('[nimbi-cms] setHomePage dynamic import failed', e) }
  if (l10nFile) await loadL10nFile(l10nFile, pageDir)
  if (availableLanguages && Array.isArray(availableLanguages)) {
    setLanguages(availableLanguages)
  }
  if (lang) setLang(lang)

  const ui = createUI({ contentWrap, navWrap, container, mountOverlay, t, contentBase, homePage, initialDocumentTitle, runHooks })

  if (typeof cacheTtlMinutes === 'number' && cacheTtlMinutes >= 0) {
    if (typeof router.setResolutionCacheTtl === 'function') {
      router.setResolutionCacheTtl(cacheTtlMinutes * 60 * 1000)
    }
  }
  if (typeof cacheMaxEntries === 'number' && cacheMaxEntries >= 0) {
    if (typeof router.setResolutionCacheMax === 'function') {
      router.setResolutionCacheMax(cacheMaxEntries)
    }
  }
  if (markdownExtensions && Array.isArray(markdownExtensions) && markdownExtensions.length) {
    try {
      markdownExtensions.forEach(ext => {
        if (typeof ext === 'object' && markdown && typeof markdown.addMarkdownExtension === 'function') {
          markdown.addMarkdownExtension(ext)
        }
      })
    } catch (err) { console.warn('[nimbi-cms] applying markdownExtensions failed', err) }
  }

  try {
    if (typeof crawlMaxQueue === 'number') {
      import('./slugManager.js').then(({ setDefaultCrawlMaxQueue }) => {
        try { setDefaultCrawlMaxQueue(crawlMaxQueue) } catch (_) { console.warn('[nimbi-cms] setDefaultCrawlMaxQueue failed', _) }
      })
    }
  } catch (err) { console.warn('[nimbi-cms] setDefaultCrawlMaxQueue import failed', err) }

  try { setContentBase(contentBase) } catch (err) { console.warn('[nimbi-cms] setContentBase failed', err) }
  try { setNotFoundPage(notFoundPage) } catch (err) { console.warn('[nimbi-cms] setNotFoundPage failed', err) }
  try { setContentBase(contentBase) } catch (err) { console.warn('[nimbi-cms] setContentBase failed', err) }
  try { setNotFoundPage(notFoundPage) } catch (err) { console.warn('[nimbi-cms] setNotFoundPage failed', err) }
  try {
    // Optional: expose sitemap endpoints for crawlers when enabled (opt-in).
    // Hosts can enable by passing `exposeSitemap: true` to `initCMS()` or
    // by setting `window.__nimbiExposeSitemap = true` before init.
    if (exposeSitemap === true || (typeof window !== 'undefined' && window.__nimbiExposeSitemap)) {
      try {
        const mod = await import('./runtimeSitemap.js')
        try {
          if (mod && typeof mod.handleSitemapRequest === 'function') {
            const handled = mod.handleSitemapRequest({ includeAllMarkdown: true })
            if (handled) return
          }
        } catch (e) { /* ignore runtime sitemap handler errors */ }
      } catch (e) { /* ignore dynamic import errors */ }
    }

    // Optional: attach a small sitemap download UI when a host enables it
    if (typeof window !== 'undefined' && window.__nimbiAutoAttachSitemapUI) {
      import('./runtimeSitemap.js').then(mod => {
        try { if (mod && typeof mod.attachSitemapDownloadUI === 'function') mod.attachSitemapDownloadUI(document.body, { filename: 'sitemap.json' }) } catch (e) { /* ignore */ }
      }).catch(() => {})
    }
  } catch (e) {}
    try {
      await fetchMarkdown(homePage, contentBase)
    } catch (e) {
      if (homePage === '_home.md') {
        throw new Error('Required _home.md not found')
      }
      throw new Error(`Required ${homePage} not found at ${contentBase}${homePage}: ${e.message}`)
    }

  setStyle(defaultStyle)
  await ensureBulma(bulmaCustomize, pageDir)

  try {
    const navbarWrap = document.createElement('header')
    navbarWrap.className = 'nimbi-site-navbar'
    mountEl.insertBefore(navbarWrap, sectionEl)
    const navMd = await fetchMarkdown(navigationPage, contentBase)
    const parsedNav = await parseMarkdownToHtml(navMd.raw || '')
    const { navbar, linkEls } = await buildNav(navbarWrap, container, parsedNav.html || '', contentBase, homePage, t, ui.renderByQuery, effectiveSearchEnabled, searchIndexMode, indexDepth, noIndexing, navbarLogo)
    try { await runHooks('onNavBuild', { navWrap, navbar, linkEls, contentBase }) } catch (e) { console.warn('[nimbi-cms] onNavBuild hooks failed', e) }
    
    try {
      const computeAndSet = () => {
        const navHeight = (navbarWrap && navbarWrap.getBoundingClientRect && Math.round(navbarWrap.getBoundingClientRect().height)) || (navbarWrap && navbarWrap.offsetHeight) || 0
        if (navHeight > 0) {
          try { mountEl.style.setProperty('--nimbi-site-navbar-height', `${navHeight}px`) } catch (err) { console.warn('[nimbi-cms] set CSS var failed', err) }
          try { container.style.paddingTop = '' } catch (err) { console.warn('[nimbi-cms] set container paddingTop failed', err) }
          try {
            const mountH = (mountEl && mountEl.getBoundingClientRect && Math.round(mountEl.getBoundingClientRect().height)) || (mountEl && mountEl.clientHeight) || 0
            if (mountH > 0) {
              const explicit = Math.max(0, mountH - navHeight)
              try { container.style.setProperty('--nimbi-cms-height', `${explicit}px`) } catch (err) { console.warn('[nimbi-cms] set --nimbi-cms-height failed', err) }
            } else {
              try { container.style.setProperty('--nimbi-cms-height', 'calc(100vh - var(--nimbi-site-navbar-height))') } catch (err) { console.warn('[nimbi-cms] set --nimbi-cms-height failed', err) }
            }
          } catch (err) { console.warn('[nimbi-cms] compute container height failed', err) }
          try { navbarWrap.style.setProperty('--nimbi-site-navbar-height', `${navHeight}px`) } catch (err) { console.warn('[nimbi-cms] set navbar CSS var failed', err) }
        }
      }
      computeAndSet()
      try {
        if (typeof ResizeObserver !== 'undefined') {
          const ro = new ResizeObserver(() => computeAndSet())
          try { ro.observe(navbarWrap) } catch (err) { console.warn('[nimbi-cms] ResizeObserver.observe failed', err) }
        }
      } catch (err) { console.warn('[nimbi-cms] ResizeObserver setup failed', err) }
    } catch (err) { console.warn('[nimbi-cms] compute navbar height failed', err) }
    
  } catch (e) {
    console.warn('[nimbi-cms] build navigation failed', e)
  }
  await ui.renderByQuery()
  
  try {
    import('./version.js').then(({ getVersion }) => {
      if (typeof getVersion === 'function') {
        getVersion().then(ver => {
          try {
                const v = ver || '0.0.0'
                try {
                    const finishWithAnchor = (href) => {
                    const a = document.createElement('a')
                    a.className = 'nimbi-version-label tag is-small'
                    a.textContent = `nimbiCMS v. ${v}`
                    a.href = href || '#'
                    a.target = '_blank'
                    a.rel = 'noopener noreferrer nofollow'
                    a.setAttribute('aria-label', `nimbiCMS version ${v}`)
                    try { registerThemedElement(a) } catch (e) { /* ignore */ }
                    try { mountEl.appendChild(a) } catch (err) { console.warn('[nimbi-cms] append version label failed', err) }
                  }

                  const injectedHomepage = typeof __NIMBI_CMS_HOMEPAGE__ !== 'undefined' ? __NIMBI_CMS_HOMEPAGE__ : null
                  const safeLink = (() => {
                    try {
                      if (injectedHomepage && typeof injectedHomepage === 'string') {
                        return new URL(injectedHomepage).toString()
                      }
                    } catch (e) {
                    }
                    return '#'
                  })()

                  finishWithAnchor(safeLink)
                } catch (err) {
                  console.warn('[nimbi-cms] building version label failed', err)
                }
          } catch (err) { console.warn('[nimbi-cms] building version label failed', err) }
        }).catch((e) => { console.warn('[nimbi-cms] getVersion() failed', e) })
      }
    }).catch((e) => { console.warn('[nimbi-cms] import version module failed', e) })
  } catch (err) { console.warn('[nimbi-cms] version label setup failed', err) }

    })()
  } catch (err) {
    renderInitError(err)
    throw err
  }
}
