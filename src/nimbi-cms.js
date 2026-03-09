import { parseFrontmatter } from './utils/frontmatter.js'
import { marked } from 'marked'
import hljs from 'highlight.js/lib/core'
import 'highlight.js/styles/monokai.css'
import 'bulma/css/bulma.min.css'
import './styles/nimbi-cms-extra.css'
import readingTime from 'reading-time/lib/reading-time'
import { DEFAULT_L10N } from './utils/l10n-defaults.js'

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

  if (registeredLangs.has(name)) return true
  try {
    let mod
    const aliasMap = { shell: 'bash', sh: 'bash', zsh: 'bash' }
    let m = (modulePath || name || '').toString().replace(/\.js$/, '')
    if (!m) m = name
    if (aliasMap[m]) m = aliasMap[m]
    try {
      if (SUPPORTED_HLJS_MAP.size && SUPPORTED_HLJS_MAP.has(name)) {
        let canonical = SUPPORTED_HLJS_MAP.get(name)
        if (canonical) {
          try {
            const s = String(canonical)
            const jsMatches = Array.from(s.matchAll(/([a-z0-9_+-]+)(?=\.js)/ig)).map(m => m[1])
            if (jsMatches && jsMatches.length) canonical = jsMatches[0]
            else {
              const tokenMatch = s.match(/([a-z0-9_+-]+)/i)
              if (tokenMatch) canonical = tokenMatch[1]
            }
          } catch (e) { }
          if (canonical) m = String(canonical).toLowerCase()
        }
      }
    } catch (e) { }
    const tryCandidates = []
    try {
      let rawSource = String(modulePath || name || m || '')
      rawSource = rawSource.replace(/\.js$/i, '').trim()
      const raw = rawSource.toLowerCase()

      const add = (s) => { try { const v = String(s || '').trim(); if (v && !tryCandidates.includes(v)) tryCandidates.push(v) } catch (e) { } }

      const unsafe = /[^a-z0-9_-]/.test(raw)
      if (unsafe) {
        const tokens = raw.split(/[^a-z0-9]+/i).map(s => s.trim()).filter(Boolean)
        for (const t of tokens) {
          const tt = t.toLowerCase()
          add(tt)
          try {
            if (SUPPORTED_HLJS_MAP.size && SUPPORTED_HLJS_MAP.has(tt)) add(String(SUPPORTED_HLJS_MAP.get(tt)).toLowerCase())
          } catch (e) { }
        }
      } else {
        const aliasSanitized = raw.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        add(aliasSanitized || raw)
        const aliasUnderscore = raw.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
        add(aliasUnderscore)
        try {
          if (SUPPORTED_HLJS_MAP.size && SUPPORTED_HLJS_MAP.has(name)) {
            const canonical = SUPPORTED_HLJS_MAP.get(name)
            if (canonical) add(String(canonical).toLowerCase())
          }
        } catch (e) { }
      }

      try {
        const checkStr = (raw + ' ' + (SUPPORTED_HLJS_MAP.size && SUPPORTED_HLJS_MAP.has(name) ? SUPPORTED_HLJS_MAP.get(name) : '')).toLowerCase()
        if (/(pgsql|pl\/?pgsql|postgres)/.test(checkStr)) {
          add('pgsql')
          add('plpgsql')
          add('postgresql')
        }
      } catch (e) { }
    } catch (e) { }

    const finalCandidates = Array.from(new Set((tryCandidates || []).map(c => {
      try {
        return String(c || '')
          .toLowerCase()
          .replace(/[^a-z0-9_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
      } catch (e) { return '' }
    }).filter(Boolean)))

    let importErr = null
    for (const candidate of finalCandidates) {
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
        importErr = null
        break
      } catch (eCandidate) {
        importErr = eCandidate
      }
    }
    if (!mod && importErr) throw importErr
    const lang = mod && (mod.default || mod)
    if (lang) {
      let registerName = name
      try {
        if (SUPPORTED_HLJS_MAP.size && SUPPORTED_HLJS_MAP.has(name)) registerName = SUPPORTED_HLJS_MAP.get(name) || name
      } catch (e) { }
      try {
        hljs.registerLanguage(registerName, lang)
        registeredLangs.add(registerName)
      } catch (e) { }
      if (registerName !== name) {
        try { hljs.registerLanguage(name, lang); registeredLangs.add(name) } catch (e) { }
      }
      return true
    }
    throw new Error('language module did not export a valid definition')
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
  const STOP = new Set(['then', 'now', 'if', 'once', 'so', 'and', 'or', 'but', 'when', 'the', 'a', 'an', 'as', 'let', 'const', 'var', 'export', 'import', 'from', 'true', 'false', 'null', 'npm', 'run', 'echo', 'sudo'])
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
      if (isKnown) set.add(name)
      else if (name.length >= 3 && name.length <= 30 && !STOP.has(name)) set.add(name)
    }
  }
  return set
}

