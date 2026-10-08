import { it, expect, vi } from 'vitest'

const created = []
let retryAttempts = 0
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
vi.mock('performance-helpers/powerRetry', () => ({
  PowerRetry: class {
    constructor(opts) { this.opts = opts }
    async run(fn) {
      let lastError
      for (let attempt = 0; attempt < this.opts.maxAttempts; attempt++) {
        retryAttempts++
        try { return await fn() } catch (error) { lastError = error }
      }
      throw lastError
    }
  }
}))

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
        expect(created[0].opts && created[0].opts.totalTimeout).toBe(1234)
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

it('does not retry twice when PowerRetry exhausts its attempts', async () => {
  vi.resetModules()
  retryAttempts = 0
  const slugMgr = await import('../src/slugManager.js')
  const origFetch = global.fetch
  try {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 503 })
    await expect(slugMgr.fetchMarkdown('retry.md', '/', { force: true })).rejects.toThrow('failed to fetch md')
    expect(retryAttempts).toBe(3)
    expect(global.fetch).toHaveBeenCalledTimes(3)
  } finally {
    global.fetch = origFetch
  }
})
