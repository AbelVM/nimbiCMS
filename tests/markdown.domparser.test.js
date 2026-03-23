import { describe, it, expect, vi } from 'vitest'

describe('markdown parse uses shared DOMParser', () => {
  it('creates a single shared DOMParser instance for parseMarkdownToHtml', async () => {
    vi.resetModules()
    let constructed = 0
    global.DOMParser = class {
      constructor() { constructed += 1 }
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

    expect(constructed).toBe(1)
    expect(res1 && typeof res1 === 'object').toBeTruthy()
    delete global.DOMParser
  })
})
