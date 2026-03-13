import { slugify, mdToSlug, slugToMd, fetchMarkdown } from './filesManager.js'
import { detectFenceLanguages, parseMarkdownToHtml } from './markdown.js'
import { hljs, SUPPORTED_HLJS_MAP, registerLanguage, observeCodeBlocks } from './codeblocksManager.js'
import { isExternalLink, normalizePath, safe, ensureTrailingSlash, trimTrailingSlash } from './utils/helpers.js'

/**
 * @typedef {{path:string,name:string,children?:NavItem[]}} NavItem
 * @typedef {{html:string,meta:Object,toc:Array<{level:number,text:string,id?:string}>}} ParsedPage
 */

/**
 * @typedef {{article:HTMLElement,parsed:ParsedPage,toc:HTMLElement,topH1:HTMLElement|null,h1Text:string|null,slugKey:string|null}} ArticleResult
 */

/**
 * Build a navigation tree DOM element from a simple tree description.
 * @param {Function} t - localization function that returns translated strings
 * @param {Array<{path:string,name:string,children?:Array}>} tree - nav items
 * @returns {HTMLElement} aside menu element
 */
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



/**
 * Build a table-of-contents DOM element from parsed TOC entries.
 * @param {Function} t - localization function
 * @param {Array<{level:number,text:string,id?:string}>} toc - TOC entries
 * @param {string} [pagePath]
 * @returns {HTMLElement}
 */
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
      else a.href = `?page=${encodeURIComponent(slug)}#${encodeURIComponent(slug)}`
    } catch (err) {
      console.warn('[htmlBuilder] buildTocElement href normalization failed', err)
      const normPage = String(pagePath || '').replace(/^[\.\/]+/, '')
      const display = (normPage && mdToSlug && mdToSlug.has && mdToSlug.has(normPage)) ? mdToSlug.get(normPage) : normPage
      if (display) a.href = `?page=${encodeURIComponent(display)}#${encodeURIComponent(slug)}`
      else a.href = `?page=${encodeURIComponent(slug)}#${encodeURIComponent(slug)}`
    }
    a.textContent = item.text
    li.appendChild(a)
    ul.appendChild(li)
  })
  aside.appendChild(ul)
  return aside
}

/**
 * Ensure every heading in the document has an id (slugified from text).
 * @param {Document|HTMLElement} doc
 * @returns {void}
 */
function addHeadingIds(doc) {
  const heads = doc.querySelectorAll('h1,h2,h3,h4,h5,h6')
  heads.forEach(h => { if (!h.id) h.id = slugify(h.textContent || '') })
}

/**
 * Resolve relative image `src` attributes against the content base and
 * mark them for lazy loading where appropriate.
 * @param {HTMLElement} el - container element to search for images
 * @param {string} pagePath
 * @param {string} contentBase
 * @returns {void}
 */
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
          try { if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy') } catch (err) { console.warn('[htmlBuilder] set image loading attribute failed', err) }
        } catch (err) { console.warn('[htmlBuilder] resolve image src failed', err) }
      })
    }
  } catch (err) { console.warn('[htmlBuilder] lazyLoadImages failed', err) }
}

let _lastContentBase = ''
let _lastContentBaseUrl = null
let _lastContentBasePath = ''

/**
 * Rewrite anchor hrefs in an article element to SPA `?page=` links where
 * applicable. Performs slug lookups and may fetch markdown titles.
 * @param {HTMLElement} article
 * @param {string} contentBase
 * @param {string} [pagePath]
 * @returns {Promise<void>}
 */
