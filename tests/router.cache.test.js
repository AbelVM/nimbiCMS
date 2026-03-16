import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  RESOLUTION_CACHE_MAX,
  setResolutionCacheMax,
  RESOLUTION_CACHE_TTL,
  setResolutionCacheTtl,
  resolutionCache,
  resolutionCacheGet,
  resolutionCacheSet,
  _purgeExpiredEntries,
  augmentIndexWithAllMarkdownPaths,
  _clearIndexCache,
} from '../src/router.js'
import { indexSet } from '../src/indexManager.js'

describe('router cache helpers', () => {
  beforeEach(() => {
    resolutionCache.clear()
    indexSet.clear()
    // reset to defaults
    setResolutionCacheMax(100)
    setResolutionCacheTtl(5 * 60 * 1000)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('can adjust cache limits and ttl', () => {
    setResolutionCacheMax(2)
    expect(RESOLUTION_CACHE_MAX).toBe(2)

    setResolutionCacheTtl(1000)
    expect(RESOLUTION_CACHE_TTL).toBe(1000)
  })

  it('stores and retrieves entries with LRU behavior', () => {
    setResolutionCacheMax(2)
    resolutionCacheSet('a', { resolved: 'a', anchor: null })
    resolutionCacheSet('b', { resolved: 'b', anchor: 'x' })
    expect(resolutionCacheGet('a')).toEqual({ resolved: 'a', anchor: null })

    // Adding a third entry should evict oldest (b becomes oldest after get('a'))
    resolutionCacheSet('c', { resolved: 'c', anchor: null })
    expect(resolutionCacheGet('b')).toBeUndefined()
    expect(resolutionCacheGet('a')).toEqual({ resolved: 'a', anchor: null })
  })

  it('expires entries based on TTL', () => {
    vi.useFakeTimers()
    setResolutionCacheTtl(1000)

    resolutionCacheSet('a', { resolved: 'a', anchor: null })
    expect(resolutionCacheGet('a')).toEqual({ resolved: 'a', anchor: null })

    // Advance time past ttl
    vi.advanceTimersByTime(1500)
    expect(resolutionCacheGet('a')).toBeUndefined()
  })

  it('purges expired entries on demand', () => {
    vi.useFakeTimers()
    setResolutionCacheTtl(1000)

    resolutionCacheSet('a', { resolved: 'a', anchor: null })
    resolutionCacheSet('b', { resolved: 'b', anchor: null })

    vi.advanceTimersByTime(1500)
    _purgeExpiredEntries()
    expect(resolutionCache.size).toBe(0)
  })

  it('augmentIndexWithAllMarkdownPaths supports arrays and map-like objects', () => {
    augmentIndexWithAllMarkdownPaths(['x.md', '', null, 'y.md'])
    expect(indexSet.has('x.md')).toBe(true)
    expect(indexSet.has('y.md')).toBe(true)

    const m = new Map([['a', 'a.md'], ['b', 'b.md']])
    augmentIndexWithAllMarkdownPaths(m)
    expect(indexSet.has('a.md')).toBe(true)
    expect(indexSet.has('b.md')).toBe(true)
  })

  it('clear index cache resets state', () => {
    indexSet.add('foo.md')
    _clearIndexCache()
    expect(indexSet.size).toBe(0)
  })
})
