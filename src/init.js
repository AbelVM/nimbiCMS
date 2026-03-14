/* Initialization logic extracted from nimbi-cms.js to keep the top-level
 * entrypoint small.  This module exports the `initCMS` function which is
 * responsible for validating options, constructing the DOM scaffolding, and
 * delegating navigation and UI behaviour to helper modules.
 */
/**
 * Initialization logic extracted from nimbi-cms.js to keep the top-level
 * entrypoint small.  This module exports the `initCMS` function which is
 * responsible for validating options, constructing the DOM scaffolding, and
 * delegating navigation and UI behaviour to helper modules.
 */

import { fetchMarkdown, setContentBase, setNotFoundPage, setLanguages, setHomePage } from './slugManager.js'
import * as router from './router.js'
import { parseMarkdownToHtml } from './markdown.js'
import * as markdown from './markdown.js'
import { buildNav } from './nav.js'
import { createUI } from './ui.js'
import { runHooks } from './hookManager.js'
import { t, loadL10nFile, setLang } from './l10nManager.js'
import { ensureBulma, setStyle } from './bulmaManager.js'

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
 * @returns {Object}
 */
export function parseInitOptionsFromQuery(queryString) {
  try {
    const qs = typeof queryString === 'string' ? queryString : (typeof window !== 'undefined' && window.location ? window.location.search : '')
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
      if (v === 'light' || v === 'dark') out.defaultStyle = v
    }
    if (params.has('bulmaCustomize')) out.bulmaCustomize = params.get('bulmaCustomize')
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

// --- Path sanitization helpers -------------------------------------------
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
  // disallow absolute filesystem-ish paths
  if (p.startsWith('/') || /^[A-Za-z]:\\/.test(p)) return false
  return true
}

/**
 * Validates a page basename for `homePage` / `notFoundPage`.
 * Rules:
 *  - must be a simple basename (no slashes)
 *  - allowed chars: A-Za-z0-9._- and must end with .md or .html
 */
