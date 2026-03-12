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
import { applyPageMeta } from './seoManager.js'

/**
 * Initialize UI rendering helpers for a mounted CMS instance.
 *
 * @param {object} opts
 * @param {HTMLElement} opts.contentWrap
 * @param {HTMLElement} opts.navWrap
 * @param {HTMLElement} opts.container
 * @param {HTMLElement|null} opts.mountOverlay
 * @param {Function} opts.t
 * @param {string} opts.contentBase
 * @param {string} opts.homePage
 * @param {string} opts.initialDocumentTitle
 * @param {Function} opts.runHooks - hook runner from nimbi-cms
 * @returns {{renderByQuery: function():Promise<void>, siteNav: object, getCurrentPagePath: function():string|null}}
 */
export function createUI({
  contentWrap,
  navWrap,
  container,
  mountOverlay = null,
  t,
  contentBase,
  homePage,
  initialDocumentTitle,
  runHooks
}) {
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

  return { renderByQuery, siteNav, getCurrentPagePath: () => currentPagePath }
}
