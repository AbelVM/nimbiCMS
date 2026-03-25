import { describe, it, expect, vi } from 'vitest'

// Top-level mocks so vitest hoisting is consistent.
vi.mock('highlight.js/lib/core', () => ({ __esModule: true, default: { getLanguage: () => undefined } }))
const sendMock = vi.fn().mockResolvedValue({ html: '<p><img src="/logo.png" alt="logo"></p><p>Keep me</p>', meta: {}, toc: [] })
vi.mock('../../src/worker-manager.js', () => ({ __esModule: true, makeWorkerPool: (factory, name, size) => ({ get: () => ({}), send: sendMock, terminate: () => {} }) }))

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
