import 'highlight.js/styles/monokai.css'
import { slugToMd, mdToSlug, slugify, fetchMarkdown, setContentBase } from './filesManager.js'
import { isExternalLink, normalizePath, safe } from './utils/helpers.js'
import { createNavTree, preScanHtmlSlugs, preMapMdSlugs, prepareArticle, renderNotFound, attachTocClickHandler, scrollToAnchorOrTop, ensureScrollTopButton } from './htmlBuilder.js'
import { applyPageMeta } from './seoManager.js'
import { parseMarkdownToHtml } from './markdown.js'
import { fetchPageData } from './router.js'
import { loadSupportedLanguages } from './codeblocksManager.js'
import { t, loadL10nFile, setLang } from './l10nManager.js'
import { ensureBulma, setStyle, setThemeVars } from './bulmaManager.js'

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
 */
export function onPageLoad(fn) { addHook('onPageLoad', fn) }
/**
 * Register a callback once the navigation DOM has been built.
 * @param {Function} fn
 */
export function onNavBuild(fn) { addHook('onNavBuild', fn) }
/**
 * Register a callback that can mutate the article element before it is
 * appended to the document.
 * @param {Function} fn
 */
export function transformHtml(fn) { addHook('transformHtml', fn) }

async function runHooks(name, ctx) {
  const list = hooks[name] || []
  for (const fn of list) {
    try {
      await fn(ctx)
    } catch (e) {
      // swallow errors from plugin code to avoid crashing the host
    }
  }
}

// test helpers ---------------------------------------------------------------

// reset all registered hooks (used by unit tests so each spec starts clean)
export function _clearHooks() {
  Object.keys(hooks).forEach(k => { hooks[k].length = 0 })
}



/**
 * Initialize the CMS in a host page.
 *
 * @param {Object} options
 * @param {string|Element} options.el - mount point selector or element
 * @param {string} [options.contentPath='/content'] - URL path to content
 * @param {number} [options.crawlMaxQueue] - maximum directory queue length for slug crawling (see docs)
 * @param {ThemeStyle} [options.defaultStyle='light'] - initial light/dark mode
 * @param {string} [options.bulmaCustomize='none'] - Bulma customization flag
 * @param {string} [options.lang] - UI language code
 * @param {string|null} [options.l10nFile] - path to localization file
 * @returns {Promise<void>} resolves once the initial page has rendered
 */
