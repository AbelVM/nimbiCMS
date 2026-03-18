import { marked } from 'marked'
import RendererWorker from './worker/renderer.js?worker&inline'
import * as RendererModule from './worker/renderer.js'
import { makeWorkerPool } from './worker-manager.js'

const poolSize = (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2

function _createRendererInstance() {
  if (typeof Worker !== 'undefined') {
    try { return new RendererWorker() } catch (e) { /* fallthrough to inline */ }
  }

  const listeners = { message: [], error: [] }
  const w = {
    addEventListener(type, fn) { if (!listeners[type]) listeners[type] = []; listeners[type].push(fn) },
    removeEventListener(type, fn) { if (!listeners[type]) return; const i = listeners[type].indexOf(fn); if (i !== -1) listeners[type].splice(i,1) },
    postMessage(msg) {
      setTimeout(async () => {
        try {
          const out = await RendererModule.handleWorkerMessage(msg)
          const ev = { data: out }
          (listeners.message || []).forEach(fn => fn(ev))
        } catch (e) {
          const ev = { data: { id: msg && msg.id, error: String(e) } }
          (listeners.message || []).forEach(fn => fn(ev))
        }
      }, 0)
    },
    terminate() { Object.keys(listeners).forEach(k => listeners[k].length = 0) }
  }
  return w
}

const _rendererManager = makeWorkerPool(() => _createRendererInstance(), 'markdown', poolSize)

const SHARED_DOM_PARSER = typeof DOMParser !== 'undefined' ? new DOMParser() : null

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

export const _sendToRenderer = (msg) => {
  /** @returns {Promise<RendererResult>} */
  return _rendererManager.send(msg, 3000)
}

/** Registered marked plugins. */
/** @type {Array<MarkdownPlugin>} */
export const markdownPlugins = []

/**
 * Register a new marked plugin.  The object is passed directly to
 * `marked.use()` which merges its fields into the global parser.
 * @param {MarkdownPlugin} plugin - Markdown plugin object to register with `marked`.
 */
export function addMarkdownExtension(plugin) {
    if (plugin && typeof plugin === 'object') {
    markdownPlugins.push(plugin)
    try { marked.use(plugin) } catch (e) { console.warn('[markdown] failed to apply plugin', e) }
  }
}

/**
 * Replace the full plugin list.  Existing list is cleared first.
 * @param {MarkdownPlugin[]} plugins - array of markdown plugins to register
 */
export function setMarkdownExtensions(plugins) {
  markdownPlugins.length = 0
  if (Array.isArray(plugins)) {
    markdownPlugins.push(...plugins.filter(p=>p && typeof p === 'object'))
  }
  try {
    markdownPlugins.forEach(p => marked.use(p))
  } catch (e) { console.warn('[markdown] failed to apply markdown extensions', e) }
}
import { parseFrontmatter } from './utils/frontmatter.js'
import hljs from 'highlight.js/lib/core'
import { BAD_LANGUAGES, HLJS_ALIAS_MAP } from './codeblocksManager.js'

/**
 * Convert markdown string to HTML and extract a table-of-contents list.
 * Preserves frontmatter metadata.
 *
 * @param {string} md - markdown source string to convert
 * @returns {Promise<ParseResult>} - Promise resolving to the parsed HTML, metadata, and table-of-contents.
 */
export async function parseMarkdownToHtml(md) {
  if (markdownPlugins && markdownPlugins.length) {
    const { content, data } = parseFrontmatter(md || '')
    marked.setOptions({ gfm: true, mangle: false, headerIds: false, headerPrefix: '' })
    try { markdownPlugins.forEach(p => marked.use(p)) } catch (e) { console.warn('[markdown] apply plugins failed', e) }
    const html = marked.parse(content)
    try {
      const parser = SHARED_DOM_PARSER || (typeof DOMParser !== 'undefined' ? new DOMParser() : null)
      if (parser) {
        const doc = parser.parseFromString(html, 'text/html')
        const heads = doc.querySelectorAll('h1,h2,h3,h4,h5,h6')
        const docToc = []
        heads.forEach(h => { docToc.push({ level: Number(h.tagName.substring(1)), text: (h.textContent || '').trim(), id: h.id }) })
        return { html: doc.body.innerHTML, meta: data || {}, toc: docToc }
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
  try {
    if (typeof hljs !== 'undefined' && hljs && typeof hljs.getLanguage === 'function' && hljs.getLanguage('plaintext')) {
      if (/```\s*\n/.test(String(md || ''))) {
        const { content, data } = parseFrontmatter(md || '')
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
        const parser = SHARED_DOM_PARSER || (typeof DOMParser !== 'undefined' ? new DOMParser() : null)
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
          html = doc.body.innerHTML
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
 * @param {string} md - markdown source
 * @param {Map<string,string>} [supportedMap] - optional supported languages map
 * @returns {Set<string>} set of detected language identifiers
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
 * @param {string} mdText
 * @param {Map<string,string>} [supportedMap]
 * @returns {Promise<Set<string>>}
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
      console.warn('[markdown] detectFenceLanguagesAsync worker failed', e)
    }
  }
  return detectFenceLanguages(mdText || '', supportedMap)
}
