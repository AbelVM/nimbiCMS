import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('importCache: negative-cache TTL and single-flight dedupe', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('single-flight dedupe: concurrent callers call loader only once', async () => {
    const mod = await import('../src/utils/importCache.js')
    const { runImportWithCache, clearImportCache } = mod
    clearImportCache()

    let calls = 0
    let resolvePromise
    const p = new Promise((res) => { resolvePromise = res })
    const loader = async () => { calls++; return await p }

    const pa = runImportWithCache('sf-key', loader)
    const pb = runImportWithCache('sf-key', loader)

    // satisfy the underlying loader once
    resolvePromise({ value: 123 })

    const [a, b] = await Promise.all([pa, pb])
    expect(calls).toBe(1)
    expect(a).toEqual({ value: 123 })
    expect(b).toBe(a)
  })

  it('negative-cache TTL prevents retries until expiry', async () => {
    vi.useFakeTimers()
    const baseTime = Date.now()
    vi.setSystemTime(baseTime)

    const mod = await import('../src/utils/importCache.js')
    const { runImportWithCache, clearImportCache, setImportNegativeCacheTTL } = mod
    clearImportCache()
    setImportNegativeCacheTTL(1000) // 1s

    // first loader fails -> null and sets negative entry
    const loaderFail = async () => null
    const first = await runImportWithCache('neg-key', loaderFail)
    expect(first).toBeNull()

    // attempt to load again with a success loader; should NOT be called while negative cache active
    let called = 0
    const loaderSuccess = async () => { called++; return 'ok' }
    const second = await runImportWithCache('neg-key', loaderSuccess)
    expect(second).toBeNull()
    expect(called).toBe(0)

    // advance past TTL and retry — now the success loader should run
    vi.setSystemTime(baseTime + 2000)
    const third = await runImportWithCache('neg-key', loaderSuccess)
    expect(third).toBe('ok')
    expect(called).toBe(1)

    vi.useRealTimers()
  })
})