function createNavTree(tree) {
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


async function fetchMarkdown(path, base) {
  const baseClean = base.endsWith('/') ? base.slice(0, -1) : base
  const url = `${baseClean}/${path}`
  const res = await fetch(url)
  if (!res.ok) {
    if (res.status === 404) {
      try {
        const p404 = `${baseClean}/_404.md`
        const r404 = await fetch(p404)
        if (r404.ok) {
          const raw404 = await r404.text()
          return { raw: raw404, status: 404 }
        }
      } catch (ee) {
      }
    }
    const body = await res.clone().text().catch(() => '')
    console.error('fetchMarkdown failed:', { url, status: res.status, statusText: res.statusText, body: body.slice(0, 200) })
    throw new Error('failed to fetch md')
  }
  const raw = await res.text()
  const trimmed = raw.trim().slice(0, 16).toLowerCase()
  if (trimmed.startsWith('<!doctype') || trimmed.startsWith('<html')) {
    console.error('fetchMarkdown expected markdown but received HTML:', { url, snippet: raw.trim().slice(0, 200) })
    throw new Error('expected markdown but received HTML — check contentPath and that the file exists')
  }
  return { raw }
}

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

    const tmp = document.createElement('div')
    tmp.innerHTML = parsedNav.html || ''
    const linkEls = tmp.querySelectorAll('a')

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
      const href = firstLink.getAttribute('href') || '#'
      if (/^[^#]*\.md(?:$|[#?])/.test(href) || href.endsWith('.md')) brandItem.href = '#' + href.replace(/^\.\//, '')
      else brandItem.href = href
      brandItem.textContent = firstLink.textContent || t('home')
    } else {
      brandItem.href = '#_home.md'
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

    linkEls.forEach((a, i) => {
      if (i === 0) return
      const href = a.getAttribute('href') || '#'
      const item = document.createElement('a')
      item.className = 'navbar-item'
      if (/^[^#]*\.md(?:$|[#?])/.test(href) || href.endsWith('.md')) {
        item.href = '#' + href.replace(/^\.\//, '')
      } else {
        item.href = href
      }
      item.textContent = a.textContent || href
      start.appendChild(item)
    })

    menu.appendChild(start)
    navbar.appendChild(brand)
    navbar.appendChild(menu)
    navbarWrap.appendChild(navbar)

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

  const siteNav = createNavTree([{ path: '_home.md', name: t('home'), isIndex: true, children: [] }])
  let currentPagePath = null

  async function renderByHash() {
    const raw = location.hash.replace(/^#/, '') || '_home.md'

    if (raw.includes('.md')) {
      const [pagePath, anchor] = raw.split('::', 2)
      const data = await fetchMarkdown(pagePath, contentBase)
      contentWrap.innerHTML = ''

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

      const parsed = await parseMarkdownToHtml(data.raw || '')

      setMetaTags(parsed)

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
          anchors.forEach(a => {
            const href = a.getAttribute('href') || ''
            if (!href) return
            if (/^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')) return
            if (href.startsWith('/') && !href.endsWith('.md')) return
            const mdMatch = href.match(/^([^#?]+\.md)(?:[#](.+))?$/)
            if (mdMatch) {
              const mdPath = mdMatch[1]
              const frag = mdMatch[2]
              try {
                const resolved = new URL(mdPath, contentBase).pathname
                const rel = resolved.startsWith(contentBasePath) ? resolved.slice(contentBasePath.length) : resolved.replace(/^\//, '')
                const hash = frag ? `${rel}::${frag}` : rel
                a.setAttribute('href', `#${hash}`)
              } catch (e) {
                a.setAttribute('href', '#' + mdPath.replace(/^\.\//, ''))
              }
            }
          })
        }
      } catch (e) {
      }

      const toc = buildTocElement(parsed.toc, pagePath)
      try {
        const topH1 = article.querySelector('h1')
        const labelEl = toc.querySelector('.menu-label')
        if (labelEl) {
          labelEl.textContent = topH1 ? (topH1.textContent || t('onThisPage')) : t('onThisPage')
        }
        try {
          const metaTitle = parsed.meta && parsed.meta.title ? String(parsed.meta.title).trim() : ''
          const h1Text = topH1 ? (topH1.textContent || '').trim() : ''
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
          if (!href.startsWith('#')) return
          ev.preventDefault()
          const rawAnchor = href.replace(/^#/, '')
          const parts = rawAnchor.split('::', 2)
          const aid = parts[1] || parts[0]
          if (!aid) return
          const target = article.querySelector('#' + aid)
          if (target) {
            try {
              if (container && container.scrollTo) container.scrollTo({ top: target.offsetTop, behavior: 'smooth' })
              else target.scrollIntoView({ behavior: 'smooth' })
            } catch (e) { try { target.scrollIntoView() } catch (ee) { } }
          }
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

    const slug = raw
    const el = document.getElementById(slug)
    if (el) {
      el.scrollIntoView()
    }
  }

  window.addEventListener('hashchange', renderByHash)
  await renderByHash()
}

function buildTocElement(toc, pagePath = '') {
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
    if (pagePath) a.href = `#${pagePath}::${slug}`
    else a.href = `#${slug}`
    a.textContent = item.text
    li.appendChild(a)
    ul.appendChild(li)
  })
  aside.appendChild(ul)
  return aside
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9\- ]/g, '').replace(/ /g, '-')
}

function setMetaTags(data) {
  const meta = data.meta || {}
  setTag('description', meta.description || '')
  setOgTwitter(meta)
}

function setTag(name, content) {
  let tag = document.querySelector(`meta[name="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setOgTwitter(meta) {
  upsertMeta('property', 'og:title', meta.title || initialDocumentTitle || document.title)
  upsertMeta('property', 'og:description', meta.description || '')
  upsertMeta('name', 'twitter:card', meta.twitter_card || 'summary_large_image')
  if (meta.image) {
    upsertMeta('property', 'og:image', meta.image)
    upsertMeta('name', 'twitter:image', meta.image)
  }
}

function upsertMeta(attrName, attrValue, content) {
  let sel = `meta[${attrName}="${attrValue}"]`
  let tag = document.querySelector(sel)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attrName, attrValue)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

export default initCMS
