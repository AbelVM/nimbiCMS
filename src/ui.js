/**
 * UI exports and rendering helpers.
 *
 * Re-exports hook utilities and provides the `createUI` entrypoint.
 *
 * @module ui
 */
export { addHook, onPageLoad, onNavBuild, transformHtml, runHooks, _clearHooks } from './nimbi-cms.js'

import { fetchPageData } from './router.js'
import { parseHrefToRoute } from './utils/urlHelper.js'
import { prepareArticle, executeEmbeddedScripts, renderNotFound, attachTocClickHandler, scrollToAnchorOrTop, ensureScrollTopButton, createNavTree } from './htmlBuilder.js'
import { setEagerForAboveFoldImages } from './utils/helpers.js'
import { applyPageMeta } from './seoManager.js'
import { attachImagePreview } from './imagePreview.js'
import { debugWarn, debugError, incrementCounter, syncLegacyCounter } from './utils/debug.js'
import { notFoundPage } from './slugManager.js'



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
/**
 * Create UI helpers and entrypoints for rendering pages in a mounted CMS.
 * Placed adjacent to the exported symbol for clarity.
 * @param {UIOptions} opts
 * @returns {UIReturn}
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
  // Serialize renders to avoid concurrent duplicate rendering when multiple
  // navigation events fire in quick succession (e.g. popstate + script-driven calls).
  // `_isRendering` guards active render; `_queuedRender` signals a subsequent
  // render should run once the active render completes.
  let _isRendering = false
  let _queuedRender = false

  /**
   * Render a page into the UI.
   * @param {string|null|undefined} raw - The raw page identifier or path to render.
   * @param {string|null|undefined} hashAnchor - Optional anchor to scroll to after render.
   * @returns {Promise<void>}
   */
  async function renderPage(raw, hashAnchor) {
    let data, pagePath, anchor
    try {
      ({ data, pagePath, anchor } = await fetchPageData(raw, contentBase))
    } catch (e) {
      // Treat expected 'no page data' failures as warnings when the
      // consumer has elected to use the inline not-found fallback
      // (i.e. `notFoundPage` is unset). Preserve error-level logs for
      // unexpected failures.
      const msg = e && e.message ? String(e.message) : ''
      const expectedMissing = (!notFoundPage || typeof notFoundPage !== 'string' || !notFoundPage) && /no page data/i.test(msg)
      try {
        if (expectedMissing) {
          try { debugWarn('[nimbi-cms] fetchPageData (expected missing)', e) } catch (err) {}
        } else {
          try { debugError('[nimbi-cms] fetchPageData failed', e) } catch (err) {}
        }
      } catch (_e) {}
      // When hosts choose to disable a configured `notFoundPage` (set to
      // `null`) we render a small inline 404 helper. In that case the
      // sidebar/nav TOC should be hidden so the page doesn't show stale
      // navigation for a missing route.
      try { if (!notFoundPage && navWrap && navWrap.innerHTML !== undefined) navWrap.innerHTML = '' } catch (err) {}
      renderNotFound(contentWrap, t, e)
      return
    }
    if (!anchor && hashAnchor) anchor = hashAnchor

    try { scrollToAnchorOrTop(null) } catch (_) { debugWarn('[nimbi-cms] scrollToAnchorOrTop failed', _) }
    contentWrap.innerHTML = ''

    const { article, parsed, toc, topH1, h1Text, slugKey } = await prepareArticle(t, data, pagePath, anchor, contentBase)

    applyPageMeta(t, initialDocumentTitle, parsed, toc, article, pagePath, anchor, topH1, h1Text, slugKey, data)

    navWrap.innerHTML = ''
    if (toc) {
      navWrap.appendChild(toc)
      attachTocClickHandler(toc)
    }

    try { await runHooks('transformHtml', { article, parsed, toc, pagePath, anchor, topH1, h1Text, slugKey, data }) } catch (e) { debugWarn('[nimbi-cms] transformHtml hooks failed', e) }

    contentWrap.appendChild(article)

    try { executeEmbeddedScripts(article) } catch (e) { debugWarn('[nimbi-cms] executeEmbeddedScripts failed', e) }

    try { attachImagePreview(article, { t }) } catch (e) { debugWarn('[nimbi-cms] attachImagePreview failed', e) }

    try {
      setEagerForAboveFoldImages(container, 100, false)
      requestAnimationFrame(() => setEagerForAboveFoldImages(container, 100, false))
      setTimeout(() => setEagerForAboveFoldImages(container, 100, false), 250)
    } catch (e) {
      debugWarn('[nimbi-cms] setEagerForAboveFoldImages failed', e)
    }

    scrollToAnchorOrTop(anchor)
    ensureScrollTopButton(article, topH1, { mountOverlay, container, navWrap, t })

    try { await runHooks('onPageLoad', { data, pagePath, anchor, article, toc, topH1, h1Text, slugKey, contentWrap, navWrap }) } catch (e) { debugWarn('[nimbi-cms] onPageLoad hooks failed', e) }

    currentPagePath = pagePath
  }

  /**
   * Render the current page based on the URL or configured `homePage`.
   * Serializes renders to avoid duplicate concurrent work.
   * @returns {Promise<void>}
   */
  async function renderByQuery() {
    // Prevent concurrent renders: if a render is already in progress, mark
    // that another render is desired and return. When the active render
    // completes it will re-run `renderByQuery` to pick up the latest URL.
    if (_isRendering) {
      _queuedRender = true
      return
    }
    _isRendering = true
    try {
      try { incrementCounter('renderByQuery') } catch (_) {}
      try { syncLegacyCounter('renderByQuery') } catch (_) {}
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
      debugWarn('[nimbi-cms] renderByQuery failed', e)
      try { if (!notFoundPage && navWrap && navWrap.innerHTML !== undefined) navWrap.innerHTML = '' } catch (err) {}
      renderNotFound(contentWrap, t, e)
    } finally {
      _isRendering = false
      if (_queuedRender) {
        _queuedRender = false
        try { await renderByQuery() } catch (e) { /* ignore re-run errors */ }
      }
    }
  }

  window.addEventListener('popstate', renderByQuery)

  /**
   * Compute the sessionStorage key used to persist scroll position
   * for the current URL.
   * @returns {string}
   */
  const scrollStoreKey = () => `nimbi-cms-scroll:${location.pathname}${location.search}`

  /**
   * Persist current scroll position for the page into sessionStorage.
   * @returns {void}
   */
  const saveScrollPosition = () => {
    try {
      const containerEl = container || document.querySelector('.nimbi-cms')
      if (!containerEl) return
      const data = {
        top: containerEl.scrollTop || 0,
        left: containerEl.scrollLeft || 0
      }
      sessionStorage.setItem(scrollStoreKey(), JSON.stringify(data))
    } catch (e) {
      debugWarn('[nimbi-cms] save scroll position failed', e)
    }
  }

  /**
   * Restore persisted scroll position from sessionStorage, if present.
   * @returns {void}
   */
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
      /* ignore restore errors */
    }
  }

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      try {
        restoreScrollPosition()
        setEagerForAboveFoldImages(container, 100, false)
      } catch (e) {
        debugWarn('[nimbi-cms] bfcache restore failed', e)
      }
    }
  })

  window.addEventListener('pagehide', () => {
    try {
      saveScrollPosition()
    } catch (e) {
      debugWarn('[nimbi-cms] save scroll position failed', e)
    }
  })

  return { renderByQuery, siteNav, getCurrentPagePath: () => currentPagePath }
}
