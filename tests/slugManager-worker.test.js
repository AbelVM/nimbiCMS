import { describe, it, expect, vi } from 'vitest'

describe('slugManager worker integration', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('buildSearchIndexWorker and crawlForSlugWorker proxy to worker', async () => {
    vi.doMock('../src/worker-manager.js', () => {
      const fakePool = {
        get: () => ({ /* marker */ }),
        send: (msg) => {
          if (msg && msg.type === 'buildSearchIndex') return Promise.resolve([{ slug: 'a', title: 'A', excerpt: 'x', path: '/a.md' }])
          if (msg && msg.type === 'crawlForSlug') return Promise.resolve('/a.md')
          return Promise.resolve(null)
        },
        terminate: () => {}
      }
      return { makeWorkerPool: () => fakePool, createWorkerFromRaw: () => null }
    })

    const s = await import('../src/slugManager.js')
    const idx = await s.buildSearchIndexWorker('/content')
    expect(Array.isArray(idx)).toBe(true)
    expect(idx[0] && idx[0].slug).toBe('a')

    const found = await s.crawlForSlugWorker('a', '/content', 2)
    expect(found).toBe('/a.md')
  })

  it('buildSearchIndexWorker throws when worker unavailable', async () => {
    vi.doMock('../src/worker-manager.js', () => {
      const fakePool = { get: () => null, send: () => Promise.reject(new Error('no worker')), terminate: () => {} }
      return { makeWorkerPool: () => fakePool, createWorkerFromRaw: () => null }
    })
    const s = await import('../src/slugManager.js')
    await expect(s.buildSearchIndexWorker('/content')).rejects.toThrow(/slug worker required but unavailable/)
  })
})
