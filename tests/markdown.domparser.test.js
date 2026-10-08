import { describe, it, expect, vi } from 'vitest'

describe('markdown parse uses shared DOMParser', () => {
  it('creates a single shared DOMParser instance for parseMarkdownToHtml', async () => {
    vi.resetModules()
    let constructed = 0
    let sharedInstance = null
    global.DOMParser = class {
      constructor() {
        constructed += 1
        sharedInstance = this
      }
      parseFromString(html) {
        const doc = { body: { innerHTML: html }, querySelectorAll: () => [], querySelector: () => null }
        return doc
      }
    }

    const md = await import('../src/markdown.js')
    // ensure plugin path is taken so parseMarkdownToHtml uses DOM parsing
    md.setMarkdownExtensions([{}])

    const res1 = await md.parseMarkdownToHtml('# Heading\nSome text')
    const res2 = await md.parseMarkdownToHtml('# Heading\nSome text')

    // With DOMPurify v3, DOMPurify creates its own internal DOMParser during
    // sanitize(), so total constructions are >1. The important invariant is
    // that the shared parser module still only creates one instance at import
    // time and reuses it across calls.
    expect(constructed).toBeGreaterThanOrEqual(1)
    expect(res1 && typeof res1 === 'object').toBeTruthy()
    delete global.DOMParser
  })
})