export async function initCMS({ el, contentPath = '/content', /* eslint-disable no-unused-vars */ crawlMaxQueue = 1000, defaultStyle = 'light', bulmaCustomize = 'none', lang = undefined, l10nFile = null } = {}) {
      if (!el) throw new Error('el is required')

      let mountEl = el
      if (typeof el === 'string') {
        mountEl = document.querySelector(el)
        if (!mountEl) throw new Error(`el selector "${el}" did not match any element`)
      } else if (!(el instanceof Element)) {
        throw new Error('el must be a CSS selector string or a DOM element')
      }

      try {
        mountEl.classList.add('nimbi-mount')
        mountEl.style.position = mountEl.style.position || 'relative'
        mountEl.style.overflow = mountEl.style.overflow || 'hidden'
      } catch (e) { }

      const container = document.createElement('div')
      container.className = 'nimbi-cms'
      try {
        container.style.position = container.style.position || 'relative'
        container.style.overflow = container.style.overflow || 'auto'
        try { if (!container.style.webkitOverflowScrolling) container.style.webkitOverflowScrolling = 'touch' } catch (e) { }
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
  }

  const pagePath = location.pathname || '/'
  const pageDir = pagePath.endsWith('/') ? pagePath : pagePath.substring(0, pagePath.lastIndexOf('/') + 1)
  try { initialDocumentTitle = document.title || '' } catch (e) { initialDocumentTitle = '' }
  let cp = contentPath
  if (cp.startsWith('./')) cp = cp.slice(2)
  if (!cp.endsWith('/')) cp = cp + '/'
  const contentBase = new URL(pageDir + cp, location.origin).toString()
  if (l10nFile) await loadL10nFile(l10nFile, pageDir)
  if (lang) setLang(lang)

  // allow crawling behavior to be tuned by consumer
  try {
    if (typeof crawlMaxQueue === 'number') {
      // eslint-disable-next-line no-unused-vars
      import('./filesManager.js').then(({ setDefaultCrawlMaxQueue }) => {
        try { setDefaultCrawlMaxQueue(crawlMaxQueue) } catch (_) {}
      })
    }
  } catch (_) {}

  // Inform filesManager of the runtime content base so slug -> md mapping
  // can be computed relative to the correct path instead of relying on
  // hardcoded segments.
  try { setContentBase(contentBase) } catch (_) { }
  try {
    await fetchMarkdown('_home.md', contentBase)
  } catch (e) {
    throw new Error(`Required _home.md not found at ${contentBase}_home.md: ${e.message}`)
  }

  setStyle(defaultStyle)
  await ensureBulma(bulmaCustomize, pageDir)

  try {
    const navbarWrap = document.createElement('header')
    navbarWrap.className = 'nimbi-site-navbar'
    mountEl.insertBefore(navbarWrap, container)
    const navMd = await fetchMarkdown('_navigation.md', contentBase)
    const parsedNav = await parseMarkdownToHtml(navMd.raw || '')

    const parser = new DOMParser()
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
            let md = m[1].replace(/^\.\//, '')
            if (md.startsWith('/')) md = md.replace(/^\//, '')
            brandItem.href = '?page=' + encodeURIComponent(md)
          } else {
            // fallback to raw href if it's an external link
            brandItem.href = rawHref
          }
        }
      } catch (e) {
        // non-URL hrefs (hash-only or strange formats) -> handle simple cases
        if (/^[#].*\.md$/.test(rawHref)) brandItem.href = '?page=' + encodeURIComponent(rawHref.replace(/^#/, ''))
        else if (/\.md$/.test(rawHref)) brandItem.href = '?page=' + encodeURIComponent(rawHref.replace(/^\.\//, ''))
        else brandItem.href = rawHref
      }
      brandItem.textContent = firstLink.textContent || t('home')
    } else {
      // ensure brand goes to the explicit home page slug
      brandItem.href = '?page=_home.md'
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
            try { renderByQuery() } catch (e) { }
          }
        } catch (e) { }
      })
    } catch (e) { }

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

    for (let i = 0; i < linkEls.length; i++) {
      const a = linkEls[i]
      if (i === 0) continue
      const href = a.getAttribute('href') || '#'
      const item = document.createElement('a')
      item.className = 'navbar-item'
      try {
        // Markdown links -> keep existing behavior
        if (/^[^#]*\.md(?:$|[#?])/.test(href) || href.endsWith('.md')) {
          const mdRaw = href.replace(/^\.\//, '')
          // support legacy '::' or hash anchors in nav links
          const parts = mdRaw.split(/::|#/, 2)
          const mdPath = parts[0]
          const frag = parts[1]
          item.href = '?page=' + encodeURIComponent(mdPath) + (frag ? '#' + encodeURIComponent(frag) : '')
        } else if (/\.html(?:$|[#?])/.test(href) || href.endsWith('.html')) {
          // HTML file - fetch title to produce friendly slug and map it
          const raw = href.replace(/^\.\//, '')
          const parts = raw.split(/::|#/, 2)
          const htmlPath = parts[0]
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
                    try { slugToMd.set(slugKey, htmlPath); mdToSlug.set(htmlPath, slugKey) } catch (ee) { }
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
                  try { slugToMd.set(slugKey, decoded); mdToSlug.set(decoded, slugKey) } catch (ee) { }
                }
              } catch (ee) { }
            }
          } catch (ee) { }
        }
      } catch (ee) { }



            item.textContent = a.textContent || href
            start.appendChild(item)
          }

    menu.appendChild(start)
    navbar.appendChild(brand)
    navbar.appendChild(menu)
    navbarWrap.appendChild(navbar)

    // invoke nav-build hooks so plugins can tweak the DOM or track data
    try { await runHooks('onNavBuild', { navWrap, navbar, linkEls, contentBase }) } catch (e) { }

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
            try { renderByQuery() } catch (e) { }
          }
        } catch (e) { }
      })
    } catch (e) { }

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
            try { renderByQuery() } catch (e) { }
          }
        } catch (e) {
          // ignore non-URL hrefs
        }
      })
    } catch (e) { }

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
        } catch (e) { }
      }
      updateContainerHeight()
      if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(updateContainerHeight)
        ro.observe(navbarWrap)
      } else {
        window.addEventListener('resize', updateContainerHeight)
      }
    } catch (e) { }
  } catch (e) {
  }

  try {
    // start loading supported languages in background; do not block render
    try { loadSupportedLanguages().catch(() => {}) } catch (e) { }
  } catch (e) {
  }

  const siteNav = createNavTree(t, [{ path: '_home.md', name: t('home'), isIndex: true, children: [] }])
  let currentPagePath = null





    async function renderPage(raw, hashAnchor) {
      let data, pagePath, anchor
      try {
          ({data,pagePath,anchor} = await fetchPageData(raw, contentBase))
        } catch (e) {
          renderNotFound(contentWrap, t, e)
          return
        }
      if (!anchor && hashAnchor) anchor = hashAnchor
      // reset scroll before inserting new page; if an anchor is present
      // the later scrollToAnchorOrTop call will position correctly.
      try { scrollToAnchorOrTop(null) } catch (_) {}
      contentWrap.innerHTML = ''

      const { article, parsed, toc, topH1, h1Text, slugKey } = await prepareArticle(t, data, pagePath, anchor, contentBase)

      applyPageMeta(t, initialDocumentTitle, parsed, toc, article, pagePath, anchor, topH1, h1Text, slugKey, data)

      navWrap.innerHTML = ''
      navWrap.appendChild(toc)
      attachTocClickHandler(toc)

      // allow plugins to modify the generated article element before it is
      // placed in the document (e.g. for analytics, extra widgets, etc.)
      try { await runHooks('transformHtml', { article, parsed, toc, pagePath, anchor, topH1, h1Text, slugKey, data }) } catch (e) { }

      contentWrap.appendChild(article)

      scrollToAnchorOrTop(anchor)
      ensureScrollTopButton(article, topH1, { mountOverlay, container, mountEl, navWrap, t })

      // fire the onPageLoad hooks after everything is in place
      try { await runHooks('onPageLoad', { data, pagePath, anchor, article, toc, topH1, h1Text, slugKey, contentWrap, navWrap }) } catch (e) { }

      currentPagePath = pagePath
    }

    async function renderByQuery() {
      const raw = (new URLSearchParams(location.search).get('page')) || '_home.md'
      const hashAnchor = location.hash ? decodeURIComponent(location.hash.replace(/^#/, '')) : null
      await renderPage(raw, hashAnchor)
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

export default initCMS
