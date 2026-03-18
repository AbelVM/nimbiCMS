import * as _markedModule from 'marked'
import { parseFrontmatter } from '../../src/utils/frontmatter.js'

// Support different shapes of the `marked` import (named export or namespace)
// without accessing a non-existent `default` property which triggers build
// warnings when the package doesn't export a default in ESM build.
const marked = (_markedModule && (_markedModule.marked || _markedModule)) || undefined

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

let hljs = null
const HLJS_CDN_BASE = 'https://cdn.jsdelivr.net/npm/highlight.js'

async function ensureHljs() {
  if (hljs) return hljs
  try {
    // In worker context prefer CDN-hosted core (browser-friendly path),
    // falling back to local import if CDN import fails. Tests that import
    // this module directly can mock the CDN path to simulate failures.
    try {
      const mod = await import(HLJS_CDN_BASE + '/lib/core.js')
      hljs = mod.default || mod
    } catch (e) {
      // If CDN import fails in a worker context, treat hljs as unavailable.
      hljs = null
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

// Configure marke(d) options if available
if (marked && typeof marked.setOptions === 'function') {
  marked.setOptions({
  gfm: true,
  headerIds: true,
  mangle: false,
    // marked expects a `highlight`/`highlighted` hook depending on version;
    // provide a handler that defends against missing `hljs`.
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
        const mod = await import(url)
        const lang = mod.default || mod
        hljs.registerLanguage(name, lang)
        postMessage({ type: 'registered', name })
      } catch (e) {
        postMessage({ type: 'register-error', name, error: String(e) })
      }
      return
    }

    // support detection-only messages
    if (msg.type === 'detect') {
      const mdText = msg.md || ''
      const supported = msg.supported || []
      const res = new Set()
      const re = /```\s*([a-zA-Z0-9_\-+]+)?/g
      let m
      while ((m = re.exec(mdText))) {
        if (m[1]) {
          const name = String(m[1]).toLowerCase()
          if (!name) continue
          if (name.length >= 5 && name.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(name)) res.add(name)
          const FALLBACK_KNOWN = new Set(['bash','sh','zsh','javascript','js','python','py','php','java','c','cpp','rust','go','ruby','perl','r','scala','swift','kotlin','cs','csharp','html','css','json','xml','yaml','yml','dockerfile','docker'])
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
    // Ensure highlight.js is available before parsing so the `highlighted`
    // option used by `marked` can call into `hljs`.
    await ensureHljs().catch(() => {})
    // Render HTML with marked (code highlighting happens via the highlighted option above)
    let html = marked.parse(content)
    // debug logs removed

    // Post-process headings and images using conservative string transforms
    // Generate unique ids for headings and build TOC. Use a counting map so
    // existing ids (from marked) are normalized and duplicates are renamed
    // deterministically (e.g., subtitle, subtitle-2).
    const heads = []
    const idCounts = new Map()
    const slugify = (s) => {
      try { return String(s || '').toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, '').replace(/\s+/g, '-') } catch (e) { return 'heading' }
    }
    html = html.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (full, lvl, attrs, inner) => {
      const level = Number(lvl)
      const text = inner.replace(/<[^>]+>/g, '').trim()
      // try to pick a base from any existing id attribute, otherwise slugify the text
      let existingId = null
      const idMatch = (attrs || '').match(/\sid="([^"]+)"/)
      if (idMatch) existingId = idMatch[1]
      const base = existingId || slugify(text) || 'heading'
      const prev = idCounts.get(base) || 0
      const idx = prev + 1
      idCounts.set(base, idx)
      const candidate = idx === 1 ? base : base + '-' + idx
      heads.push({ level, text, id: candidate })
      // add classes similar to main-thread post-processing
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
      // strip existing id/class and emit a single id + class list
      const cleanAttrs = (attrs || '').replace(/\s*(id|class)="[^"]*"/g, '')
      const newAttrs = (cleanAttrs + ` id="${candidate}" class="${classes}"`).trim()
      return `<h${level} ${newAttrs}>${inner}</h${level}>`
    })

    // mark images with data-want-lazy if loading not present
    // mark images with loading="lazy" if loading not present
    html = html.replace(/<img([^>]*)>/g, (full, attrs) => {
      if (/\bloading=/.test(attrs)) return `<img${attrs}>`
      if (/\bdata-want-lazy=/.test(attrs)) return `<img${attrs}>`
      return `<img${attrs} loading="lazy">`
    })
    // debug logs removed
    postMessage({ id, result: { html, meta: data || {}, toc: heads } })
  } catch (e) {
    postMessage({ id: msg.id, error: String(e) })
  }
}

// Exported handler to allow running the same logic inline in non-Worker
// environments (tests / Node). Returns an object suitable to post back to
// the caller: either `{ id, result }` or `{ id, error }`.
export async function handleWorkerMessage(msg) {
  try {
    if (msg && msg.type === 'register') {
      const { name, url } = msg
      try {
        const availableHljs = await ensureHljs()
        if (!availableHljs) return { type: 'register-error', name, error: 'hljs unavailable' }
        const mod = await import(url)
        const lang = mod.default || mod
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
      const re = /``\`\s*([a-zA-Z0-9_\-+]+)?/g
      let m
      while ((m = re.exec(mdText))) {
        if (m[1]) {
          const name = String(m[1]).toLowerCase()
          if (!name) continue
          if (name.length >= 5 && name.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(name)) res.add(name)
          const FALLBACK_KNOWN = new Set(['bash','sh','zsh','javascript','js','python','py','php','java','c','cpp','rust','go','ruby','perl','r','scala','swift','kotlin','cs','csharp','html','css','json','xml','yaml','yml','dockerfile','docker'])
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
    const slugify = (s) => {
      try { return String(s || '').toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, '').replace(/\s+/g, '-') } catch (e) { return 'heading' }
    }
    html = html.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (full, lvl, attrs, inner) => {
      const level = Number(lvl)
      const text = inner.replace(/<[^>]+>/g, '').trim()
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
