import { describe, it, expect, vi } from 'vitest'

describe('fetchMarkdown caching and dedupe', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('dedupes concurrent requests for the same URL', async () => {
    let calls = 0
    const fetchMock = vi.fn(async (url) => {
      calls += 1
      // simulate network latency
      await new Promise(r => setTimeout(r, 20))
      return { ok: true, text: async () => `content:${url}` }
    })
    vi.stubGlobal('fetch', fetchMock)

    const s = await import('../src/slugManager.js')
    s.clearFetchCache()

    const p1 = s.fetchMarkdown('a.md', '/')
    const p2 = s.fetchMarkdown('a.md', '/')

    const [r1, r2] = await Promise.all([p1, p2])
    expect(calls).toBe(1)
    expect(r1 && r1.raw).toContain('content:')
    expect(r2 && r2.raw).toContain('content:')
  })

  it('negative cache prevents repeated failed fetches until TTL expires', async () => {
    let calls = 0
    const fetchMock = vi.fn(async (url) => {
      calls += 1
      return { ok: false, status: 404, text: async () => 'not found' }
    })
    vi.stubGlobal('fetch', fetchMock)

    const s = await import('../src/slugManager.js')
    s.clearFetchCache()
    s.setNotFoundPage(null) // disable fallback to _404.md
    s.setFetchNegativeCacheTTL(50)

    // force fetch even when runtime would otherwise avoid network probes
    await expect(s.fetchMarkdown('b.md', '/', { force: true })).rejects.toThrow(/failed to fetch md/)
    expect(calls).toBe(1)

    // immediate retry should be blocked by negative cache (no new network call)
    await expect(s.fetchMarkdown('b.md', '/', { force: true })).rejects.toThrow(/failed to fetch md/)
    expect(calls).toBe(1)

    // wait for TTL to expire and try again
    await new Promise(r => setTimeout(r, 80))
    await expect(s.fetchMarkdown('b.md', '/', { force: true })).rejects.toThrow(/failed to fetch md/)
    expect(calls).toBe(2)
  })
})
