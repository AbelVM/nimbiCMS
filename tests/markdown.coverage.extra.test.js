import { describe, it, expect, vi } from 'vitest'

describe('markdown additional coverage', () => {
  it('imports with navigator present to exercise poolSize branch', async () => {
    vi.resetModules()
    const origNavigator = global.navigator
    try {
      // simulate a browser-like environment before importing the module
      // so the top-level poolSize expression takes the navigator path
      // eslint-disable-next-line no-global-assign
      global.navigator = { hardwareConcurrency: 8 }
      const md = await import('../src/markdown.js')
      expect(md).toBeTruthy()
      // ensure initRendererWorker can be invoked
      const w = md.initRendererWorker && md.initRendererWorker()
      expect(w !== undefined).toBe(true)
    } finally {
      // restore
      // eslint-disable-next-line no-global-assign
      global.navigator = origNavigator
    }
  })

  it('uses a DOMParser shim in plugin path and builds a toc', async () => {
    vi.resetModules()
    const origDOMParser = global.DOMParser
    try {
      class SimpleDOMParser {
        parseFromString(html) {
          const doc = {}
          doc.body = { innerHTML: html }
          doc.querySelectorAll = (selector) => {
            // headings
            if (/h1,h2,h3,h4,h5,h6/.test(selector)) {
              const re = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g
              const out = []
              let m
              // eslint-disable-next-line no-cond-assign
              while ((m = re.exec(html))) {
                out.push({
                  tagName: 'H' + m[1],
                  textContent: (m[2] || '').replace(/<[^>]+>/g, '').trim(),
                  getAttribute: () => null,
                  setAttribute: function (n, v) { this[n] = v },
                  className: '',
                  id: ''
                })
              }
              return out
            }

            // images
            if (/img/.test(selector)) {
              const re = /<img([^>]*)>/g
              const out = []
              let m
              // eslint-disable-next-line no-cond-assign
              while ((m = re.exec(html))) {
                const attrs = {}
                const attrRe = /([a-zA-Z0-9-_:]+)=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g
                let am
                // eslint-disable-next-line no-cond-assign
                while ((am = attrRe.exec(m[1]))) {
                  attrs[am[1]] = am[2] || am[3] || am[4] || ''
                }
                out.push({
                  getAttribute: (n) => attrs[n] || null,
                  setAttribute: (n, v) => { attrs[n] = v },
                  remove: () => { this._removed = true }
                })
              }
              return out
            }

            // code elements
            if (/code/.test(selector)) {
              const re = /<code(?: class="([^"]*)")?>([\s\S]*?)<\/code>/g
              const out = []
              let m
              // eslint-disable-next-line no-cond-assign
              while ((m = re.exec(html))) {
                const cls = m[1] || ''
                out.push({
                  getAttribute: (n) => (n === 'class' ? cls : null),
                  setAttribute: (n, v) => { this._attrs = this._attrs || {}; this._attrs[n] = v },
                  removeAttribute: (n) => { this._attrs = this._attrs || {}; delete this._attrs[n] },
                  className: cls
                })
              }
              return out
            }

            return []
          }
          return doc
        }
      }

      // eslint-disable-next-line no-global-assign
      global.DOMParser = SimpleDOMParser
      const md = await import('../src/markdown.js')
      // ensure plugin path is taken
      md.setMarkdownExtensions([])
      md.addMarkdownExtension({})
      const input = '# Hello World\n\n<img src="/logo.png">\n\n<pre><code class="language-undefined">code</code></pre>\n'
      const res = await md.parseMarkdownToHtml(input)
      expect(res).toBeTruthy()
      expect(Array.isArray(res.toc)).toBe(true)
      expect(res.toc.length).toBeGreaterThan(0)
    } finally {
      // eslint-disable-next-line no-global-assign
      global.DOMParser = origDOMParser
    }
  })

  it('detectFenceLanguages accepts long unknown language names', async () => {
    vi.resetModules()
    const md = await import('../src/markdown.js')
    const res = md.detectFenceLanguages('```foobarbaz\nconsole.log(1)\n```')
    expect(res.has('foobarbaz')).toBe(true)
  })
})