async function rewriteAnchors(article, contentBase, pagePath) {
  try {
    const anchors = article.querySelectorAll('a')
    if (!anchors || !anchors.length) return

    let contentBaseUrl, contentBasePath
    if (contentBase === _lastContentBase && _lastContentBaseUrl) {
      contentBaseUrl = _lastContentBaseUrl
      contentBasePath = _lastContentBasePath
    } else {
      contentBaseUrl = new URL(contentBase)
      contentBasePath = ensureTrailingSlash(contentBaseUrl.pathname)
      _lastContentBase = contentBase
      _lastContentBaseUrl = contentBaseUrl
      _lastContentBasePath = contentBasePath
    }

    const pending = new Set()
    const anchorInfo = []

    for (const a of Array.from(anchors)) {
      try {
        const href = a.getAttribute('href') || ''
        if (!href) continue
        if (isExternalLink(href)) continue
        if (href.startsWith('/') && !href.endsWith('.md')) continue
        const mdMatch = href.match(/^([^#?]+\.md)(?:[#](.+))?$/)
          if (mdMatch) {
          let mdPathRaw = mdMatch[1]
          const frag = mdMatch[2]
          if (!mdPathRaw.startsWith('/') && pagePath) {
            const dir = pagePath.includes('/') ? pagePath.substring(0, pagePath.lastIndexOf('/') + 1) : ''
            mdPathRaw = dir + mdPathRaw
          }
          try {
            const resolved = new URL(mdPathRaw, contentBase).pathname
            let rel = resolved.startsWith(contentBasePath) ? resolved.slice(contentBasePath.length) : resolved
            rel = normalizePath(rel)
            anchorInfo.push({ node: a, mdPathRaw, frag, rel })
            if (!mdToSlug.has(rel)) pending.add(rel)
          } catch (err) { console.warn('[htmlBuilder] resolve mdPath failed', err) }
          continue
        }
        try {
          const full = new URL(href, contentBase)
          const p = full.pathname || ''
          if (p && p.indexOf(contentBasePath) !== -1) {
            let rel = p.startsWith(contentBasePath) ? p.slice(contentBasePath.length) : p
            rel = normalizePath(rel)
            rel = trimTrailingSlash(rel)
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
        } catch (err) { console.warn('[htmlBuilder] resolving href to URL failed', err) }
      } catch (err) { console.warn('[htmlBuilder] processing anchor failed', err) }
    }

    if (pending.size) {
      await Promise.all(Array.from(pending).map(async rel => {
        try {
          try {
            const m = String(rel).match(/([^\/]+)\.md$/)
            const basename = m && m[1]
            if (basename && slugToMd.has(basename)) {
              try {
                const mapped = slugToMd.get(basename)
                if (mapped) {
                  try { mdToSlug.set(mapped, basename) } catch (err) { console.warn('[htmlBuilder] mdToSlug.set failed', err) }
                }
              } catch (err) { console.warn('[htmlBuilder] reading slugToMd failed', err) }
              return
            }
          } catch (err) { console.warn('[htmlBuilder] basename slug lookup failed', err) }

          const mdData = await fetchMarkdown(rel, contentBase)
            if (mdData && mdData.raw) {
            const m2 = (mdData.raw || '').match(/^#\s+(.+)$/m)
            if (m2 && m2[1]) {
              const candidate = slugify(m2[1].trim())
              if (candidate) {
                try { slugToMd.set(candidate, rel); mdToSlug.set(rel, candidate) } catch (err) { console.warn('[htmlBuilder] setting slug mapping failed', err) }
              }
            }
          }
          } catch (err) { console.warn('[htmlBuilder] fetchMarkdown during rewriteAnchors failed', err) }
      }))
    }

    for (const info of anchorInfo) {
      const { node: a, frag, rel } = info
      let slug = null
      try { if (mdToSlug.has(rel)) slug = mdToSlug.get(rel) } catch (err) { console.warn('[htmlBuilder] mdToSlug access failed', err) }
      if (slug) {
        if (frag) a.setAttribute('href', `?page=${encodeURIComponent(slug)}#${encodeURIComponent(frag)}`)
        else a.setAttribute('href', `?page=${encodeURIComponent(slug)}`)
      } else {
        if (frag) a.setAttribute('href', `?page=${encodeURIComponent(rel)}#${encodeURIComponent(frag)}`)
        else a.setAttribute('href', `?page=${encodeURIComponent(rel)}`)
      }
    }
  } catch (err) { console.warn('[htmlBuilder] rewriteAnchors failed', err) }
}

/**
 * Compute and replace the current history state slug for the article.
 * Returns the detected top H1, its text, and the chosen slug key.
 *
 * @param {Object} parsed - parsed page metadata
 * @param {HTMLElement} article
 * @param {string} [pagePath]
 * @param {string|null} [anchor]
 * @returns {{topH1:HTMLElement|null,h1Text:string|null,slugKey:string}}
 */
function computeSlug(parsed, article, pagePath, anchor) {
  const topH1 = article.querySelector('h1')
  const h1Text = topH1 ? (topH1.textContent || '').trim() : ''
  let slugKey = ''
  try {
    if (h1Text) slugKey = slugify(h1Text)
    if (!slugKey && parsed && parsed.meta && parsed.meta.title) slugKey = slugify(parsed.meta.title)
    if (!slugKey && pagePath) slugKey = slugify(String(pagePath))
    if (!slugKey) slugKey = '_home'
    try { if (pagePath) { slugToMd.set(slugKey, pagePath); mdToSlug.set(pagePath, slugKey) } } catch (err) { console.warn('[htmlBuilder] computeSlug set slug mapping failed', err) }
    try {
      let newUrl = '?page=' + encodeURIComponent(slugKey)
      try {
        const curHash = anchor || (location.hash ? decodeURIComponent(location.hash.replace(/^#/, '')) : '')
        if (curHash) newUrl += '#' + encodeURIComponent(curHash)
      } catch (err) { console.warn('[htmlBuilder] computeSlug hash decode failed', err) }
      try {
        history.replaceState({ page: slugKey }, '', newUrl)
      } catch (err) { console.warn('[htmlBuilder] computeSlug history replace failed', err) }
    } catch (err) { console.warn('[htmlBuilder] computeSlug inner failed', err) }
  } catch (err) { console.warn('[htmlBuilder] computeSlug failed', err) }
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
 * @returns {Promise<void>}
 */
export async function preScanHtmlSlugs(linkEls, base) {
  if (!linkEls || !linkEls.length) return

  const htmlPaths = new Set()
  for (const a of Array.from(linkEls || [])) {
      try {
        const href = a.getAttribute('href') || ''
        if (!href) continue
        const raw = normalizePath(href)
        const parts = raw.split(/::|#/, 2)
        let path = parts[0]
        if (!path) continue
        if (!path.includes('.')) {
          path = path + '.html'
        }
        if (!/\.html(?:$|[?#])/.test(path) && !path.toLowerCase().endsWith('.html')) continue
        const htmlPath = path
        try {
          if (mdToSlug && mdToSlug.has && mdToSlug.has(htmlPath)) continue
        } catch (err) { console.warn('[htmlBuilder] mdToSlug check failed', err) }
        try {
          let already = false
          for (const v of slugToMd.values()) {
            if (v === htmlPath) { already = true; break }
          }
          if (already) continue
        } catch (err) { console.warn('[htmlBuilder] slugToMd iteration failed', err) }
        htmlPaths.add(htmlPath)
      } catch (err) { console.warn('[htmlBuilder] preScanHtmlSlugs anchor iteration failed', err) }
  }

  if (!htmlPaths.size) return

  const fetchAndExtract = async (htmlPath) => {
    try {
      const res = await fetchMarkdown(htmlPath, base)
      if (res && res.raw) {
        try {
            const parser = HTML_PARSER || new DOMParser()
            const doc = parser.parseFromString(res.raw, 'text/html')
            const titleTag = doc.querySelector('title')
            const h1 = doc.querySelector('h1')
            const titleText = (titleTag && titleTag.textContent && titleTag.textContent.trim())
              ? titleTag.textContent.trim()
              : (h1 && h1.textContent ? h1.textContent.trim() : null)
            if (titleText) {
              const slugKey = slugify(titleText)
              if (slugKey) {
                try { slugToMd.set(slugKey, htmlPath); mdToSlug.set(htmlPath, slugKey) } catch (err) { console.warn('[htmlBuilder] set slugToMd/mdToSlug failed', err) }
              }
            }
          } catch (err) { console.warn('[htmlBuilder] parse HTML title failed', err) }
      }
    } catch (err) { console.warn('[htmlBuilder] fetchAndExtract failed', err) }
  }

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

/**
 * Map referenced markdown links to slugs by fetching titles where needed.
 * @param {NodeListOf<HTMLAnchorElement>|HTMLAnchorElement[]} linkEls
 * @param {string} contentBase
 * @returns {Promise<void>}
 */
export async function preMapMdSlugs(linkEls, contentBase) {
  if (!linkEls || !linkEls.length) return

  const anchorInfo = []
  const pending = new Set()
  let contentBasePath = ''
  try {
    const contentBaseUrl = new URL(contentBase)
    contentBasePath = ensureTrailingSlash(contentBaseUrl.pathname)
  } catch (err) { contentBasePath = ''; console.warn('[htmlBuilder] preMapMdSlugs parse base failed', err) }

  for (const a of Array.from(linkEls || [])) {
    try {
      const href = a.getAttribute('href') || ''
      if (!href) continue
      // look for any markdown filename in the href (may include fragments & dirs)
      const mdMatch = href.match(/^([^#?]+\.md)(?:[#](.+))?$/)
      if (mdMatch) {
        let mdPathRaw = normalizePath(mdMatch[1])
          try {
            let resolved
            try {
              resolved = new URL(mdPathRaw, contentBase).pathname
            } catch (err) {
              resolved = mdPathRaw
              console.warn('[htmlBuilder] resolve mdPath URL failed', err)
            }
          const rel = resolved.startsWith(contentBasePath) ? resolved.slice(contentBasePath.length) : resolved.replace(/^\//, '')
          anchorInfo.push({ rel })
          if (!mdToSlug.has(rel)) pending.add(rel)
        } catch (err) { console.warn('[htmlBuilder] rewriteAnchors failed', err) }
        continue
      }
    } catch (err) { console.warn('[htmlBuilder] preMapMdSlugs anchor iteration failed', err) }
  }

  if (pending.size) {
    await Promise.all(Array.from(pending).map(async rel => {
      try {
        const m = String(rel).match(/([^\/]+)\.md$/)
        const basename = m && m[1]
        if (basename && slugToMd.has(basename)) {
          try {
              const mapped = slugToMd.get(basename)
              if (mapped) mdToSlug.set(mapped, basename)
            } catch (err) { console.warn('[htmlBuilder] preMapMdSlugs slug map access failed', err) }
          return
        }
        } catch (err) { console.warn('[htmlBuilder] preMapMdSlugs basename check failed', err) }

      try {
        const mdData = await fetchMarkdown(rel, contentBase)
        if (mdData && mdData.raw) {
          const m2 = (mdData.raw || '').match(/^#\s+(.+)$/m)
          if (m2 && m2[1]) {
            const candidate = slugify(m2[1].trim())
            if (candidate) {
              try { slugToMd.set(candidate, rel); mdToSlug.set(rel, candidate) } catch (err) { console.warn('[htmlBuilder] preMapMdSlugs setting slug mapping failed', err) }
            }
          }
        }
      } catch (err) { console.warn('[htmlBuilder] preMapMdSlugs fetch failed', err) }
    }))
  }
}


/**
 * Parse raw HTML input and return the normalized "parsed" object used by the
 * rendering pipeline.
 *
 * @param {string} raw - HTML string to parse
 * @returns {{html:string,meta:Object,toc:Array<{level:number,text:string,id:string}>}}
 */
const HTML_PARSER = typeof DOMParser !== 'undefined' ? new DOMParser() : null

function parseHtml(raw) {
  try {
    const parser = HTML_PARSER || new DOMParser()
    const doc = parser.parseFromString(raw || '', 'text/html')
    addHeadingIds(doc)
    try {
      const imgs = doc.querySelectorAll('img')
      imgs.forEach(img => { try { if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy') } catch (err) { console.warn('[htmlBuilder] parseHtml set image loading attribute failed', err) } })
    } catch (err) { console.warn('[htmlBuilder] parseHtml query images failed', err) }
    const codes = doc.querySelectorAll('pre code, code[class]')
    codes.forEach(codeEl => {
      try {
        const cls = (codeEl.getAttribute && codeEl.getAttribute('class')) || codeEl.className || ''
        const match = cls.match(/language-([a-zA-Z0-9_+-]+)/) || cls.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/)
        if (match && match[1]) {
          const l = (match[1] || '').toLowerCase()
          const canonical = (SUPPORTED_HLJS_MAP.size && (SUPPORTED_HLJS_MAP.get(l) || SUPPORTED_HLJS_MAP.get(String(l).toLowerCase()))) || l
          try {
            ;(async () => {
              try { await registerLanguage(canonical) } catch (err) { console.warn('[htmlBuilder] registerLanguage failed', err) }
            })()
          } catch (err) { console.warn('[htmlBuilder] schedule registerLanguage failed', err) }
        } else {
          try {
            // no explicit language: prefer plaintext rendering if
            // available, otherwise avoid auto-detection.
            if (hljs && typeof hljs.getLanguage === 'function' && hljs.getLanguage('plaintext')) {
              const out = hljs.highlight ? hljs.highlight(codeEl.textContent || '', { language: 'plaintext' }) : null
              if (out && out.value) codeEl.innerHTML = out.value
            }
          } catch (err) { console.warn('[htmlBuilder] plaintext highlight fallback failed', err) }
        }
      } catch (err) { console.warn('[htmlBuilder] code element processing failed', err) }
    })
    const tocEntries = []
    const heads = doc.querySelectorAll('h1,h2,h3,h4,h5,h6')
    heads.forEach(h => {
      tocEntries.push({ level: Number(h.tagName.substring(1)), text: (h.textContent || '').trim(), id: h.id })
    })
    return { html: doc.body.innerHTML, meta: {}, toc: tocEntries }
  } catch (err) { console.warn('[htmlBuilder] parseHtml failed', err); return { html: raw || '', meta: {}, toc: [] } }
}

/**
 * Ensure highlight.js languages referenced in the markdown are registered.
 * This inspects fences, looks up the canonical mapping and invokes
 * `registerLanguage` as needed.  Errors are swallowed.
 *
 * @param {string} raw - markdown text to scan
 */
async function ensureLanguages(raw) {
  const langsArray = detectFenceLanguages(raw || '', SUPPORTED_HLJS_MAP)
  const langs = new Set(langsArray)
  const promises = []
  for (const l of langs) {
    try {
      const canonical = (SUPPORTED_HLJS_MAP.size && (SUPPORTED_HLJS_MAP.get(l) || SUPPORTED_HLJS_MAP.get(String(l).toLowerCase()))) || l
      try {
        promises.push(registerLanguage(canonical))
      } catch (err) { console.warn('[htmlBuilder] ensureLanguages push canonical failed', err) }
      if (String(l) !== String(canonical)) {
        try {
          promises.push(registerLanguage(l))
        } catch (err) { console.warn('[htmlBuilder] ensureLanguages push alias failed', err) }
      }
    } catch (err) { console.warn('[htmlBuilder] ensureLanguages inner failed', err) }
  }
  try { await Promise.all(promises) } catch (err) { console.warn('[htmlBuilder] ensureLanguages failed', err) }
}

/**
 * Convert markdown raw text to the normalized parsed object, registering
 * any required languages along the way.
 *
 * @param {string} raw - markdown source
 * @returns {Promise<{html:string,meta:Object,toc:Array}>}
 */
async function parseMarkdown(raw) {
  await ensureLanguages(raw)
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
 * @returns {Promise<ArticleResult>}
 */
export async function prepareArticle(t, data, pagePath, anchor, contentBase) {
    let parsed = null
    if (data.isHtml) {
      parsed = parseHtml(data.raw || '')
    } else {
      parsed = await parseMarkdown(data.raw || '')
    }

    const article = document.createElement('article')
    article.className = 'nimbi-article content'
    article.innerHTML = parsed.html
    try { addHeadingIds(article) } catch (err) { console.warn('[htmlBuilder] addHeadingIds failed', err) }
    try {
      const codeEls = article.querySelectorAll('pre code, code[class]')
      codeEls.forEach(el => {
        try {
          const raw = (el.getAttribute && el.getAttribute('class')) || el.className || ''
          const cleaned = String(raw || '').replace(/\blanguage-undefined\b|\blang-undefined\b/g, '').trim()
          if (cleaned) {
            try { el.setAttribute && el.setAttribute('class', cleaned) } catch (err) { el.className = cleaned; console.warn('[htmlBuilder] set element class failed', err) }
          } else {
            try { el.removeAttribute && el.removeAttribute('class') } catch (err) { el.className = ''; console.warn('[htmlBuilder] remove element class failed', err) }
          }
        } catch (err) { console.warn('[htmlBuilder] code element cleanup failed', err) }
      })
    } catch (err) { console.warn('[htmlBuilder] processing code elements failed', err) }
    try { observeCodeBlocks(article) } catch (err) { console.warn('[htmlBuilder] observeCodeBlocks failed', err) }

    lazyLoadImages(article, pagePath, contentBase)
    try {
      await rewriteAnchorsWorker(article, contentBase, pagePath)
    } catch (err) {
      console.warn('[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread', err)
      // fallback to in-thread implementation if worker fails
      await rewriteAnchors(article, contentBase, pagePath)
    }

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

// ---------------- worker support for anchor rewriting ------------------
let _anchorWorker = null
import anchorWorkerCode from './worker/anchorWorker.js?raw'

/**
 * @returns {Worker|null}
 */
export function initAnchorWorker() {
  if (!_anchorWorker) {
    try {
      let url = null
      if (typeof Blob !== 'undefined' && typeof URL !== 'undefined' && anchorWorkerCode) {
        try {
          const blob = new Blob([anchorWorkerCode], { type: 'application/javascript' })
          url = URL.createObjectURL(blob)
        } catch (err) { url = null; console.warn('[htmlBuilder] createObjectURL failed', err) }
      }
      if (url) {
        _anchorWorker = new Worker(url, { type: 'module' })
      } else {
        _anchorWorker = null
      }
    } catch (e) {
      console.warn('[htmlBuilder] anchor worker init failed', e)
      _anchorWorker = null
    }
  }
  return _anchorWorker
}

function _sendToAnchorWorker(msg) {
  return new Promise((resolve, reject) => {
    const w = initAnchorWorker()
    if (!w) return reject(new Error('worker unavailable'))
    const id = String(Math.random())
    msg.id = id
    const h = ev => {
      const data = ev.data || {}
      if (data.id !== id) return
      w.removeEventListener('message', h)
      if (data.error) reject(new Error(data.error))
      else resolve(data.result)
    }
    w.addEventListener('message', h)
    w.postMessage(msg)
  })
}

/**
 * Try to rewrite anchors using a dedicated worker. If the worker is not
 * available this is a thin wrapper that falls back to the in-thread
 * `rewriteAnchors` implementation.
 *
 * @param {HTMLElement} article
 * @param {string} contentBase
 * @param {string} [pagePath]
 * @returns {Promise<void>}
 */
export async function rewriteAnchorsWorker(article, contentBase, pagePath) {
  return rewriteAnchors(article, contentBase, pagePath)
}

// test helpers (not part of public API)
export { parseHtml as _parseHtml, parseMarkdown as _parseMarkdown, ensureLanguages as _ensureLanguages, rewriteAnchors, rewriteAnchors as _rewriteAnchors, computeSlug as _computeSlug, rewriteAnchorsWorker as _rewriteAnchorsWorker }



/**
 * Attach a click handler to a generated TOC so clicks perform SPA navigation.
 * @param {HTMLElement} toc
 * @returns {void}
 */
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
          // If the requested page equals the current page (or no `page` param),
          // don't re-render — just update the URL/hash and scroll to the anchor.
          let currentPage = null
          try { if (history && history.state && history.state.page) currentPage = history.state.page } catch (err) { currentPage = null; console.warn('[htmlBuilder] access history.state failed', err) }
          try { if (!currentPage) currentPage = (new URL(location.href)).searchParams.get('page') } catch (err) { console.warn('[htmlBuilder] parse current location failed', err) }

          if ((!pageParam && hash) || (pageParam && currentPage && String(pageParam) === String(currentPage))) {
            try {
              // For anchor-only clicks, preserve existing search and only set hash.
              if (!pageParam && hash) {
                try { history.replaceState(history.state, '', (location.pathname || '') + (location.search || '') + (hash ? '#' + encodeURIComponent(hash) : '')) } catch (err) { console.warn('[htmlBuilder] history.replaceState failed', err) }
              } else {
                try { history.replaceState({ page: currentPage || pageParam }, '', '?page=' + encodeURIComponent(currentPage || pageParam) + (hash ? '#' + encodeURIComponent(hash) : '')) } catch (err) { console.warn('[htmlBuilder] history.replaceState failed', err) }
              }
            } catch (err) { console.warn('[htmlBuilder] update history for anchor failed', err) }
            try { ev.stopImmediatePropagation && ev.stopImmediatePropagation(); ev.stopPropagation && ev.stopPropagation() } catch (err) { console.warn('[htmlBuilder] stopPropagation failed', err) }
            try { scrollToAnchorOrTop(hash) } catch (err) { console.warn('[htmlBuilder] scrollToAnchorOrTop failed', err) }
            return
          }

          // Otherwise perform SPA navigation as before.
          history.pushState({ page: pageParam }, '', '?page=' + encodeURIComponent(pageParam) + (hash ? '#' + encodeURIComponent(hash) : ''))
          try {
            if (typeof window !== 'undefined' && typeof window.renderByQuery === 'function') {
              try { window.renderByQuery() } catch (err) { console.warn('[htmlBuilder] window.renderByQuery failed', err) }
            } else if (typeof window !== 'undefined') {
              try { window.dispatchEvent(new PopStateEvent('popstate')) } catch (err) { console.warn('[htmlBuilder] dispatch popstate failed', err) }
            } else {
              try { renderByQuery() } catch (err) { console.warn('[htmlBuilder] renderByQuery failed', err) }
            }
          } catch (err) { console.warn('[htmlBuilder] SPA navigation invocation failed', err) }
        } catch (err) { /* ignore non-URL hrefs */ console.warn('[htmlBuilder] non-URL href in attachTocClickHandler', err) }
      })
    } catch (e) { console.warn('[htmlBuilder] attachTocClickHandler failed', e) }
  }



/**
 * Scroll the primary CMS container to either the top or to a specific
 * element with the given `id`.  When an anchor is supplied the helper
 * attempts to position the element at the top of the scroll viewport;
 * otherwise it simply resets the scroll offset to zero.  A small delay is
 * used to ensure the DOM has been updated before performing the scroll.
 *
 * @param {string|null} anchor - element id (without '#') or `null` to scroll
 *                               to the top.
 */
export function scrollToAnchorOrTop(anchor) {
    const containerEl = document.querySelector('.nimbi-cms') || null
    if (anchor) {
      const el = document.getElementById(anchor)
      if (el) {
        try {
          const doScroll = () => {
              try {
                if (containerEl && containerEl.scrollTo && containerEl.contains(el)) {
                  const top = el.getBoundingClientRect().top - containerEl.getBoundingClientRect().top + containerEl.scrollTop
                  containerEl.scrollTo({ top, behavior: 'smooth' })
                } else {
                  try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }) } catch (err) { try { el.scrollIntoView() } catch (err2) { console.warn('[htmlBuilder] scrollIntoView failed', err2) } }
                }
              } catch (err) {
                try { el.scrollIntoView() } catch (err2) { console.warn('[htmlBuilder] final scroll fallback failed', err2) }
              }
          }
          try { requestAnimationFrame(() => setTimeout(doScroll, 50)) } catch (err) { console.warn('[htmlBuilder] scheduling scroll failed', err); setTimeout(doScroll, 50) }
        } catch (err) { try { el.scrollIntoView() } catch (err2) { console.warn('[htmlBuilder] final scroll fallback failed', err2) } ; console.warn('[htmlBuilder] doScroll failed', err) }
      }
    } else {
      try {
        if (containerEl && containerEl.scrollTo) containerEl.scrollTo({ top: 0, behavior: 'smooth' })
        else window.scrollTo(0, 0)
      } catch (err) { try { window.scrollTo(0, 0) } catch (err2) { console.warn('[htmlBuilder] window.scrollTo failed', err2) } ; console.warn('[htmlBuilder] scroll to top failed', err) }
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
      } catch (err) {
        try { document.body.appendChild(btn) } catch (err2) { console.warn('[htmlBuilder] append scroll top button failed', err2) }
      }
      try {
        btn.style.position = 'absolute'
        btn.style.right = '1rem'
        btn.style.bottom = '1.25rem'
        btn.style.zIndex = '60'
      } catch (err) { console.warn('[htmlBuilder] set scroll-top button styles failed', err) }
      btn.addEventListener('click', () => {
        try {
          if (container && container.scrollTo) container.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
          else if (mountEl && mountEl.scrollTo) mountEl.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
          else window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        } catch (err) {
          try { if (container) container.scrollTop = 0 } catch (e2) { console.warn('[htmlBuilder] fallback container scrollTop failed', e2) }
          try { if (mountEl) mountEl.scrollTop = 0 } catch (e3) { console.warn('[htmlBuilder] fallback mountEl scrollTop failed', e3) }
          try { document.documentElement.scrollTop = 0 } catch (e4) { console.warn('[htmlBuilder] fallback document scrollTop failed', e4) }
        }
      })
    }

    const tocLabel = (navWrapEl && navWrapEl.querySelector) ? navWrapEl.querySelector('.menu-label') : null
    if (!topH1) {
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
        } catch (err) { console.warn('[htmlBuilder] onScroll handler failed', err) }
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
        btn._nimbiObserver = obs
      }
      try { btn._nimbiObserver.disconnect() } catch (err) { console.warn('[htmlBuilder] observer disconnect failed', err) }
      try { btn._nimbiObserver.observe(topH1) } catch (err) { console.warn('[htmlBuilder] observer observe failed', err) }
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
          } catch (err) { console.warn('[htmlBuilder] checkIntersect failed', err) }
        }
        checkIntersect()
        if (!('IntersectionObserver' in window)) {
          setTimeout(checkIntersect, 100)
        }
      } catch (err) { console.warn('[htmlBuilder] checkIntersect outer failed', err) }
    }
  } catch (err) { console.warn('[htmlBuilder] ensureScrollTopButton failed', err) }
}