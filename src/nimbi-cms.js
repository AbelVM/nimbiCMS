import hljs from 'highlight.js/lib/core'
import 'highlight.js/styles/monokai.css'
import 'bulma/css/bulma.min.css'
import './styles/nimbi-cms-extra.css'
import readingTime from 'reading-time/lib/reading-time'
import { DEFAULT_L10N } from './utils/l10n-defaults.js'
import { marked } from 'marked'
import { slugToMd, mdToSlug, slugify, fetchMarkdown } from './filesManager.js'
import { createNavTree, buildTocElement } from './htmlBuilder.js'
import { setMetaTags, setStructuredData } from './seoManager.js'
import { parseMarkdownToHtml, detectFenceLanguages } from './markdown.js'
import { fetchPageData } from './router.js'

const DEFAULT_HLJS_SUPPORTED_URL = 'https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md'
const SUPPORTED_HLJS_MAP = new Map()
// alias shortcuts used when translating a fence language or registration name
// into the highlight.js module name.  Keep this in sync with any logic that
// constructs `candidates` in `registerLanguage`.
const HLJS_ALIAS_MAP = {
  shell: 'bash', sh: 'bash', zsh: 'bash',
  js: 'javascript', ts: 'typescript', py: 'python',
  csharp: 'cs', 'c#': 'cs'
}


let loadSupportedLanguagesPromise = null

async function loadSupportedLanguages(url = DEFAULT_HLJS_SUPPORTED_URL) {
  if (!url) return
  if (loadSupportedLanguagesPromise) return loadSupportedLanguagesPromise
  loadSupportedLanguagesPromise = (async () => {
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
  })()
  return loadSupportedLanguagesPromise
}
const registeredLangs = new Set()

export async function registerLanguage(name, modulePath) {
  if (!name) return false
  if (registeredLangs.has(name)) return true
  const aliasMap = HLJS_ALIAS_MAP
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

// IntersectionObserver-based lazy highlighter for code blocks
let __hlObserver = null
function observeCodeBlocks(root = document) {
  const aliasMapLocal = HLJS_ALIAS_MAP
  const ensureObserver = () => {
    if (__hlObserver) return __hlObserver
    if (typeof IntersectionObserver === 'undefined') return null
    __hlObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const el = entry.target
        try { obs.unobserve(el) } catch (e) { }
        ;(async () => {
          try {
            const cls = (el.getAttribute && el.getAttribute('class')) || el.className || ''
            const match = cls.match(/language-([a-zA-Z0-9_+-]+)/) || cls.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/)
            if (match && match[1]) {
              const l = (match[1] || '').toLowerCase()
              const mapped = aliasMapLocal[l] || l
              const canonical = (SUPPORTED_HLJS_MAP.size && (SUPPORTED_HLJS_MAP.get(mapped) || SUPPORTED_HLJS_MAP.get(String(mapped).toLowerCase()))) || mapped
              try { await registerLanguage(canonical).catch(() => {}) } catch (e) { }
              try { hljs.highlightElement(el) } catch (e) { }
            } else {
              try { hljs.highlightElement(el) } catch (e) { }
            }
          } catch (e) { }
        })()
      })
    }, { root: null, rootMargin: '300px', threshold: 0.1 })
    return __hlObserver
  }

  const obs = ensureObserver()
  const blocks = (root && root.querySelectorAll) ? root.querySelectorAll('pre code') : []
  if (!obs) {
    // no IntersectionObserver - highlight immediately (but register languages non-blocking)
    blocks.forEach(async (el) => {
      try {
        const cls = (el.getAttribute && el.getAttribute('class')) || el.className || ''
        const match = cls.match(/language-([a-zA-Z0-9_+-]+)/) || cls.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/)
        if (match && match[1]) {
          const l = (match[1] || '').toLowerCase()
          const mapped = aliasMapLocal[l] || l
          const canonical = (SUPPORTED_HLJS_MAP.size && (SUPPORTED_HLJS_MAP.get(mapped) || SUPPORTED_HLJS_MAP.get(String(mapped).toLowerCase()))) || mapped
          try { await registerLanguage(canonical).catch(() => {}) } catch (e) { }
        }
        try { hljs.highlightElement(el) } catch (e) { }
      } catch (e) { }
    })
    return
  }
  blocks.forEach(b => { try { obs.observe(b) } catch (e) { } })
}