function isSafePageBasename(name) {
  if (typeof name !== 'string') return false
  const s = name.trim()
  if (!s) return false
  if (s.includes('/') || s.includes('\\')) return false
  if (s.includes('..')) return false
  if (!/^[A-Za-z0-9._-]+\.(md|html)$/.test(s)) return false
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
 * @param {Object} options
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
 * @param {Array<object>} [options.markdownExtensions] - list of marked extensions to register on init
 * @param {string} [options.homePage] - Sets the site’s home page. Can be a `.md` or `.html` file. If not set, falls back to `'_home.md'`.
 * @param {string} [options.notFoundPage] - Sets the site's not-found page. Can be a `.md` or `.html` file. If not set, defaults to `'_404.md'`.
 * @returns {Promise<void>} resolves once the initial page has rendered
 */
export async function initCMS(options = {}) {

  if (!options || typeof options !== 'object') {
    throw new TypeError('initCMS(options): options must be an object')
  }

  // Merge user-supplied options with any options provided via URL query
  // parameters. Explicit `options` take precedence over query params.
  //
  // SECURITY: for safety, do not allow sensitive path-related options to be
  // overridden via URL query parameters by default. Allowing `contentPath`,
  // `homePage` or `notFoundPage` from the URL can enable path traversal or
  // unintended exposure of server-served files if the backend is not
  // explicitly hardened. These query params are still parsed (useful for
  // tests), but are ignored at runtime unless the host page explicitly
  // enables URL-based overrides via a deliberate opt-in mechanism.
  const queryOpts = parseInitOptionsFromQuery()
  if (queryOpts && (queryOpts.contentPath || queryOpts.homePage || queryOpts.notFoundPage)) {
    // Only honor URL-provided path overrides when the embedding page has
    // explicitly passed `allowUrlPathOverrides: true` to `initCMS()`.
    if (options && options.allowUrlPathOverrides === true) {
      try {
        console.warn('[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage')
      } catch (e) { console.warn('[nimbi-cms] allowUrlPathOverrides logging failed', e) }
    } else {
      try {
        console.warn('[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage')
      } catch (e) { console.warn('[nimbi-cms] logging ignore of URL overrides failed', e) }
      // Remove any path-like overrides from queryOpts to avoid accidental exposure
      delete queryOpts.contentPath
      delete queryOpts.homePage
      delete queryOpts.notFoundPage
    }
  }
  const finalOptions = Object.assign({}, queryOpts, options)

  const {
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
    notFoundPage = '_404.md'
  } = finalOptions

  // Validate sanitized overrides (if any) before accepting them. This enforces
  // that runtime values cannot be used to traverse out of the static content
  // tree or reference absolute/protocol URLs.
  if (finalOptions.contentPath != null) {
    if (!isSafeContentPath(finalOptions.contentPath)) {
      throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns')
    }
  }
  if (finalOptions.homePage != null) {
    if (!isSafePageBasename(finalOptions.homePage)) {
      throw new TypeError('initCMS(options): "homePage" must be a simple basename ending with .md or .html')
    }
  }
  if (finalOptions.notFoundPage != null) {
    if (!isSafePageBasename(finalOptions.notFoundPage)) {
      throw new TypeError('initCMS(options): "notFoundPage" must be a simple basename ending with .md or .html')
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

  if (defaultStyle !== 'light' && defaultStyle !== 'dark') {
    throw new TypeError('initCMS(options): "defaultStyle" must be "light" or "dark"')
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

  if (homePage != null && (typeof homePage !== 'string' || !homePage.trim() || !/\.(md|html)$/.test(homePage))) {
    throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html')
  }

  if (notFoundPage != null && (typeof notFoundPage !== 'string' || !notFoundPage.trim() || !/\.(md|html)$/.test(notFoundPage))) {
    throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html')
  }

  const effectiveSearchEnabled = !!searchEnabled

  try {
    mountEl.classList.add('nimbi-mount')
    mountEl.style.position = mountEl.style.position || 'relative'
    mountEl.style.overflow = mountEl.style.overflow || 'hidden'
  } catch (e) { console.warn('[nimbi-cms] mount element setup failed', e) }

  const container = document.createElement('div')
  container.className = 'nimbi-cms'
  try {
    container.style.position = container.style.position || 'relative'
    container.style.overflow = container.style.overflow || 'auto'
    try { if (!container.style.webkitOverflowScrolling) container.style.webkitOverflowScrolling = 'touch' } catch (e) { console.warn('[nimbi-cms] set container webkitOverflowScrolling failed', e) }
    container.style.width = container.style.width || '100%'
    container.style.height = container.style.height || '100%'
    container.style.boxSizing = container.style.boxSizing || 'border-box'
  } catch (e) { console.warn('[nimbi-cms] container style setup failed', e) }

  const cols = document.createElement('div')
  cols.className = 'columns'

  const navCol = document.createElement('div')
  navCol.className = 'column is-full-mobile is-3-tablet nimbi-nav-wrap'
  navCol.setAttribute('role', 'navigation')
  try {
    const label = (typeof t === 'function') ? t('navigation') : null
    if (label) navCol.setAttribute('aria-label', label)
  } catch (e) {
    console.warn('[nimbi-cms] set nav aria-label failed', e)
  }
  cols.appendChild(navCol)

  const contentCol = document.createElement('div')
  contentCol.className = 'column nimbi-content'
  contentCol.setAttribute('role', 'main')
  cols.appendChild(contentCol)

  container.appendChild(cols)

  const navWrap = navCol
  const contentWrap = contentCol

  mountEl.appendChild(container)

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
  const pageDir = pagePath.endsWith('/') ? pagePath : pagePath.substring(0, pagePath.lastIndexOf('/') + 1)
  try { initialDocumentTitle = document.title || '' } catch (e) { initialDocumentTitle = ''; console.warn('[nimbi-cms] read initial document title failed', e) }
  let cp = contentPath
  // treat '.' or './' as "current directory root" (no extra path)
  if (cp === '.' || cp === './') cp = ''
  if (cp.startsWith('./')) cp = cp.slice(2)
  if (cp.startsWith('/')) cp = cp.slice(1)
  // Normalize `cp` so that:
  // - an empty string means "same directory as the current page" (no extra '/'),
  // - non-empty values always end with a trailing '/'.
  if (cp !== '' && !cp.endsWith('/')) cp = cp + '/'
  const contentBase = new URL(pageDir + cp, location.origin).toString()
  try { setHomePage && setHomePage(homePage) } catch (e) { /* ignore */ }
  if (l10nFile) await loadL10nFile(l10nFile, pageDir)
  if (availableLanguages && Array.isArray(availableLanguages)) {
    // Set the list of languages used for slug resolution and navigation mapping.
    // This controls whether paths like `en/foo.md` are treated as per-language
    // variants of the same slug.
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
    mountEl.insertBefore(navbarWrap, container)
    const navMd = await fetchMarkdown('_navigation.md', contentBase)
    const parsedNav = await parseMarkdownToHtml(navMd.raw || '')
    const { navbar, linkEls } = await buildNav(navbarWrap, container, parsedNav.html || '', contentBase, homePage, t, ui.renderByQuery, effectiveSearchEnabled, searchIndexMode, indexDepth, noIndexing)
    try { await runHooks('onNavBuild', { navWrap, navbar, linkEls, contentBase }) } catch (e) { console.warn('[nimbi-cms] onNavBuild hooks failed', e) }
    
    try {
      const computeAndSet = () => {
        const navHeight = (navbarWrap && navbarWrap.getBoundingClientRect && Math.round(navbarWrap.getBoundingClientRect().height)) || (navbarWrap && navbarWrap.offsetHeight) || 0
        if (navHeight > 0) {
          try { mountEl.style.setProperty('--nimbi-site-navbar-height', `${navHeight}px`) } catch (err) { console.warn('[nimbi-cms] set CSS var failed', err) }
          try { container.style.paddingTop = '' } catch (err) { console.warn('[nimbi-cms] set container paddingTop failed', err) }
          try {
            // set explicit pixel height to avoid layout differences across browsers
            const mountH = (mountEl && mountEl.getBoundingClientRect && Math.round(mountEl.getBoundingClientRect().height)) || (mountEl && mountEl.clientHeight) || 0
            if (mountH > 0) {
              const explicit = Math.max(0, mountH - navHeight)
              try { container.style.boxSizing = 'border-box' } catch (e) { console.warn('[nimbi-cms] set container boxSizing failed', e) }
              try { container.style.height = `${explicit}px` } catch (err) { console.warn('[nimbi-cms] set container height failed', err) }
              try { container.style.setProperty('--nimbi-cms-height', `${explicit}px`) } catch (err) { console.warn('[nimbi-cms] set --nimbi-cms-height failed', err) }
            } else {
              try { container.style.height = `calc(100% - var(--nimbi-site-navbar-height))` } catch (err) { console.warn('[nimbi-cms] set container height failed', err) }
              try { container.style.setProperty('--nimbi-cms-height', 'calc(100% - var(--nimbi-site-navbar-height))') } catch (err) { console.warn('[nimbi-cms] set --nimbi-cms-height failed', err) }
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
  
  // Show a subtle version label in the bottom-left corner (non-blocking).
  try {
    import('./version.js').then(({ getVersion }) => {
      if (typeof getVersion === 'function') {
        getVersion().then(ver => {
          try {
            const v = ver || '0.0.0'
            const label = document.createElement('div')
            label.className = 'nimbi-version-label'
            label.textContent = `Ninbi CMS v. ${v}`
            label.style.position = 'absolute'
            label.style.left = '8px'
            label.style.bottom = '6px'
            label.style.fontSize = '11px'
            label.style.opacity = '0.6'
            label.style.pointerEvents = 'none'
            label.style.zIndex = '9999'
            label.style.userSelect = 'none'
            try { mountEl.appendChild(label) } catch (err) { console.warn('[nimbi-cms] append version label failed', err) }
          } catch (err) { console.warn('[nimbi-cms] building version label failed', err) }
        }).catch((e) => { console.warn('[nimbi-cms] getVersion() failed', e) })
      }
    }).catch((e) => { console.warn('[nimbi-cms] import version module failed', e) })
  } catch (err) { console.warn('[nimbi-cms] version label setup failed', err) }
  


}
