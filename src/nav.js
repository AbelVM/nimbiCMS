import { createNavTree } from './htmlBuilder.js'
import { t } from './l10nManager.js'
import { preScanHtmlSlugs, preMapMdSlugs } from './htmlBuilder.js'
import { buildPageUrl, isExternalLink, normalizePath, safe } from './utils/helpers.js'
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
      if (p) {
        const page = decodeURIComponent(p)
        brandItem.href = buildPageUrl(page)
      } else {
        brandItem.href = buildPageUrl(homePage)
        brandItem.textContent = t('home')
      }
    } catch (e) {
      brandItem.href = buildPageUrl(homePage)
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
      if (!items.length) {
        if (dropdown) dropdown.classList.remove('is-active')
        try { dropdownContent.style.display = 'none' } catch (e) {}
        try { dropdownContent.classList.remove('is-open') } catch (e) {}
        return
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
            if (dropdown) dropdown.classList.remove('is-active')
            try { dropdownContent.style.display = 'none' } catch (e) {}
            try { dropdownContent.classList.remove('is-open') } catch (e) {}
          })
          panel.appendChild(a)
        })
        dropdownContent.appendChild(panel)
      } catch (e) { /* ignore render errors */ }
      if (dropdown) dropdown.classList.add('is-active')
      try { dropdownContent.style.display = 'block' } catch (e) {}
      try { dropdownContent.classList.add('is-open') } catch (e) {}
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
              if (dropdown) dropdown.classList.remove('is-active')
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
        item.href = buildPageUrl(mdPath, frag)
      } else if (/\.html(?:$|[#?])/.test(href) || href.endsWith('.html')) {
        let raw = normalizePath(href)
        const parts = raw.split(/::|#/, 2)
        let htmlPath = parts[0]
        if (htmlPath && !htmlPath.toLowerCase().endsWith('.html')) {
          htmlPath = htmlPath + '.html'
        }
        const frag = parts[1]
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
          history.pushState({ page: pageParam }, '', buildPageUrl(pageParam, hash))
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
          history.pushState({ page: pageParam }, '', buildPageUrl(pageParam, hash))
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
