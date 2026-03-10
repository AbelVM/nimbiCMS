import 'highlight.js/styles/monokai.css'
import readingTime from 'reading-time/lib/reading-time'
import { marked } from 'marked'
import { slugToMd, mdToSlug, slugify, fetchMarkdown } from './filesManager.js'
import { createNavTree, buildTocElement, preScanHtmlSlugs, prepareArticle, renderNotFound } from './htmlBuilder.js'
import { setMetaTags, setStructuredData, getSiteNameFromMeta, applyPageMeta } from './seoManager.js'
import { parseMarkdownToHtml, detectFenceLanguages } from './markdown.js'
import { fetchPageData } from './router.js'
import { hljs, SUPPORTED_HLJS_MAP, loadSupportedLanguages, registerLanguage, observeCodeBlocks, setHighlightTheme, BAD_LANGUAGES } from './codeblocksManager.js'
import { t, loadL10nFile, setLang } from './l10nManager.js'
import { ensureBulma, setStyle } from './bulmaManager.js'

// Pre-scan nav links for HTML files and map title/H1 -> slug to avoid nav-time fetches

let currentHighlightTheme = 'monokai'
let initialDocumentTitle = ''


export async function initCMS({ el, contentPath = '/content', /* languages (deprecated) */ defaultStyle = 'light', bulmaCustomize = 'none', lang = undefined, l10nFile = null } = {}) {
      if (!el) throw new Error('el is required')

      let mountEl = el
      if (typeof el === 'string') {
        mountEl = document.querySelector(el)
        if (!mountEl) throw new Error(`el selector "${el}" did not match any element`)
      } else if (!(el instanceof Element)) {
        throw new Error('el must be a CSS selector string or a DOM element')
      }

      try {
        mountEl.classList.add('nimbi-mount')
        mountEl.style.position = mountEl.style.position || 'relative'
        mountEl.style.overflow = mountEl.style.overflow || 'hidden'
      } catch (e) { }

      const container = document.createElement('div')
      container.className = 'nimbi-cms'
      try {
        container.style.position = container.style.position || 'relative'
        container.style.overflow = container.style.overflow || 'auto'
        try { if (!container.style.webkitOverflowScrolling) container.style.webkitOverflowScrolling = 'touch' } catch (e) { }
        container.style.width = container.style.width || '100%'
        container.style.height = container.style.height || '100%'
        container.style.boxSizing = container.style.boxSizing || 'border-box'
      } catch (e) { }

      const cols = document.createElement('div')
      cols.className = 'columns'

      const navCol = document.createElement('div')
      navCol.className = 'column is-full-mobile is-3-tablet nimbi-nav-wrap'
      cols.appendChild(navCol)

      const contentCol = document.createElement('div')
      contentCol.className = 'column nimbi-content'
      cols.appendChild(contentCol)

      container.appendChild(cols)

    const navWrap = navCol
  const contentWrap = contentCol

  mountEl.appendChild(container)

  let mountOverlay = null
  try {
    mountOverlay = mountEl.querySelector('.nimbi-overlay')
    if (!mountOverlay) {
      mountOverlay = document.createElement('div')
      mountOverlay.className = 'nimbi-overlay'
      mountEl.appendChild(mountOverlay)
    }
  } catch (e) {
    mountOverlay = null
  }

  const pagePath = location.pathname || '/'
  const pageDir = pagePath.endsWith('/') ? pagePath : pagePath.substring(0, pagePath.lastIndexOf('/') + 1)
  try { initialDocumentTitle = document.title || '' } catch (e) { initialDocumentTitle = '' }
  let cp = contentPath
  if (cp.startsWith('./')) cp = cp.slice(2)
  if (!cp.endsWith('/')) cp = cp + '/'
  const contentBase = new URL(pageDir + cp, location.origin).toString()
  if (l10nFile) await loadL10nFile(l10nFile, pageDir)
  if (lang) setLang(lang)
  try {
    await fetchMarkdown('_home.md', contentBase)
  } catch (e) {
    throw new Error(`Required _home.md not found at ${contentBase}_home.md: ${e.message}`)
  }

  setStyle(defaultStyle)
  await ensureBulma(bulmaCustomize, pageDir)

  try {
    const navbarWrap = document.createElement('header')
    navbarWrap.className = 'nimbi-site-navbar'
    mountEl.insertBefore(navbarWrap, container)
    const navMd = await fetchMarkdown('_navigation.md', contentBase)
    const parsedNav = await parseMarkdownToHtml(navMd.raw || '')

    const parser = new DOMParser()
    const navDoc = parser.parseFromString(parsedNav.html || '', 'text/html')
    const linkEls = navDoc.querySelectorAll('a')
    try { await preScanHtmlSlugs(linkEls, contentBase) } catch (e) { }

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
        // Prefer canonical `?page=` form so SPA navigation resets page param correctly
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
            let md = m[1].replace(/^\.\//, '')
            if (md.startsWith('/')) md = md.replace(/^\//, '')
            brandItem.href = '?page=' + encodeURIComponent(md)
          } else {
            // fallback to raw href if it's an external link
            brandItem.href = rawHref
          }
        }
      } catch (e) {
        // non-URL hrefs (hash-only or strange formats) -> handle simple cases
        if (/^[#].*\.md$/.test(rawHref)) brandItem.href = '?page=' + encodeURIComponent(rawHref.replace(/^#/, ''))
        else if (/\.md$/.test(rawHref)) brandItem.href = '?page=' + encodeURIComponent(rawHref.replace(/^\.\//, ''))
        else brandItem.href = rawHref
      }
      brandItem.textContent = firstLink.textContent || t('home')
    } else {
      // ensure brand goes to the explicit home page slug
      brandItem.href = '?page=_home.md'
      brandItem.textContent = t('home')
    }
    brand.appendChild(brandItem)
    try {
      // intercept clicks on the brand (home) link to perform SPA navigation
      brandItem.addEventListener('click', (ev) => {
        try {
          const href = brandItem.getAttribute('href') || ''
          const url = new URL(href, location.href)
          const pageParam = url.searchParams.get('page')
          const hash = url.hash ? url.hash.replace(/^#/, '') : null
          if (pageParam) {
            ev.preventDefault()
            history.pushState({ page: pageParam }, '', '?page=' + encodeURIComponent(pageParam) + (hash ? '#' + encodeURIComponent(hash) : ''))
            try { renderByQuery() } catch (e) { }
          }
        } catch (e) { }
      })
    } catch (e) { }

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

    for (let i = 0; i < linkEls.length; i++) {
      const a = linkEls[i]
      if (i === 0) continue
      const href = a.getAttribute('href') || '#'
      const item = document.createElement('a')
      item.className = 'navbar-item'
      try {
        // Markdown links -> keep existing behavior
        if (/^[^#]*\.md(?:$|[#?])/.test(href) || href.endsWith('.md')) {
          const mdRaw = href.replace(/^\.\//, '')
          // support legacy '::' or hash anchors in nav links
          const parts = mdRaw.split(/::|#/, 2)
          const mdPath = parts[0]
          const frag = parts[1]
          item.href = '?page=' + encodeURIComponent(mdPath) + (frag ? '#' + encodeURIComponent(frag) : '')
        } else if (/\.html(?:$|[#?])/.test(href) || href.endsWith('.html')) {
          // HTML file - fetch title to produce friendly slug and map it
          const raw = href.replace(/^\.\//, '')
          const parts = raw.split(/::|#/, 2)
          const htmlPath = parts[0]
          const frag = parts[1]
          try {
            const res = await fetchMarkdown(htmlPath, contentBase)
            if (res && res.raw) {
              try {
                const parser = new DOMParser()
                const doc = parser.parseFromString(res.raw, 'text/html')
                const titleTag = doc.querySelector('title')
                const h1 = doc.querySelector('h1')
                const titleText = (titleTag && titleTag.textContent && titleTag.textContent.trim()) ? titleTag.textContent.trim() : (h1 && h1.textContent ? h1.textContent.trim() : null)
                if (titleText) {
                  const slugKey = slugify(titleText)
                  if (slugKey) {
                    try { slugToMd.set(slugKey, htmlPath); mdToSlug.set(htmlPath, slugKey) } catch (ee) { }
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
        // populate slug <-> md mappings from navbar link text so direct slugs resolve
        const displayName = (a.textContent && String(a.textContent).trim()) ? String(a.textContent).trim() : null
        if (displayName) {
          try {
            const slugKey = slugify(displayName)
            if (slugKey) {
              // if this nav link refers to a markdown page, map slug->md
              const parsedHref = (item.getAttribute && item.getAttribute('href')) ? item.getAttribute('href') : ''
              try {
                const url = new URL(parsedHref, location.href)
                const p = url.searchParams.get('page')
                if (p) {
                  const decoded = decodeURIComponent(p)
                  try { slugToMd.set(slugKey, decoded); mdToSlug.set(decoded, slugKey) } catch (ee) { }
                }
              } catch (ee) { }
            }
          } catch (ee) { }
        }
      } catch (ee) { }



            item.textContent = a.textContent || href
            start.appendChild(item)
          }

    menu.appendChild(start)
    navbar.appendChild(brand)
    navbar.appendChild(menu)
    navbarWrap.appendChild(navbar)

    // intercept internal query links in the navbar to perform SPA navigation
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
            try { renderByQuery() } catch (e) { }
          }
        } catch (e) { }
      })
    } catch (e) { }

    try {
      // intercept internal links inside the content area so they use SPA navigation
      container.addEventListener('click', (ev) => {
        const a = ev.target && ev.target.closest ? ev.target.closest('a') : null
        if (!a) return
        const href = a.getAttribute('href') || ''
        if (!href) return
        // ignore external/mailto/tel links
        if (/^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')) return
        try {
          const url = new URL(href, location.href)
          const pageParam = url.searchParams.get('page')
          const hash = url.hash ? url.hash.replace(/^#/, '') : null
          if (pageParam) {
            ev.preventDefault()
            history.pushState({ page: pageParam }, '', '?page=' + encodeURIComponent(pageParam) + (hash ? '#' + encodeURIComponent(hash) : ''))
            try { renderByQuery() } catch (e) { }
          }
        } catch (e) {
          // ignore non-URL hrefs
        }
      })
    } catch (e) { }

    burger.addEventListener('click', () => {
      const isActive = burger.classList.contains('is-active')
      burger.classList.toggle('is-active')
      menu.classList.toggle('is-active')
      burger.setAttribute('aria-expanded', String(!isActive))
    })
    try {
      const updateContainerHeight = () => {
        try {
          const h = navbarWrap.offsetHeight || 0
          container.style.height = `calc(100% - ${h}px)`
        } catch (e) { }
      }
      updateContainerHeight()
      if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(updateContainerHeight)
        ro.observe(navbarWrap)
      } else {
        window.addEventListener('resize', updateContainerHeight)
      }
    } catch (e) { }
  } catch (e) {
  }

  try {
    // start loading supported languages in background; do not block render
    try { loadSupportedLanguages().catch(() => {}) } catch (e) { }
  } catch (e) {
  }

  const siteNav = createNavTree(t, [{ path: '_home.md', name: t('home'), isIndex: true, children: [] }])
  let currentPagePath = null



  function attachTocClickHandler(toc) {
    try {
      toc.addEventListener('click', (ev) => {
        const a = ev.target && ev.target.closest ? ev.target.closest('a') : null
        if (!a) return
        const href = a.getAttribute('href') || ''
        try {
          const url = new URL(href, location.href)
          const pageParam = url.searchParams.get('page')
          const hash = url.hash ? url.hash.replace(/^#/, '') : null
          if (!pageParam && !hash) return
          ev.preventDefault()
          history.pushState({ page: pageParam }, '', '?page=' + encodeURIComponent(pageParam) + (hash ? '#' + encodeURIComponent(hash) : ''))
          try { renderByQuery() } catch (e) { }
        } catch (e) { /* ignore non-URL hrefs */ }
      })
    } catch (e) { }
  }



  function scrollToAnchorOrTop(anchor) {
    if (anchor) {
      const el = document.getElementById(anchor)
      if (el) {
        try {
          const doScroll = () => {
            try {
              if (container && container.scrollTo && container.contains(el)) {
                const top = el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop
                container.scrollTo({ top, behavior: 'smooth' })
              } else {
                try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }) } catch (e) { el.scrollIntoView() }
              }
            } catch (e) {
              try { el.scrollIntoView() } catch (ee) { }
            }
          }
          try { requestAnimationFrame(() => setTimeout(doScroll, 50)) } catch (e) { setTimeout(doScroll, 50) }
        } catch (e) { try { el.scrollIntoView() } catch (ee) { } }
      }
    } else {
      try {
        if (container && container.scrollTo) container.scrollTo({ top: 0, behavior: 'smooth' })
        else window.scrollTo(0, 0)
      } catch (e) { window.scrollTo(0, 0) }
    }
  }

  function ensureScrollTopButton(article, topH1) {
    try {
      const existingBtn = document.querySelector('.nimbi-scroll-top')
      let btn = existingBtn
      if (!btn) {
        btn = document.createElement('button')
        btn.className = 'nimbi-scroll-top'
        btn.setAttribute('aria-label', t('scrollToTop'))
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>'
        try {
          if (mountOverlay && mountOverlay.appendChild) mountOverlay.appendChild(btn)
          else if (container && container.appendChild) container.appendChild(btn)
          else if (mountEl && mountEl.appendChild) mountEl.appendChild(btn)
          else document.body.appendChild(btn)
        } catch (e) {
          try { document.body.appendChild(btn) } catch (ee) { /* give up */ }
        }
        try {
          btn.style.position = 'absolute'
          btn.style.right = '1rem'
          btn.style.bottom = '1.25rem'
          btn.style.zIndex = '60'
        } catch (e) { }
        btn.addEventListener('click', () => {
          try {
            if (container && container.scrollTo) container.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
            else if (mountEl && mountEl.scrollTo) mountEl.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
            else window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
          } catch (e) {
            try { if (container) container.scrollTop = 0 } catch (e2) { }
            try { if (mountEl) mountEl.scrollTop = 0 } catch (e3) { }
            try { document.documentElement.scrollTop = 0 } catch (e4) { }
          }
        })
      }

      const tocLabel = navWrap.querySelector('.menu-label')
      if (!topH1) {
        btn.classList.remove('show')
        if (tocLabel) tocLabel.classList.remove('show')
      } else {
        if (!btn._nimbiObserver) {
          const obs = new IntersectionObserver((entries) => {
            for (const entry of entries) {
              if (entry.target instanceof Element) {
                if (entry.isIntersecting) {
                  btn.classList.remove('show')
                  if (tocLabel) tocLabel.classList.remove('show')
                } else {
                  btn.classList.add('show')
                  if (tocLabel) tocLabel.classList.add('show')
                }
              }
            }
          }, { root: (container instanceof Element) ? container : ((mountEl instanceof Element) ? mountEl : null), threshold: 0 })
          btn._nimbiObserver = obs
        }
        try { btn._nimbiObserver.disconnect() } catch (e) { }
        btn._nimbiObserver.observe(topH1)
        try {
          const checkIntersect = () => {
            try {
              const rootRect = (container instanceof Element) ? container.getBoundingClientRect() : { top: 0, bottom: window.innerHeight }
              const elRect = topH1.getBoundingClientRect()
              const isIntersecting = !(elRect.bottom < rootRect.top || elRect.top > rootRect.bottom)
              if (isIntersecting) {
                btn.classList.remove('show')
                if (tocLabel) tocLabel.classList.remove('show')
              } else {
                btn.classList.add('show')
                if (tocLabel) tocLabel.classList.add('show')
              }
            } catch (e) { }
          }
          try {
            checkIntersect()
            requestAnimationFrame(checkIntersect)
            setTimeout(checkIntersect, 50)
            setTimeout(checkIntersect, 200)
            setTimeout(checkIntersect, 500)
          } catch (e) {
            setTimeout(checkIntersect, 100)
          }
            } catch (e) { }
        }
      } catch (e) {
      }
    }

    async function renderByQuery() {
      const raw = (new URLSearchParams(location.search).get('page')) || '_home.md'
      const hashAnchor = location.hash ? decodeURIComponent(location.hash.replace(/^#/, '')) : null
      let data, pagePath, anchor
      try {
          ({data,pagePath,anchor} = await fetchPageData(raw, contentBase))
        } catch (e) {
          renderNotFound(contentWrap, t, e)
          return
        }
      if (!anchor && hashAnchor) anchor = hashAnchor
      contentWrap.innerHTML = ''

      const { article, parsed, toc, topH1, h1Text, slugKey } = await prepareArticle(t, data, pagePath, anchor, contentBase)

      applyPageMeta(t, initialDocumentTitle, parsed, toc, article, pagePath, anchor, topH1, h1Text, slugKey, data)

      navWrap.innerHTML = ''
      navWrap.appendChild(toc)
      attachTocClickHandler(toc)

      contentWrap.appendChild(article)

      scrollToAnchorOrTop(anchor)
      ensureScrollTopButton(article, topH1)

      currentPagePath = pagePath
    }

  window.addEventListener('popstate', renderByQuery)
  await renderByQuery()
}

// TOC builder moved to src/htmlBuilder.js

// slugify moved to src/filesManager.js

// SEO helpers moved to src/seoManager.js

export { registerLanguage, loadSupportedLanguages, observeCodeBlocks, setHighlightTheme, SUPPORTED_HLJS_MAP, BAD_LANGUAGES } from './codeblocksManager.js'

export default initCMS
