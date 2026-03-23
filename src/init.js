/**
 * Initialization API.
 *
 * Exports `initCMS` and helpers to initialize the CMS runtime.
 *
 * @module init
 */

import { fetchMarkdown, setContentBase, setNotFoundPage, setLanguages, setHomePage, notFoundPage } from './slugManager.js'
import * as router from './router.js'
import * as markdown from './markdown.js'
import { buildNav } from './nav.js'
import { createUI } from './ui.js'
import { parseHrefToRoute } from './utils/urlHelper.js'
import { normalizePath } from './utils/helpers.js'
import { injectSeoForPage, setSeoMap } from './seoManager.js'
import { runHooks } from './hookManager.js'
import { t, loadL10nFile, setLang } from './l10nManager.js'
import { ensureBulma, setStyle, registerThemedElement } from './bulmaManager.js'
import { setDebugLevel, debugWarn, debugInfo } from './utils/debug.js'

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
/**
 * Parse URL query string into a normalized `initCMS` options object.
 * Conservative, descriptive helper used by `initCMS` and tests.
 * @param {string} [queryString]
 * @returns {Object}
 */
export function parseInitOptionsFromQuery(queryString) {
  try {
    let qs = typeof queryString === 'string' ? queryString : (typeof window !== 'undefined' && window.location ? window.location.search : '')

    if (!qs && typeof window !== 'undefined' && window.location && window.location.hash) {
      try {
        const parsed = parseHrefToRoute(window.location.href)
        if (parsed && parsed.params) qs = parsed.params.startsWith('?') ? parsed.params : ('?' + parsed.params)
      } catch (e) {
        qs = ''
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
    if (params.has('notFoundPage')) {
      const v = params.get('notFoundPage')
      out.notFoundPage = (v === 'null') ? null : v
    }
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
  } catch (e) {
    return {}
  }
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
 * @param {string} name - candidate page path
 * @returns {boolean} true when `name` matches allowed page path rules
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
 * Validate a `contentPath` override supplied via URL.
 * Accepts relative paths like `./content/` or `content/` but rejects
 * protocol absolute, leading-slash absolute, Windows absolute, or
 * parent-directory references ("..").
 * @param {string} p
 * @returns {boolean}
 */
function isSafeContentPath(p) {
  if (typeof p !== 'string') return false
  const s = p.trim()
  if (!s) return false
  // Allow '.' or './' as explicit page-relative indicators (same as empty)
  if (s === '.' || s === './') return true
  if (s.includes('..')) return false
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(s)) return false
  if (s.startsWith('//')) return false
  if (s.startsWith('/') || /^[A-Za-z]:\\/.test(s)) return false
  const normalized = s.replace(/^\.\//, '')
  if (!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\/?$/.test(normalized)) return false
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
 * @param {string} [options.homePage] - Sets the site’s home page. Can be a `.md` or `.html` file. If not set, the initializer will attempt to derive the home page from the first link in `navigationPage`. The runtime will not automatically fall back to `'_home.md'`.
 * @param {string|null} [options.notFoundPage] - Sets the site's not-found page. Can be a `.md` or `.html` file. If not set, the runtime will render an inline "Not Found" message linking to the configured `homePage` instead of attempting to load `'_404.md'`.
 * @param {boolean} [options.skipRootReadme=false] - when true, the indexer will skip link discovery inside a repository-root `README.md`; set to `false` to treat the root README like other content pages.
 * @returns {Promise<void>} resolves once the initial page has rendered
 */
/**
 * Initialize the Nimbi CMS runtime on the host page.
 * Conservative wrapper used by consumers to mount UI and start routing.
 * @param {Record<string,unknown>} [options]
 * @returns {Promise<void>}
 */
export async function initCMS(options = {}) {

  if (!options || typeof options !== 'object') {
    throw new TypeError('initCMS(options): options must be an object')
  }

  const queryOpts = parseInitOptionsFromQuery()
    if (queryOpts && (queryOpts.contentPath || queryOpts.homePage || queryOpts.notFoundPage || queryOpts.navigationPage)) {
    if (options && options.allowUrlPathOverrides === true) {
      try { debugWarn('[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage/navigationPage') } catch (e) {}
    } else {
      try { debugWarn('[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage/navigationPage') } catch (e) {}
      delete queryOpts.contentPath
      delete queryOpts.homePage
      delete queryOpts.notFoundPage
        delete queryOpts.navigationPage
    }
  }
  const finalOptions = Object.assign({}, queryOpts, options)
  try {
    if (Object.prototype.hasOwnProperty.call(finalOptions, 'debugLevel')) {
      setDebugLevel(finalOptions.debugLevel)
    } else if (typeof globalThis !== 'undefined' && globalThis.__nimbiCMSDebug && typeof globalThis.__nimbiCMSDebug.debugLevel !== 'undefined') {
      // Honor an explicit legacy debugLevel if present on the old global
      // (e.g. `window.__nimbiCMSDebug = { debugLevel: 3 }`). Presence of the
      // legacy counters object alone should not automatically enable
      // verbose logging; to avoid unexpectedly noisy consoles we only
      // respect a numeric `debugLevel` property when present.
      try {
        const lvl = Number(globalThis.__nimbiCMSDebug.debugLevel)
        if (Number.isFinite(lvl)) setDebugLevel(Math.max(0, Math.min(3, Math.floor(lvl))))
      } catch (e) {}
    }
  } catch (e) {}
  try { debugInfo('[nimbi-cms] initCMS called', () => ({ options: finalOptions })) } catch (e) {}
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
    homePage = null,
    notFoundPage = null,
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
      try { if (m && typeof m.setSkipRootReadme === 'function') m.setSkipRootReadme(!!skipRootReadme) } catch (e2) { debugWarn('[nimbi-cms] setSkipRootReadme failed', e2) }
    }).catch(e => { /* ignore dynamic import errors for tests */ })
  } catch (e) { debugWarn('[nimbi-cms] setSkipRootReadme dynamic import failed', e) }

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
            try { debugWarn('[nimbi-cms] runtime error', rec.message) } catch (_) {}
            window.__nimbiRenderingErrors__.push(rec)
          } catch (_) {}
        })
        window.addEventListener('unhandledrejection', function(ev) {
          try {
            const rec = { type: 'unhandledrejection', reason: ev && ev.reason ? String(ev.reason) : '', time: Date.now() }
            try { debugWarn('[nimbi-cms] unhandledrejection', rec.reason) } catch (_) {}
            window.__nimbiRenderingErrors__.push(rec)
          } catch (_) {}
        })
      }
    } catch (e) {}
    try {
      const parsedForSeo = parseHrefToRoute(typeof window !== 'undefined' ? window.location.href : '')
      const pageForSeo = (parsedForSeo && parsedForSeo.page) ? parsedForSeo.page : (homePage || undefined)
      try { if (pageForSeo) injectSeoForPage(pageForSeo, initialDocumentTitle || '') } catch (e) {}
    } catch (e) {}

    await (async () => {

  try {
    mountEl.classList.add('nimbi-mount')
  } catch (e) { debugWarn('[nimbi-cms] mount element setup failed', e) }

  const sectionEl = document.createElement('section')
  sectionEl.className = 'section'

  const container = document.createElement('div')
  container.className = 'container nimbi-cms'
  try {
  } catch (e) { debugWarn('[nimbi-cms] container style setup failed', e) }

  const cols = document.createElement('div')
  cols.className = 'columns'

  const navCol = document.createElement('div')
  navCol.className = 'column is-hidden-mobile is-3-tablet nimbi-nav-wrap'
  navCol.setAttribute('role', 'navigation')
  try {
    const label = (typeof t === 'function') ? t('navigation') : null
    if (label) navCol.setAttribute('aria-label', label)
  } catch (e) {
    debugWarn('[nimbi-cms] set nav aria-label failed', e)
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
    debugWarn('[nimbi-cms] mount overlay setup failed', e)
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
  try { initialDocumentTitle = document.title || '' } catch (e) { initialDocumentTitle = ''; debugWarn('[nimbi-cms] read initial document title failed', e) }
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
  // Defer setting the slugManager home page until after we attempt to
  // derive a sensible default from the navigation page when the caller
  // did not explicitly provide `homePage` in options. This avoids
  // forcing `_home.md` when the site's nav points elsewhere.
  if (l10nFile) await loadL10nFile(l10nFile, pageDir)
  if (availableLanguages && Array.isArray(availableLanguages)) {
    setLanguages(availableLanguages)
  }
  if (lang) setLang(lang)

  

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
    } catch (err) { debugWarn('[nimbi-cms] applying markdownExtensions failed', err) }
  }

  try {
    if (typeof crawlMaxQueue === 'number') {
      import('./slugManager.js').then(({ setDefaultCrawlMaxQueue }) => {
        try { setDefaultCrawlMaxQueue(crawlMaxQueue) } catch (_) { debugWarn('[nimbi-cms] setDefaultCrawlMaxQueue failed', _) }
      })
    }
  } catch (err) { debugWarn('[nimbi-cms] setDefaultCrawlMaxQueue import failed', err) }

  try {
    // If an authoritative content manifest was provided by the caller
    // (or injected on the global), apply it to the slug manager before
    // calling `setContentBase`. This ensures `allMarkdownPaths` and
    // slug maps are populated deterministically so direct URL loads
    // (hard refreshes) can resolve pages that are not present in the
    // navigation file.
    try {
      const manifest = (finalOptions && finalOptions.manifest) ? finalOptions.manifest :
        (typeof globalThis !== 'undefined' && globalThis.__NIMBI_CMS_MANIFEST__) ? globalThis.__NIMBI_CMS_MANIFEST__ :
        (typeof window !== 'undefined' && window.__NIMBI_CMS_MANIFEST__) ? window.__NIMBI_CMS_MANIFEST__ : null
      if (manifest && typeof manifest === 'object') {
        try {
          const sm = await import('./slugManager.js')
          if (sm && typeof sm._setAllMd === 'function') {
            sm._setAllMd(manifest)
            try { debugInfo('[nimbi-cms diagnostic] applied content manifest', () => ({ manifestKeys: Object.keys(manifest).length })) } catch (e) {}
          }
        } catch (e) { debugWarn('[nimbi-cms] applying content manifest failed', e) }
      }

      try {
        setContentBase(contentBase)
      } catch (err) { debugWarn('[nimbi-cms] setContentBase failed', err) }

      try {
        // Log current slug/index sizes after applying manifest + setContentBase
        try {
          const sm2 = await import('./slugManager.js')
            try {
            debugInfo('[nimbi-cms diagnostic] after setContentBase', () => ({
              manifestKeys: manifest && typeof manifest === 'object' ? Object.keys(manifest).length : 0,
              slugToMdSize: (sm2 && sm2.slugToMd && typeof sm2.slugToMd.size === 'number') ? sm2.slugToMd.size : undefined,
              allMarkdownPathsLength: (sm2 && Array.isArray(sm2.allMarkdownPaths)) ? sm2.allMarkdownPaths.length : undefined,
              allMarkdownPathsSetSize: (sm2 && sm2.allMarkdownPathsSet && typeof sm2.allMarkdownPathsSet.size === 'number') ? sm2.allMarkdownPathsSet.size : undefined,
              searchIndexLength: (sm2 && Array.isArray(sm2.searchIndex)) ? sm2.searchIndex.length : undefined
            }))
          } catch (e) {}
        } catch (e) {}
      } catch (e) {}
    } catch (e) {}
  } catch (err) { debugWarn('[nimbi-cms] setContentBase failed', err) }
  try { setNotFoundPage(notFoundPage) } catch (err) { debugWarn('[nimbi-cms] setNotFoundPage failed', err) }
  try {
    // Optional: attach a small sitemap download UI when a host enables it
    if (typeof window !== 'undefined' && window.__nimbiAutoAttachSitemapUI) {
      import('./runtimeSitemap.js').then(mod => {
        try { if (mod && typeof mod.attachSitemapDownloadUI === 'function') mod.attachSitemapDownloadUI(document.body, { filename: 'sitemap.json' }) } catch (e) { /* ignore */ }
      }).catch(() => {})
    }
  } catch (e) {}
    // Attempt to derive `homePage` from the first link in the navigation
    // page when the user did not explicitly provide `homePage`.
    let _earlyParsedNav = null
    let _earlyNavMd = null
    try {
      const homeWasProvided = Object.prototype.hasOwnProperty.call(finalOptions, 'homePage')
      if (!homeWasProvided && navigationPage) {
        // Try to fetch the configured navigation page. If it fails, attempt
        // a few common alternate locations (no leading underscore, plain
        // "navigation.md", or under `assets/`) so sites that moved/renamed
        // their nav file still derive a sensible home page.
        try {
          const tried = []
          const candidates = []
          try {
            if (navigationPage) candidates.push(String(navigationPage))
          } catch (_) {}
          try {
            const stripped = String(navigationPage || '').replace(/^_/, '')
            if (stripped && stripped !== String(navigationPage)) candidates.push(stripped)
          } catch (_) {}
          try { candidates.push('navigation.md') } catch (_) {}
          try { candidates.push('assets/navigation.md') } catch (_) {}
          // Deduplicate while preserving order
          const uniq = []
          for (const c of candidates) {
            try {
              if (!c) continue
              const s = String(c)
              if (!uniq.includes(s)) uniq.push(s)
            } catch (_) {}
          }

          for (const np of uniq) {
            tried.push(np)
            try {
              _earlyNavMd = await fetchMarkdown(np, contentBase, { force: true })
              if (_earlyNavMd && _earlyNavMd.raw) {          // Use repo-relative content path so gh-pages serves files from the
          // repository subpath (avoids requests to root `/`)
                // Remember which navigation file actually worked so we
                // reuse it later when building the nav (avoid a second
                // failing round-trip to the original configured path).
                try { navigationPage = np } catch (_) {}
                try { debugWarn('[nimbi-cms] fetched navigation candidate', np, 'contentBase=', contentBase) } catch (_) {}
                _earlyParsedNav = await markdown.parseMarkdownToHtml(_earlyNavMd.raw || '')
                try {
                  const parser = (typeof DOMParser !== 'undefined') ? new DOMParser() : null
                  if (parser && _earlyParsedNav && _earlyParsedNav.html) {
                    const doc = parser.parseFromString(_earlyParsedNav.html, 'text/html')
                    const a = doc.querySelector('a')
                    if (a) {
                      try {
                        const href = a.getAttribute('href') || ''
                        const r = parseHrefToRoute(href)
                        try { debugWarn('[nimbi-cms] parsed nav first-link href', href, '->', r) } catch (_) {}
                        if (r && r.page) {
                          // Only accept candidate home pages that look like a path
                          // (contain an extension or a directory). Slugs (cosmetic)
                          // are not used here because `homePage` is expected to be
                          // a fetchable path relative to `contentBase`.
                          if (r.type === 'path' || (r.type === 'canonical' && (r.page.includes('.') || r.page.includes('/')))) {
                            homePage = r.page
                            try { debugWarn('[nimbi-cms] derived homePage from navigation', homePage) } catch (_) {}
                            break
                          }
                        }
                      } catch (e) { /* swallow parsing errors for this candidate */ }
                    }
                  }
                } catch (e) { /* swallow parse errors for this candidate */ }
              }
            } catch (_) {
              // try next candidate
            }
          }
        } catch (e) {
          // ignore navigation fetch/parse failures — we'll fall back below
        }
      }

      try { debugWarn('[nimbi-cms] final homePage before slugManager setHomePage', homePage) } catch (_) {}
      // Inform slugManager of the (possibly updated) homePage value.
      try {
        setHomePage(homePage)
      } catch (e) { debugWarn('[nimbi-cms] setHomePage failed', e) }

      // Only fetch the configured `homePage` when it is necessary. When the
      // runtime is starting from a cosmetic hash route (e.g. "#/slug") and
      // the host has intentionally left `notFoundPage` unset (inline 404),
      // avoid probing the home page to reduce noisy network requests.
      let _shouldFetchHome = true
      try {
        const parsedCurrent = parseHrefToRoute(typeof location !== 'undefined' ? location.href : '')
        if (parsedCurrent && parsedCurrent.type === 'cosmetic' && (typeof notFoundPage === 'undefined' || notFoundPage == null)) {
          _shouldFetchHome = false
        }
      } catch (_e) {}

      if (_shouldFetchHome && homePage) {
        try {
          await fetchMarkdown(homePage, contentBase, { force: true })
        } catch (e) {
          throw new Error(`Required ${homePage} not found at ${contentBase}${homePage}: ${e && e.message ? e.message : String(e)}`)
        }
      }
    } catch (e) {
      // rethrow the error so init fails as before
      throw e
    }

  setStyle(defaultStyle)
  await ensureBulma(bulmaCustomize, pageDir)
  const ui = createUI({ contentWrap, navWrap, container, mountOverlay, t, contentBase, homePage, initialDocumentTitle, runHooks })

  try {
    const navbarWrap = document.createElement('header')
    navbarWrap.className = 'nimbi-site-navbar'
    mountEl.insertBefore(navbarWrap, sectionEl)
    // Reuse the navigation page parsed earlier when available to avoid a
    // second network round-trip; otherwise load it now.
    let navMd = _earlyNavMd
    let parsedNav = _earlyParsedNav
    if (!parsedNav) {
      navMd = await fetchMarkdown(navigationPage, contentBase, { force: true })
      parsedNav = await markdown.parseMarkdownToHtml(navMd.raw || '')
    }
    const { navbar, linkEls } = await buildNav(navbarWrap, container, parsedNav.html || '', contentBase, homePage, t, ui.renderByQuery, effectiveSearchEnabled, searchIndexMode, indexDepth, noIndexing, navbarLogo)
    try { await runHooks('onNavBuild', { navWrap, navbar, linkEls, contentBase }) } catch (e) { debugWarn('[nimbi-cms] onNavBuild hooks failed', e) }
    try {
      // Ensure nav link slugs are present in slugManager for mocked environments
      try {
          if (linkEls && linkEls.length) {
          const sm = await import('./slugManager.js')
          for (const a of Array.from(linkEls || [])) {
            try {
              const href = (a && a.getAttribute) ? (a.getAttribute('href') || '') : ''
              if (!href) continue
              let path = String(href || '').split(/::|#/, 1)[0]
              path = String(path || '').split('?')[0]
              if (!path) continue
              if (!/\.(?:md|html?)$/.test(path)) path = path + '.html'
              // Normalize path to a content-base relative canonical form
              let rel = null
              try { rel = normalizePath(String(path || '')) } catch (_) { rel = String(path || '') }
              const baseName = String(rel || '').replace(/^.*\//, '').replace(/\?.*$/, '')
              if (!baseName) continue
              try {
                // Prefer using slugManager.slugify when available to produce
                // consistent slugs; avoid clobbering existing slug keys by
                // generating a unique candidate when collisions would occur.
                let candidate = null
                try { if (sm && typeof sm.slugify === 'function') candidate = sm.slugify(baseName.replace(/\.(?:md|html?)$/i, '')) } catch (_) { candidate = String(baseName || '').replace(/\s+/g, '-').toLowerCase() }
                if (!candidate) continue
                let slugKeyFinal = candidate
                try {
                  if (sm && sm.slugToMd && typeof sm.slugToMd.has === 'function' && sm.slugToMd.has(candidate)) {
                    // If the existing mapping belongs to the same path, keep it.
                    const existing = sm.slugToMd.get(candidate)
                    let belongs = false
                    try {
                      if (typeof existing === 'string') {
                        if (existing === path) belongs = true
                      } else if (existing && typeof existing === 'object') {
                        if (existing.default === path) belongs = true
                        for (const k of Object.keys(existing.langs || {})) { if (existing.langs[k] === path) { belongs = true; break } }
                      }
                    } catch (_) {}
                    if (!belongs && typeof sm.uniqueSlug === 'function') {
                      try { slugKeyFinal = sm.uniqueSlug(candidate, new Set(sm.slugToMd.keys())) } catch (_) { slugKeyFinal = candidate }
                    }
                  }
                } catch (_) {}

                try {
                  if (sm && typeof sm._storeSlugMapping === 'function') {
                    try { sm._storeSlugMapping(slugKeyFinal, rel) } catch (_) {}
                  } else if (sm && sm.slugToMd && typeof sm.slugToMd.set === 'function') {
                    try { sm.slugToMd.set(slugKeyFinal, rel) } catch (_) {}
                  }
                  try { if (sm && sm.mdToSlug && typeof sm.mdToSlug.set === 'function') sm.mdToSlug.set(rel, slugKeyFinal) } catch (_) {}
                  try { if (sm && Array.isArray(sm.allMarkdownPaths) && !sm.allMarkdownPaths.includes(rel)) sm.allMarkdownPaths.push(rel) } catch (_) {}
                  try { if (sm && sm.allMarkdownPathsSet && typeof sm.allMarkdownPathsSet.add === 'function') sm.allMarkdownPathsSet.add(rel) } catch (_) {}
                } catch (_) {}
              } catch (_) {}
            } catch (_) {}
          }
          try { const im2 = await import('./indexManager.js'); if (im2 && typeof im2.refreshIndexPaths === 'function') im2.refreshIndexPaths(contentBase) } catch (_) {}
        }
      } catch (e) {}
    } catch (e) {}
    
      try {
        // If the current URL is requesting a sitemap/rss/atom, run the
        // sitemap handler regardless of `exposeSitemap`. This ensures
        // requests like `/?rss` or `/sitemap.xml` are handled by the
        // runtime generator even when the host hasn't explicitly enabled
        // the `exposeSitemap` flag.
        let shouldTrySitemap = false
        try {
          const sp = new URLSearchParams(location.search || '')
          if (sp.has('sitemap') || sp.has('rss') || sp.has('atom')) shouldTrySitemap = true
        } catch (_) {}
        try {
          const pathname = (location.pathname || '/').replace(/\/\/+/g, '/')
          const name = pathname.split('/').filter(Boolean).pop() || ''
          if (name && /^(sitemap|sitemap\.xml|rss|rss\.xml|atom|atom\.xml)$/i.test(name)) shouldTrySitemap = true
        } catch (_) {}

        if (shouldTrySitemap || exposeSitemap === true || (typeof window !== 'undefined' && window.__nimbiExposeSitemap)) {
          try {
            // Ensure the authoritative index is built before handling
            // sitemap/rss/atom requests. This will deterministically wait
            // for the runtime index (worker-first) and avoid race
            // conditions where consumers observe a partial array.
            try {
              const sm = await import('./slugManager.js')
              if (sm && typeof sm.awaitSearchIndex === 'function') {
                const seeds = []
                if (homePage) seeds.push(homePage)
                if (navigationPage) seeds.push(navigationPage)
                try {
                  await sm.awaitSearchIndex({ contentBase, indexDepth: Math.max(indexDepth || 1, 3), noIndexing, seedPaths: seeds.length ? seeds : undefined, startBuild: true, timeoutMs: Infinity })
                } catch (_) { /* don't fail init if index build errors */ }
              }
            } catch (_) {}

            const mod = await import('./runtimeSitemap.js')
            try {
              if (mod && typeof mod.handleSitemapRequest === 'function') {
                const handled = await mod.handleSitemapRequest({ includeAllMarkdown: true, homePage, navigationPage, notFoundPage, contentBase, indexDepth, noIndexing })
                if (handled) return
              }
            } catch (e) { /* ignore runtime sitemap handler errors */ }
          } catch (e) { /* ignore dynamic import errors */ }
        }

        // Kick off a background sitemap build to expose runtime globals so
        // developers and diagnostic tools can inspect the final sitemap
        // even when the page wasn't explicitly requested as `?rss`.
        try {
          import('./runtimeSitemap.js').then(mod => {
            try {
              if (mod && typeof mod.exposeSitemapGlobals === 'function') {
                // fire-and-forget; allow an indefinite wait so the
                // background population has ample time to complete in
                // environments where crawling/indexing may be slow.
                try { mod.exposeSitemapGlobals({ includeAllMarkdown: true, homePage, navigationPage, notFoundPage, contentBase, indexDepth, noIndexing, waitForIndexMs: Infinity }).catch(() => {}) } catch (_) {}
              }
            } catch (_) {}
          }).catch(() => {})
        } catch (_) {}
      } catch (e) {}

    try {
      // Refresh the runtime index set from any slug mappings created
      // during nav build so initial direct page loads can probe
      // candidates (crawl/index lookups) even when no build-time
      // manifest was provided.
      try {
        const im = await import('./indexManager.js')
        if (im && typeof im.refreshIndexPaths === 'function') {
          try {
            im.refreshIndexPaths(contentBase)
            try {
              // Diagnostic: log slug/index sizes after index refresh
              try {
                const sm3 = await import('./slugManager.js')
                try { debugInfo('[nimbi-cms diagnostic] after refreshIndexPaths', () => ({ slugToMdSize: (sm3 && sm3.slugToMd && typeof sm3.slugToMd.size === 'number') ? sm3.slugToMd.size : undefined, allMarkdownPathsLength: (sm3 && Array.isArray(sm3.allMarkdownPaths)) ? sm3.allMarkdownPaths.length : undefined, allMarkdownPathsSetSize: (sm3 && sm3.allMarkdownPathsSet && typeof sm3.allMarkdownPathsSet.size === 'number') ? sm3.allMarkdownPathsSet.size : undefined })) } catch (e) {}
              } catch (e) {}
            } catch (e) {}
              // If no build-time manifest and slug maps are sparse, try using
              // the runtime sitemap / search index exposed on `window` to
              // populate slug->md mappings so direct URL loads can resolve.
                try {
                const sm4 = await import('./slugManager.js')
                const currentSize = (sm4 && sm4.slugToMd && typeof sm4.slugToMd.size === 'number') ? sm4.slugToMd.size : 0
                // Decide whether to seed: prefer targeted seeding when the
                // currently requested slug/path is missing, otherwise seed
                // when maps appear sparse. This avoids noisy work on large
                // sites while fixing direct-load cases.
                let shouldSeed = false
                try {
                  if (!manifest) {
                    if (currentSize < 30) shouldSeed = true
                    try {
                      const parsedCurrent = parseHrefToRoute(typeof location !== 'undefined' ? location.href : '')
                      if (parsedCurrent) {
                        if (parsedCurrent.type === 'cosmetic' && parsedCurrent.page) {
                          try { if (!sm4.slugToMd.has(parsedCurrent.page)) shouldSeed = true } catch (_) {}
                        } else if ((parsedCurrent.type === 'path' || parsedCurrent.type === 'canonical') && parsedCurrent.page) {
                          try {
                            const rp = normalizePath(parsedCurrent.page)
                            if (!(sm4.mdToSlug && sm4.mdToSlug.has(rp)) && !(sm4.allMarkdownPathsSet && sm4.allMarkdownPathsSet.has(rp))) shouldSeed = true
                          } catch (_) {}
                        }
                      }
                    } catch (_) {}
                  }
                } catch (_) {}

                if (shouldSeed) {
                  let resolvedIndex = null
                  try { resolvedIndex = (typeof window !== 'undefined' && (window.__nimbiSitemapFinal || window.__nimbiResolvedIndex || window.__nimbiSearchIndex || window.__nimbiLiveSearchIndex || window.__nimbiSearchIndex)) || null } catch (_) { resolvedIndex = null }
                  if (Array.isArray(resolvedIndex) && resolvedIndex.length) {
                    let added = 0
                    for (const it of resolvedIndex) {
                      try {
                        if (!it || !it.slug) continue
                        const baseSlug = String(it.slug).split('::')[0]
                        if (sm4.slugToMd.has(baseSlug)) continue
                        let rawPath = it.sourcePath || it.path || null
                        if (!rawPath && Array.isArray(resolvedIndex)) {
                          const found = (resolvedIndex || []).find(si => si && si.slug === it.slug)
                          if (found && found.path) rawPath = found.path
                        }
                        if (!rawPath) continue
                        try { rawPath = String(rawPath) } catch (_) { continue }

                        // Normalize to a content-base relative path similar to
                        // how `buildSearchIndex` and `slugManager` represent
                        // paths. Attempt URL resolution when possible so
                        // absolute URLs or root-prefixed paths are handled.
                        let rel = null
                        try {
                          const baseForResolve = (contentBase && typeof contentBase === 'string') ? contentBase : (typeof location !== 'undefined' && location.origin ? location.origin + '/' : '')
                          try {
                            const u = new URL(rawPath, baseForResolve)
                            const baseUrl = new URL(baseForResolve)
                            if (u.origin === baseUrl.origin) {
                              const basePath = baseUrl.pathname || '/'
                              let p = u.pathname || ''
                              if (p.startsWith(basePath)) p = p.slice(basePath.length)
                              if (p.startsWith('/')) p = p.slice(1)
                              rel = normalizePath(p)
                            } else {
                              rel = normalizePath(u.pathname || '')
                            }
                          } catch (e) {
                            rel = normalizePath(rawPath)
                          }
                        } catch (e) { rel = normalizePath(rawPath) }

                        if (!rel) continue
                        rel = String(rel).split(/[?#]/)[0]
                        rel = normalizePath(rel)

                        try { sm4._storeSlugMapping(baseSlug, rel) } catch (_) {}
                        added++
                      } catch (_) {}
                    }
                    if (added) {
                      try { debugInfo('[nimbi-cms diagnostic] populated slugToMd from sitemap/searchIndex', () => ({ added, total: (sm4 && sm4.slugToMd && typeof sm4.slugToMd.size === 'number') ? sm4.slugToMd.size : undefined })) } catch (_) {}
                      try {
                        const im2 = await import('./indexManager.js')
                        if (im2 && typeof im2.refreshIndexPaths === 'function') im2.refreshIndexPaths(contentBase)
                      } catch (_) {}
                    }
                  }
                }
              } catch (_) {}
          } catch (e) { debugWarn('[nimbi-cms] refreshIndexPaths after nav build failed', e) }
        }
      } catch (e) {}

      const computeAndSet = () => {
        const navHeight = (navbarWrap && navbarWrap.getBoundingClientRect && Math.round(navbarWrap.getBoundingClientRect().height)) || (navbarWrap && navbarWrap.offsetHeight) || 0
        if (navHeight > 0) {
          try { mountEl.style.setProperty('--nimbi-site-navbar-height', `${navHeight}px`) } catch (err) { debugWarn('[nimbi-cms] set CSS var failed', err) }
          try { container.style.paddingTop = '' } catch (err) { debugWarn('[nimbi-cms] set container paddingTop failed', err) }
          try {
            const mountH = (mountEl && mountEl.getBoundingClientRect && Math.round(mountEl.getBoundingClientRect().height)) || (mountEl && mountEl.clientHeight) || 0
            if (mountH > 0) {
              const explicit = Math.max(0, mountH - navHeight)
              try { container.style.setProperty('--nimbi-cms-height', `${explicit}px`) } catch (err) { debugWarn('[nimbi-cms] set --nimbi-cms-height failed', err) }
              } else {
              try { container.style.setProperty('--nimbi-cms-height', 'calc(100vh - var(--nimbi-site-navbar-height))') } catch (err) { debugWarn('[nimbi-cms] set --nimbi-cms-height failed', err) }
            }
          } catch (err) { debugWarn('[nimbi-cms] compute container height failed', err) }
          try { navbarWrap.style.setProperty('--nimbi-site-navbar-height', `${navHeight}px`) } catch (err) { debugWarn('[nimbi-cms] set navbar CSS var failed', err) }
        }
      }
      computeAndSet()
      try {
        if (typeof ResizeObserver !== 'undefined') {
          const ro = new ResizeObserver(() => computeAndSet())
          try { ro.observe(navbarWrap) } catch (err) { debugWarn('[nimbi-cms] ResizeObserver.observe failed', err) }
        }
      } catch (err) { debugWarn('[nimbi-cms] ResizeObserver setup failed', err) }
    } catch (err) { debugWarn('[nimbi-cms] compute navbar height failed', err) }
    
  } catch (e) {
    debugWarn('[nimbi-cms] build navigation failed', e)
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
                    try { mountEl.appendChild(a) } catch (err) { debugWarn('[nimbi-cms] append version label failed', err) }
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
                  debugWarn('[nimbi-cms] building version label failed', err)
                }
          } catch (err) { debugWarn('[nimbi-cms] building version label failed', err) }
        }).catch((e) => { debugWarn('[nimbi-cms] getVersion() failed', e) })
      }
    }).catch((e) => { debugWarn('[nimbi-cms] import version module failed', e) })
  } catch (err) { debugWarn('[nimbi-cms] version label setup failed', err) }

    })()
  } catch (err) {
    renderInitError(err)
    throw err
  }
}
