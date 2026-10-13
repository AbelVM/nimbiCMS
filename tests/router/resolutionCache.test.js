import { describe, it, expect, beforeEach } from 'vitest'
import { resolutionCache, resolutionCacheSet, resolutionCacheGet, setResolutionCacheTtl, setResolutionCacheMax } from '../../src/router.js'

describe('router resolution cache behavior', () => {
  beforeEach(() => {
    resolutionCache.clear()
    setResolutionCacheTtl(5 * 60 * 1000)
    setResolutionCacheMax(100)
  })

  it('evicts expired entries based on TTL', () => {
    setResolutionCacheTtl(60 * 1000)
    resolutionCacheSet('k1', { resolved: 'a', anchor: null })
    const rec = resolutionCache.get('k1')
    expect(rec).toEqual({ resolved: 'a', anchor: null })
    // Simulate a legacy { value, ts } record written by older helpers
    resolutionCache.set('k1', { value: rec, ts: Date.now() - 100000 })
    expect(resolutionCacheGet('k1')).toBeUndefined()
  })

  it('evicts oldest entry when exceeding max size', () => {
    setResolutionCacheMax(1)
    resolutionCacheSet('a', { resolved: 'x', anchor: null })
    resolutionCacheSet('b', { resolved: 'y', anchor: null })
    expect(resolutionCache.has('a')).toBe(false)
    expect(resolutionCache.has('b')).toBe(true)
  })
})
