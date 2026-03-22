import { createNavTree, preScanHtmlSlugs, preMapMdSlugs } from './htmlBuilder.js'
import { t } from './l10nManager.js'
import { buildPageUrl, isExternalLink, normalizePath, safe } from './utils/helpers.js'
import { parseHrefToRoute } from './utils/urlHelper.js'
import { slugify, slugToMd, mdToSlug, fetchMarkdown, allMarkdownPaths, searchIndex } from './slugManager.js'

// Local debug helpers: controlled by `window.__nimbiCMSDebug` at runtime
const __nimbiDebug = (typeof window !== 'undefined' && window.__nimbiCMSDebug)
function __nimbiDebugLog(...args) { if (!__nimbiDebug) return; try { console.log(...args) } catch (e) {} }
function __nimbiDebugWarn(...args) { if (!__nimbiDebug) return; try { console.warn(...args) } catch (e) {} }

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
  // one-time guard so we only trigger sitemap build once when spinner removal fires
  let sitemapTriggered = false
  let resolvedIndexForSitemap = null

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
    } catch (err) { __nimbiDebugWarn('[nimbi-cms] closeMobileMenu failed', err) }
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
      try { __nimbiDebugWarn('[nimbi-cms] renderByQuery failed', e) } catch (_) {}
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
        const globalBuild = (typeof globalThis !== 'undefined' ? globalThis.buildSearchIndex : undefined)
        const globalWorker = (typeof globalThis !== 'undefined' ? globalThis.buildSearchIndexWorker : undefined)
        const moduleBuild = safeGet(fm, 'buildSearchIndex')
        const moduleWorker = safeGet(fm, 'buildSearchIndexWorker')
        const buildFn = (typeof globalBuild === 'function') ? globalBuild : (moduleBuild || undefined)
        const workerFn = (typeof globalWorker === 'function') ? globalWorker : (moduleWorker || undefined)
        __nimbiDebugLog('[nimbi-cms test] ensureSearchIndex: buildFn=' + (typeof buildFn) + ' workerFn=' + (typeof workerFn) + ' (global preferred)')
        const seeds = []
        try { if (homePage) seeds.push(homePage) } catch (_) {}
        try { if (navigationPage) seeds.push(navigationPage) } catch (_) {}
        if (searchIndexMode === 'lazy' && typeof workerFn === 'function') {
          try {
            const r = await workerFn(contentBase, indexDepth, noIndexing, seeds.length ? seeds : undefined)
            if (r && r.length) {
              try {
                if (fm && typeof fm._setSearchIndex === 'function') {
                  try { fm._setSearchIndex(r) } catch (e) {}
                }
              } catch (e) {}
              return r
            }
          } catch (e) { __nimbiDebugWarn('[nimbi-cms] worker builder threw', e) }
        }
        if (typeof buildFn === 'function') {
          __nimbiDebugLog('[nimbi-cms test] calling buildFn')
          return await buildFn(contentBase, indexDepth, noIndexing, seeds.length ? seeds : undefined)
        }
        return []
      } catch (err) {
        __nimbiDebugWarn('[nimbi-cms] buildSearchIndex failed', err)
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
        // capture resolved index for sitemap trigger
        try { resolvedIndexForSitemap = Array.isArray(idx) ? idx : null } catch (_) { resolvedIndexForSitemap = null }
        try {
          if (typeof window !== 'undefined') {
            try {
              ;(async () => {
                try {
                  const fmMod = await import('./slugManager.js')
                  try {
                    Object.defineProperty(window, '__nimbiResolvedIndex', {
                      get() { return (fmMod && Array.isArray(fmMod.searchIndex)) ? fmMod.searchIndex : (Array.isArray(resolvedIndexForSitemap) ? resolvedIndexForSitemap : []) },
                      enumerable: true,
                      configurable: true
                    })
                    } catch (e2) {
                    try { window.__nimbiResolvedIndex = (fmMod && Array.isArray(fmMod.searchIndex)) ? fmMod.searchIndex : (Array.isArray(resolvedIndexForSitemap) ? resolvedIndexForSitemap : []) } catch (e3) {}
                  }
                } catch (e) {
                  try { window.__nimbiResolvedIndex = (Array.isArray(searchIndex) ? searchIndex : (Array.isArray(resolvedIndexForSitemap) ? resolvedIndexForSitemap : [])) } catch (e4) {}
                }
              })()
            } catch (e) {}
            try { window.__nimbi_contentBase = contentBase } catch (e) {}
            try { window.__nimbi_indexDepth = indexDepth } catch (e) {}
            try { window.__nimbi_noIndexing = noIndexing } catch (e) {}
          }
        } catch (e) {}
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
              a.href = buildPageUrl(it.slug)
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
    }).catch(()=>{}).finally(() => {
      ;(async () => {
        try {
          if (sitemapTriggered) return
          sitemapTriggered = true
          const rs = await import('./runtimeSitemap.js')
            try {
              // Do not pass a snapshot index here — let the sitemap module
              // import / reference the live `searchIndex` directly so it
              // always operates on the same object used by the search UI.
              await rs.handleSitemapRequest({ homePage, contentBase, indexDepth, noIndexing, includeAllMarkdown: true })
            } catch (err) {
              __nimbiDebugWarn('[nimbi-cms] sitemap trigger failed', err)
            }
        } catch (err) {
          try { __nimbiDebugWarn('[nimbi-cms] sitemap dynamic import failed', err) } catch (_) {}
        }
      })()
    })

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
      const target = p ? decodeURIComponent(p) : homePage
      // Prefer a slug when possible: if the target looks like a path (.md/.html
      // or contains a directory), try to resolve a slug for that path. If the
      // target already looks like a slug (no dot), keep it as-is.
      let slugCandidate = null
      try {
        if (typeof target === 'string' && (/(?:\.md|\.html?)$/i.test(target) || target.includes('/'))) {
          slugCandidate = findSlugForPath(target)
        }
      } catch (e) {}
      if (!slugCandidate && typeof target === 'string' && !String(target).includes('.')) slugCandidate = target
      const finalPage = slugCandidate || target
      brandItem.href = buildPageUrl(finalPage)
      if (!brandItem.textContent || !String(brandItem.textContent).trim()) brandItem.textContent = t('home')
    } catch (e) {
      try {
        const slugCandidate = (typeof homePage === 'string' && (/(?:\.md|\.html?)$/i.test(homePage) || homePage.includes('/'))) ? findSlugForPath(homePage) : (typeof homePage === 'string' && !homePage.includes('.') ? homePage : null)
        brandItem.href = buildPageUrl(slugCandidate || homePage)
      } catch (ee) {
        brandItem.href = buildPageUrl(homePage)
      }
      brandItem.textContent = t('home')
    }
  } else {
    brandItem.href = buildPageUrl(homePage)
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
    if (href.startsWith('?page=')) {
      ev.preventDefault();
      const url = new URL(href, location.href);
      const pageParam = url.searchParams.get('page');
      const hash = url.hash ? url.hash.replace(/^#/, '') : null;
      history.pushState({ page: pageParam }, '', buildPageUrl(pageParam, hash));
      runRenderWithTransition()
      try { closeMobileMenu() } catch (e) {}
    }
  });

  // Helper: try to find an existing slug for a given markdown/html path.
  // Returns the slug string or null when no mapping exists.
  function findSlugForPath(p) {
    try {
      if (!p) return null
      const norm = normalizePath(String(p || ''))
      try { if (mdToSlug && mdToSlug.has(norm)) return mdToSlug.get(norm) } catch (e) {}
      // Try basename lookup
      const base = norm.replace(/^.*\//, '')
      try { if (mdToSlug && mdToSlug.has(base)) return mdToSlug.get(base) } catch (e) {}
      // Scan slugToMd map for a matching value (handles localized entries)
      try {
        for (const [slug, entry] of slugToMd.entries()) {
          if (!entry) continue
          if (typeof entry === 'string') {
            if (normalizePath(entry) === norm) return slug
          } else if (entry && typeof entry === 'object') {
            if (entry.default && normalizePath(entry.default) === norm) return slug
            const langs = entry.langs || {}
            for (const k in langs) {
              if (langs[k] && normalizePath(langs[k]) === norm) return slug
            }
          }
        }
      } catch (e) {}
      return null
    } catch (e) { return null }
  }


  
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
      } catch (err) { __nimbiDebugWarn('[nimbi-cms] navbar burger toggle failed', err) }
    })
  } catch (err) { __nimbiDebugWarn('[nimbi-cms] burger event binding failed', err) }

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
    try {
      const ariaLabel = (t && typeof t === 'function' ? t('searchAria') : null) || searchInput.placeholder || 'Search'
      try { searchInput.setAttribute('aria-label', ariaLabel) } catch (e) {}
      try { searchInput.setAttribute('aria-controls', 'nimbi-search-results') } catch (e) {}
      try { searchInput.setAttribute('aria-autocomplete', 'list') } catch (e) {}
      try { searchInput.setAttribute('role', 'combobox') } catch (e) {}
    } catch (e) {}
    if (searchIndexMode === 'eager') {
      searchInput.disabled = true
    }

    searchControl = document.createElement('div')
    searchControl.className = 'control'
    if (searchIndexMode === 'eager') searchControl.classList.add('is-loading')
    searchControl.appendChild(searchInput)
    searchItem.appendChild(searchControl)

    dropdown = document.createElement('div')
    dropdown.className = 'dropdown is-right'
    dropdown.id = 'nimbi-search-dropdown'

    const trigger = document.createElement('div')
    trigger.className = 'dropdown-trigger'
    trigger.appendChild(searchItem)

    const dropdownMenu = document.createElement('div')
    dropdownMenu.className = 'dropdown-menu'
    dropdownMenu.setAttribute('role', 'menu')

    dropdownContent = document.createElement('div')
    dropdownContent.id = 'nimbi-search-results'
    dropdownContent.className = 'dropdown-content nimbi-search-results'

    resultsContainer = dropdownContent

    dropdownMenu.appendChild(dropdownContent)
    dropdown.appendChild(trigger)
    dropdown.appendChild(dropdownMenu)
    end.appendChild(dropdown)

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
          a.href = buildPageUrl(it.slug)
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
          __nimbiDebugLog('[nimbi-cms test] search handleInput q="' + q + '" idxlen=' + (Array.isArray(idx) ? idx.length : 'nil'))
          const filtered = idx.filter(e => (e.title && e.title.toLowerCase().includes(q)) || (e.excerpt && e.excerpt.toLowerCase().includes(q)))
          __nimbiDebugLog('[nimbi-cms test] filtered len=' + (Array.isArray(filtered) ? filtered.length : 'nil'))
          showResults(filtered.slice(0, 10))
        } catch (err) { __nimbiDebugWarn('[nimbi-cms] search input handler failed', err); showResults([]) }
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
        __nimbiDebugWarn('[nimbi-cms] eager search index init failed', err)
        searchIndexPromise = Promise.resolve([])
      }
        searchIndexPromise.finally(() => {
          const domInput = document.querySelector('input#nimbi-search')
          if (domInput) {
            try { domInput.removeAttribute('disabled') } catch (e) {}
            try { searchControl && searchControl.classList.remove('is-loading') } catch (e) {}
          }
          ;(async () => {
            try {
              if (sitemapTriggered) return
              sitemapTriggered = true
              const idx = await searchIndexPromise.catch(() => [])
              const rs = await import('./runtimeSitemap.js')
              try {
                await rs.handleSitemapRequest({ index: Array.isArray(idx) ? idx : undefined, homePage, contentBase, indexDepth, noIndexing, includeAllMarkdown: true })
              } catch (err) {
                __nimbiDebugWarn('[nimbi-cms] sitemap trigger failed', err)
              }
            } catch (err) {
              try { __nimbiDebugWarn('[nimbi-cms] sitemap dynamic import failed', err) } catch (_) {}
            }
          })()
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
        const slug = findSlugForPath(mdPath)
        if (slug) {
          item.href = buildPageUrl(slug, frag)
        } else {
          item.href = buildPageUrl(mdPath, frag)
        }
      } else if (/\.html(?:$|[#?])/.test(href) || href.endsWith('.html')) {
        let raw = normalizePath(href)
        const parts = raw.split(/::|#/, 2)
        let htmlPath = parts[0]
        if (htmlPath && !htmlPath.toLowerCase().endsWith('.html')) {
          htmlPath = htmlPath + '.html'
        }
        const frag = parts[1]
        const slug = findSlugForPath(htmlPath)
        if (slug) {
          item.href = buildPageUrl(slug, frag)
        } else {
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
                    try { slugToMd.set(slugKey, htmlPath); mdToSlug.set(htmlPath, slugKey) } catch (ee) { __nimbiDebugWarn('[nimbi-cms] slugToMd/mdToSlug set failed', ee) }
                    item.href = buildPageUrl(slugKey, frag)
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
      } else {
        item.href = href
      }
    } catch (e) { __nimbiDebugWarn('[nimbi-cms] nav item href parse failed', e); item.href = href }
    try {
      const displayName = (a.textContent && String(a.textContent).trim()) ? String(a.textContent).trim() : null
      if (displayName) {
        try {
          const slugKey = slugify(displayName)
          if (slugKey) {
                const hrefVal = item.getAttribute('href') || ''
                let mappingTarget = null
                // Prefer explicit md/html paths for mappings (relative or canonical)
                if (/^[^#?]*\.(?:md|html?)(?:$|[?#])/i.test(hrefVal)) {
                  mappingTarget = normalizePath(String(hrefVal || '').split(/[?#]/)[0])
                } else {
                  // If it's a canonical ?page=... form, use the page value
                  try {
                    const p = parseHrefToRoute(hrefVal)
                    if (p && p.type === 'canonical' && p.page) mappingTarget = normalizePath(p.page)
                  } catch (_e) {}
                }
                if (mappingTarget) {
                  let persistMapping = false
                  try {
                    if (/\.(?:md|html?)(?:$|[?#])/i.test(String(mappingTarget || ''))) {
                      persistMapping = true
                    } else {
                      const norm = String(mappingTarget || '').replace(/^\.\//, '')
                      const baseName = norm.replace(/^.*\//, '')
                      if (Array.isArray(allMarkdownPaths) && allMarkdownPaths.length) {
                        if (allMarkdownPaths.includes(norm) || allMarkdownPaths.includes(baseName)) persistMapping = true
                      }
                    }
                  } catch (err) { persistMapping = false }
                  if (persistMapping) {
                    try { slugToMd.set(slugKey, mappingTarget) } catch (ee) {}
                    try { mdToSlug.set(mappingTarget, slugKey) } catch (ee) {}
                  }
                }
              }
        } catch (ee) { __nimbiDebugWarn('[nimbi-cms] nav slug mapping failed', ee) }
      }
    } catch (ee) { __nimbiDebugWarn('[nimbi-cms] nav slug mapping failed', ee) }

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
          history.pushState({ page: pageParam }, '', buildPageUrl(pageParam, hash))
          runRenderWithTransition()
        }
      } catch (e) { __nimbiDebugWarn('[nimbi-cms] navbar click handler failed', e) }
        try {
          const burgerEl = navbar && navbar.querySelector ? navbar.querySelector('.navbar-burger') : null
          const targetId = burgerEl && burgerEl.dataset ? burgerEl.dataset.target : null
          const target = targetId ? document.getElementById(targetId) : null
          if (burgerEl && burgerEl.classList.contains('is-active')) {
            burgerEl.classList.remove('is-active')
            burgerEl.setAttribute('aria-expanded', 'false')
            if (target) target.classList.remove('is-active')
          }
        } catch (err) { __nimbiDebugWarn('[nimbi-cms] mobile menu close failed', err) }
    })
  } catch (e) { __nimbiDebugWarn('[nimbi-cms] attach content click handler failed', e) }

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
          history.pushState({ page: pageParam }, '', buildPageUrl(pageParam, hash))
          runRenderWithTransition()
        }
      } catch (e) {
        __nimbiDebugWarn('[nimbi-cms] container click URL parse failed', e)
      }
    })
  } catch (e) { __nimbiDebugWarn('[nimbi-cms] build navbar failed', e) }
  

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
