import 'highlight.js/styles/monokai.css'
import { slugToMd, mdToSlug, slugify, fetchMarkdown, setContentBase, setNotFoundPage } from './filesManager.js'
import * as router from './router.js'
import { isExternalLink, normalizePath, safe } from './utils/helpers.js'
import { createNavTree, preScanHtmlSlugs, preMapMdSlugs, prepareArticle, renderNotFound, attachTocClickHandler, scrollToAnchorOrTop, ensureScrollTopButton } from './htmlBuilder.js'
import { applyPageMeta } from './seoManager.js'
import { parseMarkdownToHtml } from './markdown.js'
import { fetchPageData } from './router.js'
import { t, loadL10nFile, setLang } from './l10nManager.js'
import * as markdown from './markdown.js'
import { ensureBulma, setStyle } from './bulmaManager.js'

// Pre-scan nav links for HTML files and map title/H1 -> slug to avoid nav-time fetches

let currentHighlightTheme = 'monokai'
let initialDocumentTitle = ''

// --- plugin/hook subsystem -------------------------------------------------

/**
 * Built-in hook names and their callback lists.  External code can register
 * handlers to be invoked at key events in the CMS lifecycle.
 */
const hooks = {
  onPageLoad: [],      // called after a page has been rendered
  onNavBuild: [],      // called after the navigation DOM is constructed
  transformHtml: []    // allow modification of the article DOM before insertion
}

/**
 * Register a hook by name.  Throws if the name is not recognised.
 * @param {string} name
 * @param {Function} fn
 * @returns {void}
 */
export function addHook(name, fn) {
  if (!Object.prototype.hasOwnProperty.call(hooks, name)) {
    throw new Error('Unknown hook "' + name + '"')
  }
  if (typeof fn !== 'function') {
    throw new TypeError('hook callback must be a function')
  }
  hooks[name].push(fn)
}

/**
 * Convenience wrappers for the most common hooks.
 */
/**
 * Register a callback to be invoked after each page is rendered.
 * @param {Function} fn
 * @returns {void}
 */
export function onPageLoad(fn) { addHook('onPageLoad', fn) }
/**
 * Register a callback once the navigation DOM has been built.
 * @param {Function} fn
 * @returns {void}
 */
export function onNavBuild(fn) { addHook('onNavBuild', fn) }
/**
 * Register a callback that can mutate the article element before it is
 * appended to the document.
 * @param {Function} fn
 * @returns {void}
 */
export function transformHtml(fn) { addHook('transformHtml', fn) }

/**
 * Invoke all registered hook callbacks for the given hook `name` with a
 * supplied context object. Errors from individual callbacks are swallowed.
 *
 * @param {string} name - hook name
 * @param {object} ctx - context passed to callbacks
 * @returns {Promise<void>}
 */
async function runHooks(name, ctx) {
  const list = hooks[name] || []
  for (const fn of list) {
    try {
      await fn(ctx)
    } catch (e) {
      console.warn('[nimbi-cms] runHooks callback failed', e)
    }
  }
}

// test helpers ---------------------------------------------------------------

// reset all registered hooks (used by unit tests so each spec starts clean)
/**
 * Clear all hooks registered via `addHook` (testing use only).
 * @returns {void}
 */
export function _clearHooks() {
  Object.keys(hooks).forEach(k => { hooks[k].length = 0 })
}



