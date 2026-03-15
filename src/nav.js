import { createNavTree } from './htmlBuilder.js'
import { t } from './l10nManager.js'
import { preScanHtmlSlugs, preMapMdSlugs } from './htmlBuilder.js'
import { isExternalLink, normalizePath, safe } from './utils/helpers.js'
import { slugify, slugToMd, mdToSlug, fetchMarkdown } from './slugManager.js'

// Safe getter for properties on dynamically-imported modules. Some tests
// partially mock modules and accessing non-exported named properties can
// throw under certain mocking strategies; hide such errors and return
// undefined when the property is not available.
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
export async function buildNav(navbarWrap, container, navHtml, contentBase, homePage, t, renderByQuery, effectiveSearchEnabled, searchIndexMode = 'eager', indexDepth = 1, noIndexing = undefined) {
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
  let indexedCountLog = false

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
        brandItem.href = '?page=' + encodeURIComponent(decodeURIComponent(p))
      } else {
        brandItem.href = '?page=' + encodeURIComponent(homePage)
        brandItem.textContent = t('home')
      }
    } catch (e) {
      brandItem.href = '?page=' + encodeURIComponent(homePage)
      brandItem.textContent = t('home')
    }
  } else {
    brandItem.href = '?page=' + encodeURIComponent(homePage)
    brandItem.textContent = t('home')
  }
  brand.appendChild(brandItem)

  brandItem.addEventListener('click', function (ev) {
    const href = brandItem.getAttribute('href') || '';
    if (href.startsWith('?page=')) {
      ev.preventDefault();
      const url = new URL(href, location.href);
      const pageParam = url.searchParams.get('page');
      const hash = url.hash ? url.hash.replace(/^#/, '') : null;
      history.pushState({ page: pageParam }, '', '?page=' + encodeURIComponent(pageParam) + (hash ? '#' + encodeURIComponent(hash) : ''));
      try { renderByQuery(); } catch (e) { console.warn('[nimbi-cms] renderByQuery failed', e); }
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

  // Toggle navbar menu on mobile when burger is clicked
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
  let end, searchItem, resultsContainer
  if (!effectiveSearchEnabled) {
    end = null
    searchInput = null
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
      searchInput.classList.add('is-loading')
    }
    searchItem.appendChild(searchInput)

    resultsContainer = document.createElement('div')
    resultsContainer.id = 'nimbi-search-results'
    resultsContainer.className = 'box'
    searchItem.appendChild(resultsContainer)
    end.appendChild(searchItem)

    
    const showResults = (items) => {
      resultsContainer.innerHTML = ''
      if (!items.length) {
        resultsContainer.classList.remove('is-open')
        try { resultsContainer.style.display = 'none' } catch (e) {}
        return
      }
      items.forEach(it => {
        const wrap = document.createElement('div')
        wrap.className = 'nimbi-search-result'
        if (it.parentTitle) {
          const label = document.createElement('div')
          label.textContent = it.parentTitle
          label.className = 'nimbi-search-title nimbi-search-parent'
          wrap.appendChild(label)
        }
        const a = document.createElement('a')
        a.className = 'block'
        a.href = '?page=' + encodeURIComponent(it.slug)
        a.textContent = it.title
        a.addEventListener('click', () => { resultsContainer.style.display = 'none' })
        wrap.appendChild(a)
        resultsContainer.appendChild(wrap)
      })
      try { resultsContainer.style.display = 'block' } catch (e) {}
      resultsContainer.classList.add('is-open')
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
          const fm = await import('./slugManager.js')
          if (!searchIndexPromise) {
            searchIndexPromise = (async () => {
              try {
                const workerFn = safeGet(fm, 'buildSearchIndexWorker')
                const buildFn = safeGet(fm, 'buildSearchIndex')
                if (searchIndexMode === 'lazy' && typeof workerFn === 'function') {
                    try {
                    const r = await workerFn(contentBase, indexDepth, noIndexing)
                    if (r && r.length) return r
                    // fallback to main-thread builder when worker returns nothing
                  } catch (e) {
                    console.warn && console.warn('[nimbi-cms] worker builder threw', e)
                    // fallthrough to main-thread builder
                  }
                }
                if (typeof buildFn === 'function') return buildFn(contentBase, indexDepth, noIndexing)
                return []
              } catch (err) {
                console.warn('[nimbi-cms] buildSearchIndex failed', err)
                return []
              } finally {
                if (searchInput) {
                  try { searchInput.removeAttribute('disabled') } catch (e) {}
                  try { searchInput.classList.remove('is-loading') } catch (e) {}
                }
              }
            })()
            // Ensure that once the index resolves we show results for the
            // current query if applicable — this guards against timing
            // races where the worker returns after the input event.
                try {
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
                  filteredNow.slice(0,10).forEach(it => {
                    const wrap = document.createElement('div')
                    wrap.className = 'nimbi-search-result'
                    if (it.parentTitle) {
                      const label = document.createElement('div')
                      label.textContent = it.parentTitle
                      label.className = 'nimbi-search-title nimbi-search-parent'
                      wrap.appendChild(label)
                    }
                    const a = document.createElement('a')
                    a.className = 'block'
                    a.href = '?page=' + encodeURIComponent(it.slug)
                    a.textContent = it.title
                    a.addEventListener('click', () => { try { resultsEl.style.display = 'none' } catch (_) {} })
                    wrap.appendChild(a)
                    resultsEl.appendChild(wrap)
                  })
                  try { resultsEl.style.display = 'block' } catch (e) {}
                } catch (e) { /* ignore */ }
              }).catch(()=>{})
            } catch (e) { /* ignore */ }
          }
          const idx = await searchIndexPromise
          const filtered = idx.filter(e => (e.title && e.title.toLowerCase().includes(q)) || (e.excerpt && e.excerpt.toLowerCase().includes(q)))
          showResults(filtered.slice(0, 10))
        } catch (err) { console.warn('[nimbi-cms] search input handler failed', err); showResults([]) }
      }, 50)
    }

    if (searchIndexMode === 'eager') {
      try {
        searchIndexPromise = (async () => {
            try {
            const fm = await import('./slugManager.js')
            const workerFn = safeGet(fm, 'buildSearchIndexWorker')
            const buildFn = safeGet(fm, 'buildSearchIndex')
            let idx = []
            if (searchIndexMode === 'lazy' && typeof workerFn === 'function') {
              try {
                const r = await workerFn(contentBase, indexDepth, noIndexing)
                if (r && r.length) idx = r
              } catch (e) { console.warn('[nimbi-cms] worker builder (eager branch) threw', e) }
            }
            if (!idx.length && typeof buildFn === 'function') {
              try { idx = await buildFn(contentBase, indexDepth, noIndexing) } catch (e) { console.warn('[nimbi-cms] eager buildSearchIndex call failed', e) }
            }
            
            if (!indexedCountLog) indexedCountLog = true
            return idx
          } catch (err) {
            console.warn('[nimbi-cms] buildSearchIndex failed', err)
            return []
          }
        })()
      } catch (err) {
        console.warn('[nimbi-cms] eager search index init failed', err)
        searchIndexPromise = Promise.resolve([])
      }
      searchIndexPromise.finally(() => {
        const domInput = document.querySelector('input#nimbi-search');
        if (domInput) {
          domInput.removeAttribute('disabled');
          domInput.classList.remove('is-loading');
        }
      })
      // If an eager index finished and the input already contains text
      // (tests sometimes set the value before the index completes), run
      // a quick post-index check to show results for the current query.
      try {
        searchIndexPromise.then((idx) => {
          try {
            const domInput = document.querySelector('input#nimbi-search')
            if (domInput) {
              const q = String(domInput.value || '').trim().toLowerCase()
              if (q && Array.isArray(idx) && idx.length) {
                const filtered = idx.filter(e => (e.title && e.title.toLowerCase().includes(q)) || (e.excerpt && e.excerpt.toLowerCase().includes(q)))
                try {
                  const results = document.getElementById('nimbi-search-results')
                  if (results) {
                    results.innerHTML = ''
                    filtered.slice(0,10).forEach(it => {
                      const wrap = document.createElement('div')
                      wrap.className = 'nimbi-search-result'
                      if (it.parentTitle) {
                        const label = document.createElement('div')
                        label.textContent = it.parentTitle
                        label.className = 'nimbi-search-title nimbi-search-parent'
                        wrap.appendChild(label)
                      }
                      const a = document.createElement('a')
                      a.className = 'block'
                      a.href = '?page=' + encodeURIComponent(it.slug)
                      a.textContent = it.title
                      a.addEventListener('click', () => { try { results.style.display = 'none' } catch (_) {} })
                      wrap.appendChild(a)
                      results.appendChild(wrap)
                    })
                    try { results.style.display = 'block' } catch (_) {}
                  }
                } catch (e) {}
              }
            }
          } catch (e) { /* ignore post-index errors */ }
        }).catch(() => {})
      } catch (e) { /* ignore */ }
    }
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
        item.href = '?page=' + encodeURIComponent(mdPath) + (frag ? '#' + encodeURIComponent(frag) : '')
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

  

    try {
      searchInput = document.getElementById('nimbi-search')
      const results = document.getElementById('nimbi-search-results')
      const showResults = (items) => {
      results.innerHTML = ''
      if (!items.length) {
        results.classList.remove('is-open')
        try { results.style.display = 'none' } catch (e) {}
        return
      }
      items.forEach(it => {
        const wrap = document.createElement('div')
        wrap.className = 'nimbi-search-result'
        if (it.parentTitle) {
          const label = document.createElement('div')
          label.textContent = it.parentTitle
          label.className = 'nimbi-search-title nimbi-search-parent'
          wrap.appendChild(label)
        }
        const a = document.createElement('a')
        a.className = 'block'
        a.href = '?page=' + encodeURIComponent(it.slug)
        a.textContent = it.title
        a.addEventListener('click', () => { results.style.display = 'none' })
        wrap.appendChild(a)
        results.appendChild(wrap)
      })
      try { results.style.display = 'block' } catch (e) {}
      results.classList.add('is-open')
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
        const q = String(searchInput.value || '').trim().toLowerCase()
        if (!q) { showResults([]); return }
        try {
          const fm = await import('./slugManager.js')
          if (!searchIndexPromise) {
            searchIndexPromise = (async () => {
              try {
                  
                  if (searchIndexMode === 'lazy' && fm.buildSearchIndexWorker) {
                    return fm.buildSearchIndexWorker(contentBase, indexDepth, noIndexing)
                  }
                  return fm.buildSearchIndex(contentBase, indexDepth, noIndexing)
              } catch (err) {
                console.warn('[nimbi-cms] buildSearchIndex failed', err)
                return []
              } finally {
                if (searchInput) {
                  try { searchInput.removeAttribute('disabled') } catch (e) {}
                  try { searchInput.classList.remove('is-loading') } catch (e) {}
                }
              }
            })()
          }
            const idx = await searchIndexPromise
              const filtered = idx.filter(e => (e.title && e.title.toLowerCase().includes(q)) || (e.excerpt && e.excerpt.toLowerCase().includes(q)))
          showResults(filtered.slice(0, 10))
        } catch (err) { console.warn('[nimbi-cms] search input handler failed', err); showResults([]) }
      }, 50)

      searchInput.addEventListener('input', handleInput)
      
      // Also listen at document capture phase to ensure synthetic input
      // events (from tests or other frameworks) are caught reliably.
      try {
        document.addEventListener('input', (ev) => {
          try {
            if (ev && ev.target && ev.target.id === 'nimbi-search') {
              handleInput(ev)
            }
          } catch (e) { /* ignore */ }
        }, true)
      } catch (e) { /* ignore attach failures in constrained env */ }
      document.addEventListener('click', (ev) => {
        if (searchInput && !searchInput.contains(ev.target) && results && !results.contains(ev.target)) {
          results.style.display = 'none'
        }
      })
    }
  } catch (_) {
    console.warn('[nimbi-cms] navbar/search setup inner failed', _)
  }

  menu.appendChild(start)
  if (end) menu.appendChild(end)
  navbar.appendChild(brand)
  navbar.appendChild(menu)
  navbarWrap.appendChild(navbar)

  // Lightweight fallback for environments where the primary input listener
  // may not be attached yet. This re-runs the filtering/render logic on
  // `input` events for `#nimbi-search` without emitting debug logs.
  try {
    setTimeout(() => {
      try {
        const inp = document.getElementById('nimbi-search')
        const resultsEl = document.getElementById('nimbi-search-results')
        if (!inp || inp.__nimbi_input_fallback) return
        inp.__nimbi_input_fallback = true
        inp.addEventListener('input', async (ev) => {
          try {
            const q = String((ev && ev.target && ev.target.value) || '').trim().toLowerCase()
            if (!q) {
              if (resultsEl) {
                resultsEl.innerHTML = ''
                try { resultsEl.style.display = 'none' } catch (e) {}
              }
              return
            }
            if (!searchIndexPromise) return
            const idx = await searchIndexPromise
            if (!Array.isArray(idx) || !idx.length) {
              if (resultsEl) {
                resultsEl.innerHTML = ''
                try { resultsEl.style.display = 'none' } catch (e) {}
              }
              return
            }
            const filtered = idx.filter(e => (e.title && e.title.toLowerCase().includes(q)) || (e.excerpt && e.excerpt.toLowerCase().includes(q)))
            if (!resultsEl) return
            resultsEl.innerHTML = ''
            filtered.slice(0,10).forEach(it => {
              const wrap = document.createElement('div')
              wrap.className = 'nimbi-search-result'
              if (it.parentTitle) {
                const label = document.createElement('div')
                label.textContent = it.parentTitle
                label.className = 'nimbi-search-title nimbi-search-parent'
                wrap.appendChild(label)
              }
              const a = document.createElement('a')
              a.className = 'block'
              a.href = '?page=' + encodeURIComponent(it.slug)
              a.textContent = it.title
              a.addEventListener('click', () => { try { resultsEl.style.display = 'none' } catch (e) {} })
              wrap.appendChild(a)
              resultsEl.appendChild(wrap)
            })
            try { resultsEl.style.display = filtered.length ? 'block' : 'none' } catch (e) {}
          } catch (e) { /* ignore fallback errors */ }
        })
      } catch (e) { /* ignore attach errors */ }
    }, 50)
  } catch (e) {}

  

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
        // On mobile, close the burger/menu after a navigation click
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
          history.pushState({ page: pageParam }, '', '?page=' + encodeURIComponent(pageParam) + (hash ? '#' + encodeURIComponent(hash) : ''))
          try { renderByQuery() } catch (e) { console.warn('[nimbi-cms] renderByQuery failed', e) }
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
