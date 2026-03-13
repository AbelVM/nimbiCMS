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
import { prepareArticle, renderNotFound, attachTocClickHandler, scrollToAnchorOrTop, ensureScrollTopButton, createNavTree } from './htmlBuilder.js'
import { setEagerForAboveFoldImages } from './utils/helpers.js'
import { applyPageMeta } from './seoManager.js'

/**
 * Options passed to `createUI`.
 * @typedef {Object} UIOptions
 * @property {HTMLElement} contentWrap
 * @property {HTMLElement} navWrap
 * @property {HTMLElement} container
 * @property {HTMLElement|null} mountOverlay
 * @property {(key:string, vars?:Object)=>string} t
 * @property {string} contentBase
 * @property {string} homePage
 * @property {string} initialDocumentTitle
 * @property {(name:string, ctx?:Object)=>void|Promise<void>} runHooks
 */

/**
 * Return shape from `createUI`.
 * @typedef {Object} UIReturn
 * @property {function():Promise<void>} renderByQuery
 * @property {Object} siteNav
 * @property {function():string|null} getCurrentPagePath
 */

/**
 * Initialize UI rendering helpers for a mounted CMS instance.
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
    navWrap.appendChild(toc)
    attachTocClickHandler(toc)

    try { await runHooks('transformHtml', { article, parsed, toc, pagePath, anchor, topH1, h1Text, slugKey, data }) } catch (e) { console.warn('[nimbi-cms] transformHtml hooks failed', e) }

    contentWrap.appendChild(article)

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
    let raw = (new URLSearchParams(location.search).get('page')) || homePage
    const hashAnchor = location.hash ? decodeURIComponent(location.hash.replace(/^#/, '')) : null
    try {
      await renderPage(raw, hashAnchor)
    } catch (e) {
      console.warn('[nimbi-cms] renderByQuery failed for', raw, e)
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
    } catch (e) {
      // ignore
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
    } catch (e) {
      // ignore
    }
  }

  // When the page is restored from bfcache, restore scroll position and re-run
  // the eager-image marker so images keep the expected loading priority.
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

  // Store scroll position whenever the page is about to be hidden.
  window.addEventListener('pagehide', () => {
    try {
      saveScrollPosition()
    } catch (e) {
      console.warn('[nimbi-cms] save scroll position failed', e)
    }
  })

  return { renderByQuery, siteNav, getCurrentPagePath: () => currentPagePath }
}
