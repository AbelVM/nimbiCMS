import { test, expect } from 'vitest'
import * as router from '../src/router.js'

test('resolutionCacheGet removes expired entries', () => {
  const key = 'expired|||en'
  const val = { resolved: 'x', anchor: null }
  const expiredTs = Date.now() - (router.RESOLUTION_CACHE_TTL + 1000)
  router.resolutionCache.set(key, { value: val, ts: expiredTs })
  const got = router.resolutionCacheGet(key)
  expect(got).toBeUndefined()
  expect(router.resolutionCache.has(key)).toBe(false)
})

test('resolutionCacheSet evicts oldest when over max', () => {
  const origMax = router.RESOLUTION_CACHE_MAX
  try {
    router.setResolutionCacheMax(1)
    router.resolutionCache.clear()
    router.resolutionCacheSet('k1', { resolved: 'r1', anchor: null })
    router.resolutionCacheSet('k2', { resolved: 'r2', anchor: null })
    expect(router.resolutionCache.size).toBe(1)
    expect(router.resolutionCache.has('k2')).toBe(true)
  } finally {
    router.setResolutionCacheMax(origMax)
    router.resolutionCache.clear()
  }
})

test('buildPageCandidates returns index path when indexSet contains match', () => {
  router.augmentIndexWithAllMarkdownPaths(['docs/alpha.md'])
  const candidates = router.buildPageCandidates('alpha')
  expect(candidates).toContain('docs/alpha.md')
  router._clearIndexCache()
})

test('buildPageCandidates returns explicit md/html unchanged', () => {
  const cand = router.buildPageCandidates('foo/bar.md')
  expect(cand).toContain('foo/bar.md')
})
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  augmentIndexWithAllMarkdownPaths,
  _clearIndexCache,
  resolutionCache,
  resolutionCacheSet,
  resolutionCacheGet,
  setResolutionCacheMax,
  setResolutionCacheTtl,
  _purgeExpiredEntries,
  buildPageCandidates,
  RESOLUTION_CACHE_MAX,
  RESOLUTION_CACHE_TTL
} from '../src/router.js'
import { indexSet } from '../src/indexManager.js'
import { slugToMd } from '../src/slugManager.js'

describe('router cache and index helpers', () => {
  let origMax
  let origTtl

  beforeEach(() => {
    origMax = RESOLUTION_CACHE_MAX
    origTtl = RESOLUTION_CACHE_TTL
    resolutionCache.clear()
    indexSet.clear()
    slugToMd.clear()
  })

  afterEach(() => {
    try { setResolutionCacheMax(origMax) } catch (_) {}
    try { setResolutionCacheTtl(origTtl) } catch (_) {}
    resolutionCache.clear()
    indexSet.clear()
    slugToMd.clear()
  })

  it('augmentIndexWithAllMarkdownPaths handles arrays and map-like objects', () => {
    indexSet.clear()
    augmentIndexWithAllMarkdownPaths(['a.md', '', null, 'b.md'])
    expect(indexSet.has('a.md')).toBe(true)
    expect(indexSet.has('b.md')).toBe(true)

    indexSet.clear()
    const m = new Map([['x', 'c.md'], ['y', null]])
    augmentIndexWithAllMarkdownPaths(m)
    expect(indexSet.has('c.md')).toBe(true)
  })

  it('_clearIndexCache empties the index set', () => {
    indexSet.add('one.md')
    expect(indexSet.size).toBeGreaterThan(0)
    _clearIndexCache()
    expect(indexSet.size).toBe(0)
  })

  it('resolutionCacheSet/get respects max size and evicts least-recently-used', () => {
    setResolutionCacheMax(1)
    resolutionCache.clear()
    resolutionCacheSet('a', { resolved: 'a', anchor: null })
    expect(resolutionCacheGet('a')).toEqual({ resolved: 'a', anchor: null })
    resolutionCacheSet('b', { resolved: 'b', anchor: null })
    // 'a' should be evicted due to max size = 1
    expect(resolutionCacheGet('a')).toBeUndefined()
    expect(resolutionCacheGet('b')).toEqual({ resolved: 'b', anchor: null })
  })

  it('purges expired entries according to TTL', () => {
    resolutionCache.clear()
    setResolutionCacheTtl(1)
    // Insert an artificially old entry
    resolutionCache.set('old', { value: { resolved: 'old', anchor: null }, ts: Date.now() - 100000 })
    _purgeExpiredEntries()
    expect(resolutionCache.has('old')).toBe(false)
  })

  it('buildPageCandidates handles explicit files, slug mappings and index discovery', () => {
    // explicit file
    const explicit = buildPageCandidates('foo.md')
    expect(explicit).toContain('foo.md')

    // slug mapping without extension should produce val and val.html
    slugToMd.set('my-slug', 'folder/path')
    const mapped = buildPageCandidates('my-slug')
    expect(mapped).toContain('folder/path')
    expect(mapped).toContain('folder/path.html')

    // indexSet discovery: when slugToMd doesn't have it, indexSet entries are considered
    slugToMd.delete('my-slug')
    indexSet.clear()
    indexSet.add('some/path/slug.md')
    const idx = buildPageCandidates('slug')
    expect(idx).toContain('some/path/slug.md')
  })
})
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
