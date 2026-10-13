import { describe, it, expect, beforeEach, vi } from 'vitest'

// Instead of instantiating a Worker (not available in node environment),
// we'll import the worker script and invoke its onmessage handler directly.
// The module sets `global.onmessage` when loaded.

let handler

beforeEach(() => {
  // stub global.fetch for any operations the worker may perform
  global.fetch = vi.fn(async (url) => ({ ok: false, status: 404, text: () => Promise.resolve('') }))
  // clear any existing handler
  handler = null
  // load worker script
  return import('../src/worker/slugWorker.js').then(() => {
    handler = global.onmessage
  })
})

describe('slug worker API (direct invocation)', () => {
  it('responds to buildSearchIndex messages', async () => {
    expect(typeof handler).toBe('function')
    const promise = new Promise(r => {
      // patch postMessage for the test
      global.postMessage = (msg) => r(msg)
    })
    handler({ data: { type: 'buildSearchIndex', id: '1', contentBase: '/base/' } })
    const res = await promise
    expect(res.id).toBe('1')
    expect(Array.isArray(res.result)).toBe(true)
  })

  it('responds to crawlForSlug messages', async () => {
    const promise = new Promise(r => { global.postMessage = (msg) => r(msg) })
    handler({ data: { type: 'crawlForSlug', id: '2', slug: 'foo', base: '/base/' } })
    const res = await promise
    expect(res.id).toBe('2')
    expect(res.result).toBeNull()
  })

  it('passes seedPaths through buildSearchIndex worker messages', async () => {
    vi.resetModules()
    const buildSearchIndex = vi.fn(async () => ['ok'])
    vi.doMock('../src/slugSearchRuntime.js', () => ({
      buildSearchIndex,
      crawlForSlug: vi.fn(async () => null),
    }))
    await import('../src/worker/slugWorker.js')
    const localHandler = global.onmessage
    const promise = new Promise((resolve) => {
      global.postMessage = (msg) => resolve(msg)
    })
    localHandler({
      data: {
        type: 'buildSearchIndex',
        id: '3',
        contentBase: '/base/',
        indexDepth: 2,
        noIndexing: ['skip'],
        seedPaths: ['assets/brochure.md', 'assets/navigation.md'],
      },
    })
    const res = await promise
    expect(res.id).toBe('3')
    expect(buildSearchIndex).toHaveBeenCalledWith(
      '/base/',
      2,
      ['skip'],
      ['assets/brochure.md', 'assets/navigation.md'],
    )
  })
})