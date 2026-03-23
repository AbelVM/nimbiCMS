import { describe, it, expect, vi } from 'vitest'

describe('markdown worker integration', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('parseMarkdownToHtml uses the worker pool and returns renderer output', async () => {
    vi.doMock('../src/worker-manager.js', () => {
      const fakePool = {
        get: () => ({ /* presence marker */ }),
        send: (msg) => {
          if (msg && msg.type === 'render') return Promise.resolve({ html: `<p>rendered:${String(msg.md)}</p>`, meta: {}, toc: [] })
          return Promise.resolve(null)
        },
        terminate: () => {}
      }
      return { makeWorkerPool: () => fakePool, createWorkerFromRaw: () => null }
    })

    const md = await import('../src/markdown.js')
    const res = await md.parseMarkdownToHtml('Hello world')
    expect(res && res.html).toBe('<p>rendered:Hello world</p>')
  })
})
