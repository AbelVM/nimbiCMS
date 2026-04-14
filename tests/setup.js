// Minimal test shims to emulate browser globals not present in the Node/jsdom test environment

// Lightweight markdown renderer to emulate the inlined worker used in-browser.
import { marked } from 'marked'
import { parseFrontmatter } from '../src/utils/frontmatter.js'
import * as slugMgr from '../src/slugManager.js'
import { u82o } from 'performance-helpers/powerBuffer'

// Stub Worker so code that constructs a Worker doesn't throw ReferenceError
if (typeof globalThis.Worker === 'undefined') {
  class TestWorker {
    constructor() {
      this._listeners = { message: [], error: [] }
      this.onmessage = null
      this.onerror = null
    }
    addEventListener(type, cb) {
      if (!this._listeners[type]) this._listeners[type] = []
      this._listeners[type].push(cb)
    }
    removeEventListener(type, cb) {
      if (!this._listeners[type]) return
      const i = this._listeners[type].indexOf(cb)
      if (i >= 0) this._listeners[type].splice(i, 1)
    }
    postMessage(msg) {
      // Handles PowerPool binary protocol (Uint8Array via o2u8) as well as
      // legacy plain-object messages. PowerPool sends binary; test utilities
      // that construct FakeWorkers send plain objects.
      try {
        const handle = async () => {
          // Decode PowerPool binary payload when present
          let data = msg || {}
          if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
            try { data = u82o(data) } catch (_) { data = {} }
          }
          const { correlationId } = data

          // Respond helper — PowerPool accepts plain {correlationId, response}
          const sendResponse = (result) => {
            const listeners = this._listeners.message.slice()
            for (const cb of listeners) cb({ data: { correlationId, response: result } })
          }

          if (data.type === 'render') {
            const md = data.md || ''
            const { content, data: fm } = parseFrontmatter(md)
            let html = marked.parse(content)
            // post-process: heading ids, lazy images, clean language-undefined
            try {
              const parser = new DOMParser()
              const doc = parser.parseFromString(html, 'text/html')
              const heads = doc.querySelectorAll('h1,h2,h3,h4,h5,h6')
              const slugify = (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9\- ]/g, '').replace(/ /g, '-').replace(/(?:-?)(?:md|html)$/, '')
              heads.forEach(h => { if (!h.id) h.id = slugify(h.textContent || '') })
              const imgs = doc.querySelectorAll('img')
              imgs.forEach(img => { try { if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy') } catch (_) {} })
              try {
                const codes = doc.querySelectorAll('pre code')
                codes.forEach(codeEl => {
                  try {
                    const rawCls = (codeEl.getAttribute && codeEl.getAttribute('class')) || codeEl.className || ''
                    const cleanedCls = String(rawCls ?? '').replace(/\blanguage-undefined\b|\blang-undefined\b/g, '').trim()
                    if (cleanedCls) {
                      try { codeEl.setAttribute && codeEl.setAttribute('class', cleanedCls) } catch (_) { codeEl.className = cleanedCls }
                    } else {
                      try { codeEl.removeAttribute && codeEl.removeAttribute('class') } catch (_) { codeEl.className = '' }
                    }
                  } catch (e) { /* ignore */ }
                })
              } catch (e) { /* ignore */ }
              html = doc.body.innerHTML
              const toc = []
              heads.forEach(h => { toc.push({ level: Number(h.tagName.substring(1)), text: (h.textContent || '').trim(), id: h.id }) })
              sendResponse({ html, meta: fm || {}, toc })
            } catch (e) {
              // fallback: simple TOC extraction
              const lines = content.split('\n')
              const toc = []
              for (const line of lines) {
                const m = line.match(/^(#{1,6})\s+(.*)$/)
                if (m) toc.push({ level: m[1].length, text: m[2].trim() })
              }
              sendResponse({ html, meta: fm || {}, toc })
            }
            return
          }

          if (data.type === 'register') {
            sendResponse({ registered: true })
            return
          }

          if (data.type === 'buildSearchIndex') {
            try {
              const result = await slugMgr.buildSearchIndex(data.contentBase)
              sendResponse(result)
            } catch (e) {
              sendResponse({ error: String(e) })
            }
            return
          }

          if (data.type === 'crawlForSlug') {
            try {
              const result = await slugMgr.crawlForSlug(data.slug, data.base, data.maxQueue)
              sendResponse(result)
            } catch (e) {
              sendResponse({ error: String(e) })
            }
            return
          }

          if (data.type === 'rewriteAnchors') {
            const { html, contentBase, pagePath } = data
            try {
              const parser = new DOMParser()
              const doc = parser.parseFromString(html || '', 'text/html')
              const dir = pagePath && pagePath.includes('/')
                ? pagePath.substring(0, pagePath.lastIndexOf('/') + 1)
                : ''
              for (const a of Array.from(doc.querySelectorAll('a'))) {
                try {
                  const href = a.getAttribute('href') || ''
                  if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('//') || href.startsWith('?')) continue
                  if (!href.endsWith('.md')) continue
                  const resolved = dir ? dir + href : href
                  let slug = slugMgr.mdToSlug.get(resolved) || slugMgr.mdToSlug.get(href)
                  if (!slug) {
                    // fetch the md file to discover its title/slug
                    try {
                      const url = new URL(resolved, contentBase).href
                      const resp = await fetch(url)
                      if (resp.ok) {
                        const text = await resp.text()
                        const titleMatch = text.match(/^#\s+(.+)$/m)
                        if (titleMatch) {
                          const title = titleMatch[1].trim()
                          const newSlug = title.toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, '').replace(/\s+/g, '-')
                          slugMgr.mdToSlug.set(resolved, newSlug)
                          slugMgr.slugToMd.set(newSlug, resolved)
                          slug = newSlug
                        }
                      }
                    } catch (_) {}
                  }
                  if (slug) a.setAttribute('href', `?page=${slug}`)
                } catch (_) {}
              }
              sendResponse(doc.body.innerHTML)
            } catch (e) {
              sendResponse(html)
            }
            return
          }
        }
        setTimeout(() => { handle().catch(e => { const errListeners = this._listeners.error.slice(); for (const cb of errListeners) cb({ message: String(e) }) }) }, 0)
      } catch (e) {
        const errListeners = this._listeners.error.slice()
        for (const cb of errListeners) cb({ message: String(e) })
      }
    }
    terminate() {
      this._listeners = { message: [], error: [] }
    }
  }
  // make it available globally
  globalThis.Worker = TestWorker
}

// Stub IntersectionObserver with minimal API
if (typeof globalThis.IntersectionObserver === 'undefined') {
  class TestIntersectionObserver {
    constructor(callback) {
      this._callback = callback
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return [] }
  }
  globalThis.IntersectionObserver = TestIntersectionObserver
}

// Wrap fetch so that if a mocked response lacks `clone()`, we provide a lightweight clone implementation.
// This preserves tests that return plain objects as responses.
if (typeof globalThis.fetch === 'function') {
  const _origFetch = globalThis.fetch.bind(globalThis)
  globalThis.fetch = async (...args) => {
    const res = await _origFetch(...args)
    if (res && typeof res.clone !== 'function') {
      // create a simple clone that mirrors common Response shape used by the codebase
      res.clone = () => {
        try {
          // shallow copy of enumerable properties
          return Object.assign({}, res)
        } catch (e) {
          return res
        }
      }
    }
    return res
  }
}

// Quiet noisy warnings from slugManager during tests. Tests assert behavior,
// not console output — so filter out repetitive fetch warnings to keep test
// logs focused. We only suppress messages that include the slugManager prefix.
if (typeof console !== 'undefined' && console.warn) {
  const _warn = console.warn.bind(console)
  console.warn = (...args) => {
    try {
      const s = args.map(a => (typeof a === 'string' ? a : String(a))).join(' ')
      if (s.includes('[slugManager]') || s.includes('fetchMarkdown failed')) return
    } catch (e) {}
    _warn(...args)
  }
}
