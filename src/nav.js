/**
 * Navigation helpers shim.
 *
 * Small helper used by the initializer to construct the site navigation
 * structure. Consumers can import `createSiteNav` from `./nav.js` as a
 * clearer separation point for nav-related logic.
 */
import { createNavTree } from './htmlBuilder.js'
import { t } from './l10nManager.js'
import { preScanHtmlSlugs, preMapMdSlugs } from './htmlBuilder.js'
import { isExternalLink, normalizePath, safe } from './utils/helpers.js'
import { slugify, slugToMd, mdToSlug, fetchMarkdown } from './filesManager.js'

/**
 * Create a minimal site nav structure rooted at the provided home page.
 * @param {string} homePage
 * @returns {object} nav tree
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
 * @param {('eager'|'lazy'|'off')} searchIndexMode - search index option
 *   forwarded from `initCMS`; only relevant if a search input is present.
 * @returns {Promise<Object>} resolves with an object containing `navbar` and `linkEls`
 */
export async function buildNav(navbarWrap, container, navHtml, contentBase, homePage, t, renderByQuery, effectiveSearchEnabled, searchIndexMode = 'eager') {
  if (!navbarWrap || !(navbarWrap instanceof HTMLElement)) {
    throw new TypeError('navbarWrap must be an HTMLElement')
  }

  const parser = typeof DOMParser !== 'undefined' ? new DOMParser() : null
  const navDoc = parser ? parser.parseFromString(navHtml || '', 'text/html') : null
  const linkEls = navDoc ? navDoc.querySelectorAll('a') : []
  

  // ensure slug maps are populated for links inside the navigation
  await safe(() => preScanHtmlSlugs(linkEls, contentBase))
  await safe(() => preMapMdSlugs(linkEls, contentBase))

  // search-related state variables must be declared before they are
  // referenced.  earlier versions placed these near the end of the function
  // which meant the eager-search branch hit the TDZ when the page build ran
  // (only encountered in the example app; tests disable search).  Moving the
  // declarations here ensures the bindings are initialized upfront.
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
      } else if (u.hash && /\.md$/.test(u.hash.replace(/^#/, ''))) {
        const h = u.hash.replace(/^#/, '')
        brandItem.href = '?page=' + encodeURIComponent(h)
      } else {
        const m = (u.pathname || '').match(/([^\/]+\.md)(?:$|[?#])/)
        if (m) {
          let md = normalizePath(m[1])
          brandItem.href = '?page=' + encodeURIComponent(md)
        } else {
          brandItem.href = rawHref
        }
      }
    } catch (e) {
      if (/^[#].*\.md$/.test(rawHref)) brandItem.href = '?page=' + encodeURIComponent(rawHref.replace(/^#/, ''))
      else if (/\.md$/.test(rawHref)) brandItem.href = '?page=' + encodeURIComponent(normalizePath(rawHref))
      else brandItem.href = rawHref
    }
    brandItem.textContent = firstLink.textContent || t('home')
  } else {
    brandItem.href = '?page=' + encodeURIComponent(homePage)
    brandItem.textContent = t('home')
  }
  brand.appendChild(brandItem)
  
      // Add SPA navigation handler for home link
    brandItem.addEventListener('click', function(ev) {
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


  // mobile hamburger
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
  let end, searchItem, resultsContainer
  // Respect searchIndex and searchIndexMode options
  if (!effectiveSearchEnabled || searchIndexMode === 'off') {
    // Do not render search box at all
    end = null;
    searchInput = null;
    resultsContainer = null;
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
    searchInput.disabled = true
    searchInput.classList.add('is-loading')
    searchItem.appendChild(searchInput)

    resultsContainer = document.createElement('div')
    resultsContainer.id = 'nimbi-search-results'
    resultsContainer.className = 'box'
    searchItem.appendChild(resultsContainer)
    end.appendChild(searchItem)

    // Setup search event handlers immediately after creation
    const showResults = (items) => {
      resultsContainer.innerHTML = ''
      if (!items.length) {
        resultsContainer.style.display = 'none'
        return
      }
      items.forEach(it => {
        const a = document.createElement('a')
        a.className = 'block'
        a.href = '?page=' + encodeURIComponent(it.slug)
        a.textContent = it.title
        a.style.whiteSpace = 'nowrap'
        a.style.overflow = 'hidden'
        a.style.textOverflow = 'ellipsis'
        a.addEventListener('click', () => { resultsContainer.style.display = 'none' })
        resultsContainer.appendChild(a)
      })
      resultsContainer.style.display = 'block'
      resultsContainer.style.right = '0'
      resultsContainer.style.left = 'auto'
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
        const domInput = document.querySelector('input#nimbi-search');
        const q = String(domInput && domInput.value || '').trim().toLowerCase();
        if (!q) { showResults([]); return; }
        try {
          const fm = await import('./filesManager.js');
          if (!searchIndexPromise) {
            searchIndexPromise = (async () => {
              try {
                if (searchIndexMode === 'lazy' && fm.buildSearchIndexWorker) {
                  return fm.buildSearchIndexWorker(contentBase);
                }
                return fm.buildSearchIndex(contentBase);
              } catch (_) {
                return [];
              } finally {
                if (domInput) {
                  domInput.removeAttribute('disabled');
                  domInput.classList.remove('is-loading');
                }
              }
            })();
          }
          const idx = await searchIndexPromise;
          const filtered = idx.filter(e => (e.title && e.title.toLowerCase().includes(q)) || (e.excerpt && e.excerpt.toLowerCase().includes(q)));
          showResults(filtered.slice(0, 10));
        } catch (_) { showResults([]); }
      }, 50);

      if (searchInput) searchInput.addEventListener('input', handleInput);
      document.addEventListener('click', (ev) => {
        const domInput = document.querySelector('input#nimbi-search');
        if (domInput && !domInput.contains(ev.target) && resultsContainer && !resultsContainer.contains(ev.target)) {
          resultsContainer.style.display = 'none';
        }
      });
    }

    if (searchIndexMode === 'eager') {
      try {
        searchIndexPromise = (async () => {
          try {
            const fm = await import('./filesManager.js')
            const idx = await fm.buildSearchIndex(contentBase)
            if (!indexedCountLog) {
              indexedCountLog = true
            }
            return idx
          } catch (_) {
            return []
          }
        })()
      } catch (_) {
        searchIndexPromise = Promise.resolve([])
      }
      searchIndexPromise.finally(() => {
        const domInput = document.querySelector('input#nimbi-search');
        if (domInput) {
          domInput.removeAttribute('disabled');
          domInput.classList.remove('is-loading');
        }
      })
    }
  }

  // iterate through parsed nav links to build start menu items
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
    } catch (e) { item.href = href }
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

  // search-related state (declared earlier to avoid TDZ) - retained for
  // clarity but should already be initialized above
  // let searchIndexPromise = null
  // let searchInput = null

  try {
    searchInput = document.getElementById('nimbi-search')
    const results = document.getElementById('nimbi-search-results')
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
        a.style.whiteSpace = 'nowrap'
        a.style.overflow = 'hidden'
        a.style.textOverflow = 'ellipsis'
        a.addEventListener('click', () => { results.style.display = 'none' })
        results.appendChild(a)
      })
      results.style.display = 'block'
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

    if (searchInput) {
      const handleInput = debounce(async () => {
        const q = String(searchInput.value || '').trim().toLowerCase()
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

      searchInput.addEventListener('input', handleInput)
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
        // ignore non-URL hrefs
      }
    })
  } catch (e) { console.warn('[nimbi-cms] build navbar failed', e) }

  return { navbar, linkEls }
}
