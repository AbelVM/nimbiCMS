import { describe, it, expect, vi } from 'vitest'

// Disable HLJS branch so we go through the worker-render path.
vi.mock('highlight.js/lib/core', () => ({ __esModule: true, default: { getLanguage: () => undefined } }))

// Mock worker-manager to return a result containing an image that
// should be removed when `data-nimbi-logo-moved` is set.
vi.mock('../../src/worker-manager.js', () => ({
  __esModule: true,
  makeWorkerPool: (factory, name, size) => ({
    get: () => ({}),
    send: async () => ({ html: '<p><img src="/logo.png" alt="logo"></p><p>Keep</p>', meta: {}, toc: [] })
  })
}))

describe('parseMarkdownToHtml moved logo removal without XMLSerializer', () => {
  it('uses node-serialization fallback when XMLSerializer is unavailable', async () => {
    vi.resetModules()
    const mdModule = await import('../../src/markdown.js')

    // set moved logo absolute URL so removal logic runs
    const movedAbs = new URL('/logo.png', location.href).toString()
    document.documentElement.setAttribute('data-nimbi-logo-moved', movedAbs)

    // Temporarily remove XMLSerializer to force the alternate serialization branch
    const prev = global.XMLSerializer
    try {
      // remove XMLSerializer
      // eslint-disable-next-line no-undef
      // @ts-ignore
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
