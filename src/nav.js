import { createNavTree } from './htmlBuilder.js'
import { t } from './l10nManager.js'
import { preScanHtmlSlugs, preMapMdSlugs } from './htmlBuilder.js'
import { buildPageUrl, isExternalLink, normalizePath, safe, encodeURL } from './utils/helpers.js'
import { slugify, slugToMd, mdToSlug, fetchMarkdown } from './slugManager.js'

function safeGet(mod, name) {
  try {
    if (!mod) return undefined
    try { const v = mod[name]; if (typeof v !== 'undefined') return v } catch (e) {}
    try { if (mod.default) return mod.default[name] } catch (e) {}
    return undefined
  } catch (e) {
    return undefined
  }
}

/**
 * @typedef {{path:string,name:string,isIndex?:boolean,children?:NavTreeItem[]}} NavTreeItem
 */

/**
 * @typedef {{slug:string,title:string,excerpt?:string}} SearchIndexEntry
 * @typedef {{navbar:HTMLElement,linkEls:NodeListOf<Element>}} NavBuildResult
 * @typedef {{html:string,meta:Record<string, unknown>,toc:Array<{level:number,text:string,id?:string}>}} ParsedPage
 */

/**
 * Create a minimal site nav structure rooted at the provided home page.
 * @param {string} homePage - Home page path or slug to use for the nav root.
 * @returns {NavTreeItem[]} - Array of navigation tree items for the site.
 */
export function createSiteNav(homePage) {
  return createNavTree(t, [{ path: homePage, name: t('home'), isIndex: true, children: [] }])
}

/**
 * Build the main navigation bar DOM and wire up SPA navigation callbacks.
 * Previously this logic lived directly inside `initCMS` in nimbi-cms.js.
 *
 * @param {HTMLElement} navbarWrap - element where the navbar header should be
 *   inserted (typically a <header> element).
 * @param {HTMLElement} container - main content container; clicks inside
 *   this element will also be intercepted for SPA navigation.
 * @param {string} navHtml - HTML representation of the navigation obtained
 *   by parsing `_navigation.md`.
 * @param {string} contentBase - base URL used when resolving slugs.
 * @param {string} homePage - default home page slug used for the brand link
 * @param {Function} t - translation helper from l10nManager.
 * @param {Function} renderByQuery - callback invoked when the user navigates
 *   via the navbar or content links.  This allows the UI layer to render the
 *   requested page without creating a circular dependency.
 * @param {boolean} effectiveSearchEnabled - whether search UI should be rendered
 * @param {('eager'|'lazy')} searchIndexMode - search index option
 *   forwarded from `initCMS`; only relevant if a search input is present.
 * @param {1|2|3} indexDepth - include H2 headings in the search index when 2; include H3 when 3
 * @returns {Promise<NavBuildResult>} resolves with an object containing `navbar` and `linkEls`
 */
