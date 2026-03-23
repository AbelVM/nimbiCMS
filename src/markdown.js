/**
 * Markdown parsing and renderer helpers.
 *
 * Provides utilities for converting Markdown to HTML, managing renderer
 * workers, and extracting table-of-contents data.
 *
 * @module markdown
 */
import { marked } from 'marked'
import rendererWorkerCode from './worker/renderer.js?raw'
import RendererWorker from './worker/renderer.js?worker&inline'
import * as RendererModule from './worker/renderer.js'
import * as WorkerManager from './worker-manager.js'
import emojimap from './utils/emojiMap.js'
import { debugWarn } from './utils/debug.js'
import { getSharedParser } from './utils/sharedDomParser.js'

const poolSize = (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2

/**
 * Create a renderer worker instance or an inline shim when Workers are
 * unavailable. The returned value implements a minimal Worker-like API
 * (`postMessage`, `addEventListener`, `removeEventListener`, `terminate`).
 * @returns {Worker|Object|null}
 */
const _rendererManager = WorkerManager.makeWorkerPool(() => {
  // Prefer bundler-provided worker class (test mocks target `?worker&inline`).
  if (typeof Worker !== 'undefined') {
    try { return new RendererWorker() } catch (e) { /* fallthrough to raw/inline */ }
  }

  // Try creating a worker from raw code if available.
  try { if (WorkerManager.createWorkerFromRaw) return WorkerManager.createWorkerFromRaw(rendererWorkerCode) } catch (e) {}

  // Inline shim: forward to module handler and emulate Worker message events.
  const listeners = { message: [], error: [] }
  return {
    addEventListener(type, fn) { if (!listeners[type]) listeners[type] = []; listeners[type].push(fn) },
    removeEventListener(type, fn) { if (!listeners[type]) return; const i = listeners[type].indexOf(fn); if (i !== -1) listeners[type].splice(i,1) },
    postMessage(msg) {
      setTimeout(async () => {
        try {
          const out = await RendererModule.handleWorkerMessage(msg)
          const ev = { data: out }
          ;(listeners.message || []).forEach(fn => fn(ev))
        } catch (e) {
          const ev = { data: { id: msg && msg.id, error: String(e) } }
          ;(listeners.message || []).forEach(fn => fn(ev))
        }
      }, 0)
    },
    terminate() { Object.keys(listeners).forEach(k => listeners[k].length = 0) }
  }
}, 'markdown', poolSize)

// use shared DOMParser helper (see src/utils/sharedDomParser.js)

/**
 * Table-of-contents entry extracted from a parsed document.
 * @typedef {{
 *   level: number,
 *   text: string,
 *   id?: string,
 *   slug?: string,
 *   parentTitle?: string
 * }} TocEntry
 */

/**
 * Generic metadata object returned alongside parsed content. Common keys
 * include `title`, `description`, `author`, etc. Consumers can inspect
 * additional keys as needed. Nested objects are represented as plain objects.
 * @typedef {Record<string, unknown>} Meta
 */

/**
 * Parse result returned by `parseMarkdownToHtml` and similar helpers.
 * @typedef {{html:string,meta:Meta,toc:Array<TocEntry>}} ParseResult
 */

/**
 * @typedef {Object} MarkdownPlugin
 * @property {Function} [tokenizer]
 * @property {Object} [renderer]
 * @property {Function} [walkTokens]
 * @property {Function} [transform]
 */

/**
 * @typedef {{html:string,meta?:Meta}} RendererResult
 */

/**
 * Lazily return or create a renderer worker instance (may return null).
 * @returns {Worker|null} - A Worker instance or null if workers are unavailable.
 */
export const initRendererWorker = () => _rendererManager.get()

/**
 * Send a message to the renderer worker and await a response.
 * @param {Object} msg - Message payload to send to the renderer.
 * @param {number} [timeout=3000] - Timeout in milliseconds.
 * @returns {Promise<RendererResult>} Promise resolving with the renderer result.
 */
export const _sendToRenderer = (msg, timeout = 3000) => {
  return _rendererManager.send(msg, timeout)
}

/** Registered marked plugins. */
/** @type {Array<MarkdownPlugin>} */
export const markdownPlugins = []

/**
 * Register a new marked plugin.  The object is passed directly to
 * `marked.use()` which merges its fields into the global parser.
 * @param {MarkdownPlugin} plugin - Markdown plugin object to register with `marked`.
 * @returns {void}
 */
export function addMarkdownExtension(plugin) {
  if (plugin && (typeof plugin === 'object' || typeof plugin === 'function')) {
    markdownPlugins.push(plugin)
    try { marked.use(plugin) } catch (e) { debugWarn('[markdown] failed to apply plugin', e) }
  }
}

/**
 * Replace the full plugin list.  Existing list is cleared first.
 * @param {MarkdownPlugin[]} plugins - array of markdown plugins to register
 * @returns {void}
 */
export function setMarkdownExtensions(plugins) {
  markdownPlugins.length = 0
  if (Array.isArray(plugins)) {
    markdownPlugins.push(...plugins.filter(p=>p && typeof p === 'object'))
  }
  try {
    markdownPlugins.forEach(p => marked.use(p))
  } catch (e) { debugWarn('[markdown] failed to apply markdown extensions', e) }
}
import { parseFrontmatter } from './utils/frontmatter.js'
import hljs from 'highlight.js/lib/core'
import { BAD_LANGUAGES, HLJS_ALIAS_MAP } from './codeblocksManager.js'

/**
 * Convert markdown string to HTML and extract a table-of-contents list.
 * Preserves frontmatter metadata.
 *
 * @param {string} [md] - Markdown source string to convert; falsy values are treated as an empty string.
 * @returns {Promise<ParseResult>} Promise resolving to the parsed HTML, metadata, and table-of-contents.
 */
export async function parseMarkdownToHtml(md) {
  if (markdownPlugins && markdownPlugins.length) {
    let { content, data } = parseFrontmatter(md || '')
    try { content = String(content || '').replace(/:([^:\s]+):/g, (m, name) => emojimap[name] || m) } catch (e) {}
    marked.setOptions({ gfm: true, mangle: false, headerIds: false, headerPrefix: '' })
    try { markdownPlugins.forEach(p => marked.use(p)) } catch (e) { debugWarn('[markdown] apply plugins failed', e) }
    const html = marked.parse(content)
    try {
      const parser = getSharedParser()
      if (parser) {
        const doc = parser.parseFromString(html, 'text/html')
        // add heading ids and build toc
        const heads = doc.querySelectorAll('h1,h2,h3,h4,h5,h6')
        const docToc = []
        const used = new Set()
        const slugifyLocal = (s) => { try { return String(s || '').toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, '').replace(/\s+/g, '-') } catch (e) { return 'heading' } }
        const classesFor = (level) => {
          const resp = {
            1: 'is-size-3-mobile is-size-2-tablet is-size-1-desktop',
            2: 'is-size-4-mobile is-size-3-tablet is-size-2-desktop',
            3: 'is-size-5-mobile is-size-4-tablet is-size-3-desktop',
            4: 'is-size-6-mobile is-size-5-tablet is-size-4-desktop',
            5: 'is-size-6-mobile is-size-6-tablet is-size-5-desktop',
            6: 'is-size-6-mobile is-size-6-tablet is-size-6-desktop'
          }
          const weight = (level <= 2) ? 'has-text-weight-bold' : (level <= 4) ? 'has-text-weight-semibold' : 'has-text-weight-normal'
          return (resp[level] + ' ' + weight).trim()
        }
        heads.forEach(h => {
          try {
            const level = Number(h.tagName.substring(1))
            const text = (h.textContent || '').trim()
            let base = slugifyLocal(text) || 'heading'
            let candidate = base
            let i = 2
            while (used.has(candidate)) { candidate = base + '-' + i; i += 1 }
            used.add(candidate)
            h.id = candidate
            h.className = classesFor(level)
            docToc.push({ level, text, id: candidate })
          } catch (e) {}
        })

        // ensure images have loading=lazy unless explicitly set or opted-out
        try {
          doc.querySelectorAll('img').forEach(img => {
            try {
              const attrs = img.getAttribute && img.getAttribute('loading')
              const want = img.getAttribute && img.getAttribute('data-want-lazy')
              if (!attrs && !want) img.setAttribute && img.setAttribute('loading', 'lazy')
            } catch (e) {}
          })
        } catch (e) {}

        // clean code element classes like language-undefined
        try {
          doc.querySelectorAll('pre code, code[class]').forEach(el => {
            try {
              const raw = (el.getAttribute && el.getAttribute('class')) || el.className || ''
              const cleaned = String(raw || '').replace(/\blanguage-undefined\b|\blang-undefined\b/g, '').trim()
              if (cleaned) {
                try { el.setAttribute && el.setAttribute('class', cleaned) } catch (err) { el.className = cleaned }
              } else {
                try { el.removeAttribute && el.removeAttribute('class') } catch (err) { el.className = '' }
              }
            } catch (e) {}
          })
        } catch (e) {}

        try {
          let htmlOut = null
          try {
            if (typeof XMLSerializer !== 'undefined') {
              const ser = new XMLSerializer()
              htmlOut = ser.serializeToString(doc.body).replace(/^<body[^>]*>/i, '').replace(/<\/body>$/i, '')
            } else {
              const nodes = Array.from(doc.body.childNodes || [])
              htmlOut = nodes.map(n => (n && typeof n.outerHTML === 'string') ? n.outerHTML : (n && typeof n.textContent === 'string' ? n.textContent : '')).join('')
            }
          } catch (err) {
            try { htmlOut = doc.body.innerHTML } catch (err2) { htmlOut = '' }
          }
          return { html: htmlOut, meta: data || {}, toc: docToc }
        } catch (e) { return { html: '', meta: data || {}, toc: docToc } }
      }
    } catch (e) { /* fall through to return raw html */ }
    return { html, meta: data || {}, toc: [] }
  }

  

  // Obtain worker; in Vitest we import the module namespace so test spies
  // can override `initRendererWorker`. Outside tests avoid self-import.
  let w
  if (typeof process !== 'undefined' && process.env && process.env.VITEST) {
    try {
      const ns = await import('./markdown.js')
      w = ns.initRendererWorker && ns.initRendererWorker()
    } catch (e) {
      w = initRendererWorker && initRendererWorker()
    }
  } else {
    w = initRendererWorker && initRendererWorker()
  }
  try { md = String(md || '').replace(/:([^:\s]+):/g, (m, name) => emojimap[name] || m) } catch (e) {}
  try {
    if (typeof hljs !== 'undefined' && hljs && typeof hljs.getLanguage === 'function' && hljs.getLanguage('plaintext')) {
      if (/```\s*\n/.test(String(md || ''))) {
        let { content, data } = parseFrontmatter(md || '')
        try { content = String(content || '').replace(/:([^:\s]+):/g, (m, name) => emojimap[name] || m) } catch (e) {}
        marked.setOptions({ gfm: true, headerIds: true, mangle: false, highlighted: (code, lang) => {
          try {
            if (lang && hljs.getLanguage && hljs.getLanguage(lang)) return hljs.highlight(code, { language: lang }).value
            if (hljs && typeof hljs.getLanguage === 'function' && hljs.getLanguage('plaintext')) {
              return hljs.highlight(code, { language: 'plaintext' }).value
            }
            return code
          } catch (e) { return code }
        } })
        let html = marked.parse(content)
        try {
          html = html.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (full, code) => {
            try {
              if (code && hljs && typeof hljs.highlight === 'function') {
                try {
                  const out = hljs.highlight(code, { language: 'plaintext' })
                  return `<pre><code>${out && out.value ? out.value : out}</code></pre>`
                } catch (e) {
                  try {
                    if (hljs && typeof hljs.highlightElement === 'function') {
                      const el = { innerHTML: code }
                      hljs.highlightElement(el)
                      return `<pre><code>${el.innerHTML}</code></pre>`
                    }
                  } catch (ee) {}
                }
              }
            } catch (e) {}
            return full
          })
        } catch (e) {}
        const heads = []
        const used = new Set()
        const slugifyLocal = (s) => { try { return String(s || '').toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, '').replace(/\s+/g, '-') } catch (e) { return 'heading' } }
        html = html.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (full, lvl, attrs, inner) => {
          const level = Number(lvl)
          const text = inner.replace(/<[^>]+>/g, '').trim()
          let base = slugifyLocal(text) || 'heading'
          let candidate = base
          let i = 2
          while (used.has(candidate)) { candidate = base + '-' + i; i += 1 }
          used.add(candidate)
          heads.push({ level, text, id: candidate })
          const resp = {
            1: 'is-size-3-mobile is-size-2-tablet is-size-1-desktop',
            2: 'is-size-4-mobile is-size-3-tablet is-size-2-desktop',
            3: 'is-size-5-mobile is-size-4-tablet is-size-3-desktop',
            4: 'is-size-6-mobile is-size-5-tablet is-size-4-desktop',
            5: 'is-size-6-mobile is-size-6-tablet is-size-5-desktop',
            6: 'is-size-6-mobile is-size-6-tablet is-size-6-desktop'
          }
          const weight = (level <= 2) ? 'has-text-weight-bold' : (level <= 4) ? 'has-text-weight-semibold' : 'has-text-weight-normal'
          const classes = (resp[level] + ' ' + weight).trim()
          const cleanAttrs = (attrs || '').replace(/\s*(id|class)="[^"]*"/g, '')
          const newAttrs = (cleanAttrs + ` id="${candidate}" class="${classes}"`).trim()
          return `<h${level} ${newAttrs}>${inner}</h${level}>`
        })
        html = html.replace(/<img([^>]*)>/g, (full, attrs) => {
          if (/\bloading=/.test(attrs)) return `<img${attrs}>`
          if (/\bdata-want-lazy=/.test(attrs)) return `<img${attrs}>`
          return `<img${attrs} loading="lazy">`
        })
        return { html, meta: data || {}, toc: heads }
      }
    }
  } catch (e) { /* ignore and continue to worker path */ }
  if (!w) throw new Error('renderer worker required but unavailable')
  const res = await _sendToRenderer({ type: 'render', md })
  if (!res || typeof res !== 'object' || res.html === undefined) throw new Error('renderer worker returned invalid response')
  try {
    const idCounts = new Map()
    const toc = []
    const slugifyLocal = (s) => { try { return String(s || '').toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, '').replace(/\s+/g, '-') } catch (e) { return 'heading' } }
    const classesFor = (level) => {
      const resp = {
        1: 'is-size-3-mobile is-size-2-tablet is-size-1-desktop',
        2: 'is-size-4-mobile is-size-3-tablet is-size-2-desktop',
        3: 'is-size-5-mobile is-size-4-tablet is-size-3-desktop',
        4: 'is-size-6-mobile is-size-5-tablet is-size-4-desktop',
        5: 'is-size-6-mobile is-size-6-tablet is-size-5-desktop',
        6: 'is-size-6-mobile is-size-6-tablet is-size-6-desktop'
      }
      const weight = (level <= 2) ? 'has-text-weight-bold' : (level <= 4) ? 'has-text-weight-semibold' : 'has-text-weight-normal'
      return (resp[level] + ' ' + weight).trim()
    }
    let html = res.html
    html = html.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (full, lvl, attrs, inner) => {
      const level = Number(lvl)
      const text = inner.replace(/<[^>]+>/g, '').trim()
      const idMatch = (attrs || '').match(/\sid="([^"]+)"/)
      const base = idMatch ? idMatch[1] : (slugifyLocal(text) || 'heading')
      const prev = idCounts.get(base) || 0
      const idx = prev + 1
      idCounts.set(base, idx)
      const candidate = idx === 1 ? base : base + '-' + idx
      toc.push({ level, text, id: candidate })
      const classes = classesFor(level)
      const cleanAttrs = (attrs || '').replace(/\s*(id|class)="[^"]*"/g, '')
      const newAttrs = (cleanAttrs + ` id="${candidate}" class="${classes}"`).trim()
      return `<h${level} ${newAttrs}>${inner}</h${level}>`
    })
    try {
      const moved = (typeof document !== 'undefined' && document.documentElement && document.documentElement.getAttribute)
        ? document.documentElement.getAttribute('data-nimbi-logo-moved') || '' : ''
      if (moved) {
        const parser = getSharedParser()
        if (parser) {
          const doc = parser.parseFromString(html, 'text/html')
          const imgs = doc.querySelectorAll('img')
          imgs.forEach(img => {
            try {
              const src = img.getAttribute('src') || ''
              const abs = src ? new URL(src, location.href).toString() : ''
              if (abs === moved) img.remove()
            } catch (e) {}
          })
          try {
            if (typeof XMLSerializer !== 'undefined') {
              const ser = new XMLSerializer()
              html = ser.serializeToString(doc.body).replace(/^<body[^>]*>/i, '').replace(/<\/body>$/i, '')
            } else {
              const nodes = Array.from(doc.body.childNodes || [])
              html = nodes.map(n => (n && typeof n.outerHTML === 'string') ? n.outerHTML : (n && typeof n.textContent === 'string' ? n.textContent : '')).join('')
            }
          } catch (err) {
            try { html = doc.body.innerHTML } catch (err2) { /* leave html as-is */ }
          }
        } else {
          try {
            const escaped = moved.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            html = html.replace(new RegExp(`<img[^>]*src=\\"${escaped}\\"[^>]*>`, 'g'), '')
          } catch (e) {}
        }
      }
    } catch (e) {}
    return { html, meta: res.meta || {}, toc }
  } catch (e) {
    return { html: res.html, meta: res.meta || {}, toc: res.toc || [] }
  }
}

/* function extractToc(md) {
  const lines = md.split('\n')
  const toc = []
  for (const line of lines) {
    const m = line.match(/^(#{1,6})\s+(.*)$/)
    if (m) toc.push({ level: m[1].length, text: m[2].trim() })
  }
  return toc
}
 */
/**
 * Detect fenced code block languages in a markdown string.
 * Kept immediately above the exported symbol for TypeDoc.
 * @param {string} [md] - Markdown source string to scan for fenced code blocks.
 * @param {Map<string,string>} [supportedMap] - Optional map of supported language alias -> canonical name.
 * @returns {Set<string>} - Set of detected language identifiers (canonical or fallback names)
 */
export function detectFenceLanguages(md, supportedMap) {
  const set = new Set()
  const re = /```\s*([a-zA-Z0-9_\-+]+)?/g
  const STOP = new Set([
    'then', 'now', 'if', 'once', 'so', 'and', 'or', 'but', 'when', 'the', 'a', 'an', 'as',
    'let', 'const', 'var', 'export', 'import', 'from', 'true', 'false', 'null', 'npm',
    'run', 'echo', 'sudo', 'this', 'that', 'have', 'using', 'some', 'return', 'returns',
    'function', 'console', 'log', 'error', 'warn', 'class', 'new', 'undefined',
    'with', 'select', 'from', 'where', 'join', 'on', 'group', 'order', 'by', 'having', 'as', 'into', 'values',
    'like', 'limit', 'offset', 'create', 'table', 'index', 'view', 'insert', 'update', 'delete', 'returning',
    'and', 'or', 'not', 'all', 'any', 'exists', 'case', 'when', 'then', 'else', 'end', 'distance', 'geometry',
    'you', 'which', 'would', 'why', 'cool', 'other', 'same', 'everything', 'check'
  ])
  const FALLBACK_KNOWN = new Set(['bash', 'sh', 'zsh', 'javascript', 'js', 'python', 'py', 'php', 'java', 'c', 'cpp', 'rust', 'go', 'ruby', 'perl', 'r', 'scala', 'swift', 'kotlin', 'cs', 'csharp', 'html', 'css', 'json', 'xml', 'yaml', 'yml', 'dockerfile', 'docker'])
  let m
  while ((m = re.exec(md))) {
    if (m[1]) {
      const name = m[1].toLowerCase()
      
      if (BAD_LANGUAGES.has(name)) continue
      
      if (supportedMap && supportedMap.size && name.length < 3 && !supportedMap.has(name) && !(HLJS_ALIAS_MAP && HLJS_ALIAS_MAP[name] && supportedMap.has(HLJS_ALIAS_MAP[name]))) continue
      if (supportedMap && supportedMap.size) {
        if (supportedMap.has(name)) {
          const canonical = supportedMap.get(name)
          if (canonical) set.add(canonical)
          continue
        }
        
        if (HLJS_ALIAS_MAP && HLJS_ALIAS_MAP[name]) {
          const mapped = HLJS_ALIAS_MAP[name]
          if (supportedMap.has(mapped)) {
            const canonical = supportedMap.get(mapped) || mapped
            set.add(canonical)
            continue
          }
        }
      }
      const isKnown = FALLBACK_KNOWN.has(name)
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

/**
 * Asynchronous detection that attempts to use the renderer worker if available.
 * @param {string} [mdText] - Markdown source string to scan for fenced code blocks.
 * @param {Map<string,string>} [supportedMap] - Optional map of supported language alias -> canonical name.
 * @returns {Promise<Set<string>>} Promise resolving to a set of detected language identifiers.
 */
export async function detectFenceLanguagesAsync(mdText, supportedMap) {
  if (markdownPlugins && markdownPlugins.length) return detectFenceLanguages(mdText || '', supportedMap)
  if (typeof process !== 'undefined' && process.env && process.env.VITEST) return detectFenceLanguages(mdText || '', supportedMap)
  const w = initRendererWorker && initRendererWorker()
  if (w) {
    try {
      const arr = supportedMap && supportedMap.size ? Array.from(supportedMap.keys()) : []
      const res = await _sendToRenderer({ type: 'detect', md: String(mdText || ''), supported: arr })
      if (Array.isArray(res)) return new Set(res)
    } catch (e) {
      debugWarn('[markdown] detectFenceLanguagesAsync worker failed', e)
    }
  }
  return detectFenceLanguages(mdText || '', supportedMap)
}
