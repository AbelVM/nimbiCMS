import { describe, it, expect, vi } from 'vitest'

// Top-level mocks so vitest hoisting is consistent.
vi.mock('highlight.js/lib/core', () => ({ __esModule: true, default: { getLanguage: () => undefined } }))

vi.mock('performance-helpers/powerPool', () => ({
  PowerPool: class {
    constructor(source, opts) {
      this.workers = [{ worker: { _underlying: {} } }]
    }
    postMessage() {
      return Promise.resolve({ html: '<p><img src="/logo.png" alt="logo"></p><p>Keep me</p>', meta: {}, toc: [] })
    }
  }
}))

describe('parseMarkdownToHtml moved logo removal', () => {
  it('removes images that match data-nimbi-logo-moved', async () => {
    vi.resetModules()
    const mdModule = await import('../../src/markdown.js')
    const movedAbs = new URL('/logo.png', location.href).toString()
    document.documentElement.setAttribute('data-nimbi-logo-moved', movedAbs)
    const saved = Array.isArray(mdModule.markdownPlugins) ? [...mdModule.markdownPlugins] : []
    mdModule.setMarkdownExtensions([])

    const res = await mdModule.parseMarkdownToHtml('some content')
    expect(res.html).not.toContain('logo.png')
    expect(res.html).not.toContain('<img')

    mdModule.setMarkdownExtensions(saved)
  })
})