export async function buildNav(navbarWrap, container, navHtml, contentBase, homePage, t, renderByQuery, effectiveSearchEnabled, searchIndexMode = 'eager', indexDepth = 1, noIndexing = undefined, logoOption = 'favicon') {
  if (!navbarWrap || !(navbarWrap instanceof HTMLElement)) {
    throw new TypeError('navbarWrap must be an HTMLElement')
  }

  const parser = typeof DOMParser !== 'undefined' ? new DOMParser() : null
  const navDoc = parser ? parser.parseFromString(navHtml || '', 'text/html') : null
  const linkEls = navDoc ? navDoc.querySelectorAll('a') : []


  await safe(() => preScanHtmlSlugs(linkEls, contentBase))
  await safe(() => preMapMdSlugs(linkEls, contentBase))

  try {
    if (container && container instanceof HTMLElement) {
      if (!container.hasAttribute || !container.hasAttribute('role')) {
        try { container.setAttribute('role', 'main') } catch (e) {}
      }
    }
  } catch (e) {}
  
  let searchIndexPromise = null
  let searchInput = null
  let searchControl = null
  let dropdown = null
  let dropdownContent = null
  let resultsContainer = null
  let searchOutsideHandler = null
  let indexedCountLog = false

  function closeMobileMenu() {
    try {
      const burgerEl = document.querySelector('.navbar-burger')
      const targetId = burgerEl && burgerEl.dataset ? burgerEl.dataset.target : null
      const target = targetId ? document.getElementById(targetId) : null
      if (burgerEl && burgerEl.classList.contains('is-active')) {
        burgerEl.classList.remove('is-active')
        burgerEl.setAttribute('aria-expanded', 'false')
        if (target) target.classList.remove('is-active')
      }
    } catch (err) { console.warn && console.warn('[nimbi-cms] closeMobileMenu failed', err) }
  }

  /* Helper: run the provided `renderByQuery` with a small visual transition.
     Adds `.is-inactive` to the main content then calls the renderer; when
     the renderer completes (or throws) the class is removed on the next
     animation frame so layout has a chance to settle. */
  async function runRenderWithTransition() {
    const contentEl = (typeof document !== 'undefined') ? document.querySelector('.nimbi-content') : null
    try { if (contentEl) contentEl.classList.add('is-inactive') } catch (e) {}
    try {
      const r = renderByQuery && renderByQuery()
      if (r && typeof r.then === 'function') await r
    } catch (e) {
      try { console.warn && console.warn('[nimbi-cms] renderByQuery failed', e) } catch (_) {}
    } finally {
      try {
        if (typeof requestAnimationFrame === 'function') {
          requestAnimationFrame(() => { try { if (contentEl) contentEl.classList.remove('is-inactive') } catch (e) {} })
        } else {
          try { if (contentEl) contentEl.classList.remove('is-inactive') } catch (e) {}
        }
      } catch (e) { try { if (contentEl) contentEl.classList.remove('is-inactive') } catch (e2) {} }
    }
  }

  const ensureSearchIndex = () => {
    if (searchIndexPromise) return searchIndexPromise
    searchIndexPromise = (async () => {
      try {
        const fm = await import('./slugManager.js')
        const buildFn = safeGet(fm, 'buildSearchIndex') || (typeof globalThis !== 'undefined' ? globalThis.buildSearchIndex : undefined)
        const workerFn = safeGet(fm, 'buildSearchIndexWorker') || (typeof globalThis !== 'undefined' ? globalThis.buildSearchIndexWorker : undefined)
        if (searchIndexMode === 'lazy' && typeof workerFn === 'function') {
          try {
            const r = await workerFn(contentBase, indexDepth, noIndexing)
            if (r && r.length) return r
          } catch (e) { console.warn && console.warn('[nimbi-cms] worker builder threw', e) }
        }
        if (typeof buildFn === 'function') return await buildFn(contentBase, indexDepth, noIndexing)
        return []
      } catch (err) {
        console.warn('[nimbi-cms] buildSearchIndex failed', err)
        return []
      } finally {
        if (searchInput) {
          try { searchInput.removeAttribute('disabled') } catch (e) {}
          try { searchControl && searchControl.classList.remove('is-loading') } catch (e) {}
        }
      }
    })()

    searchIndexPromise.then((idx) => {
      try {
        const qnow = String(searchInput && searchInput.value || '').trim().toLowerCase()
        if (!qnow) return
        if (!Array.isArray(idx) || !idx.length) return
        const filteredNow = idx.filter(e => (e.title && e.title.toLowerCase().includes(qnow)) || (e.excerpt && e.excerpt.toLowerCase().includes(qnow)))
        if (!filteredNow || !filteredNow.length) return
        const resultsEl = document.getElementById('nimbi-search-results')
        if (!resultsEl) return
        resultsEl.innerHTML = ''
        try {
          const panel = document.createElement('div')
          panel.className = 'panel nimbi-search-panel'
          filteredNow.slice(0,10).forEach(it => {
            try {
              if (it.parentTitle) {
                const p = document.createElement('p')
                p.className = 'panel-heading nimbi-search-title nimbi-search-parent'
                p.textContent = it.parentTitle
                panel.appendChild(p)
              }
              const a = document.createElement('a')
              a.className = 'panel-block nimbi-search-result'
              try {
                // When using eager indexing the tests expect canonical `?page=` links
                if (searchIndexMode === 'eager') {
                  // Support slug entries that encode an anchor as `slug::anchor`.
                  // Split and pass anchor separately to `buildPageUrl` so the
                  // resulting canonical URL is `?page=slug#anchor` instead of
                  // encoding the `::` sequence into the `page` parameter.
                  let pageKey = it.slug || ''
                  // Some upstream/indexed data may already contain URI-encoded
                  // delimiters like `%3A%3A` instead of `::`.
                  try { pageKey = decodeURIComponent(String(pageKey || '')) } catch (_e) { /* ignore */ }
                  let anchor = null
                  if (typeof pageKey === 'string' && pageKey.indexOf('::') !== -1) {
                    const parts = pageKey.split('::', 2)
                    pageKey = parts[0]
                    anchor = parts[1] || null
                  }
                  a.href = buildPageUrl(pageKey, anchor)
                } else {
                  let pageKey = it.slug || ''
                  // Support URI-encoded `::` (e.g. `slug%3A%3Aanchor`).
                  try { pageKey = decodeURIComponent(String(pageKey || '')) } catch (_e) { /* ignore */ }
                  let anchorPart = ''
                  if (typeof pageKey === 'string' && pageKey.indexOf('::') !== -1) {
                    const parts = pageKey.split('::', 2)
                    pageKey = parts[0]
                    anchorPart = parts[1] ? '#' + encodeURIComponent(parts[1]) : ''
                  }
                  const locParams = new URLSearchParams((typeof location !== 'undefined' && location.search) ? location.search : '')
                  locParams.delete('page')
                  const qs = locParams.toString()
                  const suffix = qs ? '?' + qs : ''
                  a.href = '#/' + encodeURL(pageKey || '') + anchorPart + suffix
                }
              } catch (e) {
                a.href = buildPageUrl(it.slug)
              }
              a.setAttribute('role', 'button')
              try {
                if (it.path && typeof it.slug === 'string') {
                  try { slugToMd.set(it.slug, it.path) } catch (ee) {}
                  try { mdToSlug.set(it.path, it.slug) } catch (ee) {}
                }
              } catch (e) {}
              const title = document.createElement('div')
              title.className = 'is-size-6 has-text-weight-semibold'
              title.textContent = it.title
              a.appendChild(title)
              a.addEventListener('click', () => { try { resultsEl.style.display = 'none' } catch (_) {} })
              panel.appendChild(a)
            } catch (e) { /* ignore per-item failures */ }
          })
          resultsEl.appendChild(panel)
          try { resultsEl.style.display = 'block' } catch (e) {}
        } catch (e) { /* ignore panel render failures */ }
      } catch (e) { /* ignore */ }
    }).catch(()=>{})

    return searchIndexPromise
  }

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
      const u = new URL(rawHref, location.href)
      const p = u.searchParams.get('page')
      let rawHash = u.hash ? String(u.hash).replace(/^#/, '') : null
      // Prevent cosmetic route fragments (e.g., "/slug") from becoming
      // encoded anchors like "#%2Fslug" in the brand URL.
      if (rawHash && rawHash.startsWith('/')) rawHash = null
      if (p) {
        // If the first link's URL is same-origin as the current location,
        // prefer showing the cosmetic fragment (so visible URL looks like
        // `#/slug`). If it's cross-origin or points at a different base
        // path, expose the canonical `?page=` URL instead so crawlers see
        // the canonical form.
        const page = decodeURIComponent(p || '')
        let useCosmetic = false
        try {
          // Only prefer the cosmetic brand when the original href was an
          // absolute URL (contained a scheme) and its origin matches the
          // current location. This preserves the previous behavior of
          // showing canonical `?page=` for relative or root-relative
          // links while allowing absolute same-origin URLs to be cosmetic.
          const linkOrigin = u && u.origin ? u.origin : null
          const locOrigin = (typeof location !== 'undefined' && location.origin) ? location.origin : ((typeof location !== 'undefined' && location.href) ? (new URL(location.href)).origin : null)
          const wasAbsolute = typeof rawHref === 'string' && rawHref.indexOf('://') !== -1
          if (wasAbsolute && linkOrigin && locOrigin && linkOrigin === locOrigin) useCosmetic = true
        } catch (err) { /* ignore origin read errors */ }

        if (useCosmetic) {
          // Prefer showing the cosmetic slug in the brand link when possible
          let normalized = (typeof normalizePath === 'function') ? normalizePath(page) : String(page).replace(/^\/+/, '')
          let cosmeticKey = normalized
          try {
            if (mdToSlug && typeof mdToSlug.has === 'function') {
              if (mdToSlug.has(normalized)) cosmeticKey = mdToSlug.get(normalized)
              else {
                const decoded = decodeURIComponent(String(page || ''))
                const decodedNorm = (typeof normalizePath === 'function') ? normalizePath(decoded) : String(decoded).replace(/^\/+/, '')
                if (mdToSlug.has(decodedNorm)) cosmeticKey = mdToSlug.get(decodedNorm)
                else {
                  const baseName = String(normalized || '').replace(/^.*\//, '')
                  if (mdToSlug.has(baseName)) cosmeticKey = mdToSlug.get(baseName)
                }
              }
            }
          } catch (err) { /* ignore mapping errors */ }
          // include any extra query params from current location (excluding page)
          const locParams = new URLSearchParams((typeof location !== 'undefined' && location.search) ? location.search : '')
          locParams.delete('page')
          const suffix = locParams.toString() ? '?' + locParams.toString() : ''
          // set brand href to cosmetic fragment so it's not exposing raw filepaths
          brandItem.href = '#/' + encodeURL(String(cosmeticKey || normalized || page)) + (rawHash ? '#' + encodeURIComponent(rawHash) : '') + suffix
          brandItem.textContent = t('home')
        } else {
          try {
            brandItem.href = buildPageUrl(page, rawHash, (typeof location !== 'undefined' && location.search) ? location.search : '')
          } catch (err) {
            brandItem.href = rawHref
          }
          brandItem.textContent = t('home')
        }
      } else {
        // Map the provided homePage to a cosmetic slug when possible so the
        // brand link prefers `#/slug` over exposing raw file paths.
        try {
          const locParams2 = new URLSearchParams((typeof location !== 'undefined' && location.search) ? location.search : '')
          locParams2.delete('page')
          const suffix2 = locParams2.toString() ? '?' + locParams2.toString() : ''
          let homeDisplay = String(homePage || '')
          try {
            const normHome = (typeof normalizePath === 'function') ? normalizePath(String(homePage || '')) : String(homePage || '')
            if (mdToSlug && typeof mdToSlug.has === 'function' && mdToSlug.has(normHome)) homeDisplay = mdToSlug.get(normHome)
            else {
              const baseName = String(normHome || '').replace(/^.*\//, '')
              if (baseName && mdToSlug && typeof mdToSlug.has === 'function' && mdToSlug.has(baseName)) homeDisplay = mdToSlug.get(baseName)
            }
          } catch (e) { /* ignore mapping errors */ }
          brandItem.href = '#/' + encodeURL(String(homeDisplay || homePage || '')) + suffix2
          brandItem.textContent = t('home')
        } catch (e) {
          brandItem.href = '#/' + encodeURL(String(homePage || ''))
          brandItem.textContent = t('home')
        }
      }
    } catch (e) {
      brandItem.href = '#/' + encodeURL(String(homePage || ''))
      brandItem.textContent = t('home')
    }
  } else {
    brandItem.href = '#/' + encodeURL(String(homePage || ''))
    brandItem.textContent = t('home')
  }
  async function resolveLogoSrc(opt) {
    try {
      if (!opt || opt === 'none') return null
      if (opt === 'favicon') {
        try {
          const link = document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]')
          if (!link) return null
          const href = link.getAttribute('href') || ''
          if (!href) return null
          if (/\.png(?:\?|$)/i.test(href)) return new URL(href, location.href).toString()
          return null
        } catch (e) { return null }
      }
      if (opt === 'copy-first' || opt === 'move-first') {
        try {
          const res = await fetchMarkdown(homePage, contentBase)
          if (!res || !res.raw) return null
          const p = new DOMParser()
          const d = p.parseFromString(res.raw, 'text/html')
          const img = d.querySelector('img')
          if (!img) return null
          const src = img.getAttribute('src') || ''
          if (!src) return null
          const abs = new URL(src, location.href).toString()
          if (opt === 'move-first') {
            try { document.documentElement.setAttribute('data-nimbi-logo-moved', abs) } catch (e) {}
          }
          return abs
        } catch (e) { return null }
      }
      try {
        return new URL(opt, location.href).toString()
      } catch (e) { return null }
    } catch (e) { return null }
  }

  let logoSrc = null
  try { logoSrc = await resolveLogoSrc(logoOption) } catch (e) { logoSrc = null }

  if (logoSrc) {
    try {
      const img = document.createElement('img')
      img.className = 'nimbi-navbar-logo'
      const label = t && typeof t === 'function' ? (t('home') || t('siteLogo') || '') : ''
      img.alt = label
      img.title = label
      img.src = logoSrc
      try { img.style.marginRight = '0.5em' } catch (e) {}
      try {
        if (!brandItem.textContent || !String(brandItem.textContent).trim()) {
          brandItem.textContent = label
        }
      } catch (e) { /* ignore setting text failures */ }
      try {
        brandItem.insertBefore(img, brandItem.firstChild)
      } catch (e) {
        try { brandItem.appendChild(img) } catch (e2) { /* ignore append failures */ }
      }
    } catch (e) { /* ignore image insertion failures */ }
  }

  brand.appendChild(brandItem)

  brandItem.addEventListener('click', function (ev) {
    const href = brandItem.getAttribute('href') || '';
    if (href.startsWith('?page=') || href.startsWith('#/')) {
      ev.preventDefault();
      // support both canonical `?page=` hrefs and cosmetic `#/slug` hrefs
      let pageParam = null
      let hash = null
      let cosmetic = href
      try {
        if (href.startsWith('?page=')) {
          const url = new URL(href, location.href)
          pageParam = url.searchParams.get('page')
          hash = url.hash ? url.hash.replace(/^#/, '') : null
        } else if (href.startsWith('#/')) {
          // parse cosmetic fragment: '#/slug#anchor?qs' -> slug and anchor
          const raw = String(href || '').replace(/^#/, '')
          let beforeQs = raw
          let qsPart = ''
          if (raw.indexOf('?') !== -1) {
            const ix = raw.indexOf('?')
            beforeQs = raw.slice(0, ix)
            qsPart = raw.slice(ix)
          }
          // beforeQs looks like '/slug' or '/slug#anchor'
          const parts = beforeQs.split('#')
          let slugPart = parts[0] || ''
          if (slugPart.startsWith('/')) slugPart = slugPart.slice(1)
          pageParam = slugPart || null
          hash = parts[1] || null
          cosmetic = '#' + beforeQs + qsPart
        }
      } catch (e) { /* ignore parse errors */ }
      try {
      // Prefer mapped slug for cosmetic fragment and stored canonical state
      // Normalize page param to strip any leading ./ or / so mappings match
      const rawPageParam = pageParam || ''
      const normalizedPageParam = (typeof normalizePath === 'function') ? normalizePath(rawPageParam) : rawPageParam.replace(/^\/+/, '')
      let pageVal = normalizedPageParam + (hash ? `::${hash}` : '')
      let cosmeticPageKey = normalizedPageParam
        try {
          // If the pageParam is a markdown/file path and we have a slug mapping,
          // prefer the slug for the visible cosmetic fragment and for history.state.
          if (mdToSlug && typeof mdToSlug.has === 'function') {
            if (mdToSlug.has(normalizedPageParam)) {
              cosmeticPageKey = mdToSlug.get(normalizedPageParam)
              pageVal = cosmeticPageKey + (hash ? `::${hash}` : '')
            } else {
              try {
                const decoded = decodeURIComponent(rawPageParam || '')
                const decodedNorm = (typeof normalizePath === 'function') ? normalizePath(decoded) : String(decoded).replace(/^\/+/, '')
                if (mdToSlug.has(decodedNorm)) {
                  cosmeticPageKey = mdToSlug.get(decodedNorm)
                  pageVal = cosmeticPageKey + (hash ? `::${hash}` : '')
                } else {
                  const baseName = String(normalizedPageParam || '').replace(/^.*\//, '')
                  if (mdToSlug.has(baseName)) {
                    cosmeticPageKey = mdToSlug.get(baseName)
                    pageVal = cosmeticPageKey + (hash ? `::${hash}` : '')
                  }
                }
              } catch (e) { /* ignore decode errors */ }
            }
          }
        } catch (e) { /* swallow mapping errors */ }
        // Compose cosmetic fragment (preserve extra query params except `page`)
        try {
          let linkParams = null
          if (typeof url !== 'undefined' && url && url.search) {
            linkParams = new URLSearchParams(url.search)
          } else {
            linkParams = new URLSearchParams((typeof location !== 'undefined' && location.search) ? location.search : '')
          }
          linkParams.delete('page')
          const qs = linkParams.toString()
          const suffix = qs ? '?' + qs : ''
          const anchorPart = hash ? '#' + encodeURIComponent(hash) : ''
          const finalCosmetic = (cosmetic && cosmetic.indexOf('#/') === 0) ? cosmetic : '#/' + encodeURL(cosmeticPageKey || '') + anchorPart + suffix
          history.pushState({ page: pageVal }, '', finalCosmetic)
        } catch (e) {
          const locParams = new URLSearchParams((typeof location !== 'undefined' && location.search) ? location.search : '')
          locParams.delete('page')
          const qs = locParams.toString()
          const suffix = qs ? '?' + qs : ''
          const anchorPart = hash ? '#' + encodeURIComponent(hash) : ''
          const finalCosmetic = '#/' + encodeURL(cosmeticPageKey || pageParam || '') + anchorPart + suffix
          history.pushState({ page: pageVal }, '', finalCosmetic)
        }
      } catch (e) {
        const locParams = new URLSearchParams((typeof location !== 'undefined' && location.search) ? location.search : '')
        locParams.delete('page')
        const qs = locParams.toString()
        const suffix = qs ? '?' + qs : ''
        const anchorPart = hash ? '#' + encodeURIComponent(hash) : ''
        const finalCosmetic = '#/' + encodeURL(cosmeticPageKey || pageParam || '') + anchorPart + suffix
        history.pushState({ page: pageVal }, '', finalCosmetic)
      }
      runRenderWithTransition()
      try { closeMobileMenu() } catch (e) {}
    }
  });


  
  const burger = document.createElement('a')
  burger.className = 'navbar-burger'
  burger.setAttribute('role', 'button')
  burger.setAttribute('aria-label', 'menu')
  burger.setAttribute('aria-expanded', 'false')
  const targetId = 'nimbi-navbar-menu'
  burger.dataset.target = targetId
  burger.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>'
  brand.appendChild(burger)

  try {
    burger.addEventListener('click', (ev) => {
      try {
        const targetId = burger.dataset && burger.dataset.target ? burger.dataset.target : null
        const target = targetId ? document.getElementById(targetId) : null
        const isActive = burger.classList.contains('is-active')
        if (isActive) {
          burger.classList.remove('is-active')
          burger.setAttribute('aria-expanded', 'false')
          if (target) target.classList.remove('is-active')
        } else {
          burger.classList.add('is-active')
          burger.setAttribute('aria-expanded', 'true')
          if (target) target.classList.add('is-active')
        }
      } catch (err) { console.warn('[nimbi-cms] navbar burger toggle failed', err) }
    })
  } catch (err) { console.warn('[nimbi-cms] burger event binding failed', err) }

  const menu = document.createElement('div')
  menu.className = 'navbar-menu'
  menu.id = targetId
  const start = document.createElement('div')
  start.className = 'navbar-start'
  let end = null
  let searchItem = null
  if (!effectiveSearchEnabled) {
    end = null
    searchInput = null
    dropdown = null
    dropdownContent = null
    resultsContainer = null
  } else {
    end = document.createElement('div')
    end.className = 'navbar-end'
    searchItem = document.createElement('div')
    searchItem.className = 'navbar-item'

    searchInput = document.createElement('input')
    searchInput.className = 'input'
    searchInput.type = 'search'
    searchInput.placeholder = t('searchPlaceholder') || ''
    searchInput.id = 'nimbi-search'
    try { searchInput.setAttribute('disabled', 'disabled') } catch (e) {}
      try {
        const ariaLabel = (t && typeof t === 'function' ? t('searchAria') : null) || searchInput.placeholder || 'Search'
      try { searchInput.setAttribute('aria-label', ariaLabel) } catch (e) {}
      try { searchInput.setAttribute('aria-controls', 'nimbi-search-results') } catch (e) {}
      try { searchInput.setAttribute('aria-autocomplete', 'list') } catch (e) {}
      try { searchInput.setAttribute('role', 'combobox') } catch (e) {}
      } catch (e) {}
    try {
      dropdown = document.createElement('div')
      dropdown.className = 'dropdown is-right nimbi-search'
      const dropdownMenu = document.createElement('div')
      dropdownMenu.className = 'dropdown-menu'
      dropdownContent = document.createElement('div')
      dropdownContent.id = 'nimbi-search-results'
      dropdownContent.className = 'dropdown-content nimbi-search-results'
      resultsContainer = dropdownContent
      dropdownMenu.appendChild(dropdownContent)
      dropdown.appendChild(dropdownMenu)
      try { searchItem.appendChild(searchInput) } catch (e) {}
      try { end.appendChild(searchItem) } catch (e) {}
      end.appendChild(dropdown)
    } catch (e) {
      dropdown = null
      dropdownContent = null
      resultsContainer = null
    }

    const showResults = (items) => {
      if (!dropdownContent) return
      dropdownContent.innerHTML = ''

      let selectedIndex = -1
      function updateSelection(i) {
        try {
          const prev = dropdownContent.querySelector('.nimbi-search-result.is-selected')
          if (prev) prev.classList.remove('is-selected')
          const all = dropdownContent.querySelectorAll('.nimbi-search-result')
          if (!all || !all.length) return
          if (i < 0) { selectedIndex = -1; return }
          if (i >= all.length) i = all.length - 1
          const el = all[i]
          if (el) {
            el.classList.add('is-selected')
            selectedIndex = i
            try { el.scrollIntoView({ block: 'nearest' }) } catch (e) {}
          }
        } catch (e) { /* ignore selection errors */ }
      }

      function resultsKeydown(ev) {
        try {
          const key = ev.key
          const all = dropdownContent.querySelectorAll('.nimbi-search-result')
          if (!all || !all.length) return
          if (key === 'ArrowDown') {
            ev.preventDefault()
            const next = selectedIndex < 0 ? 0 : Math.min(all.length - 1, selectedIndex + 1)
            updateSelection(next)
            return
          }
          if (key === 'ArrowUp') {
            ev.preventDefault()
            const prev = selectedIndex <= 0 ? 0 : selectedIndex - 1
            updateSelection(prev)
            return
          }
          if (key === 'Enter') {
            ev.preventDefault()
            const el = dropdownContent.querySelector('.nimbi-search-result.is-selected') || dropdownContent.querySelector('.nimbi-search-result')
            if (el) {
              try { el.click() } catch (e) {}
            }
            return
          }
          if (key === 'Escape') {
            try { dropdown.classList.remove('is-active') } catch (e) {}
            try { document.documentElement.classList.remove('nimbi-search-open') } catch (e) {}
            try { dropdownContent.style.display = 'none' } catch (e) {}
            try { dropdownContent.classList.remove('is-open') } catch (e) {}
            try { dropdownContent.removeAttribute('tabindex') } catch (e) {}
            try { dropdownContent.removeEventListener('keydown', resultsKeydown) } catch (e) {}
            try { if (searchInput) searchInput.focus() } catch (e) {}
            try { if (searchInput) searchInput.removeEventListener('keydown', inputKeyHandler) } catch (e) {}
            return
          }
        } catch (e) { /* ignore */ }
      }

      function inputKeyHandler(ev) {
        try {
          if (ev && ev.key === 'ArrowDown') {
            ev.preventDefault()
            try { dropdownContent.focus() } catch (e) {}
            updateSelection(0)
          }
        } catch (e) {}
      }

      try {
        const panel = document.createElement('div')
        panel.className = 'panel nimbi-search-panel'
        items.forEach(it => {
          if (it.parentTitle) {
            const heading = document.createElement('p')
            heading.textContent = it.parentTitle
            heading.className = 'panel-heading nimbi-search-title nimbi-search-parent'
            panel.appendChild(heading)
          }
          const a = document.createElement('a')
          a.className = 'panel-block nimbi-search-result'
          try {
            if (searchIndexMode === 'eager') {
              let pageKey = it.slug || ''
              let anchor = null
              if (typeof pageKey === 'string' && pageKey.indexOf('::') !== -1) {
                const parts = pageKey.split('::', 2)
                pageKey = parts[0]
                anchor = parts[1] || null
              }
              a.href = buildPageUrl(pageKey, anchor)
            } else {
              let pageKey = it.slug || ''
              let anchorPart = ''
              if (typeof pageKey === 'string' && pageKey.indexOf('::') !== -1) {
                const parts = pageKey.split('::', 2)
                pageKey = parts[0]
                anchorPart = parts[1] ? '#' + encodeURIComponent(parts[1]) : ''
              }
              const locParams = new URLSearchParams((typeof location !== 'undefined' && location.search) ? location.search : '')
              locParams.delete('page')
              const qs = locParams.toString()
              const suffix = qs ? '?' + qs : ''
              a.href = '#/' + encodeURL(pageKey || '') + anchorPart + suffix
            }
          } catch (e) {
            a.href = buildPageUrl(it.slug)
          }
          a.setAttribute('role', 'button')
              try {
                if (it.path && typeof it.slug === 'string') {
                  try { slugToMd.set(it.slug, it.path) } catch (ee) {}
                  try { mdToSlug.set(it.path, it.slug) } catch (ee) {}
                }
              } catch (e) {}
          const title = document.createElement('div')
          title.className = 'is-size-6 has-text-weight-semibold'
          title.textContent = it.title
          a.appendChild(title)
          a.addEventListener('click', () => {
            if (dropdown) {
              dropdown.classList.remove('is-active')
              try { document.documentElement.classList.remove('nimbi-search-open') } catch (e) {}
            }
            try { dropdownContent.style.display = 'none' } catch (e) {}
            try { dropdownContent.classList.remove('is-open') } catch (e) {}
            try { dropdownContent.removeAttribute('tabindex') } catch (e) {}
            try { dropdownContent.removeEventListener('keydown', resultsKeydown) } catch (e) {}
            try { if (searchInput) searchInput.removeEventListener('keydown', inputKeyHandler) } catch (e) {}
          })
          panel.appendChild(a)
        })
        dropdownContent.appendChild(panel)
      } catch (e) { /* ignore render errors */ }
      if (dropdown) {
        dropdown.classList.add('is-active')
        try { document.documentElement.classList.add('nimbi-search-open') } catch (e) {}
      }
      try { dropdownContent.style.display = 'block' } catch (e) {}
      try { dropdownContent.classList.add('is-open') } catch (e) {}
      try { dropdownContent.setAttribute('tabindex', '0') } catch (e) {}
      try { dropdownContent.addEventListener('keydown', resultsKeydown) } catch (e) {}
      try { if (searchInput) searchInput.addEventListener('keydown', inputKeyHandler) } catch (e) {}
    }

    const debounce = (fn, delay) => {
      let timer = null
      return (...args) => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => fn(...args), delay)
      }
    }

    if (searchInput) {
      const handleInput = debounce(async () => {
        const domInput = document.querySelector('input#nimbi-search')
        const q = String(domInput && domInput.value || '').trim().toLowerCase()
        if (!q) { showResults([]); return }
        try {
          await ensureSearchIndex()

          const idx = await searchIndexPromise
          const filtered = idx.filter(e => (e.title && e.title.toLowerCase().includes(q)) || (e.excerpt && e.excerpt.toLowerCase().includes(q)))
          showResults(filtered.slice(0, 10))
        } catch (err) { console.warn('[nimbi-cms] search input handler failed', err); showResults([]) }
      }, 50)

      try {
        searchInput.addEventListener('input', handleInput)
      } catch (e) { /* ignore attach failures in constrained env */ }

      try {
        document.addEventListener('input', (ev) => {
          try {
            if (ev && ev.target && ev.target.id === 'nimbi-search') {
              handleInput(ev)
            }
          } catch (e) { /* ignore */ }
        }, true)
      } catch (e) { /* ignore attach failures in constrained env */ }
    }

    if (searchIndexMode === 'eager') {
      try {
        searchIndexPromise = ensureSearchIndex()
      } catch (err) {
        console.warn('[nimbi-cms] eager search index init failed', err)
        searchIndexPromise = Promise.resolve([])
      }
        searchIndexPromise.finally(() => {
          const domInput = document.querySelector('input#nimbi-search')
          if (domInput) {
            try { domInput.removeAttribute('disabled') } catch (e) {}
            try { searchControl && searchControl.classList.remove('is-loading') } catch (e) {}
          }
        })
    }
    
        try {
          const searchOutsideHandler = (ev) => {
            try {
              const tgt = ev && ev.target
              if (!resultsContainer) return
              if (!resultsContainer.classList.contains('is-open') && (resultsContainer.style && resultsContainer.style.display !== 'block')) return
              if (tgt && (resultsContainer.contains(tgt) || (searchInput && (tgt === searchInput || (searchInput.contains && searchInput.contains(tgt)))))) return
              if (dropdown) {
                dropdown.classList.remove('is-active')
                try { document.documentElement.classList.remove('nimbi-search-open') } catch (e) {}
              }
              try { resultsContainer.style.display = 'none' } catch (e) {}
              try { resultsContainer.classList.remove('is-open') } catch (e) {}
            } catch (e) { /* ignore */ }
          }
          document.addEventListener('click', searchOutsideHandler, true)
          document.addEventListener('touchstart', searchOutsideHandler, true)
        } catch (e) { /* ignore */ }
  }

  
  for (let i = 0; i < linkEls.length; i++) {
    const a = linkEls[i]
    if (i === 0) continue
    const href = a.getAttribute('href') || '#'
    const item = document.createElement('a')
    item.className = 'navbar-item'
    try {
      if (/^[^#]*\.md(?:$|[#?])/.test(href) || href.endsWith('.md')) {
        const mdRaw = normalizePath(href)
        const parts = mdRaw.split(/::|#/, 2)
        const mdPath = parts[0]
        const frag = parts[1]
        // Prefer cosmetic slug-based link when mapping exists
        try {
          let display = null
          try {
            if (mdToSlug && mdToSlug.has && mdToSlug.has(mdPath)) display = mdToSlug.get(mdPath)
            else {
              const baseName = String(mdPath || '').replace(/^.*\//, '')
              if (baseName && mdToSlug && mdToSlug.has && mdToSlug.has(baseName)) display = mdToSlug.get(baseName)
              else {
                try {
                  for (const [k, v] of slugToMd || []) {
                    if (v === mdPath || v === baseName) { display = k; break }
                  }
                } catch (e2) { /* ignore iteration errors */ }
              }
            }
          } catch (err) { console.warn('[nimbi-cms] nav mdToSlug lookup failed', err) }
          if (display) {
            item.href = '#/' + encodeURL(display) + (frag ? '#' + encodeURIComponent(frag) : '')
          } else {
            item.href = buildPageUrl(mdPath, frag)
          }
        } catch (e) { item.href = buildPageUrl(mdPath, frag) }
      } else if (/\.html(?:$|[#?])/.test(href) || href.endsWith('.html')) {
        let raw = normalizePath(href)
        const parts = raw.split(/::|#/, 2)
        let htmlPath = parts[0]
        if (htmlPath && !htmlPath.toLowerCase().endsWith('.html')) {
          htmlPath = htmlPath + '.html'
        }
        const frag = parts[1]
        try {
          // try existing mappings first (path or basename)
          let display = null
          try {
            if (mdToSlug && mdToSlug.has && mdToSlug.has(htmlPath)) display = mdToSlug.get(htmlPath)
            else {
              const baseName = String(htmlPath || '').replace(/^.*\//, '')
              if (baseName && mdToSlug && mdToSlug.has && mdToSlug.has(baseName)) display = mdToSlug.get(baseName)
              else {
                try {
                  for (const [k, v] of slugToMd || []) {
                    if (v === htmlPath || v === baseName) { display = k; break }
                  }
                } catch (e2) { /* ignore iteration errors */ }
              }
            }
          } catch (err) { console.warn('[nimbi-cms] nav mdToSlug lookup failed (html)', err) }
          if (display) {
            item.href = '#/' + encodeURL(display) + (frag ? '#' + encodeURIComponent(frag) : '')
          } else {
            // fall back to fetching the HTML to extract a title/slug
            try {
              const res = await fetchMarkdown(htmlPath, contentBase)
              if (res && res.raw) {
                try {
                  const parser2 = new DOMParser()
                  const doc = parser2.parseFromString(res.raw, 'text/html')
                  const titleTag = doc.querySelector('title')
                  const h1 = doc.querySelector('h1')
                  const titleText = (titleTag && titleTag.textContent && titleTag.textContent.trim()) ? titleTag.textContent.trim() : (h1 && h1.textContent ? h1.textContent.trim() : null)
                  if (titleText) {
                    const slugKey = slugify(titleText)
                    if (slugKey) {
                      try { slugToMd.set(slugKey, htmlPath); mdToSlug.set(htmlPath, slugKey) } catch (ee) { console.warn('[nimbi-cms] slugToMd/mdToSlug set failed', ee) }
                      item.href = '#/' + encodeURL(slugKey) + (frag ? '#' + encodeURIComponent(frag) : '')
                    } else {
                      item.href = buildPageUrl(htmlPath, frag)
                    }
                  } else {
                    item.href = buildPageUrl(htmlPath, frag)
                  }
                } catch (ee) {
                  item.href = buildPageUrl(htmlPath, frag)
                }
              } else {
                item.href = href
              }
            } catch (ee) {
              item.href = href
            }
          }
        } catch (ee) {
          item.href = href
        }
      } else {
        item.href = href
      }
    } catch (e) { console.warn('[nimbi-cms] nav item href parse failed', e); item.href = href }
    try {
      const displayName = (a.textContent && String(a.textContent).trim()) ? String(a.textContent).trim() : null
      if (displayName) {
        try {
          const slugKey = slugify(displayName)
          if (slugKey) {
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
  if (end) menu.appendChild(end)
  navbar.appendChild(brand)
  navbar.appendChild(menu)
  navbarWrap.appendChild(navbar)
  
  try {
    const outsideHandler = (ev) => {
      try {
        const burgerEl = navbar && navbar.querySelector ? navbar.querySelector('.navbar-burger') : document.querySelector('.navbar-burger')
        if (!burgerEl || !burgerEl.classList.contains('is-active')) return
        const navEl = (burgerEl && burgerEl.closest) ? burgerEl.closest('.navbar') : navbar
        if (navEl && navEl.contains(ev.target)) return
        closeMobileMenu()
      } catch (e) { /* ignore */ }
    }
    document.addEventListener('click', outsideHandler, true)
    document.addEventListener('touchstart', outsideHandler, true)
  } catch (e) { /* ignore */ }
  

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
            try {
              const pageVal = pageParam + (hash ? `::${hash}` : '')
              try {
                const anchorPart = hash ? '#' + encodeURIComponent(hash) : ''
                const cosmetic = '#/' + encodeURL(pageParam || '') + anchorPart
                history.pushState({ page: pageVal }, '', cosmetic)
              } catch (e) {
                const anchorPart = hash ? '#' + encodeURIComponent(hash) : ''
                const cosmetic = '#/' + encodeURL(pageParam || '') + anchorPart
                history.pushState({ page: pageVal }, '', cosmetic)
              }
            } catch (e) {
              const locParams = new URLSearchParams(location.search || '')
              locParams.delete('page')
              const qs = locParams.toString()
              const suffix = qs ? '?' + qs : ''
              const anchorPart = hash ? '#' + encodeURIComponent(hash) : ''
              const cosmetic = '#/' + encodeURL(pageParam || '') + anchorPart + suffix
              history.pushState({ page: pageParam }, '', cosmetic)
            }
          runRenderWithTransition()
        }
      } catch (e) { console.warn('[nimbi-cms] navbar click handler failed', e) }
        try {
          const burgerEl = navbar && navbar.querySelector ? navbar.querySelector('.navbar-burger') : null
          const targetId = burgerEl && burgerEl.dataset ? burgerEl.dataset.target : null
          const target = targetId ? document.getElementById(targetId) : null
          if (burgerEl && burgerEl.classList.contains('is-active')) {
            burgerEl.classList.remove('is-active')
            burgerEl.setAttribute('aria-expanded', 'false')
            if (target) target.classList.remove('is-active')
          }
        } catch (err) { console.warn('[nimbi-cms] mobile menu close failed', err) }
    })
  } catch (e) { console.warn('[nimbi-cms] attach content click handler failed', e) }

  try {
    container.addEventListener('click', (ev) => {
      const a = ev.target && ev.target.closest ? ev.target.closest('a') : null
      if (!a) return
      const href = a.getAttribute('href') || ''
      if (!href) return
      if (isExternalLink(href)) return
      try {
        const url = new URL(href, location.href)
        const pageParam = url.searchParams.get('page')
        const hash = url.hash ? url.hash.replace(/^#/, '') : null
        if (pageParam) {
          ev.preventDefault()
            try {
              const pageVal = pageParam + (hash ? `::${hash}` : '')
              try {
                const anchorPart = hash ? '#' + encodeURIComponent(hash) : ''
                const cosmetic = '#/' + encodeURL(pageParam || '') + anchorPart
                history.pushState({ page: pageVal }, '', cosmetic)
              } catch (e) {
                const anchorPart = hash ? '#' + encodeURIComponent(hash) : ''
                const cosmetic = '#/' + encodeURL(pageParam || '') + anchorPart
                history.pushState({ page: pageVal }, '', cosmetic)
              }
          } catch (e) {
            const locParams = new URLSearchParams(location.search || '')
            locParams.delete('page')
            const qs = locParams.toString()
            const suffix = qs ? '?' + qs : ''
            const anchorPart = hash ? '#' + encodeURIComponent(hash) : ''
            const cosmetic = '#/' + encodeURL(pageParam || '') + anchorPart + suffix
            history.pushState({ page: pageParam }, '', cosmetic)
          }
          runRenderWithTransition()
        }
      } catch (e) {
        console.warn('[nimbi-cms] container click URL parse failed', e)
      }
    })
  } catch (e) { console.warn('[nimbi-cms] build navbar failed', e) }
  

  return { navbar, linkEls }
}

try {
  document.addEventListener('input', (ev) => {
    try {
      if (ev && ev.target && ev.target.id === 'nimbi-search') {
        const r = document.getElementById('nimbi-search-results')
        if (r && ev.target && ev.target.value) {
          try { r.style.display = 'block' } catch (e) {}
        }
      }
    } catch (e) {}
  }, true)
  
} catch (e) {}
