/**
 * Initialization logic extracted from nimbi-cms.js to keep the top-level
 * entrypoint small.  This module exports the `initCMS` function which is
 * responsible for validating options, constructing the DOM scaffolding, and
 * delegating navigation and UI behaviour to helper modules.
 */

import { fetchMarkdown, setContentBase, setNotFoundPage } from './slugManager.js'
import * as router from './router.js'
import { parseMarkdownToHtml } from './markdown.js'
import * as markdown from './markdown.js'
import { buildNav } from './nav.js'
import { createUI } from './ui.js'
import { runHooks } from './hookManager.js'
import { t, loadL10nFile, setLang } from './l10nManager.js'
import { ensureBulma, setStyle } from './bulmaManager.js'

// persisted state used during init/render operations
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
 * @param {string|Element} options.el - mount point selector or element
 * @param {string} [options.contentPath='/content'] - URL path to content
 * @param {number} [options.crawlMaxQueue=1000] - maximum directory queue length for slug crawling (see docs)
 * @param {boolean} [options.searchIndex=true] - build a client-side search index (adds search box to navbar)
 * @param {('eager'|'lazy'|'off')} [options.searchIndexMode='eager'] - when to build the search index
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

  const {
    el,
    contentPath = '/content',
          crawlMaxQueue = 1000,
    searchIndex: searchEnabled = true,
    searchIndexMode = 'eager',
    defaultStyle = 'light',
    bulmaCustomize = 'none',
    lang = undefined,
    l10nFile = null,
    cacheTtlMinutes = 5,
    cacheMaxEntries,
    markdownExtensions,
    homePage = '_home.md',
    notFoundPage = '_404.md'
  } = options

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

  if (searchIndexMode != null && searchIndexMode !== 'eager' && searchIndexMode !== 'lazy' && searchIndexMode !== 'off') {
    throw new TypeError('initCMS(options): "searchIndexMode" must be "eager", "lazy", or "off" when provided')
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

  if (homePage != null && (typeof homePage !== 'string' || !homePage.trim() || !/\.(md|html)$/.test(homePage))) {
    throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html')
  }

  if (notFoundPage != null && (typeof notFoundPage !== 'string' || !notFoundPage.trim() || !/\.(md|html)$/.test(notFoundPage))) {
    throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html')
  }

  const effectiveSearchEnabled = searchEnabled && searchIndexMode !== 'off'

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
  cols.appendChild(navCol)

  const contentCol = document.createElement('div')
  contentCol.className = 'column nimbi-content'
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
  // remove any leading './' or '/' to avoid creating protocol-relative URLs
  if (cp.startsWith('./')) cp = cp.slice(2)
  if (cp.startsWith('/')) cp = cp.slice(1)
  if (!cp.endsWith('/')) cp = cp + '/'
  const contentBase = new URL(pageDir + cp, location.origin).toString()
  if (l10nFile) await loadL10nFile(l10nFile, pageDir)
  if (lang) setLang(lang)

  // set up UI helpers early so we can supply the render callback to nav builder
  const ui = createUI({ contentWrap, navWrap, container, mountOverlay, t, contentBase, homePage, initialDocumentTitle, runHooks })

  // configure router cache TTL if user supplied minutes
  if (typeof cacheTtlMinutes === 'number' && cacheTtlMinutes >= 0) {
    // use the exported setter to avoid namespace immutability errors
    if (typeof router.setResolutionCacheTtl === 'function') {
      router.setResolutionCacheTtl(cacheTtlMinutes * 60 * 1000)
    }
  }
  // configure router max entries if given
  if (typeof cacheMaxEntries === 'number' && cacheMaxEntries >= 0) {
    if (typeof router.setResolutionCacheMax === 'function') {
      router.setResolutionCacheMax(cacheMaxEntries)
    }
  }
  // register any markdown extensions passed on init
  if (markdownExtensions && Array.isArray(markdownExtensions) && markdownExtensions.length) {
    try {
      markdownExtensions.forEach(ext => {
        if (typeof ext === 'object' && markdown && typeof markdown.addMarkdownExtension === 'function') {
          markdown.addMarkdownExtension(ext)
        }
      })
    } catch (err) { console.warn('[nimbi-cms] applying markdownExtensions failed', err) }
  }

  // allow crawling behavior to be tuned by consumer
  try {
    if (typeof crawlMaxQueue === 'number') {
       
      import('./slugManager.js').then(({ setDefaultCrawlMaxQueue }) => {
        try { setDefaultCrawlMaxQueue(crawlMaxQueue) } catch (_) { console.warn('[nimbi-cms] setDefaultCrawlMaxQueue failed', _) }
      })
    }
  } catch (err) { console.warn('[nimbi-cms] setDefaultCrawlMaxQueue import failed', err) }

  // Inform filesManager of the runtime content base so slug -> md mapping
  // can be computed relative to the correct path instead of relying on
  // hardcoded segments.
  try { setContentBase(contentBase) } catch (err) { console.warn('[nimbi-cms] setContentBase failed', err) }
  try { setNotFoundPage(notFoundPage) } catch (err) { console.warn('[nimbi-cms] setNotFoundPage failed', err) }
  try {
    await fetchMarkdown(homePage, contentBase)
  } catch (e) {
    // Preserve historical error message when using the default home
    // page so unit tests depending on the exact wording still pass.
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
    const { navbar, linkEls } = await buildNav(navbarWrap, container, parsedNav.html || '', contentBase, homePage, t, ui.renderByQuery, effectiveSearchEnabled, searchIndexMode)
    try { await runHooks('onNavBuild', { navWrap, navbar, linkEls, contentBase }) } catch (e) { console.warn('[nimbi-cms] onNavBuild hooks failed', e) }
  } catch (e) {
    console.warn('[nimbi-cms] build navigation failed', e)
  }
  // initial render once navigation is in place
  await ui.renderByQuery()

  // supported languages list will be fetched lazily when we first
  // encounter a code block or register a language.  preloading here is
  // optional and no longer necessary.


}
