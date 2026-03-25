import { describe, it, beforeEach, expect } from 'vitest'
import { augmentIndexWithAllMarkdownPaths, resolutionCacheSet, resolutionCacheGet, setResolutionCacheMax, resolutionCache } from '../../src/router.js'
import { indexSet } from '../../src/indexManager.js'

describe('router helpers', () => {
  beforeEach(() => {
    indexSet.clear()
    resolutionCache.clear()
  })

  it('augmentIndexWithAllMarkdownPaths accepts arrays', () => {
    augmentIndexWithAllMarkdownPaths(['a.md', '', null, 'b.md'])
    expect(indexSet.has('a.md')).toBe(true)
    expect(indexSet.has('b.md')).toBe(true)
  })

  it('augmentation accepts Map-like objects with values()', () => {
    const m = new Map([['x','one.md'], ['y','two.md']])
    augmentIndexWithAllMarkdownPaths(m)
    expect(indexSet.has('one.md')).toBe(true)
    expect(indexSet.has('two.md')).toBe(true)
  })

  it('resolutionCacheSet evicts oldest entries when max exceeded', () => {
    setResolutionCacheMax(1)
    resolutionCacheSet('k1', { resolved: 'a', anchor: null })
    resolutionCacheSet('k2', { resolved: 'b', anchor: null })
    expect(resolutionCacheGet('k1')).toBeUndefined()
    const got = resolutionCacheGet('k2')
    expect(got).toBeTruthy()
    expect(got.resolved).toBe('b')
  })
})
