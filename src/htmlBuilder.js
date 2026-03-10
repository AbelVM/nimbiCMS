import { slugify, mdToSlug, slugToMd, fetchMarkdown } from './filesManager.js'
import { detectFenceLanguages, parseMarkdownToHtml } from './markdown.js'
import { hljs, SUPPORTED_HLJS_MAP, registerLanguage, observeCodeBlocks } from './codeblocksManager.js'
import { isExternalLink, normalizePath, setLazyload, safe } from './utils/helpers.js'

export function createNavTree(t, tree) {
  const nav = document.createElement('aside')
  nav.className = 'menu nimbi-nav'
  const label = document.createElement('p')
  label.className = 'menu-label'
  label.textContent = t('navigation')
  nav.appendChild(label)
  const ul = document.createElement('ul')
  ul.className = 'menu-list'
  tree.forEach((item) => {
    const li = document.createElement('li')
    const a = document.createElement('a')
    a.href = '#' + item.path
    a.textContent = item.name
    li.appendChild(a)
    if (item.children && item.children.length) {
      const subul = document.createElement('ul')
      item.children.forEach((c) => {
        const cli = document.createElement('li')
        const ca = document.createElement('a')
        ca.href = '#' + c.path
        ca.textContent = c.name
        cli.appendChild(ca)
        subul.appendChild(cli)
      })
      li.appendChild(subul)
    }
    ul.appendChild(li)
  })
  nav.appendChild(ul)
  return nav
}

export function buildTocElement(t, toc, pagePath = '') {
  const aside = document.createElement('aside')
  aside.className = 'menu nimbi-toc-inner'
  const label = document.createElement('p')
  label.className = 'menu-label'
  label.textContent = t('onThisPage')
  aside.appendChild(label)
  const ul = document.createElement('ul')
  ul.className = 'menu-list'
  toc.forEach(item => {
    if (item.level === 1) return
    const li = document.createElement('li')
    const a = document.createElement('a')
    const slug = item.id || slugify(item.text)
    try {
      const normPage = String(pagePath || '').replace(/^[\.\/]+/, '')
      const display = (normPage && mdToSlug && mdToSlug.has && mdToSlug.has(normPage)) ? mdToSlug.get(normPage) : normPage
      if (display) a.href = `?page=${encodeURIComponent(display)}#${encodeURIComponent(slug)}`
      else a.href = `?page=${encodeURIComponent(slug)}`
    } catch (_) {
      const normPage = String(pagePath || '').replace(/^[\.\/]+/, '')
      const display = (normPage && mdToSlug && mdToSlug.has && mdToSlug.has(normPage)) ? mdToSlug.get(normPage) : normPage
      if (display) a.href = `?page=${encodeURIComponent(display)}#${encodeURIComponent(slug)}`
      else a.href = `?page=${encodeURIComponent(slug)}`
    }
    a.textContent = item.text
    li.appendChild(a)
    ul.appendChild(li)
  })
  aside.appendChild(ul)
  return aside
}

// helpers used by prepareArticle ------------------------------------------------

function addHeadingIds(doc) {
  const heads = doc.querySelectorAll('h1,h2,h3,h4,h5,h6')
  heads.forEach(h => { if (!h.id) h.id = slugify(h.textContent || '') })
}

