/**
 * Navigation builder and DOM wiring utilities.
 *
 * Build navigation DOM, pre-scan links for slug mapping, and wire SPA
 * navigation callbacks into the site header.
 *
 * @module nav
 */
import { createNavTree, preScanHtmlSlugs, preMapMdSlugs } from './htmlBuilder.js'
import { t } from './l10nManager.js'
import { buildPageUrl, isExternalLink, normalizePath, safe } from './utils/helpers.js'
import { parseHrefToRoute } from './utils/urlHelper.js'
import { getSharedParser } from './utils/sharedDomParser.js'
import { slugify, slugToMd, mdToSlug, storeSlugMapping, fetchMarkdown, allMarkdownPaths, allMarkdownPathsSet, searchIndex, _setSearchIndex } from './slugManager.js'
import { debugLog, debugWarn } from './utils/debug.js'
import { debounce, rafThrottle, scheduleDOMWrite } from './utils/events.js'

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
 * Normalize resolved search index entries so slugs are homogeneous
 * across the app (nav, TOC, search).
 * @param {Array} entries - Array of index entry objects to normalize.
 * @returns {Array} The same array of entries (normalized in-place).
 */
function normalizeSearchIndexEntriesMut(entries) {
  try {
    if (!Array.isArray(entries)) return entries
    entries.forEach(it => {
      try {
        if (!it || typeof it !== 'object') return
        let raw = (typeof it.slug === 'string') ? String(it.slug) : ''
        // preserve anchor part (page::anchor)
        let anchor = null
        if (raw && raw.indexOf('::') !== -1) {
          const parts = raw.split('::')
          raw = parts[0] || ''
          anchor = parts.slice(1).join('::') || null
        }

        // If raw looks like a path/file (contains dot or slash) try to
        // resolve a canonical slug via path -> slug maps. Prefer explicit
        // entry.path when present.
        const looksFiley = !!(raw && (raw.indexOf('.') !== -1 || raw.indexOf('/') !== -1))
        let canonical = ''
        try {
          if (it.path && typeof it.path === 'string') {
            const pn = normalizePath(String(it.path ?? ''))
            // prefer any existing mapping for this path
            canonical = findSlugForPath(pn) || (mdToSlug && mdToSlug.has(pn) ? mdToSlug.get(pn) : '') || ''
            if (!canonical) {
              // If the index entry included a title (H1), prefer that
              if (it.title && String(it.title).trim()) {
                canonical = slugify(String(it.title).trim())
              } else {
                // No H1/title: allow basename-derived slug as fallback
                const base = pn.replace(/^.*\//, '').replace(/\.(?:md|html?)$/i, '')
                canonical = slugify(base || pn)
              }
            }
          } else if (looksFiley) {
            // no explicit path: strip extension and try to resolve by
            // basename or fall back to title if available
            const baseOnly = String(raw).replace(/\.(?:md|html?)$/i, '')
            const found = findSlugForPath(baseOnly) || (mdToSlug && mdToSlug.has(baseOnly) ? mdToSlug.get(baseOnly) : '') || ''
            if (found) canonical = found
            else if (it.title && String(it.title).trim()) canonical = slugify(String(it.title).trim())
            else canonical = slugify(baseOnly)
          } else {
            // Not file-like; if no slug but title exists, slugify title
            if (!raw && it.title && String(it.title).trim()) canonical = slugify(String(it.title).trim())
            else canonical = raw || ''
          }
        } catch (e) {
          try { canonical = (it.title && String(it.title).trim()) ? slugify(String(it.title).trim()) : (raw ? slugify(raw) : '') } catch (_) { canonical = raw }
        }

        // Reattach anchor if present
        let finalSlug = canonical || ''
        if (anchor) finalSlug = finalSlug ? `${finalSlug}::${anchor}` : (`${slugify(anchor)}`)
        if (finalSlug) it.slug = finalSlug

        // Persist mapping so other consumers (nav / toc) will use same slug
        try {
          if (it.path && finalSlug) {
            const pageOnly = String(finalSlug).split('::')[0]
            try { storeSlugMapping(pageOnly, normalizePath(String(it.path ?? ''))) } catch (_) {}
          }
        } catch (_) {}
      } catch (_) {}
    })
  } catch (_) {}
  return entries
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
 * Build the site navigation DOM and wire SPA navigation handlers.
 * @param {HTMLElement} navbarWrap - Element where the navbar header should be inserted.
 * @param {HTMLElement} container - Main content container for click interception.
 * @param {string} navHtml - HTML representation of the navigation.
 * @param {string} contentBase - Base URL used when resolving slugs.
 * @param {string} homePage - Default home page slug used for the brand link.
 * @param {(key: string) => string} t - Translation helper from l10nManager.
 * @param {() => (void|Promise<void>)} renderByQuery - Callback invoked when navigating to render a page; may return a Promise.
 * @param {boolean} effectiveSearchEnabled - Whether search UI should be rendered.
 * @param {'eager'|'lazy'} [searchIndexMode='eager'] - Search index mode forwarded from initCMS.
 * @param {number} [indexDepth=1] - Index depth (1|2|3).
 * @param {string[]|undefined} [noIndexing] - Optional list of paths to exclude from indexing.
 * @param {string} [logoOption='favicon'] - Navbar logo option.
 * @returns {Promise<NavBuildResult>}
 */
export async function buildNav(navbarWrap, container, navHtml, contentBase, homePage, t, renderByQuery, effectiveSearchEnabled, searchIndexMode = 'eager', indexDepth = 1, noIndexing = undefined, logoOption = 'favicon') {
  if (!navbarWrap || !(navbarWrap instanceof HTMLElement)) {
    throw new TypeError('navbarWrap must be an HTMLElement')
  }

  const parser = getSharedParser()
  const navDoc = parser ? parser.parseFromString(navHtml || '', 'text/html') : null
  const linkEls = navDoc ? navDoc.querySelectorAll('a') : []


  await safe(() => preScanHtmlSlugs(linkEls, contentBase))
  await safe(() => preMapMdSlugs(linkEls, contentBase))
  try { seedNavSlugMappings(linkEls, contentBase) } catch (_) {}

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
  // Map of normalized navigation href -> slug (helps resolve search results)
  const navHrefToSlug = new Map()

  /**
   * Close the mobile hamburger menu and update ARIA attributes.
   * @returns {void}
   */
  function closeMobileMenu() {
    try {
      const burgerEl = (typeof navbar !== 'undefined' && navbar && navbar.querySelector) ? navbar.querySelector('.navbar-burger') : ((navbarWrap && navbarWrap.querySelector) ? navbarWrap.querySelector('.navbar-burger') : (typeof document !== 'undefined' ? document.querySelector('.navbar-burger') : null))
      const targetId = burgerEl && burgerEl.dataset ? burgerEl.dataset.target : null
      const target = targetId ? ((typeof navbar !== 'undefined' && navbar && navbar.querySelector) ? (navbar.querySelector(`#${targetId}`) || document.getElementById(targetId)) : ((navbarWrap && navbarWrap.querySelector) ? navbarWrap.querySelector(`#${targetId}`) : (typeof document !== 'undefined' ? document.getElementById(targetId) : null))) : null
      if (burgerEl && burgerEl.classList && burgerEl.classList.contains('is-active')) {
        try { burgerEl.classList.remove('is-active') } catch (e) {}
        try { burgerEl.setAttribute('aria-expanded', 'false') } catch (e) {}
        if (target && target.classList) {
          try { target.classList.remove('is-active') } catch (e) {}
        }
      }
    } catch (err) { debugWarn('[nimbi-cms] closeMobileMenu failed', err) }
  }

    /**
    * Run the provided `renderByQuery` with a small visual transition.
    * Adds `.is-inactive` to the main content then calls the renderer; when
    * the renderer completes (or throws) the class is removed on the next
    * animation frame so layout has a chance to settle.
    * @returns {Promise<void>}
    */
    async function runRenderWithTransition() {
    const contentEl = (container && container instanceof HTMLElement) ? container : ((typeof document !== 'undefined') ? document.querySelector('.nimbi-content') : null)
    try { if (contentEl) contentEl.classList.add('is-inactive') } catch (e) {}
    try {
      const r = renderByQuery && renderByQuery()
      if (r && typeof r.then === 'function') await r
    } catch (e) {
      try { debugWarn('[nimbi-cms] renderByQuery failed', e) } catch (_) {}
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

  /**
   * Resolve an index entry's slug/path into a canonical page slug and optional fragment.
   * This guards against builders that may emit a file path into `entry.slug`.
   * @param {{slug?:string,path?:string}} entry
   * @returns {{page:string,hash:string|null}}
   */
  function resolveEntryTarget(entry) {
    try {
      let s = (entry && typeof entry.slug === 'string') ? String(entry.slug) : ''
      let hash = null
      // Extract heading fragment early from the slug token so that
      // when we prefer `entry.path` for slug resolution we still
      // preserve and return the anchor fragment.
      try {
        if (s && s.indexOf('::') !== -1) {
          const partsHash = s.split('::')
          hash = partsHash.slice(1).join('::') || null
        }
      } catch (_) {}

      // If an explicit path is provided prefer resolving that to a
      // canonical slug first (this handles cases where index entries
      // contain file-like slugs such as `brochure.md::anchor`).
      try {
        if (entry && entry.path && typeof entry.path === 'string') {
          const pathNorm = normalizePath(String(entry.path ?? ''))
          const base = pathNorm.replace(/^.*\//, '')
          try {
            if (navHrefToSlug && navHrefToSlug.has(pathNorm)) return { page: navHrefToSlug.get(pathNorm), hash }
            if (navHrefToSlug && navHrefToSlug.has(base)) return { page: navHrefToSlug.get(base), hash }
          } catch (_) {}
          try {
            if (mdToSlug && mdToSlug.has(pathNorm)) return { page: mdToSlug.get(pathNorm), hash }
          } catch (_) {}
          try {
            const found = findSlugForPath(pathNorm)
            if (found) return { page: found, hash }
          } catch (_) {}
          // fallthrough: we'll still try the slug/token from entry below
        }
      } catch (_) {}

      // split heading anchors encoded as `page::anchor`
      if (s && s.indexOf('::') !== -1) {
        const parts = s.split('::')
        s = parts[0] || ''
        hash = parts.slice(1).join('::') || null
      }

      // If slug looks like a path (contains dot or slash), try to resolve
      // a real slug via known mappings (prefer entry.path when present),
      // otherwise normalize by stripping extensions and slugifying.
      if (s && (s.includes('.') || s.includes('/'))) {
        const candidatePath = normalizePath((entry && entry.path) ? String(entry.path) : s)
        const candBase = candidatePath.replace(/^.*\//, '')
        try {
          if (navHrefToSlug && navHrefToSlug.has(candidatePath)) return { page: navHrefToSlug.get(candidatePath), hash }
          if (navHrefToSlug && navHrefToSlug.has(candBase)) return { page: navHrefToSlug.get(candBase), hash }
        } catch (_) {}
        try {
          let found = findSlugForPath(candidatePath)
          if (!found) {
            // permissive scan of slugToMd values
            try {
              const normCand = String(candidatePath ?? '').replace(/^\/+/, '')
              const candBase2 = normCand.replace(/^.*\//, '')
              for (const [k, v] of slugToMd.entries()) {
                try {
                  let val = null
                  if (typeof v === 'string') val = normalizePath(String(v ?? ''))
                  else if (v && typeof v === 'object') {
                    if (v.default) val = normalizePath(String(v.default ?? ''))
                    else val = null
                  }
                  if (!val) continue
                  if (val === normCand || val.endsWith('/' + normCand) || normCand.endsWith('/' + val) || val.endsWith(candBase2) || normCand.endsWith(candBase2)) {
                    found = k
                    break
                  }
                } catch (_) {}
              }
            } catch (_) {}
          }
          if (found) s = found
          else {
            // Strip file extension and slugify the basename as a safe fallback
            try {
              const baseOnly = String(s).replace(/\.(?:md|html?)$/i, '')
              s = slugify(baseOnly || candidatePath)
            } catch (e) {
              s = slugify(candidatePath)
            }
          }
        } catch (e) {
          s = slugify(candidatePath)
        }
      }

      if (!s && entry && entry.path) {
        s = slugify(normalizePath(String(entry.path ?? '')))
      }
      return { page: s, hash }
    } catch (err) {
      return { page: (entry && entry.slug) || '', hash: null }
    }
  }

  const ensureSearchIndex = () => {
    if (searchIndexPromise) return searchIndexPromise
    searchIndexPromise = (async () => {
      try {
        const slugSearchRuntime = await import('./slugSearchRuntime.js')
        const globalBuild = (typeof globalThis !== 'undefined' ? globalThis.buildSearchIndex : undefined)
        const globalWorker = (typeof globalThis !== 'undefined' ? globalThis.buildSearchIndexWorker : undefined)
        const moduleBuild = safeGet(slugSearchRuntime, 'buildSearchIndex')
        const moduleWorker = safeGet(slugSearchRuntime, 'buildSearchIndexWorker')
        const buildFn = (typeof globalBuild === 'function') ? globalBuild : (moduleBuild || undefined)
        const workerFn = (typeof globalWorker === 'function') ? globalWorker : (moduleWorker || undefined)
        debugLog('[nimbi-cms test] ensureSearchIndex: buildFn=' + (typeof buildFn) + ' workerFn=' + (typeof workerFn) + ' (global preferred)')
        const seeds = []
        try { if (homePage) seeds.push(homePage) } catch (_) {}
        try { if (navigationPage) seeds.push(navigationPage) } catch (_) {}
        if (searchIndexMode === 'lazy' && typeof workerFn === 'function') {
          try {
            const r = await workerFn(contentBase, indexDepth, noIndexing, seeds.length ? seeds : undefined)
            if (r && r.length) {
              try {
                try { _setSearchIndex(r) } catch (e) {}
              } catch (e) {}
              return r
            }
          } catch (e) { debugWarn('[nimbi-cms] worker builder threw', e) }
        }
        if (typeof buildFn === 'function') {
          debugLog('[nimbi-cms test] calling buildFn')
          return await buildFn(contentBase, indexDepth, noIndexing, seeds.length ? seeds : undefined)
        }
        return []
      } catch (err) {
        debugWarn('[nimbi-cms] buildSearchIndex failed', err)
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
        // capture resolved index for sitemap
        try { resolvedIndexForSitemap = Array.isArray(idx) ? idx : null } catch (_) { resolvedIndexForSitemap = null }
        // Normalize slugs so external builders cannot inject file/path slugs
        try { normalizeSearchIndexEntriesMut(idx) } catch (_) {}
        try {
          if (typeof window !== 'undefined') {
            try {
              ;(async () => {
                try {
                  try {
                    // Update slugManager's live searchIndex if available
                    try { _setSearchIndex(Array.isArray(idx) ? idx : []) } catch (_) {}
                    Object.defineProperty(window, '__nimbiResolvedIndex', {
                      get() { return Array.isArray(searchIndex) ? searchIndex : (Array.isArray(resolvedIndexForSitemap) ? resolvedIndexForSitemap : []) },
                      enumerable: true,
                      configurable: true
                    })
                    } catch (e2) {
                    try { window.__nimbiResolvedIndex = Array.isArray(searchIndex) ? searchIndex : (Array.isArray(resolvedIndexForSitemap) ? resolvedIndexForSitemap : []) } catch (e3) {}
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
        const qnow = String((searchInput && searchInput.value) ?? '').trim().toLowerCase()
        // resolved index available; qnow captured above
        if (!qnow) return
        if (!Array.isArray(idx) || !idx.length) return
        const filteredNow = idx.filter(e => (e.title && e.title.toLowerCase().includes(qnow)) || (e.excerpt && e.excerpt.toLowerCase().includes(qnow)))
        // filteredNow computed above
        if (!filteredNow || !filteredNow.length) return
        const resultsEl = (typeof dropdownContent !== 'undefined' && dropdownContent) ? dropdownContent : (typeof document !== 'undefined' ? document.getElementById('nimbi-search-results') : null)
        if (!resultsEl) return
        try {
          if (typeof resultsEl.replaceChildren === 'function') resultsEl.replaceChildren()
          else resultsEl.innerHTML = ''
        } catch (e) {
          try { resultsEl.innerHTML = '' } catch (_) {}
        }
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
              const _t = resolveEntryTarget(it)
              a.href = buildPageUrl(_t.page, _t.hash)
              a.setAttribute('role', 'button')
              try {
                if (it.path && typeof it.path === 'string') {
                  try { storeSlugMapping(_t.page, it.path) } catch (ee) {}
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
          scheduleDOMWrite(() => { try { resultsEl.appendChild(panel) } catch (e) {} })
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
              debugWarn('[nimbi-cms] sitemap trigger failed', err)
            }
        } catch (err) {
          try { debugWarn('[nimbi-cms] sitemap dynamic import failed', err) } catch (_) {}
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
          const p = getSharedParser()
          const d = p ? p.parseFromString(res.raw, 'text/html') : null
          const img = d ? d.querySelector('img') : null
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

  /**
   * Try to find an existing slug for a given markdown/html path.
   * @param {string} p - Markdown or HTML path to resolve (e.g. 'foo.md').
   * @returns {string|null} Slug string when found, otherwise `null`.
   */
  function findSlugForPath(p) {
    try {
      if (!p) return null
      const norm = normalizePath(String(p ?? ''))
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

  /**
   * Seed slug mappings from navigation links early so the rest of the
   * UI (search, TOC, nav) uses consistent, canonical slugs. This does a
   * best-effort synchronous pass using existing maps and nav labels, then
   * performs an asynchronous upgrade pass that fetches page content to
   * extract an H1/title-derived slug when available.
   *
   * This function is intentionally non-blocking for the async upgrade
   * phase: callers may invoke it without awaiting so initial rendering
   * is not delayed.
   *
   * @param {NodeListOf<Element>} linkEls
   * @param {string} contentBase
   */
  async function seedNavSlugMappings(linkEls, contentBase) {
    try {
      if (!linkEls || !linkEls.length) return
      const toUpgrade = []
      for (let i = 0; i < linkEls.length; i++) {
        try {
          const a = linkEls[i]
          if (!a || typeof a.getAttribute !== 'function') continue
          const rawHref = a.getAttribute('href') || ''
          if (!rawHref) continue
          // skip external links
          if (isExternalLink(rawHref)) continue
          let mappingTarget = null
          try {
            const parsed = parseHrefToRoute(rawHref)
            if (parsed && parsed.page) mappingTarget = parsed.page
          } catch (_) {}
          if (!mappingTarget) {
            // Accept .md/.html paths or relative paths
            const parts = String(rawHref ?? '').split(/[?#]/, 1)
            const left = (parts && parts[0]) ? parts[0] : rawHref
            if (/\.(?:md|html?)$/i.test(left) || left.indexOf('/') !== -1) {
              mappingTarget = normalizePath(String(left ?? ''))
            }
          }
          if (!mappingTarget) continue

          // If the nav link includes the site subpath (contentBase pathname)
          // (for example authors added "nimbiCMS/assets/..."), strip that
          // leading segment so later resolution uses the configured
          // `contentBase` and we avoid duplicated pageDir in fetch URLs.
          try {
            if (contentBase && typeof contentBase === 'string') {
              try {
                const cbUrl = new URL(contentBase, (typeof location !== 'undefined' ? location.origin : 'http://localhost'))
                let cbPath = cbUrl.pathname || ''
                cbPath = cbPath.replace(/^\/+|\/+$/g, '')
                if (cbPath) {
                  let mt = String(mappingTarget ?? '')
                  mt = mt.replace(/^\/+/, '')
                  if (mt === cbPath) {
                    mappingTarget = ''
                  } else if (mt.startsWith(cbPath + '/')) {
                    mappingTarget = mt.slice(cbPath.length + 1)
                  } else {
                    mappingTarget = mt
                  }
                }
              } catch (_) {}
            }
          } catch (_) {}

          const norm = normalizePath(String(mappingTarget ?? ''))
          const base = norm.replace(/^.*\//, '')
          // if there's already a mapping, skip
          let existing = null
          try { if (navHrefToSlug && navHrefToSlug.has(norm)) existing = navHrefToSlug.get(norm) } catch (_) {}
          try { if (!existing && mdToSlug && mdToSlug.has(norm)) existing = mdToSlug.get(norm) } catch (_) {}
          if (existing) continue

          // Create a conservative candidate from nav label if present
          let displayName = null
          try { displayName = (a.textContent && String(a.textContent).trim()) ? String(a.textContent).trim() : null } catch (_) { displayName = null }
          let candidate = null
          if (displayName) candidate = slugify(displayName)
          else {
            const baseOnly = base.replace(/\.(?:md|html?)$/i, '')
            candidate = slugify(baseOnly || norm)
          }

          if (candidate) {
            // Do not persist global slug mappings here — only schedule an
            // async upgrade that will fetch the page and persist the
            // H1/title-derived slug when available. Persisting global
            // mappings from the nav label synchronously causes per-item
            // HTML handling to pick up the tentative slug and skip
            // fetching the page content, which prevents title-derived
            // slugs from being preferred.
            try { toUpgrade.push({ path: norm, candidate }) } catch (_) {}
          }
        } catch (_) {}
      }

      // Async upgrade: fetch pages and prefer H1/title-derived slugs
      if (!toUpgrade.length) return
      const concurrency = 3
      let idx = 0
      const runWorker = async () => {
        while (idx < toUpgrade.length) {
          const cur = toUpgrade[idx++]
          if (!cur || !cur.path) continue
          try {
            const md = await fetchMarkdown(cur.path, contentBase)
            if (!md || !md.raw) continue
            let h1 = null
            if (md.isHtml) {
              try {
                const parser2 = getSharedParser()
                const doc = parser2 ? parser2.parseFromString(md.raw, 'text/html') : null
                const h1el = doc ? (doc.querySelector('h1') || doc.querySelector('title')) : null
                if (h1el && h1el.textContent) h1 = String(h1el.textContent).trim()
              } catch (_) {}
            } else {
              try {
                const m = md.raw.match(/^#\s+(.+)$/m)
                if (m && m[1]) h1 = String(m[1]).trim()
              } catch (_) {}
            }
            if (h1) {
              const h1Slug = slugify(h1)
              if (h1Slug && h1Slug !== cur.candidate) {
                try { storeSlugMapping(h1Slug, cur.path) } catch (_) {}
                try { navHrefToSlug.set(cur.path, h1Slug) } catch (_) {}
                try { navHrefToSlug.set(cur.path.replace(/^.*\//, ''), h1Slug) } catch (_) {}
                // Update live searchIndex entries if present
                try {
                  try {
                    if (Array.isArray(searchIndex)) {
                      let changed = false
                      for (const e of searchIndex) {
                        try {
                          if (e && e.path === cur.path && e.slug) {
                            const parts = String(e.slug).split('::')
                            const rest = parts.slice(1).join('::')
                            e.slug = rest ? `${h1Slug}::${rest}` : h1Slug
                            changed = true
                          }
                        } catch (_) {}
                      }
                      try { if (changed) _setSearchIndex(searchIndex) } catch (_) {}
                    }
                  } catch (_) {}
                } catch (_) {}
              }
            } else {
              // No H1: nothing to do (we already used basename/nav label)
            }
          } catch (_) { /* ignore per-page failures */ }
        }
      }
      const workers = []
      for (let i = 0; i < concurrency; i++) workers.push(runWorker())
      try { await Promise.all(workers) } catch (_) {}
    } catch (_) {}
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
        const target = targetId ? ((navbar && navbar.querySelector) ? (navbar.querySelector(`#${targetId}`) || (navbarWrap && navbarWrap.querySelector ? navbarWrap.querySelector(`#${targetId}`) : document.getElementById(targetId))) : ((navbarWrap && navbarWrap.querySelector) ? (navbarWrap.querySelector(`#${targetId}`) || document.getElementById(targetId)) : (typeof document !== 'undefined' ? document.getElementById(targetId) : null))) : null
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
      } catch (err) { debugWarn('[nimbi-cms] navbar burger toggle failed', err) }
    })
  } catch (err) { debugWarn('[nimbi-cms] burger event binding failed', err) }

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
      try {
        if (typeof dropdownContent.replaceChildren === 'function') dropdownContent.replaceChildren()
        else {
          while (dropdownContent.firstChild) dropdownContent.removeChild(dropdownContent.firstChild)
        }
      } catch (e) {
        try { dropdownContent.innerHTML = '' } catch (_) {}
      }

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
        const qnow = String((searchInput && searchInput.value) ?? '').trim()
        if (!items || !items.length) {
          if (!qnow) {
            try { if (dropdown) dropdown.classList.remove('is-active') } catch (e) {}
            try { document.documentElement.classList.remove('nimbi-search-open') } catch (e) {}
            try { if (dropdownContent) { dropdownContent.style.display = 'none'; dropdownContent.classList.remove('is-open'); dropdownContent.removeAttribute('tabindex') } } catch (e) {}
            try { if (dropdownContent) dropdownContent.removeEventListener('keydown', resultsKeydown) } catch (e) {}
            return
          }
          // non-empty query but no items -> show localized 'No results' message
          try {
            const panel = document.createElement('div')
            panel.className = 'panel nimbi-search-panel'
            const p = document.createElement('p')
            p.className = 'panel-block nimbi-search-no-results'
            p.textContent = (t && typeof t === 'function') ? t('searchNoResults') : 'No results'
            panel.appendChild(p)
            scheduleDOMWrite(() => { try { dropdownContent.appendChild(panel) } catch (e) {} })
          } catch (e) {}
          if (dropdown) {
            dropdown.classList.add('is-active')
            try { document.documentElement.classList.add('nimbi-search-open') } catch (e) {}
          }
          try { dropdownContent.style.display = 'block' } catch (e) {}
          try { dropdownContent.classList.add('is-open') } catch (e) {}
          try { dropdownContent.setAttribute('tabindex', '0') } catch (e) {}
          return
        }
      } catch (e) {}

        try {
          // Build the panel children in a fragment and append once to minimize reflows.
          const panel = document.createElement('div')
          panel.className = 'panel nimbi-search-panel'
          const frag = document.createDocumentFragment()
          items.forEach(it => {
            if (it.parentTitle) {
              const heading = document.createElement('p')
              heading.textContent = it.parentTitle
              heading.className = 'panel-heading nimbi-search-title nimbi-search-parent'
              frag.appendChild(heading)
            }
              const a = document.createElement('a')
              a.className = 'panel-block nimbi-search-result'
              const _t = resolveEntryTarget(it)
              a.href = buildPageUrl(_t.page, _t.hash)
            a.setAttribute('role', 'button')
              try {
                if (it.path && typeof it.path === 'string') {
                  try { storeSlugMapping(_t.page, it.path) } catch (ee) {}
                }
              } catch (e) {}
            const title = document.createElement('div')
            title.className = 'is-size-6 has-text-weight-semibold'
            title.textContent = it.title
            a.appendChild(title)
            a.addEventListener('click', (ev) => {
              try {
                try { ev && ev.preventDefault && ev.preventDefault() } catch (e) {}
                try { ev && ev.stopPropagation && ev.stopPropagation() } catch (e) {}
                // Hide the dropdown/UI immediately
                if (dropdown) {
                  dropdown.classList.remove('is-active')
                  try { document.documentElement.classList.remove('nimbi-search-open') } catch (e) {}
                }
                try { dropdownContent.style.display = 'none' } catch (e) {}
                try { dropdownContent.classList.remove('is-open') } catch (e) {}
                try { dropdownContent.removeAttribute('tabindex') } catch (e) {}
                try { dropdownContent.removeEventListener('keydown', resultsKeydown) } catch (e) {}
                try { if (searchInput) searchInput.removeEventListener('keydown', inputKeyHandler) } catch (e) {}

                // Perform SPA navigation via history + render helper rather than
                // letting the browser do a full navigation; this avoids duplicate
                // render paths (default navigation + SPA handler). Use
                // runRenderWithTransition (defined in this scope) to trigger a
                // single controlled render.
                try {
                  const hrefVal = a.getAttribute && a.getAttribute('href') || ''
                  let pageParam = null
                  let hash = null
                  try {
                    const u = new URL(hrefVal, location.href)
                    pageParam = u.searchParams.get('page')
                    hash = u.hash ? u.hash.replace(/^#/, '') : null
                  } catch (e) { /* ignore URL parse errors, fall back to navigation */ }

                  if (pageParam) {
                    try {
                      history.pushState({ page: pageParam }, '', buildPageUrl(pageParam, hash))
                      try { runRenderWithTransition() } catch (e) { /* best-effort: if helper missing, fallback to window render */
                        try { if (typeof window !== 'undefined' && typeof window.renderByQuery === 'function') window.renderByQuery() } catch (e2) {}
                      }
                      return
                    } catch (e) { /* if pushState fails, fall through to location change */ }
                  }
                } catch (e) { /* ignore navigation helper failures */ }

                // Fallback: let the browser navigate
                try { window.location.href = a.href } catch (e) {}
              } catch (e) { /* swallow per-item click errors */ }
            })
            frag.appendChild(a)
          })
          panel.appendChild(frag)
          scheduleDOMWrite(() => { try { dropdownContent.appendChild(panel) } catch (e) {} })
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

    

    if (searchInput) {
      const handleInput = debounce(async () => {
        const domInput = searchInput || ((typeof navbar !== 'undefined' && navbar && navbar.querySelector) ? navbar.querySelector('input#nimbi-search') : ((navbarWrap && navbarWrap.querySelector) ? navbarWrap.querySelector('input#nimbi-search') : (typeof document !== 'undefined' ? document.querySelector('input#nimbi-search') : null)))
          const q = String((domInput && domInput.value) ?? '').trim().toLowerCase()
        // read current input value and proceed
        if (!q) {
          try { if (dropdown) dropdown.classList.remove('is-active') } catch (e) {}
          try { document.documentElement.classList.remove('nimbi-search-open') } catch (e) {}
          try { if (dropdownContent) { dropdownContent.style.display = 'none'; dropdownContent.classList.remove('is-open'); dropdownContent.removeAttribute('tabindex') } } catch (e) {}
          return
        }
        try {
          await ensureSearchIndex()

          const idx = await searchIndexPromise
          const filtered = Array.isArray(idx) ? idx.filter(e => (e.title && e.title.toLowerCase().includes(q)) || (e.excerpt && e.excerpt.toLowerCase().includes(q))) : []
          showResults(filtered.slice(0, 10))
        } catch (err) { debugWarn('[nimbi-cms] search input handler failed', err); showResults([]) }
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
        debugWarn('[nimbi-cms] eager search index init failed', err)
        searchIndexPromise = Promise.resolve([])
      }
        searchIndexPromise.finally(() => {
            const domInput = searchInput || ((typeof navbar !== 'undefined' && navbar && navbar.querySelector) ? navbar.querySelector('input#nimbi-search') : ((navbarWrap && navbarWrap.querySelector) ? navbarWrap.querySelector('input#nimbi-search') : (typeof document !== 'undefined' ? document.querySelector('input#nimbi-search') : null)))
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
                debugWarn('[nimbi-cms] sitemap trigger failed', err)
              }
            } catch (err) {
              try { debugWarn('[nimbi-cms] sitemap dynamic import failed', err) } catch (_) {}
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

  
  // Batch-create navbar items into a fragment and append once to start
  const startFrag = document.createDocumentFragment()
  for (let i = 0; i < linkEls.length; i++) {
    const a = linkEls[i]
    if (i === 0) continue
    const rawHref = a.getAttribute('href') || '#'
    let href = rawHref
    const item = document.createElement('a')
    item.className = 'navbar-item'
    try {
      // Try to parse canonical or cosmetic route forms first so we don't
      // accidentally double-encode query params like `?page=?page=...`.
      let parsedRoute = null
      try { parsedRoute = parseHrefToRoute(String(rawHref ?? '')) } catch (_) { parsedRoute = null }
      let routePage = null
      let routeAnchor = null
      if (parsedRoute) {
        if (parsedRoute.type === 'canonical' && parsedRoute.page) {
          routePage = parsedRoute.page
          routeAnchor = parsedRoute.anchor
        } else if (parsedRoute.type === 'cosmetic' && parsedRoute.page) {
          routePage = parsedRoute.page
          routeAnchor = parsedRoute.anchor
        }
      }

      // If the route explicitly contains a page token, prioritize that
      // value when determining whether this is a markdown/html link or a
      // slug/cosmetic route.
      if (routePage) {
        // File-like target (.md/.html or contains directories)
        if (/\.(?:md|html?)$/i.test(routePage) || routePage.includes('/')) {
          href = routePage
        } else {
          // It's a slug (cosmetic or canonical with a slug) — build a
          // canonical page URL and skip file-based handling below.
          item.href = buildPageUrl(routePage, routeAnchor)
        }
      }

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
                const parser2 = getSharedParser()
                const doc = parser2 ? parser2.parseFromString(res.raw, 'text/html') : null
                const titleTag = doc ? doc.querySelector('title') : null
                const h1 = doc ? doc.querySelector('h1') : null
                const titleText = (titleTag && titleTag.textContent && titleTag.textContent.trim()) ? titleTag.textContent.trim() : (h1 && h1.textContent ? h1.textContent.trim() : null)
                if (titleText) {
                  const slugKey = slugify(titleText)
                    if (slugKey) {
                    try { storeSlugMapping(slugKey, htmlPath) } catch (ee) { debugWarn('[nimbi-cms] slugToMd/mdToSlug set failed', ee) }
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
    } catch (e) { debugWarn('[nimbi-cms] nav item href parse failed', e); item.href = href }
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
                  mappingTarget = normalizePath(String(hrefVal ?? '').split(/[?#]/)[0])
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
                    // Only persist mapping for HTML pages or when the target
                    // is present in the allMarkdownPathsSet. Do not create
                    // slug mappings for plain `.md` links (tests expect
                    // these to remain as `?page=foo.md`).
                    if (/\.(?:html?)(?:$|[?#])/i.test(String(mappingTarget ?? ''))) {
                      persistMapping = true
                    } else if (/\.(?:md)(?:$|[?#])/i.test(String(mappingTarget ?? ''))) {
                      persistMapping = false
                    } else {
                      const norm = String(mappingTarget ?? '').replace(/^\.\//, '')
                      const baseName = norm.replace(/^.*\//, '')
                      if (allMarkdownPathsSet && allMarkdownPathsSet.size) {
                        if (allMarkdownPathsSet.has(norm) || allMarkdownPathsSet.has(baseName)) persistMapping = true
                      }
                    }
                  } catch (err) { persistMapping = false }
                    if (persistMapping) {
                      try {
                        const norm = normalizePath(String(mappingTarget ?? '').split(/[?#]/)[0])
                        // Detect whether a mapping already exists for this target
                        let alreadyMapped = false
                        try { if (findSlugForPath && typeof findSlugForPath === 'function' && findSlugForPath(norm)) alreadyMapped = true } catch (_) {}

                        // Always persist the mapping to global maps, but only
                        // override the `item.href` when a mapping already existed
                        // (e.g. created by a prior fetch or explicit mapping). This
                        // avoids claiming a slug for HTML pages when fetchMarkdown
                        // failed — tests expect the original href to remain.
                        try { storeSlugMapping(slugKey, mappingTarget) } catch (ee) {}
                        try {
                          if (norm) {
                            try { navHrefToSlug.set(norm, slugKey) } catch (_) {}
                            try { const b = norm.replace(/^.*\//, ''); if (b) navHrefToSlug.set(b, slugKey) } catch (_) {}
                          }
                        } catch (_) {}

                        if (alreadyMapped) {
                          try { item.href = buildPageUrl(slugKey) } catch (_) {}
                        }
                      } catch (_) {}
                    }
                }
              }
        } catch (ee) { debugWarn('[nimbi-cms] nav slug mapping failed', ee) }
      }
    } catch (ee) { debugWarn('[nimbi-cms] nav slug mapping failed', ee) }

    item.textContent = a.textContent || href
    startFrag.appendChild(item)
  }

  try { start.appendChild(startFrag) } catch (e) { /* fallback: if append fails, leave per-item appended above */ }

  
  

  menu.appendChild(start)
  if (end) menu.appendChild(end)
  navbar.appendChild(brand)
  navbar.appendChild(menu)
  navbarWrap.appendChild(navbar)
  
  try {
    const outsideHandler = (ev) => {
      try {
        const burgerEl = (typeof navbar !== 'undefined' && navbar && navbar.querySelector) ? navbar.querySelector('.navbar-burger') : ((navbarWrap && navbarWrap.querySelector) ? navbarWrap.querySelector('.navbar-burger') : (typeof document !== 'undefined' ? document.querySelector('.navbar-burger') : null))
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
      } catch (e) { debugWarn('[nimbi-cms] navbar click handler failed', e) }
        try {
          const burgerEl = (typeof navbar !== 'undefined' && navbar && navbar.querySelector) ? navbar.querySelector('.navbar-burger') : ((navbarWrap && navbarWrap.querySelector) ? navbarWrap.querySelector('.navbar-burger') : null)
          const targetId = burgerEl && burgerEl.dataset ? burgerEl.dataset.target : null
          const target = targetId ? ((navbar && navbar.querySelector) ? (navbar.querySelector(`#${targetId}`) || (navbarWrap && navbarWrap.querySelector ? navbarWrap.querySelector(`#${targetId}`) : document.getElementById(targetId))) : ((navbarWrap && navbarWrap.querySelector) ? (navbarWrap.querySelector(`#${targetId}`) || document.getElementById(targetId)) : (typeof document !== 'undefined' ? document.getElementById(targetId) : null))) : null
          if (burgerEl && burgerEl.classList.contains('is-active')) {
            burgerEl.classList.remove('is-active')
            burgerEl.setAttribute('aria-expanded', 'false')
            if (target) target.classList.remove('is-active')
          }
        } catch (err) { debugWarn('[nimbi-cms] mobile menu close failed', err) }
    })
  } catch (e) { debugWarn('[nimbi-cms] attach content click handler failed', e) }

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
        debugWarn('[nimbi-cms] container click URL parse failed', e)
      }
    })
  } catch (e) { debugWarn('[nimbi-cms] build navbar failed', e) }
  

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

// Export internals for unit testing
const normalizeSearchIndexEntries = normalizeSearchIndexEntriesMut

export { normalizeSearchIndexEntriesMut, normalizeSearchIndexEntries, safeGet, storeSlugMapping }
// `seedNavSlugMappings` is defined inside `buildNav` (not a module-level binding)
// and cannot be exported without refactoring. Tests use `buildNav` instead.
