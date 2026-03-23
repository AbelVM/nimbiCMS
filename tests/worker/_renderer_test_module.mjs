/**
 * @module worker/renderer
 */
import * as _markedModule from 'marked'
import { parseFrontmatter } from '../../src/utils/frontmatter.js'
import { LRUCache } from '../../src/utils/cache.js'

// Lightweight local HTML entity decoder to avoid importing utils in worker
function decodeHtmlEntitiesLocal(s) {
  try {
    if (!s && s !== 0) return ''
    const str = String(s)
    const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }
    return str.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, g) => {
      if (!g) return m
      if (g[0] === '#') {
        try {
          if (g[1] === 'x' || g[1] === 'X') return String.fromCharCode(parseInt(g.slice(2), 16))
          return String.fromCharCode(parseInt(g.slice(1), 10))
        } catch (e) {
          return m
        }
      }
      return (named[g] !== undefined) ? named[g] : m
    })
  } catch (err) {
    return String(s || '')
  }
}

const marked = (_markedModule && (_markedModule.marked || _markedModule)) || undefined

// Hoisted regex and helpers to avoid reallocation per-message
const FENCE_RE = /```\s*([a-zA-Z0-9_\-+]+)?/g
const FALLBACK_KNOWN = new Set(['bash','sh','zsh','javascript','js','python','py','php','java','c','cpp','rust','go','ruby','perl','r','scala','swift','kotlin','cs','csharp','html','css','json','xml','yaml','yml','dockerfile','docker'])
function slugifyHeading(s) { try { return String(s || '').toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, '').replace(/\s+/g, '-') } catch (e) { return 'heading' } }

/**
 * Worker entrypoint for rendering markdown to HTML and registering
 * highlight.js languages on demand.
 *
 * Accepted messages:
 * - `{ type: 'register', name: string, url: string }` — dynamically import
 *   a highlight.js language module and register it. Replies with
 *   `{ type: 'registered', name }` or `{ type: 'register-error', name, error }`.
 * - `{ id: string, md: string }` — render `md` (which may contain frontmatter)
 *   and reply with `{ id, result: { html: string, meta: Record<string,string>, toc: Array<{level:number,text:string}> } }`.
 *
 * On error the worker posts `{ id, error: string }`.
 */

/**
 * Worker `onmessage` handler for renderer tasks is defined below. The worker
 * listens for messages like `{ type: 'register', name, url }`, `{ type: 'detect', id, md, supported }`,
 * or rendering requests `{ id, md }` and replies with `{ id, result }` or `{ id, error }`.
 *
 * The top-level `onmessage` assignment directly handles posting results; see function body below.
 */

let hljs = null
const HLJS_CDN_BASE = 'https://cdn.jsdelivr.net/npm/highlight.js'

// Cache for dynamic import attempts (module URL -> { promise, module, ok, ts })
const __importCache = new LRUCache({ maxSize: 500 })

/** Milliseconds to retain a negative cache entry when dynamic import fails. */
let __IMPORT_NEGATIVE_CACHE_TTL_MS = 5 * 60 * 1000

/**
 * Clear renderer import cache (useful for tests).
 * @returns {void}
 */
export function clearRendererImportCache() { __importCache.clear(); hljs = null }

/**
 * Adjust negative-cache TTL for renderer dynamic imports.
 * @param {number} ms - Milliseconds to keep negative entries.
 */
export function setRendererImportNegativeCacheTTL(ms) { __IMPORT_NEGATIVE_CACHE_TTL_MS = Number(ms) || 0 }

/**
 * Import a module URL with negative-caching/backoff to avoid repeated failed
 * CDN attempts. Returns the module or null on failure.
 * @param {string} url
 * @returns {Promise<Module|null>}
 */
async function importModuleWithCache(url) {
  try {
    if (!url) return null
    const now = Date.now()
    let cached = __importCache.get(url)
    if (cached) {
      if (cached.ok === false && (now - (cached.ts || 0) >= __IMPORT_NEGATIVE_CACHE_TTL_MS)) {
        __importCache.delete(url)
        cached = undefined
      }
    }
    if (cached) {
      if (cached.module) return cached.module
      if (cached.promise) {
        try { return await cached.promise } catch (err) { return null }
      }
    }

    const entry = { promise: null, module: null, ok: null, ts: Date.now() }
    __importCache.set(url, entry)
    entry.promise = (async () => {
      try {
        // Use dynamic import at runtime. In Node tests this supports file:// imports.
        return await import(url)
      } catch (err) {
        return null
      }
    })()
    try {
      const mod = await entry.promise
      entry.module = mod
      entry.ok = !!mod
      entry.ts = Date.now()
      return mod
    } catch (err) {
      entry.module = null
      entry.ok = false
      entry.ts = Date.now()
      return null
    }
  } catch (err) {
    return null
  }
}

async function ensureHljs() {
  if (hljs) return hljs
  try {
    const url = HLJS_CDN_BASE + '/lib/core.js'
    // Try a static import for the known CDN core path so test mocks
    // (vitest `vi.mock('https://cdn.jsdelivr.net/...')`) can intercept it.
    try {
      const mod = await import('https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js')
      if (mod) {
        hljs = mod.default || mod
        try { __importCache.set(url, { promise: null, module: mod, ok: true, ts: Date.now() }) } catch (_) {}
      } else {
        hljs = null
      }
    } catch (e) {
      const mod = await importModuleWithCache(url)
      if (mod) hljs = mod.default || mod
      else hljs = null
    }
  } catch (e) {
    hljs = null
  }
  return hljs
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

if (marked && typeof marked.setOptions === 'function') {
  marked.setOptions({
  gfm: true,
  headerIds: true,
  mangle: false,
    highlighted: (code, lang) => {
    try {
      if (hljs && lang && typeof hljs.getLanguage === 'function' && hljs.getLanguage(lang)) return hljs.highlight(code, { language: lang }).value
      if (hljs && typeof hljs.getLanguage === 'function' && hljs.getLanguage('plaintext')) {
        return hljs.highlight(code, { language: 'plaintext' }).value
      }
      return code
    } catch (e) {
      return code
    }
  }
  })
}

/**
 * Worker `onmessage` handler implementation for renderer (attached to global `onmessage`).
 * @param {MessageEvent} ev - Event carrying the request data in `ev.data`.
 * @returns {Promise<void>} Posts worker reply messages (`{id, result}` or `{id, error}`).
 */
globalThis.onmessage = async (ev) => {
  const msg = ev.data || {}
  try {
    if (msg.type === 'register') {
      const { name, url } = msg
      try {
        const availableHljs = await ensureHljs()
        if (!availableHljs) {
          postMessage({ type: 'register-error', name, error: 'hljs unavailable' })
          return
        }
        const mod = await importModuleWithCache(url)
        const lang = mod ? (mod.default || mod) : null
        if (!lang) throw new Error('failed to import language module')
        hljs.registerLanguage(name, lang)
        postMessage({ type: 'registered', name })
      } catch (e) {
        postMessage({ type: 'register-error', name, error: String(e) })
      }
      return
    }

    if (msg.type === 'detect') {
      const mdText = msg.md || ''
      const supported = msg.supported || []
      const res = new Set()
      const re = new RegExp(FENCE_RE.source, FENCE_RE.flags)
      let m
      while ((m = re.exec(mdText))) {
        if (m[1]) {
          const name = String(m[1]).toLowerCase()
          if (!name) continue
          if (name.length >= 5 && name.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(name)) res.add(name)
          if (FALLBACK_KNOWN.has(name)) res.add(name)
          if (supported && supported.length) {
            try {
              if (supported.indexOf(name) !== -1) res.add(name)
            } catch (e) {}
          }
        }
      }
      postMessage({ id: msg.id, result: Array.from(res) })
      return
    }

    const { id, md } = msg
    const { content, data } = parseFrontmatter(md || '')
    await ensureHljs().catch(() => {})
    let html = marked.parse(content)
    
    const heads = []
    const idCounts = new Map()
    const slugify = slugifyHeading
    html = html.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (full, lvl, attrs, inner) => {
      const level = Number(lvl)
      let text = inner.replace(/<[^>]+>/g, '').trim()
      try { text = decodeHtmlEntitiesLocal(text) } catch (e) {}
      let existingId = null
      const idMatch = (attrs || '').match(/\sid="([^"]+)"/)
      if (idMatch) existingId = idMatch[1]
      const base = existingId || slugify(text) || 'heading'
      const prev = idCounts.get(base) || 0
      const idx = prev + 1
      idCounts.set(base, idx)
      const candidate = idx === 1 ? base : base + '-' + idx
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
    postMessage({ id, result: { html, meta: data || {}, toc: heads } })
  } catch (e) {
    postMessage({ id: msg.id, error: String(e) })
  }
}

/**
 * Helper to process renderer worker messages outside of a Worker.
 * @param {Object} msg - Message object sent to the renderer (see worker accepted messages above).
 * @returns {Promise<Object>} Response shaped like worker replies: `{id, result}` or `{id, error}`.
 */
export async function handleWorkerMessage(msg) {
  try {
    if (msg && msg.type === 'register') {
      const { name, url } = msg
      try {
        const availableHljs = await ensureHljs()
        if (!availableHljs) return { type: 'register-error', name, error: 'hljs unavailable' }
        const mod = await importModuleWithCache(url)
        const lang = mod ? (mod.default || mod) : null
        if (!lang) return { type: 'register-error', name, error: 'failed to import language module' }
        hljs.registerLanguage(name, lang)
        return { type: 'registered', name }
      } catch (e) {
        return { type: 'register-error', name, error: String(e) }
      }
    }

    if (msg && msg.type === 'detect') {
      const mdText = msg.md || ''
      const supported = msg.supported || []
      const res = new Set()
      const re = new RegExp(FENCE_RE.source, FENCE_RE.flags)
      let m
      while ((m = re.exec(mdText))) {
        if (m[1]) {
          const name = String(m[1]).toLowerCase()
          if (!name) continue
          if (name.length >= 5 && name.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(name)) res.add(name)
          if (FALLBACK_KNOWN.has(name)) res.add(name)
          if (supported && supported.length) {
            try {
              if (supported.indexOf(name) !== -1) res.add(name)
            } catch (e) {}
          }
        }
      }
      return { id: msg.id, result: Array.from(res) }
    }

    const id = msg && msg.id
    const { content, data } = parseFrontmatter(msg && msg.md || '')
    await ensureHljs().catch(() => {})
    let html = marked.parse(content)

    const heads = []
    const idCounts = new Map()
    const slugify = slugifyHeading
    html = html.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (full, lvl, attrs, inner) => {
      const level = Number(lvl)
      let text = inner.replace(/<[^>]+>/g, '').trim()
      try { text = decodeHtmlEntitiesLocal(text) } catch (e) {}
      let existingId = null
      const idMatch = (attrs || '').match(/\sid="([^"]+)"/)
      if (idMatch) existingId = idMatch[1]
      const base = existingId || slugify(text) || 'heading'
      const prev = idCounts.get(base) || 0
      const idx = prev + 1
      idCounts.set(base, idx)
      const candidate = idx === 1 ? base : base + '-' + idx
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

    return { id, result: { html, meta: data || {}, toc: heads } }
  } catch (e) {
    return { id: msg && msg.id, error: String(e) }
  }
}