function lazyLoadImages(el, pagePath, contentBase) {
  try {
    const imgs = el.querySelectorAll('img')
    if (imgs && imgs.length) {
      const pageDirForImgs = pagePath && pagePath.includes('/') ? pagePath.substring(0, pagePath.lastIndexOf('/') + 1) : ''
      imgs.forEach((img) => {
        const src = img.getAttribute('src') || ''
        if (!src) return
        if (/^(https?:)?\/\//.test(src) || src.startsWith('/')) return
        try {
          const resolved = new URL(pageDirForImgs + src, contentBase).toString()
          img.src = resolved
          try { if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy') } catch (_) { }
        } catch (_) {}
      })
    }
  } catch (_) {}
}

async function rewriteAnchors(article, contentBase) {
  try {
    const anchors = article.querySelectorAll('a')
    if (!anchors || !anchors.length) return

    const contentBaseUrl = new URL(contentBase)
    const contentBasePath = contentBaseUrl.pathname.endsWith('/') ? contentBaseUrl.pathname : contentBaseUrl.pathname + '/'

    // collect MD paths that require slug lookup
    const pending = new Set()
    const anchorInfo = [] // { node, mdPathRaw, frag, rel }

    for (const a of Array.from(anchors)) {
      try {
        const href = a.getAttribute('href') || ''
        if (!href) continue
        if (isExternalLink(href)) continue
        if (href.startsWith('/') && !href.endsWith('.md')) continue
        const mdMatch = href.match(/^([^#?]+\.md)(?:[#](.+))?$/)
        if (mdMatch) {
          const mdPathRaw = mdMatch[1]
          const frag = mdMatch[2]
          try {
            const resolved = new URL(mdPathRaw, contentBase).pathname
            const rel = resolved.startsWith(contentBasePath) ? resolved.slice(contentBasePath.length) : resolved.replace(/^\//, '')
            anchorInfo.push({ node: a, mdPathRaw, frag, rel })
            if (!mdToSlug.has(rel)) pending.add(rel)
          } catch (_) {
            // swallow malformed url
          }
          continue
        }
        // non-md link: treat as absolute or slug lookup by path without MD
        try {
          const full = new URL(href, contentBase)
          const p = full.pathname || ''
          if (p && p.indexOf(contentBasePath) !== -1) {
            let rel = p.startsWith(contentBasePath) ? p.slice(contentBasePath.length) : p.replace(/^\//, '')
            rel = rel.replace(/^[\.\/]+/, '')
            if (rel.endsWith('/')) rel = rel.slice(0, -1)
            if (!rel) rel = '_home'
            if (!rel.endsWith('.md')) {
              if (slugToMd.has(rel)) {
                const mapped = slugToMd.get(rel)
                const slug = mdToSlug.get(mapped) || rel
                a.setAttribute('href', `?page=${encodeURIComponent(slug)}`)
              } else {
                a.setAttribute('href', `?page=${encodeURIComponent(rel)}`)
              }
            }
          }
        } catch (_) {}
      } catch (_) {}
    }

    // perform slug lookups in parallel. Prefer any existing slug->md mapping
    // when the requested path looks like a slug filename (basename.md). This
    // avoids fetching e.g. "an-ephemeral-status-update.md" when we already
    // know that slug maps to `_home.md` or another canonical path.
    if (pending.size) {
      await Promise.all(Array.from(pending).map(async rel => {
        try {
          // If the requested file looks like "basename.md" and we already
          // have a slug->md mapping for that basename, use it instead of
          // fetching the requested path.
          try {
            const m = String(rel).match(/([^\/]+)\.md$/)
            const basename = m && m[1]
            if (basename && slugToMd.has(basename)) {
              try {
                const mapped = slugToMd.get(basename)
                if (mapped) {
                  try { mdToSlug.set(mapped, basename) } catch (_) {}
                }
              } catch (_) {}
              return
            }
          } catch (_) {}

          const mdData = await fetchMarkdown(rel, contentBase)
          if (mdData && mdData.raw) {
            const m2 = (mdData.raw || '').match(/^#\s+(.+)$/m)
            if (m2 && m2[1]) {
              const candidate = slugify(m2[1].trim())
              if (candidate) {
                try { slugToMd.set(candidate, rel); mdToSlug.set(rel, candidate) } catch (_) {}
              }
            }
          }
        } catch (_) {}
      }))
    }

    // apply href transformations for MD links now that lookup map is populated
    for (const info of anchorInfo) {
      const { node: a, frag, rel } = info
      let slug = null
      try { if (mdToSlug.has(rel)) slug = mdToSlug.get(rel) } catch (_) {}
      if (slug) {
        if (frag) a.setAttribute('href', `?page=${encodeURIComponent(slug)}#${encodeURIComponent(frag)}`)
        else a.setAttribute('href', `?page=${encodeURIComponent(slug)}`)
      } else {
        if (frag) a.setAttribute('href', `?page=${encodeURIComponent(rel)}#${encodeURIComponent(frag)}`)
        else a.setAttribute('href', `?page=${encodeURIComponent(rel)}`)
      }
    }
  } catch (_) {}
}

function computeSlug(parsed, article, pagePath, anchor) {
  const topH1 = article.querySelector('h1')
  const h1Text = topH1 ? (topH1.textContent || '').trim() : ''
  let slugKey = ''
  try {
    if (h1Text) slugKey = slugify(h1Text)
    if (!slugKey && parsed && parsed.meta && parsed.meta.title) slugKey = slugify(parsed.meta.title)
    if (!slugKey && pagePath) slugKey = slugify(String(pagePath))
    if (!slugKey) slugKey = '_home'
    try { if (pagePath) { slugToMd.set(slugKey, pagePath); mdToSlug.set(pagePath, slugKey) } } catch (_) { }
    try {
      let newUrl = '?page=' + encodeURIComponent(slugKey)
      try {
        const curHash = anchor || (location.hash ? decodeURIComponent(location.hash.replace(/^#/, '')) : '')
        if (curHash) newUrl += '#' + encodeURIComponent(curHash)
      } catch (_) { }
      history.replaceState({ page: slugKey }, '', newUrl)
    } catch (_) { }
  } catch (_) { }
  return { topH1, h1Text, slugKey }
}

/**
 * Given a collection of anchor elements pointing at HTML files, fetch each
 * document and extract a title or first H1.  This allows us to create
 * slug-to-path mappings up front so clicks on HTML links behave like
 * Markdown URLs.
 *
 * @param {NodeListOf<HTMLAnchorElement>} linkEls
 * @param {string} base - base URL for fetchMarkdown
 */
export async function preScanHtmlSlugs(linkEls, base) {
  if (!linkEls || !linkEls.length) return

  // collect unique HTML paths that need titles
  const htmlPaths = new Set()
  for (const a of Array.from(linkEls || [])) {
      try {
        const href = a.getAttribute('href') || ''
        if (!href) continue
        const raw = href.replace(/^\.\//, '')
        const parts = raw.split(/::|#/, 2)
        const path = parts[0]
        if (!path || (!/\.html(?:$|[?#])/.test(path) && !path.endsWith('.html'))) continue
        const htmlPath = path
        try {
          // skip if already mapped by mdToSlug
          if (mdToSlug && mdToSlug.has && mdToSlug.has(htmlPath)) continue
        } catch (_) { }
        try {
          // also skip if slugToMd already contains this path as a value
          let already = false
          for (const v of slugToMd.values()) {
            if (v === htmlPath) { already = true; break }
          }
          if (already) continue
        } catch (_) { }
        htmlPaths.add(htmlPath)
      } catch (_) { }
  }

  if (!htmlPaths.size) return

  // helper that fetches one HTML and extracts title/H1
  const fetchAndExtract = async (htmlPath) => {
    try {
      const res = await fetchMarkdown(htmlPath, base)
      if (res && res.raw) {
        try {
          const parser = new DOMParser()
          const doc = parser.parseFromString(res.raw, 'text/html')
          const titleTag = doc.querySelector('title')
          const h1 = doc.querySelector('h1')
          const titleText = (titleTag && titleTag.textContent && titleTag.textContent.trim())
            ? titleTag.textContent.trim()
            : (h1 && h1.textContent ? h1.textContent.trim() : null)
          if (titleText) {
            const slugKey = slugify(titleText)
            if (slugKey) {
              try { slugToMd.set(slugKey, htmlPath); mdToSlug.set(htmlPath, slugKey) } catch (_) { }
            }
          }
        } catch (_) { }
      }
    } catch (_) { }
  }

  // limit concurrent fetches to avoid overloading server
  const CONCURRENCY = 5
  const paths = Array.from(htmlPaths)
  let idx = 0
  const runners = []
  while (idx < paths.length) {
    const chunk = paths.slice(idx, idx + CONCURRENCY)
    runners.push(Promise.all(chunk.map(fetchAndExtract)))
    idx += CONCURRENCY
  }
  await Promise.all(runners)
}


// helpers used by prepareArticle ------------------------------------------------

/**
 * Parse raw HTML input and return the normalized "parsed" object used by the
 * rendering pipeline.
 *
 * @param {string} raw - HTML string to parse
 * @returns {{html:string,meta:Object,toc:Array<{level:number,text:string,id:string}>}}
 */
function parseHtml(raw) {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(raw || '', 'text/html')
    addHeadingIds(doc)
    try {
      const imgs = doc.querySelectorAll('img')
      imgs.forEach(img => { try { if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy') } catch (_) { } })
    } catch (_) { }
    const codes = doc.querySelectorAll('pre code, code[class]')
    codes.forEach(codeEl => {
      try {
        const cls = (codeEl.getAttribute && codeEl.getAttribute('class')) || codeEl.className || ''
        const match = cls.match(/language-([a-zA-Z0-9_+-]+)/) || cls.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/)
        if (!match || !match[1]) {
          try { hljs.highlightElement(codeEl) } catch (_) { }
        }
      } catch (_) { }
    })
    const tocEntries = []
    const heads = doc.querySelectorAll('h1,h2,h3,h4,h5,h6')
    heads.forEach(h => {
      tocEntries.push({ level: Number(h.tagName.substring(1)), text: (h.textContent || '').trim(), id: h.id })
    })
    return { html: doc.body.innerHTML, meta: {}, toc: tocEntries }
  } catch (_) {
    return { html: raw || '', meta: {}, toc: [] }
  }
}

/**
 * Ensure highlight.js languages referenced in the markdown are registered.
 * This inspects fences, looks up the canonical mapping and invokes
 * `registerLanguage` as needed.  Errors are swallowed.
 *
 * @param {string} raw - markdown text to scan
 */
function ensureLanguages(raw) {
  const langsArray = detectFenceLanguages(raw || '', SUPPORTED_HLJS_MAP)
  const langs = new Set(langsArray)
  for (const l of langs) {
    try {
      const canonical = (SUPPORTED_HLJS_MAP.size && (SUPPORTED_HLJS_MAP.get(l) || SUPPORTED_HLJS_MAP.get(String(l).toLowerCase()))) || l
      if (!registeredLangs.has(canonical)) {
        try { registerLanguage(canonical).catch(() => {}) } catch (_) { }
      }
      if (String(l) !== String(canonical) && !registeredLangs.has(l)) {
        try { registerLanguage(l).catch(() => {}) } catch (_) { }
      }
    } catch (_) { }
  }
}

/**
 * Convert markdown raw text to the normalized parsed object, registering
 * any required languages along the way.
 *
 * @param {string} raw - markdown source
 * @returns {Promise<{html:string,meta:Object,toc:Array}>}
 */
async function parseMarkdown(raw) {
  ensureLanguages(raw)
  return await parseMarkdownToHtml(raw || '')
}

/**
 * Given a page's fetched data, produce an <article> element, a TOC,
 * and slug calculations.  Handles HTML vs Markdown transparently.
 *
 * @param {Function} t - localization function
 * @param {{raw:string,isHtml?:boolean}} data - data returned by fetchMarkdown
 * @param {string} pagePath - normalized path of the page (for link rewriting)
 * @param {string|null} anchor - optional anchor to scroll to
 * @param {string} contentBase - base URL for resolving links and images
 * @returns {Promise<{article:HTMLElement,parsed:Object,toc:HTMLElement,topH1:HTMLElement|null,h1Text:string|null,slugKey:string|null}>}
 */
export async function prepareArticle(t, data, pagePath, anchor, contentBase) {
    // parse or convert the input into HTML + metadata
    let parsed = null
    if (data.isHtml) {
      parsed = parseHtml(data.raw || '')
    } else {
      parsed = await parseMarkdown(data.raw || '')
    }

    const article = document.createElement('article')
    article.className = 'nimbi-article content'
    article.innerHTML = parsed.html
    try { observeCodeBlocks(article) } catch (_) { }

    lazyLoadImages(article, pagePath, contentBase)
    await rewriteAnchors(article, contentBase)

    const { topH1, h1Text, slugKey } = computeSlug(parsed, article, pagePath, anchor)

    const toc = buildTocElement(t, parsed.toc, pagePath)
    return { article, parsed, toc, topH1, h1Text, slugKey }
  }

    // render an error page for unresolved queries
export function renderNotFound(contentWrap, t, e) {
    if (contentWrap) contentWrap.innerHTML = ''
    const notFound = document.createElement('article')
    notFound.className = 'nimbi-article content nimbi-not-found'
    const h = document.createElement('h1')
    h.textContent = t ? t('notFound') || 'Page not found' : 'Page not found'
    const p = document.createElement('p')
    p.textContent = e && e.message ? String(e.message) : 'Failed to resolve the requested page.'
    notFound.appendChild(h)
    notFound.appendChild(p)
    if (contentWrap && contentWrap.appendChild) contentWrap.appendChild(notFound)
  }

// test helpers (not part of public API)
export { parseHtml as _parseHtml, parseMarkdown as _parseMarkdown, ensureLanguages as _ensureLanguages }

export function attachTocClickHandler(toc) {
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
          try { renderByQuery() } catch (_) { }
        } catch (_) { /* ignore non-URL hrefs */ }
      })
    } catch (e) { }
  }



export function scrollToAnchorOrTop(anchor) {
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
                try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }) } catch (_) { el.scrollIntoView() }
              }
            } catch (_) {
              try { el.scrollIntoView() } catch (_) { }
            }
          }
          try { requestAnimationFrame(() => setTimeout(doScroll, 50)) } catch (_) { setTimeout(doScroll, 50) }
        } catch (_) { try { el.scrollIntoView() } catch (_) { } }
      }
    } else {
      try {
        if (container && container.scrollTo) container.scrollTo({ top: 0, behavior: 'smooth' })
        else window.scrollTo(0, 0)
      } catch (_) { window.scrollTo(0, 0) }
    }
  }

/**
 * Create or update a scroll-to-top button and toggle the TOC/menu label
 * visibility.  Observes the supplied `topH1` element if present; on pages
 * without a top heading we fall back to a simple scroll-position listener.
 *
 * @param {HTMLElement} article
 * @param {HTMLElement|null} topH1
 * @param {object} opts
 */
export function ensureScrollTopButton(article, topH1, { mountOverlay = null, container = null, mountEl = null, navWrap = null, t = null } = {}) {
    try {
      const tFn = t || (k => (typeof k === 'string' ? k : ''))
      const containerEl = container || document.querySelector('.nimbi-cms')
      const mountElLocal = mountEl || document.querySelector('.nimbi-mount')
      const mountOverlayEl = mountOverlay || document.querySelector('.nimbi-overlay')
      const navWrapEl = navWrap || document.querySelector('.nimbi-nav-wrap')
      const existingBtn = document.querySelector('.nimbi-scroll-top')
      let btn = existingBtn
      if (!btn) {
        btn = document.createElement('button')
        btn.className = 'nimbi-scroll-top'
        btn.setAttribute('aria-label', tFn('scrollToTop'))
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>'
        try {
          if (mountOverlayEl && mountOverlayEl.appendChild) mountOverlayEl.appendChild(btn)
          else if (containerEl && containerEl.appendChild) containerEl.appendChild(btn)
          else if (mountElLocal && mountElLocal.appendChild) mountElLocal.appendChild(btn)
          else document.body.appendChild(btn)
        } catch (_) {
          try { document.body.appendChild(btn) } catch (_) { /* give up */ }
        }
        try {
          btn.style.position = 'absolute'
          btn.style.right = '1rem'
          btn.style.bottom = '1.25rem'
          btn.style.zIndex = '60'
        } catch (_) { }
        btn.addEventListener('click', () => {
          try {
            if (container && container.scrollTo) container.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
            else if (mountEl && mountEl.scrollTo) mountEl.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
            else window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
          } catch (_) {
            try { if (container) container.scrollTop = 0 } catch (e2) { }
            try { if (mountEl) mountEl.scrollTop = 0 } catch (e3) { }
            try { document.documentElement.scrollTop = 0 } catch (e4) { }
          }
        })
      }

      const tocLabel = (navWrapEl && navWrapEl.querySelector) ? navWrapEl.querySelector('.menu-label') : null
      if (!topH1) {
        // no heading available: toggle label based on scroll position
        btn.classList.remove('show')
        if (tocLabel) tocLabel.classList.remove('show')
        const root = (container instanceof Element) ? container : ((mountEl instanceof Element) ? mountEl : window)
        const onScroll = () => {
          try {
            const scrollTop = (root === window) ? window.scrollY : (root.scrollTop || 0)
            const shouldShow = scrollTop > 10
            if (shouldShow) {
              btn.classList.add('show')
              if (tocLabel) tocLabel.classList.add('show')
            } else {
              btn.classList.remove('show')
              if (tocLabel) tocLabel.classList.remove('show')
            }
          } catch (_) {}
        }
        safe(() => root.addEventListener('scroll', onScroll))
        onScroll()
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
          // removed unused rootEl variable
          btn._nimbiObserver = obs
        }
        try { btn._nimbiObserver.disconnect() } catch (_) { }
        try { btn._nimbiObserver.observe(topH1) } catch (_) { }
        try {
          const checkIntersect = () => {
            try {
              const rootRect = (containerEl instanceof Element) ? containerEl.getBoundingClientRect() : { top: 0, bottom: window.innerHeight }
              const elRect = topH1.getBoundingClientRect()
              const isIntersecting = !(elRect.bottom < rootRect.top || elRect.top > rootRect.bottom)
              if (isIntersecting) {
                btn.classList.remove('show')
                if (tocLabel) tocLabel.classList.remove('show')
              } else {
                btn.classList.add('show')
                if (tocLabel) tocLabel.classList.add('show')
              }
            } catch (_) { }
          }
          // initial evaluation; IntersectionObserver will handle subsequent
          // changes automatically.  If Observer isn't available, do one delayed
          // re-check so old browsers still update correctly.
          checkIntersect()
          if (!('IntersectionObserver' in window)) {
            setTimeout(checkIntersect, 100)
          }
            } catch (_) { }
        }
      } catch (_) {
      }
    }