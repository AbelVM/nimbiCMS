// Minimal test shims to emulate browser globals not present in the Node/jsdom test environment

// Lightweight markdown renderer to emulate the inlined worker used in-browser.
import { marked } from 'marked'
import { parseFrontmatter } from '../src/utils/frontmatter.js'
import * as slugMgr from '../src/slugManager.js'

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
      // emulate the renderer worker for `render` messages so tests exercise
      // the same parsing/TOC extraction as the real worker. Keep async
      // semantics via setTimeout.
      try {
        const handle = async () => {
          const data = msg || {}
          if (data.type === 'render') {
            const id = data.id
            const md = data.md || ''
            const { content, data: fm } = parseFrontmatter(md)
            let html = marked.parse(content)
            // post-process similarly to inline parser: assign heading ids,
            // lazy-load images, and clean language-undefined classes on code.
            try {
              const parser = new DOMParser()
              const doc = parser.parseFromString(html, 'text/html')
              const heads = doc.querySelectorAll('h1,h2,h3,h4,h5,h6')
              // simple slugify used by parser: keep consistent with tests
              const slugify = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9\- ]/g, '').replace(/ /g, '-').replace(/(?:-?)(?:md|html)$/, '')
              heads.forEach(h => { if (!h.id) h.id = slugify(h.textContent || '') })
              const imgs = doc.querySelectorAll('img')
              imgs.forEach(img => { try { if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy') } catch (_) {} })
              try {
                const codes = doc.querySelectorAll('pre code')
                codes.forEach(codeEl => {
                  try {
                    const rawCls = (codeEl.getAttribute && codeEl.getAttribute('class')) || codeEl.className || ''
                    const cleanedCls = String(rawCls || '').replace(/\blanguage-undefined\b|\blang-undefined\b/g, '').trim()
                    if (cleanedCls) {
                      try { codeEl.setAttribute && codeEl.setAttribute('class', cleanedCls) } catch (_) { codeEl.className = cleanedCls }
                    } else {
                      try { codeEl.removeAttribute && codeEl.removeAttribute('class') } catch (_) { codeEl.className = '' }
                    }
                    const cls = cleanedCls
                    const match = cls.match(/language-([a-zA-Z0-9_+-]+)/) || cls.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/)
                    if (!match || !match[1]) {
                      // leave code unchanged; tests for highlight fallback expect this
                    }
                  } catch (e) { /* ignore */ }
                })
              } catch (e) { /* ignore */ }
              html = doc.body.innerHTML
              const docToc = []
              heads.forEach(h => { docToc.push({ level: Number(h.tagName.substring(1)), text: (h.textContent || '').trim(), id: h.id }) })
              const toc = docToc
              const out = { id, result: { html, meta: fm || {}, toc } }
              const listeners = this._listeners.message.slice()
              for (const cb of listeners) cb({ data: out })
              return
            } catch (e) {
              // fallback to simple toc extraction
              const lines = content.split('\n')
              const toc = []
              for (const line of lines) {
                const m = line.match(/^(#{1,6})\s+(.*)$/)
                if (m) toc.push({ level: m[1].length, text: m[2].trim() })
              }
              const out = { id, result: { html, meta: fm || {}, toc } }
              const listeners = this._listeners.message.slice()
              for (const cb of listeners) cb({ data: out })
              return
            }
            const out = { id, result: { html, meta: fm || {}, toc } }
            // notify listeners
            const listeners = this._listeners.message.slice()
            for (const cb of listeners) cb({ data: out })
            return
          }
            if (data.type === 'register') {
            const name = data.name
            const out = { type: 'registered', name }
            const listeners = this._listeners.message.slice()
            for (const cb of listeners) cb({ data: { id: data.id, result: { registered: true } } })
            return
            }
            // slugWorker message types: delegate to slugManager internals when possible
            if (data.type === 'buildSearchIndex') {
              try {
                const result = await slugMgr.buildSearchIndex(data.contentBase)
                const listeners = this._listeners.message.slice()
                for (const cb of listeners) cb({ data: { id: data.id, result } })
              } catch (e) {
                const listeners = this._listeners.message.slice()
                for (const cb of listeners) cb({ data: { id: data.id, error: String(e) } })
              }
              return
            }
            if (data.type === 'crawlForSlug') {
              try {
                const result = await slugMgr.crawlForSlug(data.slug, data.base, data.maxQueue)
                const listeners = this._listeners.message.slice()
                for (const cb of listeners) cb({ data: { id: data.id, result } })
              } catch (e) {
                const listeners = this._listeners.message.slice()
                for (const cb of listeners) cb({ data: { id: data.id, error: String(e) } })
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