const SHARED_DOM_PARSER = typeof DOMParser !== 'undefined' ? new DOMParser() : null

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
        /* eslint-disable no-unused-vars */ crawlMaxQueue = 1000,
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
  } catch (e) { }

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
       
      import('./filesManager.js').then(({ setDefaultCrawlMaxQueue }) => {
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

    const parser = SHARED_DOM_PARSER || new DOMParser()
    const navDoc = parser.parseFromString(parsedNav.html || '', 'text/html')
    const linkEls = navDoc.querySelectorAll('a')
    // populate slug maps from any HTML links (for HTML pages) and from
    // markdown links appearing in the navigation.  Doing this before the
    // first page render ensures that a slug referring to a nav page will
    // resolve even when that page hasn't yet been visited.
    await safe(() => preScanHtmlSlugs(linkEls, contentBase))
    await safe(() => preMapMdSlugs(linkEls, contentBase))

    const navbar = document.createElement('nav')
    navbar.className = 'navbar'
    navbar.setAttribute('role', 'navigation')
    navbar.setAttribute('aria-label', 'main navigation')

    const brand = document.createElement('div')
    brand.className = 'navbar-brand'
    const firstLink = linkEls[0]
    const brandItem = document.createElement('a')
    brandItem.className = 'navbar-item'
    if (firstLink) {
      const rawHref = firstLink.getAttribute('href') || '#'
      try {
        // Prefer canonical `?page=` form so SPA navigation resets page param correctly
        const u = new URL(rawHref, location.href)
        const p = u.searchParams.get('page')
        if (p) {
          brandItem.href = '?page=' + encodeURIComponent(decodeURIComponent(p))
        } else if (u.hash && /\.md$/.test(u.hash.replace(/^#/, ''))) {
          const h = u.hash.replace(/^#/, '')
          brandItem.href = '?page=' + encodeURIComponent(h)
        } else {
          const m = (u.pathname || '').match(/([^\/]+\.md)(?:$|[?#])/)
          if (m) {
            let md = normalizePath(m[1])
            brandItem.href = '?page=' + encodeURIComponent(md)
          } else {
            // fallback to raw href if it's an external link
            brandItem.href = rawHref
          }
        }
      } catch (e) {
        // non-URL hrefs (hash-only or strange formats) -> handle simple cases
        if (/^[#].*\.md$/.test(rawHref)) brandItem.href = '?page=' + encodeURIComponent(rawHref.replace(/^#/, ''))
        else if (/\.md$/.test(rawHref)) brandItem.href = '?page=' + encodeURIComponent(normalizePath(rawHref))
        else brandItem.href = rawHref
      }
      brandItem.textContent = firstLink.textContent || t('home')
    } else {
      // ensure brand goes to the explicit home page slug
      brandItem.href = '?page=' + encodeURIComponent(homePage)
      brandItem.textContent = t('home')
    }
    brand.appendChild(brandItem)
    try {
      // intercept clicks on the brand (home) link to perform SPA navigation
      brandItem.addEventListener('click', (ev) => {
        try {
          const href = brandItem.getAttribute('href') || ''
          const url = new URL(href, location.href)
          const pageParam = url.searchParams.get('page')
          const hash = url.hash ? url.hash.replace(/^#/, '') : null
          if (pageParam) {
            ev.preventDefault()
            history.pushState({ page: pageParam }, '', '?page=' + encodeURIComponent(pageParam) + (hash ? '#' + encodeURIComponent(hash) : ''))
            try { renderByQuery() } catch (e) { console.warn('[nimbi-cms] renderByQuery failed', e) }
          }
        } catch (e) { console.warn('[nimbi-cms] brand click handler failed', e) }
      })
    } catch (e) { console.warn('[nimbi-cms] attach brand click handler failed', e) }

    const burger = document.createElement('a')
    burger.className = 'navbar-burger'
    burger.setAttribute('role', 'button')
    burger.setAttribute('aria-label', 'menu')
    burger.setAttribute('aria-expanded', 'false')
    const targetId = 'nimbi-navbar-menu'
    burger.dataset.target = targetId
    burger.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>'
    brand.appendChild(burger)

    const menu = document.createElement('div')
    menu.className = 'navbar-menu'
    menu.id = targetId
    const start = document.createElement('div')
    start.className = 'navbar-start'
    // optional search UI container on right side
    let end, searchItem, searchInput, resultsContainer, searchIndexPromise
    if (effectiveSearchEnabled) {
      end = document.createElement('div')
      end.className = 'navbar-end'
      searchItem = document.createElement('div')
      searchItem.className = 'navbar-item'

      searchInput = document.createElement('input')
      searchInput.className = 'input'
      searchInput.type = 'search'
      // placeholder text comes from localization
      searchInput.placeholder = t('searchPlaceholder') || ''
      searchInput.id = 'nimbi-search'
      // disable until index has been built and show loading spinner
      searchInput.disabled = true
      searchInput.classList.add('is-loading')
      searchItem.appendChild(searchInput)

      resultsContainer = document.createElement('div')
      resultsContainer.id = 'nimbi-search-results'
      // use Bulma "box" style for the dropdown
      resultsContainer.className = 'box'
      searchItem.appendChild(resultsContainer)
      end.appendChild(searchItem)

      if (searchIndexMode === 'eager') {
        try {
          searchIndexPromise = (async () => {
            try {
              const fm = await import('./filesManager.js')
              return fm.buildSearchIndex(contentBase)
            } catch (_) {
              return []
            }
          })()
        } catch (_) {
          searchIndexPromise = Promise.resolve([])
        }
        searchIndexPromise.finally(() => {
          if (searchInput) {
            searchInput.disabled = false
            searchInput.classList.remove('is-loading')
          }
        })
      }
    }

    for (let i = 0; i < linkEls.length; i++) {
      const a = linkEls[i]
      if (i === 0) continue
      const href = a.getAttribute('href') || '#'
      const item = document.createElement('a')
      item.className = 'navbar-item'
      try {
        // Markdown links -> keep existing behavior
        if (/^[^#]*\.md(?:$|[#?])/.test(href) || href.endsWith('.md')) {
          const mdRaw = normalizePath(href)
          // support legacy '::' or hash anchors in nav links
          const parts = mdRaw.split(/::|#/, 2)
          const mdPath = parts[0]
          const frag = parts[1]
          item.href = '?page=' + encodeURIComponent(mdPath) + (frag ? '#' + encodeURIComponent(frag) : '')
        } else if (/\.html(?:$|[#?])/.test(href) || href.endsWith('.html')) {
          // HTML file - fetch title to produce friendly slug and map it
          let raw = normalizePath(href)
          const parts = raw.split(/::|#/, 2)
          let htmlPath = parts[0]
          // ensure explicit .html suffix when missing, as authors may link
          // without extensions (server may still serve the HTML file).
          if (htmlPath && !htmlPath.toLowerCase().endsWith('.html')) {
            htmlPath = htmlPath + '.html'
          }
          const frag = parts[1]
          try {
            const res = await fetchMarkdown(htmlPath, contentBase)
            if (res && res.raw) {
              try {
                const parser = new DOMParser()
                const doc = parser.parseFromString(res.raw, 'text/html')
                const titleTag = doc.querySelector('title')
                const h1 = doc.querySelector('h1')
                const titleText = (titleTag && titleTag.textContent && titleTag.textContent.trim()) ? titleTag.textContent.trim() : (h1 && h1.textContent ? h1.textContent.trim() : null)
                if (titleText) {
                  const slugKey = slugify(titleText)
                  if (slugKey) {
                    try { slugToMd.set(slugKey, htmlPath); mdToSlug.set(htmlPath, slugKey) } catch (ee) { console.warn('[nimbi-cms] slugToMd/mdToSlug set failed', ee) }
                    item.href = '?page=' + encodeURIComponent(slugKey) + (frag ? '#' + encodeURIComponent(frag) : '')
                  } else {
                    item.href = '?page=' + encodeURIComponent(htmlPath) + (frag ? '#' + encodeURIComponent(frag) : '')
                  }
                } else {
                  item.href = '?page=' + encodeURIComponent(htmlPath) + (frag ? '#' + encodeURIComponent(frag) : '')
                }
              } catch (ee) {
                item.href = '?page=' + encodeURIComponent(htmlPath) + (frag ? '#' + encodeURIComponent(frag) : '')
              }
            } else {
              item.href = href
            }
          } catch (ee) {
            item.href = href
          }
        } else {
          item.href = href
        }
      } catch (e) { item.href = href }
      try {
        // populate slug <-> md mappings from navbar link text so direct slugs resolve
        const displayName = (a.textContent && String(a.textContent).trim()) ? String(a.textContent).trim() : null
        if (displayName) {
          try {
            const slugKey = slugify(displayName)
            if (slugKey) {
              // if this nav link refers to a markdown page, map slug->md
              const parsedHref = (item.getAttribute && item.getAttribute('href')) ? item.getAttribute('href') : ''
              try {
                const url = new URL(parsedHref, location.href)
                const p = url.searchParams.get('page')
                if (p) {
                  const decoded = decodeURIComponent(p)
                  try { slugToMd.set(slugKey, decoded); mdToSlug.set(decoded, slugKey) } catch (ee) { console.warn('[nimbi-cms] slugToMd/mdToSlug set failed', ee) }
                }
              } catch (ee) { console.warn('[nimbi-cms] nav slug mapping failed', ee) }
            }
          } catch (ee) { console.warn('[nimbi-cms] nav slug mapping failed', ee) }
        }
      } catch (ee) { console.warn('[nimbi-cms] nav slug mapping failed', ee) }



      item.textContent = a.textContent || href
      start.appendChild(item)
    }

    menu.appendChild(start)
    menu.appendChild(end)
    navbar.appendChild(brand)
    navbar.appendChild(menu)
    navbarWrap.appendChild(navbar)

    // attach search box behavior (only valid if input exists)
    try {
      const input = document.getElementById('nimbi-search')
      const results = document.getElementById('nimbi-search-results')
      let currentIndex = []
      const showResults = (items) => {
        results.innerHTML = ''
        if (!items.length) {
          results.style.display = 'none'
          return
        }
        items.forEach(it => {
          const a = document.createElement('a')
          a.className = 'block'
          a.href = '?page=' + encodeURIComponent(it.slug)
          a.textContent = it.title
          // make sure long titles are truncated with ellipsis
          a.style.whiteSpace = 'nowrap'
          a.style.overflow = 'hidden'
          a.style.textOverflow = 'ellipsis'
          // Bulma box padding handles spacing; we still want clickable blocks
          a.addEventListener('click', () => { results.style.display = 'none' })
          results.appendChild(a)
        })
        results.style.display = 'block'
        // ensure container is right-aligned (in case CSS not applied yet)
        results.style.right = '0'
        results.style.left = 'auto'
      }
      const debounce = (fn, delay) => {
        let timer = null
        return (...args) => {
          if (timer) clearTimeout(timer)
          timer = setTimeout(() => fn(...args), delay)
        }
      }

      if (input) {
        const handleInput = debounce(async () => {
          const q = String(input.value || '').trim().toLowerCase()
          if (!q) { showResults([]); return }
          try {
            const fm = await import('./filesManager.js')
            if (!searchIndexPromise) {
              searchIndexPromise = (async () => {
                try {
                  if (searchIndexMode === 'lazy' && fm.buildSearchIndexWorker) {
                    return fm.buildSearchIndexWorker(contentBase)
                  }
                  return fm.buildSearchIndex(contentBase)
                } catch (_) {
                  return []
                } finally {
                  if (searchInput) {
                    searchInput.disabled = false
                    searchInput.classList.remove('is-loading')
                  }
                }
              })()
            }
            const idx = await searchIndexPromise
            const filtered = idx.filter(e => (e.title && e.title.toLowerCase().includes(q)) || (e.excerpt && e.excerpt.toLowerCase().includes(q)))
            showResults(filtered.slice(0, 10))
          } catch (_) { showResults([]) }
        }, 50)

        input.addEventListener('input', handleInput)
        // hide results when clicking outside
        document.addEventListener('click', (ev) => {
          if (input && !input.contains(ev.target) && results && !results.contains(ev.target)) {
            results.style.display = 'none'
          }
        })
      }
    } catch (_) { console.warn('[nimbi-cms] navbar/search setup inner failed', _) }

    // invoke nav-build hooks so plugins can tweak the DOM or track data
    try { await runHooks('onNavBuild', { navWrap, navbar, linkEls, contentBase }) } catch (e) { console.warn('[nimbi-cms] onNavBuild hooks failed', e) }

    // intercept internal query links in the navbar to perform SPA navigation
    try {
      menu.addEventListener('click', (ev) => {
        const a = ev.target && ev.target.closest ? ev.target.closest('a') : null
        if (!a) return
        const href = a.getAttribute('href') || ''
        try {
          const url = new URL(href, location.href)
          const pageParam = url.searchParams.get('page')
          const hash = url.hash ? url.hash.replace(/^#/, '') : null
          if (pageParam) {
            ev.preventDefault()
            history.pushState({ page: pageParam }, '', '?page=' + encodeURIComponent(pageParam) + (hash ? '#' + encodeURIComponent(hash) : ''))
            try { renderByQuery() } catch (e) { console.warn('[nimbi-cms] renderByQuery failed', e) }
          }
        } catch (e) { console.warn('[nimbi-cms] navbar click handler failed', e) }
      })
    } catch (e) { console.warn('[nimbi-cms] attach content click handler failed', e) }

    try {
      // intercept internal links inside the content area so they use SPA navigation
      container.addEventListener('click', (ev) => {
        const a = ev.target && ev.target.closest ? ev.target.closest('a') : null
        if (!a) return
        const href = a.getAttribute('href') || ''
        if (!href) return
        // ignore external/mailto/tel links
        if (isExternalLink(href)) return
        try {
          const url = new URL(href, location.href)
          const pageParam = url.searchParams.get('page')
          const hash = url.hash ? url.hash.replace(/^#/, '') : null
          if (pageParam) {
            ev.preventDefault()
            history.pushState({ page: pageParam }, '', '?page=' + encodeURIComponent(pageParam) + (hash ? '#' + encodeURIComponent(hash) : ''))
            try { renderByQuery() } catch (e) { console.warn('[nimbi-cms] renderByQuery failed', e) }
          }
        } catch (e) {
          // ignore non-URL hrefs
        }
      })
    } catch (e) { console.warn('[nimbi-cms] build navbar failed', e) }

    burger.addEventListener('click', () => {
      const isActive = burger.classList.contains('is-active')
      burger.classList.toggle('is-active')
      menu.classList.toggle('is-active')
      burger.setAttribute('aria-expanded', String(!isActive))
    })
    try {
      const updateContainerHeight = () => {
        try {
          const h = navbarWrap.offsetHeight || 0
          container.style.height = `calc(100% - ${h}px)`
        } catch (e) { console.warn('[nimbi-cms] brand click handler failed', e) }
      }
      updateContainerHeight()
      if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(updateContainerHeight)
        ro.observe(navbarWrap)
      } else {
        window.addEventListener('resize', updateContainerHeight)
      }
    } catch (e) { console.warn('[nimbi-cms] attach brand click handler failed', e) }
  } catch (e) {
  }

  // supported languages list will be fetched lazily when we first
  // encounter a code block or register a language.  preloading here is
  // optional and no longer necessary.

  const siteNav = createNavTree(t, [{ path: homePage, name: t('home'), isIndex: true, children: [] }])
  let currentPagePath = null





  /**
   * Render a page identified by `raw` (slug/path) into the CMS container.
   * This resolves the page, prepares the article DOM and updates navigation.
   * @param {string} raw - raw page identifier (slug, path, or filename)
   * @param {string|null} hashAnchor - optional anchor to scroll to
   * @returns {Promise<void>}
   */
  async function renderPage(raw, hashAnchor) {
    let data, pagePath, anchor
    try {
      ({ data, pagePath, anchor } = await fetchPageData(raw, contentBase))
    } catch (e) {
      console.error('[nimbi-cms] fetchPageData failed', e)
      renderNotFound(contentWrap, t, e)
      return
    }
    if (!anchor && hashAnchor) anchor = hashAnchor
    // reset scroll before inserting new page; if an anchor is present
    // the later scrollToAnchorOrTop call will position correctly.
    try { scrollToAnchorOrTop(null) } catch (_) { console.warn('[nimbi-cms] scrollToAnchorOrTop failed', _) }
    contentWrap.innerHTML = ''

    const { article, parsed, toc, topH1, h1Text, slugKey } = await prepareArticle(t, data, pagePath, anchor, contentBase)

    applyPageMeta(t, initialDocumentTitle, parsed, toc, article, pagePath, anchor, topH1, h1Text, slugKey, data)

    navWrap.innerHTML = ''
    navWrap.appendChild(toc)
    attachTocClickHandler(toc)

    // allow plugins to modify the generated article element before it is
    // placed in the document (e.g. for analytics, extra widgets, etc.)
    try { await runHooks('transformHtml', { article, parsed, toc, pagePath, anchor, topH1, h1Text, slugKey, data }) } catch (e) { console.warn('[nimbi-cms] transformHtml hooks failed', e) }

    contentWrap.appendChild(article)

    scrollToAnchorOrTop(anchor)
    ensureScrollTopButton(article, topH1, { mountOverlay, container, mountEl, navWrap, t })

    // fire the onPageLoad hooks after everything is in place
    try { await runHooks('onPageLoad', { data, pagePath, anchor, article, toc, topH1, h1Text, slugKey, contentWrap, navWrap }) } catch (e) { console.warn('[nimbi-cms] onPageLoad hooks failed', e) }

    currentPagePath = pagePath
  }

  /**
   * Read the current `?page=` query param and render that page.
   * @returns {Promise<void>}
   */
  async function renderByQuery() {
    let raw = (new URLSearchParams(location.search).get('page')) || homePage
    const hashAnchor = location.hash ? decodeURIComponent(location.hash.replace(/^#/, '')) : null
    try {
      await renderPage(raw, hashAnchor)
    } catch (e) {
      console.warn('[nimbi-cms] renderByQuery failed for', raw, e)
      // if initial slug didn’t resolve, show 404 page
      renderNotFound(contentWrap, t, e)
    }
  }

  window.addEventListener('popstate', renderByQuery)
  await renderByQuery()
}

// TOC builder moved to src/htmlBuilder.js

// slugify moved to src/filesManager.js

// SEO helpers moved to src/seoManager.js

// export for tests and plugin authors – not part of the main initCMS API
/**
 * Invoke all registered hooks for a given event name.  This is the internal
 * runner used by the CMS; plugins and tests may call it directly if they need
 * to trigger or inspect hook behavior.  Errors thrown by callbacks are caught
 * and ignored.
 *
 * @param {string} name - hook name ("onPageLoad", "onNavBuild", or
 *                        "transformHtml")
 * @param {object} ctx  - context object supplied to callbacks
 * @returns {Promise<void>}
 */
export { runHooks }

export { registerLanguage, loadSupportedLanguages, observeCodeBlocks, setHighlightTheme, SUPPORTED_HLJS_MAP, BAD_LANGUAGES } from './codeblocksManager.js'

// theming helpers
export { setStyle, setThemeVars } from './bulmaManager.js'

// localization helper functions exposed for runtime language switching
export { t, loadL10nFile, setLang } from './l10nManager.js'

export default initCMS
