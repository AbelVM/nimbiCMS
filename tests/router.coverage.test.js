import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock slugManager before importing router so router picks up our maps
vi.mock('../src/slugManager.js', async (importOriginal) => {
  const actual = await importOriginal()
  const slugToMd = new Map()
  slugToMd.set('about', 'pages/about')
  return {
    ...actual,
    slugToMd,
    resolveSlugPath: (s) => undefined,
    slugify: (s) => String(s || '').toLowerCase().replace(/[^a-z0-9\-\s]+/g, '').replace(/\s+/g, '-')
  }
})

import {
  buildPageCandidates,
  resolutionCacheSet,
  resolutionCacheGet,
  setResolutionCacheMax,
  setResolutionCacheTtl,
  _purgeExpiredEntries,
  augmentIndexWithAllMarkdownPaths,
  _clearIndexCache
} from '../src/router.js'
import { indexSet } from '../src/indexManager.js'

describe('router coverage focused tests', () => {
  beforeEach(() => {
    // reset shared indexSet
    indexSet.clear()
    _clearIndexCache()
    setResolutionCacheMax(100)
    setResolutionCacheTtl(5 * 60 * 1000)
  })

  it('buildPageCandidates returns explicit md/html directly', () => {
    const res = buildPageCandidates('some/page.md')
    expect(res).toContain('some/page.md')
    const res2 = buildPageCandidates('other/page.html')
    expect(res2).toContain('other/page.html')
  })

  it('buildPageCandidates uses slugToMd mapping when available', () => {
    const res = buildPageCandidates('about')
    // our mocked slugToMd maps 'about' -> 'pages/about' (no extension)
    expect(res[0]).toBe('pages/about')
    expect(res[1]).toBe('pages/about.html')
  })

  it('augmentIndexWithAllMarkdownPaths accepts arrays and maps', () => {
    augmentIndexWithAllMarkdownPaths(['a.md', 'b.md', ''])
    expect(indexSet.has('a.md')).toBe(true)
    const m = new Map([[1,'c.md'],[2,'d.md']])
    augmentIndexWithAllMarkdownPaths(m)
    expect(indexSet.has('c.md')).toBe(true)
    expect(indexSet.has('d.md')).toBe(true)
  })

  it('resolution cache evicts oldest when exceeding max and respects ttl', () => {
    setResolutionCacheMax(1)
    // set Date.now to stable value when inserting
    const now = Date.now()
    const spyNow = vi.spyOn(Date, 'now').mockReturnValue(now)
    resolutionCacheSet('k1', { resolved: 'r1', anchor: null })
    // add second key, should evict first because max=1
    resolutionCacheSet('k2', { resolved: 'r2', anchor: null })
    expect(resolutionCacheGet('k1')).toBeUndefined()
    expect(resolutionCacheGet('k2')).toEqual({ resolved: 'r2', anchor: null })

    // test TTL expiry: set ts in past and TTL small
    spyNow.mockReturnValue(now - 1000 * 60 * 60) // past
    setResolutionCacheTtl(1000) // 1s TTL
    // insert with past timestamp
    resolutionCacheSet('kt', { resolved: 'rt', anchor: null })
    // advance time to now to make it expired
    spyNow.mockReturnValue(now)
    _purgeExpiredEntries()
    expect(resolutionCacheGet('kt')).toBeUndefined()
    spyNow.mockRestore()
  })
})
