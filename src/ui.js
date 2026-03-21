/**
 * UI / hooks exports shim.
 *
 * Re-exports hook registration and runner utilities so UI-related code can
 * import them from a focused module path (`./ui.js`). This keeps the
 * top-level `nimbi-cms.js` file compatible with existing imports while
 * providing a clearer separation for future refactors.
 */
export { addHook, onPageLoad, onNavBuild, transformHtml, runHooks, _clearHooks } from './nimbi-cms.js'

import { fetchPageData } from './router.js'
import { parseHrefToRoute } from './utils/urlHelper.js'
import { prepareArticle, executeEmbeddedScripts, renderNotFound, attachTocClickHandler, scrollToAnchorOrTop, ensureScrollTopButton, createNavTree } from './htmlBuilder.js'
import { setEagerForAboveFoldImages } from './utils/helpers.js'
import { applyPageMeta } from './seoManager.js'
import { attachImagePreview } from './imagePreview.js'



/**
 * Initialize UI rendering helpers for a mounted CMS instance.
 * @typedef {Object} UIOptions
 * @property {HTMLElement} contentWrap - Container element where article content is rendered
 * @property {HTMLElement} navWrap - Element used to render navigation/TOC
 * @property {HTMLElement} container - Layout container element used for image eagerness and scrolling
 * @property {HTMLElement|null} [mountOverlay] - Optional overlay mount used by UI helpers
 * @property {Function} t - Localization function (key => string)
 * @property {string} contentBase - Base URL/path for content fetches
 * @property {string} homePage - Default home page path or slug
 * @property {string} initialDocumentTitle - Document title at initialization
 * @property {Function} runHooks - Hook runner function provided by `hookManager`
 *
 * @typedef {Object} UIReturn
 * @property {() => Promise<void>} renderByQuery - Render current page based on URL query.
 * @property {HTMLElement} siteNav - Pre-built site navigation element.
 * @property {() => (string|null)} getCurrentPagePath - Returns the currently rendered page path or null.
 *
 * @param {UIOptions} opts - configuration options and DOM mounts for the UI
 * @returns {UIReturn} - helpers and entrypoints for rendering the site
 */
export function createUI(opts) {
  const {
    contentWrap,
    navWrap,
    container,
    mountOverlay = null,
    t,
    contentBase,
    homePage,
    initialDocumentTitle,
    runHooks
  } = opts || {}
  if (!contentWrap || !(contentWrap instanceof HTMLElement)) {
    throw new TypeError('contentWrap must be an HTMLElement')
  }

  let currentPagePath = null
  const siteNav = createNavTree(t, [{ path: homePage, name: t('home'), isIndex: true, children: [] }])

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

    try { scrollToAnchorOrTop(null) } catch (_) { console.warn('[nimbi-cms] scrollToAnchorOrTop failed', _) }
    contentWrap.innerHTML = ''

    const { article, parsed, toc, topH1, h1Text, slugKey } = await prepareArticle(t, data, pagePath, anchor, contentBase)

    applyPageMeta(t, initialDocumentTitle, parsed, toc, article, pagePath, anchor, topH1, h1Text, slugKey, data)

    navWrap.innerHTML = ''
    if (toc) {
      navWrap.appendChild(toc)
      attachTocClickHandler(toc)
    }

    try { await runHooks('transformHtml', { article, parsed, toc, pagePath, anchor, topH1, h1Text, slugKey, data }) } catch (e) { console.warn('[nimbi-cms] transformHtml hooks failed', e) }

    contentWrap.appendChild(article)

    try { executeEmbeddedScripts(article) } catch (e) { console.warn('[nimbi-cms] executeEmbeddedScripts failed', e) }

    try { attachImagePreview(article, { t }) } catch (e) { console.warn('[nimbi-cms] attachImagePreview failed', e) }

    try {
      setEagerForAboveFoldImages(container, 100, false)
      requestAnimationFrame(() => setEagerForAboveFoldImages(container, 100, false))
      setTimeout(() => setEagerForAboveFoldImages(container, 100, false), 250)
    } catch (e) {
      console.warn('[nimbi-cms] setEagerForAboveFoldImages failed', e)
    }

    scrollToAnchorOrTop(anchor)
    ensureScrollTopButton(article, topH1, { mountOverlay, container, navWrap, t })

    try { await runHooks('onPageLoad', { data, pagePath, anchor, article, toc, topH1, h1Text, slugKey, contentWrap, navWrap }) } catch (e) { console.warn('[nimbi-cms] onPageLoad hooks failed', e) }

    currentPagePath = pagePath
  }

  async function renderByQuery() {
    try {
      if (typeof window !== 'undefined' && window.__nimbiCMSDebug) {
        try {
          window.__nimbiCMSDebug = window.__nimbiCMSDebug || {}
          window.__nimbiCMSDebug.renderByQuery = (window.__nimbiCMSDebug.renderByQuery || 0) + 1
        } catch (_) {}
      }
      let parsed = parseHrefToRoute(location.href)
      // If a path-style URL was used (e.g. /slug) convert it to the
      // canonical `?page=slug[...]` form so the rest of the pipeline only
      // sees the approved patterns. Use replaceState so we don't reload.
      if (parsed && parsed.type === 'path' && parsed.page) {
        try {
          let out = '?page=' + encodeURIComponent(parsed.page || '')
          if (parsed.params) out += (out.includes('?') ? '&' : '?') + parsed.params
          if (parsed.anchor) out += '#' + encodeURIComponent(parsed.anchor)
          try { history.replaceState(history.state, '', out) } catch (e) { try { history.replaceState({}, '', out) } catch (_e) {} }
          parsed = parseHrefToRoute(location.href)
        } catch (e) { /* ignore replace failures */ }
      }
      const raw = (parsed && parsed.page) ? parsed.page : homePage
      const hashAnchor = parsed && parsed.anchor ? parsed.anchor : null
      await renderPage(raw, hashAnchor)
    } catch (e) {
      console.warn('[nimbi-cms] renderByQuery failed', e)
      renderNotFound(contentWrap, t, e)
    }
  }

  window.addEventListener('popstate', renderByQuery)

  const scrollStoreKey = () => `nimbi-cms-scroll:${location.pathname}${location.search}`

  const saveScrollPosition = () => {
    try {
      const containerEl = container || document.querySelector('.nimbi-cms')
      if (!containerEl) return
      const data = {
        top: containerEl.scrollTop || 0,
        left: containerEl.scrollLeft || 0
      }
      sessionStorage.setItem(scrollStoreKey(), JSON.stringify(data))
    } catch (_e) {
    }
  }

  const restoreScrollPosition = () => {
    try {
      const containerEl = container || document.querySelector('.nimbi-cms')
      if (!containerEl) return
      const stored = sessionStorage.getItem(scrollStoreKey())
      if (!stored) return
      const data = JSON.parse(stored)
      if (data && typeof data.top === 'number') {
        containerEl.scrollTo({ top: data.top, left: (data.left || 0), behavior: 'auto' })
      }
    } catch (_e) {
    }
  }

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      try {
        restoreScrollPosition()
        setEagerForAboveFoldImages(container, 100, false)
      } catch (e) {
        console.warn('[nimbi-cms] bfcache restore failed', e)
      }
    }
  })

  window.addEventListener('pagehide', () => {
    try {
      saveScrollPosition()
    } catch (e) {
      console.warn('[nimbi-cms] save scroll position failed', e)
    }
  })

  return { renderByQuery, siteNav, getCurrentPagePath: () => currentPagePath }
}
