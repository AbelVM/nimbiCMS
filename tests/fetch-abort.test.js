import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('fetchMarkdown abort handling', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('does not negative-cache aborted requests and clears fetchCache', async () => {
    let calls = 0
    const fetchMock = vi.fn((url, opts) => {
      calls += 1
      return new Promise((resolve, reject) => {
        const signal = opts && opts.signal
        if (signal) {
          if (signal.aborted) {
            const err = new Error('aborted')
            err.name = 'AbortError'
            return reject(err)
          }
          const onAbort = () => {
            const err = new Error('aborted')
            err.name = 'AbortError'
            try { signal.removeEventListener && signal.removeEventListener('abort', onAbort) } catch (_) {}
            reject(err)
          }
          signal.addEventListener && signal.addEventListener('abort', onAbort)
        }
        // simulate network latency
        setTimeout(() => resolve({ ok: true, text: async () => `content:${url}` }), 40)
      })
    })

    vi.stubGlobal('fetch', fetchMock)

    const s = await import('../src/slugManager.js')
    s.clearFetchCache()
    s.setNotFoundPage(null)
    s.setFetchNegativeCacheTTL(10000)

    const ac = new AbortController()
    const p = s.fetchMarkdown('aborttest.md', '/', { signal: ac.signal, force: true })
    // abort immediately
    ac.abort()

    await expect(p).rejects.toThrow()

    const url = 'http://localhost/aborttest.md'
    // aborted requests must NOT be added to the negative cache
    expect(s.negativeFetchCache.get(url)).toBeUndefined()
    // and fetchCache should not retain the aborted entry
    expect(s.fetchCache.has(url)).toBe(false)

    // retrying should attempt a fresh network call and succeed
    const r2 = await s.fetchMarkdown('aborttest.md', '/', { force: true })
    expect(r2 && r2.raw).toContain('content:')
    expect(calls).toBe(2)
  })
})
