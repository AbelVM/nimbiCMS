import { parseFrontmatter } from './utils/frontmatter.js'
import { marked } from 'marked'
import hljs from 'highlight.js/lib/core'
import 'highlight.js/styles/monokai.css'
import 'bulma/css/bulma.min.css'
import './styles/nimbi-cms-extra.css'
import readingTime from 'reading-time/lib/reading-time'
import { DEFAULT_L10N } from './utils/l10n-defaults.js'
import { slugToMd, mdToSlug, slugify, fetchMarkdown } from './filesManager.js'
import { createNavTree, buildTocElement } from './htmlBuilder.js'
import { setMetaTags, setStructuredData } from './seoManager.js'

const DEFAULT_HLJS_SUPPORTED_URL = 'https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md'
const SUPPORTED_HLJS_MAP = new Map()

async function loadSupportedLanguages(url = DEFAULT_HLJS_SUPPORTED_URL) {
  if (!url) return
  try {
    const res = await fetch(url)
    if (!res.ok) return
    const txt = await res.text()
    const lines = txt.split(/\r?\n/)
    let headerIdx = -1
    for (let i = 0; i < lines.length; i++) {
      if (/\|\s*Language\s*\|/i.test(lines[i])) { headerIdx = i; break }
    }
    if (headerIdx === -1) return
    const headerCols = lines[headerIdx].replace(/^\||\|$/g, '').split('|').map(c => c.trim().toLowerCase())
    let aliasesIdx = headerCols.findIndex(h => /alias|aliases|equivalent|alt|alternates?/i.test(h))
    if (aliasesIdx === -1) aliasesIdx = 1 // fallback to second column
    let canonicalIdx = headerCols.findIndex(h => /file|filename|module|module name|module-name|short|slug/i.test(h))
    if (canonicalIdx === -1) {
      const langCol = headerCols.findIndex(h => /language/i.test(h))
      canonicalIdx = (langCol !== -1) ? langCol : 0
    }
    let aliasesList = []
    for (let i = headerIdx + 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line || !line.startsWith('|')) break
      const colsCheck = line.replace(/^\||\|$/g, '').split('|').map(c => c.trim())
      if (colsCheck.every(c => /^-+$/.test(c))) continue
      const cols = colsCheck
      if (!cols.length) continue
      const canonicalRaw = (cols[canonicalIdx] || cols[0] || '').toString().trim()
      const langName = canonicalRaw.toLowerCase()
      if (!langName || /^-+$/.test(langName)) continue
      SUPPORTED_HLJS_MAP.set(langName, langName)
      const aliasesCol = cols[aliasesIdx] || ''
      if (aliasesCol) {
        const parts = String(aliasesCol).split(',').map(a => a.replace(/`/g, '').trim()).filter(Boolean)
        if (parts.length) {
          const rawPrimary = parts[0].toLowerCase()
          const primaryNorm = rawPrimary.replace(/^[:]+/, '').replace(/[^a-z0-9_-]+/ig, '')
          if (primaryNorm && /[a-z0-9]/i.test(primaryNorm)) {
            SUPPORTED_HLJS_MAP.set(primaryNorm, primaryNorm)
            aliasesList.push(primaryNorm)
          }
        }
      }
    }
    try {
      const cleaned = []
      for (const a of aliasesList) {
        const norm = String(a || '').replace(/^[:]+/, '').replace(/[^a-z0-9_-]+/ig, '')
        if (norm && /[a-z0-9]/i.test(norm)) cleaned.push(norm)
        else SUPPORTED_HLJS_MAP.delete(a)
      }
      aliasesList = cleaned
    } catch (e) { }
    try {
      let removed = 0
      for (const k of Array.from(SUPPORTED_HLJS_MAP.keys())) {
        if (!k || /^-+$/.test(k) || !/[a-z0-9]/i.test(k)) {
          SUPPORTED_HLJS_MAP.delete(k)
          removed++
          continue
        }
        if (/^[:]+/.test(k)) {
          const nk = k.replace(/^[:]+/, '')
          if (nk && /[a-z0-9]/i.test(nk)) {
            const v = SUPPORTED_HLJS_MAP.get(k)
            SUPPORTED_HLJS_MAP.delete(k)
            SUPPORTED_HLJS_MAP.set(nk, v)
          } else {
            SUPPORTED_HLJS_MAP.delete(k)
            removed++
          }
        }
      }
      for (const [k, v] of Array.from(SUPPORTED_HLJS_MAP.entries())) {
        if (!v || /^-+$/.test(v) || !/[a-z0-9]/i.test(v)) {
          SUPPORTED_HLJS_MAP.delete(k)
          removed++
        }
      }
      try {
        const sepKey = ':---------------------'
        if (SUPPORTED_HLJS_MAP.has(sepKey)) { SUPPORTED_HLJS_MAP.delete(sepKey); removed++ }
      } catch (e) { }

    } catch (e) { }
  } catch (e) {
  }
}
const registeredLangs = new Set()

export async function registerLanguage(name, modulePath) {
  if (!name) return false
  if (registeredLangs.has(name)) return true
  const aliasMap = { shell: 'bash', sh: 'bash', zsh: 'bash', js: 'javascript', ts: 'typescript', py: 'python', csharp: 'cs', 'c#': 'cs' }
  try {
    const base = (modulePath || name || '').toString().replace(/\.js$/i, '').trim()
    const primary = aliasMap[base] || aliasMap[name] || base || name
    const candidates = Array.from(new Set([primary, base, name].filter(Boolean))).map(c => String(c).toLowerCase())
    let mod = null
    let lastErr = null
    for (const candidate of candidates) {
      try {
        try {
          mod = await import(/* @vite-ignore */ `highlight.js/lib/languages/${candidate}.js`)
        } catch (localErr) {
          try {
            const esmUrl = `https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/es/languages/${candidate}.js`
            mod = await import(/* @vite-ignore */ esmUrl)
          } catch (esmErr) {
            const moduleUrl = `https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/lib/languages/${candidate}.js`
            mod = await import(/* @vite-ignore */ moduleUrl)
          }
        }
        if (mod) {
          const langDef = mod.default || mod
          try {
            const registerName = (SUPPORTED_HLJS_MAP.size && SUPPORTED_HLJS_MAP.get(name)) || candidate || name
            hljs.registerLanguage(registerName, langDef)
            registeredLangs.add(registerName)
            if (registerName !== name) { hljs.registerLanguage(name, langDef); registeredLangs.add(name) }
            return true
          } catch (e) {
            lastErr = e
          }
        }
      } catch (e) {
        lastErr = e
      }
    }
    if (lastErr) throw lastErr
    return false
  } catch (e) {
    return false
  }
}

let currentStyle = 'light'
let currentHighlightTheme = 'monokai'
let initialDocumentTitle = ''
function getSiteNameFromMeta() {
  try {
    const candidates = [
      'meta[name="site"]',
      'meta[name="site-name"]',
      'meta[name="siteName"]',
      'meta[property="og:site_name"]',
      'meta[name="twitter:site"]'
    ]
    for (const sel of candidates) {
      const m = document.querySelector(sel)
      if (m) {
        const c = m.getAttribute('content') || ''
        if (c && c.trim()) return c.trim()
      }
    }
  } catch (e) {
  }
  return ''
}

const L10N = JSON.parse(JSON.stringify(DEFAULT_L10N))

let detectedLang = 'en'
if (typeof navigator !== 'undefined') {
  const navLang = navigator.language || (navigator.languages && navigator.languages[0]) || 'en'
  detectedLang = String(navLang).split('-')[0].toLowerCase()
}
if (!DEFAULT_L10N[detectedLang]) detectedLang = 'en'
let currentLang = detectedLang

function t(key, replacements = {}) {
  const dict = L10N[currentLang] || L10N.en
  let s = dict && dict[key] ? dict[key] : (L10N.en[key] || '')
  for (const k of Object.keys(replacements)) {
    s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(replacements[k]))
  }
  return s
}

async function loadL10nFile(path, pageDir) {
  if (!path) return
  let resolved = path
  try {
    if (!/^https?:\/\//.test(path)) {
      resolved = new URL(path, location.origin + pageDir).toString()
    }
    const res = await fetch(resolved)
    if (!res.ok) return
    const json = await res.json()
    for (const lang of Object.keys(json || {})) {
      L10N[lang] = Object.assign({}, L10N[lang] || {}, json[lang])
    }
  } catch (e) {
  }
}

export function setHighlightTheme(theme, { useCdn = true } = {}) {
  const existing = document.querySelector('link[data-hl-theme]')
  if (existing) existing.remove()

  currentHighlightTheme = theme || 'monokai'
  if (currentHighlightTheme === 'monokai') {
    return
  }
  if (!useCdn) {
    console.warn('Requested highlight theme not bundled; set useCdn=true to load from CDN')
    return
  }
  const href = `https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/styles/${currentHighlightTheme}.css`
  const l = document.createElement('link')
  l.rel = 'stylesheet'
  l.href = href
  l.setAttribute('data-hl-theme', currentHighlightTheme)
  document.head.appendChild(l)
}

function injectLink(href, attrs = {}) {
  if (document.querySelector(`link[href="${href}"]`)) return
  const l = document.createElement('link')
  l.rel = 'stylesheet'
  l.href = href
  Object.entries(attrs).forEach(([k, v]) => l.setAttribute(k, v))
  document.head.appendChild(l)
}

export async function ensureBulma(bulmaCustomize = 'none', pageDir = '/') {
  if (!bulmaCustomize || bulmaCustomize === 'none') return

  const rawLocalCandidates = [pageDir + 'bulma.css', '/bulma.css']
  const localCandidates = Array.from(new Set(rawLocalCandidates))

  if (bulmaCustomize === 'local') {
    if (document.querySelector('style[data-bulma-override]')) return
    for (const p of localCandidates) {
      try {
        const res = await fetch(p, { method: 'GET' })
        if (res.ok) {
          const css = await res.text()
          const s = document.createElement('style')
          s.setAttribute('data-bulma-override', p)
          s.appendChild(document.createTextNode(`\n/* bulma override: ${p} */\n` + css))
          document.head.appendChild(s)
          return
        }
      } catch (e) {
      }
    }
    return
  }

  try {
    const theme = String(bulmaCustomize).trim()
    if (!theme) return
    const href = `https://unpkg.com/bulmaswatch/${encodeURIComponent(theme)}/bulmaswatch.min.css`
    injectLink(href, { 'data-bulmaswatch-theme': theme })
  } catch (e) {
  }
}

export function setStyle(style) {
  currentStyle = style === 'dark' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', currentStyle)
  if (currentStyle === 'dark') document.body.classList.add('is-dark')
  else document.body.classList.remove('is-dark')
}

async function parseMarkdownToHtml(md) {
  const { content, data } = parseFrontmatter(md || '')
  marked.setOptions({
    gfm: true,
    mangle: false,
    headerIds: false,
    headerPrefix: ''
  })
  let html = marked.parse(content)

  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const heads = doc.querySelectorAll('h1,h2,h3,h4,h5,h6')
    heads.forEach(h => {
      if (!h.id) h.id = slugify(h.textContent || '')
    })
    const codes = doc.querySelectorAll('pre code')
    codes.forEach(codeEl => {
      try {
        hljs.highlightElement(codeEl)
      } catch (e) {
      }
    })
    html = doc.body.innerHTML
    const docToc = []
    heads.forEach(h => {
      docToc.push({ level: Number(h.tagName.substring(1)), text: (h.textContent || '').trim(), id: h.id })
    })
    return { html: doc.body.innerHTML, meta: data || {}, toc: docToc }
  } catch (e) {
    console.warn('post-process markdown failed', e)
  }

  return { html, meta: data || {}, toc }
}

function extractToc(md) {
  const lines = md.split('\n')
  const toc = []
  for (const line of lines) {
    const m = line.match(/^(#{1,6})\s+(.*)$/)
    if (m) toc.push({ level: m[1].length, text: m[2].trim() })
  }
  return toc
}

function detectFenceLanguages(md) {
  const set = new Set()
  const re = /```\s*([a-zA-Z0-9_\-+]+)?/g
  const STOP = new Set([
    'then', 'now', 'if', 'once', 'so', 'and', 'or', 'but', 'when', 'the', 'a', 'an', 'as',
    'let', 'const', 'var', 'export', 'import', 'from', 'true', 'false', 'null', 'npm',
    'run', 'echo', 'sudo', 'this', 'that', 'have', 'using', 'some', 'return', 'returns',
    'function', 'console', 'log', 'error', 'warn', 'class', 'new', 'undefined',
    // common English / SQL tokens that are frequently present after ``` and are not languages
    'with', 'select', 'from', 'where', 'join', 'on', 'group', 'order', 'by', 'having', 'as', 'into', 'values',
    'like', 'limit', 'offset', 'create', 'table', 'index', 'view', 'insert', 'update', 'delete', 'returning',
    'and', 'or', 'not', 'all', 'any', 'exists', 'case', 'when', 'then', 'else', 'end', 'distance', 'geometry',
    // conversational words that have appeared in logs
    'you', 'which', 'would', 'why', 'cool', 'other', 'same', 'everything', 'check'
  ])
  const FALLBACK_KNOWN = new Set(['bash', 'sh', 'zsh', 'javascript', 'js', 'python', 'py', 'php', 'java', 'c', 'cpp', 'rust', 'go', 'ruby', 'perl', 'r', 'scala', 'swift', 'kotlin', 'cs', 'csharp', 'html', 'css', 'json', 'xml', 'yaml', 'yml', 'dockerfile', 'docker'])
  let m
  while ((m = re.exec(md))) {
    if (m[1]) {
      const name = m[1].toLowerCase()
      if (name.length < 3 && !SUPPORTED_HLJS_MAP.has(name)) continue
      if (SUPPORTED_HLJS_MAP.size) {
        if (SUPPORTED_HLJS_MAP.has(name)) {
          const canonical = SUPPORTED_HLJS_MAP.get(name)
          if (canonical) set.add(canonical)
          continue
        }
      }
      const isKnown = FALLBACK_KNOWN.has(name)
      // Accept known fallbacks or supported map entries. For unknown tokens, require a slightly
      // stricter minimum length and not be a common SQL/English stop token to avoid noisy CDN
      // requests for non-language words that often appear after the fence ticks.
      if (isKnown) set.add(name)
      else if (
        name.length >= 5 && name.length <= 30 &&
        /^[a-z][a-z0-9_\-+]*$/.test(name) &&
        !STOP.has(name)
      ) set.add(name)
    }
  }
  return set
}

// nav builder moved to src/htmlBuilder.js


// fetchMarkdown moved to src/filesManager.js

export async function initCMS({ el, contentPath = '/content', languages = [], defaultStyle = 'light', bulmaCustomize = 'none', lang = undefined, l10nFile = null } = {}) {
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
  if (lang) {
    const short = String(lang).split('-')[0].toLowerCase()
    currentLang = L10N[short] ? short : 'en'
  }
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
    await loadSupportedLanguages()
  } catch (e) {
  }

  const siteNav = createNavTree(t, [{ path: '_home.md', name: t('home'), isIndex: true, children: [] }])
  let currentPagePath = null

  async function renderByQuery() {
    const raw = (new URLSearchParams(location.search).get('page')) || '_home.md'
    const hashAnchor = location.hash ? decodeURIComponent(location.hash.replace(/^#/, '')) : null
    let resolved = raw
    let anchor = null

    // support legacy '::' anchor syntax in the page param
    if (resolved && String(resolved).includes('::')) {
      const parts = String(resolved).split('::', 2)
      resolved = parts[0]
      anchor = parts[1] || null
    }

    if (!String(resolved).includes('.md') && !String(resolved).includes('.html')) {
      try {
        const decoded = decodeURIComponent(String(resolved || ''))
        if (slugToMd.has(decoded)) resolved = slugToMd.get(decoded)
        else {
          // fallback 1: try to find a nav link whose slugified text matches the decoded slug
          try {
            const nodes = document.querySelectorAll('.nimbi-site-navbar a, .navbar a, .nimbi-nav a')
            for (const n of Array.from(nodes || [])) {
              try {
                const txt = (n.textContent || '').trim()
                if (!txt) continue
                if (slugify(txt) === decoded) {
                  const href = n.getAttribute('href') || ''
                  try {
                    const u = new URL(href, location.href)
                    const p = u.searchParams.get('page')
                    if (p) { resolved = decodeURIComponent(p); break }
                  } catch (e) { /* ignore */ }
                }
              } catch (ee) { }
            }
          } catch (ee) { }

          // fallback 2: fetch each nav-linked md and check its H1 for a slug match
          try {
            const tried = new Set()
            const anchors = document.querySelectorAll('.nimbi-site-navbar a, .navbar a, .nimbi-nav a')
            for (const n of Array.from(anchors || [])) {
              try {
                const href = n.getAttribute('href') || ''
                const u = new URL(href, location.href)
                let mdCandidate = null
                // prefer explicit ?page= param when present
                const p = u.searchParams.get('page')
                if (p) mdCandidate = decodeURIComponent(p)
                // otherwise check for markdown filename in the hash (e.g. #projects.md)
                if (!mdCandidate && u.hash) {
                  const h = u.hash.replace(/^#/, '')
                  if (/\.md$/.test(h)) mdCandidate = h
                }
                // otherwise check if the path itself references a .md file
                if (!mdCandidate && u.pathname) {
                  const m = (u.pathname || '').match(/([^\/]+\.md)(?:$|[?#])/) 
                  if (m) mdCandidate = m[1]
                }
                if (!mdCandidate) continue
                if (tried.has(mdCandidate)) continue
                tried.add(mdCandidate)
                try {
                  // ensure we fetch a markdown path: prefer existing slug->md mapping
                  // Do NOT blindly append '.md' to a bare slug (this causes noisy 404s).
                  // Instead try known mappings, then underscore-prefixed and index fallbacks.
                  let md = null
                  let fetchPath = mdCandidate
                  try {
                    if (String(fetchPath).includes('.md')) {
                      try { md = await fetchMarkdown(fetchPath, contentBase) } catch (e) { md = null }
                    } else {
                      const tryList = []
                      try { if (slugToMd.has(fetchPath)) tryList.push(slugToMd.get(fetchPath)) } catch (e) { }
                      const underscore = '_' + String(fetchPath) + '.md'
                      const indexPath = String(fetchPath) + '/index.md'
                      try { if (mdToSlug.has(underscore)) tryList.push(underscore) } catch (e) { }
                      try { if (mdToSlug.has(indexPath)) tryList.push(indexPath) } catch (e) { }
                      for (const fp of tryList) {
                        if (!fp) continue
                        try {
                          md = await fetchMarkdown(fp, contentBase)
                          fetchPath = fp
                          break
                        } catch (e) {
                          md = null
                        }
                      }
                    }
                    if (!md) { /* no file found for this nav-linked candidate; skip */ continue }
                    const m = (md.raw || '').match(/^#\s+(.+)$/m)
                    if (m) {
                      const h1 = (m[1] || '').trim()
                      if (h1 && slugify(h1) === decoded) { resolved = fetchPath; break }
                    }
                  } catch (e) { /* ignore fetch errors */ }
                } catch (e) { }
              } catch (ee) { }
            }
          } catch (ee) { }
        }
        // fallback 3: dynamically discover index/list pages from nav and known maps
        // (avoid hardcoded filenames like 'blog.md' or 'projects.md')
        try {
          const indexSet = new Set()
          try {
            const anchorsForIndex = document.querySelectorAll('.nimbi-site-navbar a, .navbar a, .nimbi-nav a')
            for (const linkEl of Array.from(anchorsForIndex || [])) {
              try {
                const href = linkEl.getAttribute('href') || ''
                if (!href) continue
                try {
                  const u = new URL(href, location.href)
                  // collect explicit md references
                  const mdMatch = (u.hash || u.pathname).match(/([^#?]+\.md)(?:$|[?#])/) || (u.pathname || '').match(/([^#?]+\.md)(?:$|[?#])/)
                  if (mdMatch) {
                    let candidate = mdMatch[1].replace(/^\.\//, '')
                    if (candidate.startsWith('/')) candidate = candidate.replace(/^\//, '')
                    if (candidate) indexSet.add(candidate)
                    continue
                  }
                  // if the link points to a directory-like path, try its index.md
                  const p = u.pathname || ''
                  if (p) {
                    const contentBaseUrl = new URL(contentBase)
                    const contentBasePath = contentBaseUrl.pathname.endsWith('/') ? contentBaseUrl.pathname : contentBaseUrl.pathname + '/'
                    if (p.indexOf(contentBasePath) !== -1) {
                      let rel = p.startsWith(contentBasePath) ? p.slice(contentBasePath.length) : p.replace(/^\//, '')
                      rel = rel.replace(/^[\.\/]+/, '')
                      if (rel && !rel.includes('.')) {
                        indexSet.add(rel + '/index.md')
                        indexSet.add(rel + '.md')
                      }
                    }
                  }
                } catch (e) { }
              } catch (e) { }
            }
          } catch (e) { }

          // include any known md paths from slug/md maps
          try { for (const v of Array.from(slugToMd.values())) { if (v) indexSet.add(v) } } catch (e) { }
          try { for (const v of Array.from(mdToSlug.keys())) { if (v) indexSet.add(v) } } catch (e) { }

          for (const candidate of Array.from(indexSet)) {
            try {
              if (!candidate || !String(candidate).includes('.md')) continue
              const idxMd = await fetchMarkdown(candidate, contentBase)
              if (!idxMd || !idxMd.raw) continue
              const parsedIdx = await parseMarkdownToHtml(idxMd.raw || '')
              const parser = new DOMParser()
              const tmpDoc = parser.parseFromString(parsedIdx.html || '', 'text/html')
              const links = tmpDoc.querySelectorAll('a')
              const triedIdx = new Set()
              for (const linkEl of Array.from(links || [])) {
                try {
                  const href = linkEl.getAttribute('href') || ''
                  const mdMatch = href.match(/([^#?]+\.md)(?:$|[?#])/) 
                  if (!mdMatch) continue
                  let candidateInner = mdMatch[1].replace(/^\.\//, '')
                  if (candidateInner.startsWith('/')) candidateInner = candidateInner.replace(/^\//, '')
                  if (triedIdx.has(candidateInner)) continue
                  triedIdx.add(candidateInner)
                  if (!String(candidateInner).includes('.md')) candidateInner = candidateInner + '.md'
                  try {
                    const md = await fetchMarkdown(candidateInner, contentBase)
                    const m = (md.raw || '').match(/^#\s+(.+)$/m)
                    if (m) {
                      const h1 = (m[1] || '').trim()
                      if (h1 && slugify(h1) === decoded) { resolved = candidateInner; break }
                    }
                  } catch (e) { /* ignore per-file fetch errors */ }
                } catch (e) { }
              }
              if (String(resolved || '').includes('.md')) break
            } catch (e) { }
          }
        } catch (e) { }
      } catch (e) { }
    }

    if (!anchor && hashAnchor) anchor = hashAnchor

    // try multiple candidate paths so slugs resolve even on direct visits
    const pageCandidates = []
    if (String(resolved).includes('.md') || String(resolved).includes('.html')) {
      pageCandidates.push(resolved)
    } else {
      try {
        const dec = decodeURIComponent(String(resolved || ''))
        if (slugToMd.has(dec)) {
          pageCandidates.push(slugToMd.get(dec))
        } else {
          // Only try underscore/index fallbacks if we have prior knowledge
          // (mdToSlug contains known markdown paths or slugToMd has an entry).
          const underscore = '_' + dec + '.md'
          const indexPath = dec + '/index.md'
          try { if (mdToSlug.has(underscore)) pageCandidates.push(underscore) } catch (e) { }
          try { if (mdToSlug.has(indexPath)) pageCandidates.push(indexPath) } catch (e) { }
        }
      } catch (e) { }
    }

    let data = null
    let pagePath = null
    let lastErr = null
    for (const candidate of pageCandidates) {
      if (!candidate) continue
      try {
        const norm = String(candidate).replace(/^[\.\/]+/, '')
        // debug logging removed to avoid noisy console output in browsers
        data = await fetchMarkdown(norm, contentBase)
        pagePath = norm
        break
      } catch (e) {
        lastErr = e
        continue
      }
    }
    if (!data) {
      // rethrow the last error to surface 404 or network failures
      throw lastErr || new Error('failed to resolve page')
    }
      contentWrap.innerHTML = ''

      let parsed = null
      if (data.isHtml) {
        // parse HTML directly and extract TOC + code block languages
        try {
          const parser = new DOMParser()
          const doc = parser.parseFromString(data.raw || '', 'text/html')
          const heads = doc.querySelectorAll('h1,h2,h3,h4,h5,h6')
          heads.forEach(h => { if (!h.id) h.id = slugify(h.textContent || '') })

          // collect languages from code block class names (e.g. language-js)
          const codes = doc.querySelectorAll('pre code, code[class]')
          const langSet = new Set()
          codes.forEach(codeEl => {
            try {
              const cls = (codeEl.getAttribute && codeEl.getAttribute('class')) || codeEl.className || ''
              const match = cls.match(/language-([a-zA-Z0-9_+-]+)/) || cls.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/)
              if (match && match[1]) {
                langSet.add(match[1].toLowerCase())
              }
            } catch (e) { }
          })
          const aliasMapLocal = { js: 'javascript', ts: 'typescript', py: 'python', sh: 'bash', shell: 'bash', zsh: 'bash', csharp: 'cs', 'c#': 'cs' }
          for (const l of langSet) {
            try {
              const mapped = aliasMapLocal[l] || l
              const canonical = (SUPPORTED_HLJS_MAP.size && (SUPPORTED_HLJS_MAP.get(mapped) || SUPPORTED_HLJS_MAP.get(String(mapped).toLowerCase()))) || mapped
              if (!registeredLangs.has(canonical)) await registerLanguage(canonical)
              if (String(mapped) !== String(canonical) && !registeredLangs.has(mapped)) await registerLanguage(mapped)
            } catch (e) { }
          }

          // now run highlighting on code blocks
          try {
            const codesToHighlight = doc.querySelectorAll('pre code')
            codesToHighlight.forEach(codeEl => { try { hljs.highlightElement(codeEl) } catch (e) { } })
          } catch (e) { }

          const docToc = []
          heads.forEach(h => { docToc.push({ level: Number(h.tagName.substring(1)), text: (h.textContent || '').trim(), id: h.id }) })
          parsed = { html: doc.body.innerHTML, meta: {}, toc: docToc }
        } catch (e) {
          parsed = { html: data.raw || '', meta: {}, toc: [] }
        }
      } else {
        const langs = detectFenceLanguages(data.raw || '')
        for (const l of langs) {
          try {
            const canonical = (SUPPORTED_HLJS_MAP.size && (SUPPORTED_HLJS_MAP.get(l) || SUPPORTED_HLJS_MAP.get(String(l).toLowerCase()))) || l
            if (!registeredLangs.has(canonical)) {
              await registerLanguage(canonical)
            }
            if (String(l) !== String(canonical) && !registeredLangs.has(l)) {
              await registerLanguage(l)
            }
          } catch (e) {
          }
        }

        parsed = await parseMarkdownToHtml(data.raw || '')
      }
      const article = document.createElement('article')
      article.className = 'nimbi-article content'
      article.innerHTML = parsed.html

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
            } catch (e) {
            }
          })
        }
      } catch (e) {
      }

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
                  // resolve to a path relative to contentBase
                  const resolved = new URL(mdPathRaw, contentBase).pathname
                  const rel = resolved.startsWith(contentBasePath) ? resolved.slice(contentBasePath.length) : resolved.replace(/^\//, '')

                  // prefer an existing slug mapping
                  let slug = null
                  try { if (mdToSlug.has(rel)) slug = mdToSlug.get(rel) } catch (e) { }

                  // if no mapping, attempt to fetch the target markdown and derive H1
                  if (!slug) {
                    try {
                      const mdData = await fetchMarkdown(rel, contentBase)
                      const m = (mdData.raw || '').match(/^#\s+(.+)$/m)
                      if (m) {
                        const h1 = (m[1] || '').trim()
                        if (h1) {
                          slug = slugify(h1)
                          try { slugToMd.set(slug, rel); mdToSlug.set(rel, slug) } catch (e) { }
                        }
                      }
                    } catch (e) {
                      // failed to fetch target md; fall back to raw rel
                      slug = null
                    }
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

              // handle links that point into the content base but omit the `.md` extension
              try {
                const full = new URL(href, contentBase)
                const p = full.pathname || ''
                if (p && p.indexOf(contentBasePath) !== -1) {
                  let rel = p.startsWith(contentBasePath) ? p.slice(contentBasePath.length) : p.replace(/^\//, '')
                  rel = rel.replace(/^[\.\/]+/, '')
                  if (rel.endsWith('/')) rel = rel.slice(0, -1)
                  if (!rel) rel = '_home'
                  // if it's not already a markdown path, try to map slug -> md or assume .md
                  if (!rel.endsWith('.md')) {
                    if (slugToMd.has(rel)) {
                      const mapped = slugToMd.get(rel)
                      const slug = mdToSlug.get(mapped) || rel
                      a.setAttribute('href', `?page=${encodeURIComponent(slug)}`)
                    } else {
                      // assume this is a slug-like path; prefer slug form to avoid .md fetches
                      a.setAttribute('href', `?page=${encodeURIComponent(rel)}`)
                    }
                  }
                }
              } catch (e) {
              }
            } catch (e) {
            }
          }
        }
      } catch (e) {
      }

      // compute H1 and slug mapping before building the TOC so TOC can use the friendly slug
      const topH1 = article.querySelector('h1')
      const h1Text = topH1 ? (topH1.textContent || '').trim() : ''
      // compute slug from H1 (fall back to a safe slug from pagePath)
      let slugKey = ''
      try {
        if (h1Text) slugKey = slugify(h1Text)
        // prefer HTML/meta title for slug when available
        if (!slugKey && parsed && parsed.meta && parsed.meta.title) slugKey = slugify(parsed.meta.title)
        if (!slugKey && pagePath) slugKey = slugify(String(pagePath))
        if (!slugKey) slugKey = '_home'
        try { if (pagePath) { slugToMd.set(slugKey, pagePath); mdToSlug.set(pagePath, slugKey) } } catch (e) { }
        try { history.replaceState({ page: slugKey }, '', '?page=' + encodeURIComponent(slugKey)) } catch (e) { }
      } catch (e) { }

      const toc = buildTocElement(t, parsed.toc, pagePath)
      try {
        const labelEl = toc.querySelector('.menu-label')
        if (labelEl) {
          labelEl.textContent = topH1 ? (topH1.textContent || t('onThisPage')) : t('onThisPage')
        }
        try {
          const metaTitle = parsed.meta && parsed.meta.title ? String(parsed.meta.title).trim() : ''
          // find first image in the rendered article (if any) to use for social preview
          const firstImgEl = article.querySelector('img')
          const firstImageUrl = firstImgEl ? (firstImgEl.getAttribute('src') || firstImgEl.src || null) : null
          // pick first paragraph between H1 and first H2 (if present) to use as description
          let descOverride = ''
          try {
            let found = ''
            if (topH1) {
              let sib = topH1.nextElementSibling
              while (sib && !(sib.tagName && sib.tagName.toLowerCase() === 'h2')) {
                if (sib.tagName && sib.tagName.toLowerCase() === 'p') {
                  const txt = (sib.textContent || '').trim()
                  if (txt) { found = txt; break }
                }
                sib = sib.nextElementSibling
              }
            }
            if (!found) {
              const existingDescTag = document.querySelector('meta[name="description"]')
              found = existingDescTag && existingDescTag.getAttribute ? (existingDescTag.getAttribute('content') || '') : ''
            }
            descOverride = found
          } catch (e) { }

          // update Open Graph / Twitter metadata preferring meta.title, then H1, and prefer the first page image when available
          try { setMetaTags(parsed, h1Text, firstImageUrl, descOverride) } catch (e) { }
          try { setStructuredData(parsed, slugKey, h1Text, firstImageUrl, descOverride) } catch (e) { }
          const siteName = getSiteNameFromMeta()
          if (h1Text) {
            if (siteName) document.title = `${siteName} - ${h1Text}`
            else document.title = `${initialDocumentTitle || 'Site'} - ${h1Text}`
          } else if (metaTitle) {
            document.title = metaTitle
          } else {
            document.title = initialDocumentTitle || document.title
          }
        } catch (e) {
        }
        try {
          const prev = article.querySelector('.nimbi-reading-time')
          if (prev) prev.remove()
          if (topH1) {
            const rt = readingTime(data.raw || '')
            const minutes = rt && typeof rt.minutes === 'number' ? Math.ceil(rt.minutes) : 0
            const p = document.createElement('p')
            p.className = 'nimbi-reading-time'
            p.textContent = minutes ? t('readingTime', { minutes }) : ''
            topH1.insertAdjacentElement('afterend', p)
          }
        } catch (ee) {
        }
      } catch (e) {
      }
      navWrap.innerHTML = ''
      navWrap.appendChild(toc)
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

      contentWrap.appendChild(article)
      if (anchor) {
        const el = document.getElementById(anchor)
        if (el) {
          try {
            if (container && container.scrollTo) container.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
            else el.scrollIntoView()
          } catch (e) { try { el.scrollIntoView() } catch (ee) { } }
        }
      } else {
        try {
          if (container && container.scrollTo) container.scrollTo({ top: 0, behavior: 'smooth' })
          else window.scrollTo(0, 0)
        } catch (e) { window.scrollTo(0, 0) }
      }
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

        const topH1 = article.querySelector('h1')
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
            try {
              if (btn._nimbiMutation) {
                try { btn._nimbiMutation.disconnect() } catch (e) { }
                btn._nimbiMutation = null
              }
              if (typeof MutationObserver !== 'undefined') {
                const mo = new MutationObserver(() => {
                  try {
                    if (!tocLabel) return
                    if (btn.classList.contains('show')) tocLabel.classList.add('show')
                    else tocLabel.classList.remove('show')
                  } catch (e) { }
                })
                mo.observe(btn, { attributes: true, attributeFilter: ['class'] })
                btn._nimbiMutation = mo
              }
            } catch (e) { }
          } catch (e) { }
        }
      } catch (e) {
      }
      currentPagePath = pagePath
      return
    }

  

  window.addEventListener('popstate', renderByQuery)
  await renderByQuery()
}

// TOC builder moved to src/htmlBuilder.js

// slugify moved to src/filesManager.js

// SEO helpers moved to src/seoManager.js

export default initCMS