// Pre-scan nav links for HTML files and map title/H1 -> slug to avoid nav-time fetches
async function preScanHtmlSlugs(linkEls, base) {
  if (!linkEls || !linkEls.length) return
  const outs = []
  for (const a of Array.from(linkEls || [])) {
    try {
      const href = a.getAttribute('href') || ''
      if (!href) continue
      const raw = href.replace(/^\.\//, '')
      const parts = raw.split(/::|#/, 2)
      const path = parts[0]
      if (!path || !/\.html(?:$|[?#])/.test(path) && !path.endsWith('.html')) continue
      const htmlPath = path
      try {
        if (mdToSlug && mdToSlug.has && mdToSlug.has(htmlPath)) continue
      } catch (e) { }
      // fetch HTML and extract title/h1
      outs.push((async () => {
        try {
          const res = await fetchMarkdown(htmlPath, base)
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

  // render an error page for unresolved queries
  function renderNotFound(e) {
    contentWrap.innerHTML = ''
    const notFound = document.createElement('article')
    notFound.className = 'nimbi-article content nimbi-not-found'
    const h = document.createElement('h1')
    h.textContent = t ? t('notFound') || 'Page not found' : 'Page not found'
    const p = document.createElement('p')
    p.textContent = e && e.message ? String(e.message) : 'Failed to resolve the requested page.'
    notFound.appendChild(h)
    notFound.appendChild(p)
    contentWrap.appendChild(notFound)
  }

  // convert raw data into a DOM article, compute TOC, slug and h1 info
  async function prepareArticle(data, pagePath, anchor) {
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

  function applyPageMeta(parsed, toc, article, pagePath, anchor, h1Text, slugKey, data) {
    try {
      const labelEl = toc.querySelector('.menu-label')
      if (labelEl) {
        labelEl.textContent = topH1 ? (topH1.textContent || t('onThisPage')) : t('onThisPage')
      }
    } catch (e) {}

    try {
      const metaTitle = parsed.meta && parsed.meta.title ? String(parsed.meta.title).trim() : ''
      const firstImgEl = article.querySelector('img')
      const firstImageUrl = firstImgEl ? (firstImgEl.getAttribute('src') || firstImgEl.src || null) : null
      let descOverride = ''
      try {
        let found = ''
        if (h1Text) {
          let sib = article.querySelector('h1')?.nextElementSibling
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
    } catch (e) { }

    try {
      const prev = article.querySelector('.nimbi-reading-time')
      if (prev) prev.remove()
      if (h1Text) {
        const rt = readingTime(data.raw || '')
        const minutes = rt && typeof rt.minutes === 'number' ? Math.ceil(rt.minutes) : 0
        const p = document.createElement('p')
        p.className = 'nimbi-reading-time'
        p.textContent = minutes ? t('readingTime', { minutes }) : ''
        const topH1Elem = article.querySelector('h1')
        if (topH1Elem) topH1Elem.insertAdjacentElement('afterend', p)
      }
    } catch (ee) { }
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
        renderNotFound(e)
        return
      }
      if (!anchor && hashAnchor) anchor = hashAnchor
      contentWrap.innerHTML = ''

      const { article, parsed, toc, topH1, h1Text, slugKey } = await prepareArticle(data, pagePath, anchor)

      applyPageMeta(parsed, toc, article, pagePath, anchor, h1Text, slugKey, data)

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

export default initCMS
