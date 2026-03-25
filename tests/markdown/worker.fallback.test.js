import { describe, it, expect, vi } from 'vitest'

// Top-level mocks so vitest hoisting behavior is consistent and
// other tests in the file aren't impacted by nested mocks.
vi.mock('highlight.js/lib/core', () => ({ __esModule: true, default: { getLanguage: () => undefined } }))
const sendMock = vi.fn().mockResolvedValue({ html: '<h1>FromWorker</h1>', meta: {}, toc: [{ level: 1, text: 'FromWorker', id: 'fromworker' }] })
vi.mock('../../src/worker-manager.js', () => ({ __esModule: true, makeWorkerPool: (factory, name, size) => ({ get: () => ({}), send: sendMock, terminate: () => {} }) }))

describe('parseMarkdownToHtml — worker path', () => {
  it('calls renderer worker via _sendToRenderer when HLJS not used', async () => {
    vi.resetModules()
    const mdModule = await import('../../src/markdown.js')
    // Ensure plugin path is disabled so parseMarkdownToHtml hits worker path.
    const saved = Array.isArray(mdModule.markdownPlugins) ? [...mdModule.markdownPlugins] : []
    mdModule.setMarkdownExtensions([])

    const res = await mdModule.parseMarkdownToHtml('plain text without codeblocks')
    expect(sendMock).toHaveBeenCalled()
    expect(res && res.html).toContain('FromWorker')

    mdModule.setMarkdownExtensions(saved)
  })
})
