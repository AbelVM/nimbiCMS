import { describe, it, expect, vi } from 'vitest'

// Disable HLJS branch so we go through the worker-render path.
vi.mock('highlight.js/lib/core', () => ({ __esModule: true, default: { getLanguage: () => undefined } }))

vi.mock('performance-helpers/powerPool', () => ({
  PowerPool: class {
    constructor(source, opts) {
      this.workers = [{ worker: { _underlying: {} } }]
    }
    postMessage() {
      return Promise.resolve({ html: '<p><img src="/logo.png" alt="logo"></p><p>Keep</p>', meta: {}, toc: [] })
    }
  }
}))

describe('parseMarkdownToHtml moved logo removal without XMLSerializer', () => {
  it('uses node-serialization fallback when XMLSerializer is unavailable', async () => {
    // Provide HTML containing the logo image via _sendToRenderer mock
    const movedAbs = new URL('/logo.png', location.href).toString()
    document.documentElement.setAttribute('data-nimbi-logo-moved', movedAbs)

    vi.resetModules()
    const mdModule = await import('../../src/markdown.js')

    const prev = global.XMLSerializer
    try {
      delete global.XMLSerializer

      const res = await mdModule.parseMarkdownToHtml('content')
      expect(res.html).not.toContain('logo.png')
      expect(res.html).toContain('Keep')
    } finally {
      if (prev === undefined) delete global.XMLSerializer
      else global.XMLSerializer = prev
    }
  })
})
