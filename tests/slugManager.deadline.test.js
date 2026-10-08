import { it, expect, vi } from 'vitest'

const created = []
vi.mock('performance-helpers/powerDeadline', () => {
  return {
    PowerDeadline: class {
      constructor(opts) {
        this.opts = opts
        this.signal = { addEventListener: () => {} }
        created.push(this)
      }
      async run(fn) { return await fn() }
    }
  }
})

it('uses a per-request PowerDeadline and passes its signal to fetch', async () => {
  vi.resetModules()

  const slugMgr = await import('../src/slugManager.js')
  try {
    // Ensure no cached fetch result interferes
    try { slugMgr.fetchCache.clear() } catch (_) {}

    const origFetch = global.fetch
    try {
      global.fetch = vi.fn().mockImplementation((url, opts) => {
        expect(created.length).toBe(1)
        expect(created[0].opts && created[0].opts.timeout).toBe(1234)
        expect(opts && opts.signal).toBe(created[0].signal)
        return Promise.resolve({ ok: true, text: async () => 'ok' })
      })

      const res = await slugMgr.fetchMarkdown('some.md', '/content', { timeoutMs: 1234 })
      expect(res && res.raw).toBe('ok')
    } finally {
      global.fetch = origFetch
    }
  } finally {
    // nothing to clean up here; mock is top-level and intentionally persistent for this test file
  }
})
