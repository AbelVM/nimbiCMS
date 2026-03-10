import { slugify, mdToSlug, slugToMd, fetchMarkdown } from './filesManager.js'
import { detectFenceLanguages, parseMarkdownToHtml } from './markdown.js'
import { hljs, SUPPORTED_HLJS_MAP, registerLanguage, observeCodeBlocks } from './codeblocksManager.js'

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
    } catch (e) {
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

// given a collection of anchor elements pointing at HTML files, fetch
// each HTML and extract a title or first H1 so we can map a friendly slug
// without waiting until the navigation click occurs.
export async function preScanHtmlSlugs(linkEls, base) {
  if (!linkEls || !linkEls.length) return
  const outs = []
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
        if (mdToSlug && mdToSlug.has && mdToSlug.has(htmlPath)) continue
      } catch (e) { }
      outs.push((async () => {
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
                  try { slugToMd.set(slugKey, htmlPath); mdToSlug.set(htmlPath, slugKey) } catch (e) { }
                }
              }
            } catch (e) { }
          }
        } catch (e) { }
      })())
    } catch (e) { }
  }
  if (outs.length) await Promise.allSettled(outs)
}


export async function prepareArticle(t, data, pagePath, anchor, contentBase) {
    let parsed = null
    if (data.isHtml) {
      try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(data.raw || '', 'text/html')
        const heads = doc.querySelectorAll('h1,h2,h3,h4,h5,h6')
        heads.forEach(h => { if (!h.id) h.id = slugify(h.textContent || '') })
        try {
          const imgs = doc.querySelectorAll('img')
          imgs.forEach(img => { try { if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy') } catch (e) { } })
        } catch (e) { }
        const codes = doc.querySelectorAll('pre code, code[class]')
        codes.forEach(codeEl => {
          try {
            const cls = (codeEl.getAttribute && codeEl.getAttribute('class')) || codeEl.className || ''
            const match = cls.match(/language-([a-zA-Z0-9_+-]+)/) || cls.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/)
            if (!match || !match[1]) {
              try { hljs.highlightElement(codeEl) } catch (e) { }
            }
          } catch (e) { }
        })
        const docToc = []
        heads.forEach(h => { docToc.push({ level: Number(h.tagName.substring(1)), text: (h.textContent || '').trim(), id: h.id }) })
        parsed = { html: doc.body.innerHTML, meta: {}, toc: docToc }
      } catch (e) {
        parsed = { html: data.raw || '', meta: {}, toc: [] }
      }
    } else {
      const langs = detectFenceLanguages(data.raw || '', SUPPORTED_HLJS_MAP)
      for (const l of langs) {
        try {
          const canonical = (SUPPORTED_HLJS_MAP.size && (SUPPORTED_HLJS_MAP.get(l) || SUPPORTED_HLJS_MAP.get(String(l).toLowerCase()))) || l
          try { registerLanguage(canonical).catch(() => {}) } catch (e) { }
          if (String(l) !== String(canonical)) try { registerLanguage(l).catch(() => {}) } catch (e) { }
        } catch (e) {}
      }
      parsed = await parseMarkdownToHtml(data.raw || '')
    }

    const article = document.createElement('article')
    article.className = 'nimbi-article content'
    article.innerHTML = parsed.html
    try { observeCodeBlocks(article) } catch (e) { }

    try {
      const imgs = article.querySelectorAll('img')
      if (imgs && imgs.length) {
        const pageDirForImgs = pagePath && pagePath.includes('/') ? pagePath.substring(0, pagePath.lastIndexOf('/') + 1) : ''
        imgs.forEach((img) => {
          const src = img.getAttribute('src') || ''
          if (!src) return
          if (/^(https?:)?\/\//.test(src) || src.startsWith('/')) return
          try {
            const resolved = new URL(pageDirForImgs + src, contentBase).toString()
            img.src = resolved
            try { if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy') } catch (e) { }
          } catch (e) {}
        })
      }
    } catch (e) {}

    try {
      const anchors = article.querySelectorAll('a')
      if (anchors && anchors.length) {
        const contentBaseUrl = new URL(contentBase)
        const contentBasePath = contentBaseUrl.pathname.endsWith('/') ? contentBaseUrl.pathname : contentBaseUrl.pathname + '/'
        for (const a of Array.from(anchors || [])) {
          try {
            const href = a.getAttribute('href') || ''
            if (!href) continue
            if (/^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')) continue
            if (href.startsWith('/') && !href.endsWith('.md')) continue
            const mdMatch = href.match(/^([^#?]+\.md)(?:[#](.+))?$/)
            if (mdMatch) {
              const mdPathRaw = mdMatch[1]
              const frag = mdMatch[2]
              try {
                const resolved = new URL(mdPathRaw, contentBase).pathname
                const rel = resolved.startsWith(contentBasePath) ? resolved.slice(contentBasePath.length) : resolved.replace(/^\//, '')
                let slug = null
                try { if (mdToSlug.has(rel)) slug = mdToSlug.get(rel) } catch (e) {}
                if (!slug) {
                  // derive slug by fetching markdown H1 if possible
                  try {
                    const mdData = await fetchMarkdown(rel, contentBase)
                    if (mdData && mdData.raw) {
                      const m = (mdData.raw || '').match(/^#\s+(.+)$/m)
                      if (m && m[1]) {
                        const candidate = slugify(m[1].trim())
                        if (candidate) {
                          slug = candidate
                          try { slugToMd.set(slug, rel); mdToSlug.set(rel, slug) } catch (ee) {}
                        }
                      }
                    }
                  } catch (ee) { /* ignore errors */ }
                }
                if (slug) {
                  if (frag) a.setAttribute('href', `?page=${encodeURIComponent(slug)}#${encodeURIComponent(frag)}`)
                  else a.setAttribute('href', `?page=${encodeURIComponent(slug)}`)
                } else {
                  if (frag) a.setAttribute('href', `?page=${encodeURIComponent(rel)}#${encodeURIComponent(frag)}`)
                  else a.setAttribute('href', `?page=${encodeURIComponent(rel)}`)
                }
              } catch (e) {
                a.setAttribute('href', '?page=' + encodeURIComponent(mdPathRaw.replace(/^\.\//, '')))
              }
              continue
            }
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
            } catch (e) {}
          } catch (e) {}
        }
      }
    } catch (e) {}

    // compute H1 and slug mapping before building the TOC so TOC can use the friendly slug
    const topH1 = article.querySelector('h1')
    const h1Text = topH1 ? (topH1.textContent || '').trim() : ''
    let slugKey = ''
    try {
      if (h1Text) slugKey = slugify(h1Text)
      if (!slugKey && parsed && parsed.meta && parsed.meta.title) slugKey = slugify(parsed.meta.title)
      if (!slugKey && pagePath) slugKey = slugify(String(pagePath))
      if (!slugKey) slugKey = '_home'
      try { if (pagePath) { slugToMd.set(slugKey, pagePath); mdToSlug.set(pagePath, slugKey) } } catch (e) { }
      try {
        let newUrl = '?page=' + encodeURIComponent(slugKey)
        try {
          const curHash = anchor || (location.hash ? decodeURIComponent(location.hash.replace(/^#/, '')) : '')
          if (curHash) newUrl += '#' + encodeURIComponent(curHash)
        } catch (e) { }
        history.replaceState({ page: slugKey }, '', newUrl)
      } catch (e) { }
    } catch (e) { }

    const toc = buildTocElement(t, parsed.toc, pagePath)
    return { article, parsed, toc, topH1: article.querySelector('h1'), h1Text, slugKey }
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
          try { renderByQuery() } catch (e) { }
        } catch (e) { /* ignore non-URL hrefs */ }
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

      const tocLabel = (navWrapEl && navWrapEl.querySelector) ? navWrapEl.querySelector('.menu-label') : null
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
          const rootEl = containerEl instanceof Element ? containerEl : (mountElLocal instanceof Element ? mountElLocal : null)
          btn._nimbiObserver = obs
        }
        try { btn._nimbiObserver.disconnect() } catch (e) { }
        try { btn._nimbiObserver.observe(topH1) } catch (e) { }
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