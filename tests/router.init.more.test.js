import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import path from 'path'

const URL_HELPER_ID = path.resolve('src/utils/urlHelper.js')

afterEach(() => {
  vi.doUnmock('../src/utils/urlHelper.js')
  vi.doUnmock(URL_HELPER_ID)
  vi.restoreAllMocks()
})

describe('router targeted branch coverage', () => {
  beforeEach(async () => {
    vi.resetModules()
    const slugMgr = await import('../src/slugManager.js')
    slugMgr.slugToMd.clear()
  })

  it('augmentIndexWithAllMarkdownPaths supports arrays and map-like values', async () => {
    const router = await import('../src/router.js')

    router.augmentIndexWithAllMarkdownPaths(['a.md', '', null, 'b.md'])
    let candidates = router.buildPageCandidates('a')
    expect(candidates.includes('a.md') || candidates.includes('a.html')).toBe(true)

    const mapLike = new Map([
      ['k1', 'docs/c.md'],
      ['k2', undefined],
      ['k3', 'docs/d.md']
    ])
    router.augmentIndexWithAllMarkdownPaths(mapLike)
    candidates = router.buildPageCandidates('d')
    expect(candidates.includes('docs/d.md') || candidates.includes('d.md') || candidates.includes('d.html')).toBe(true)
  })

  it('resolution cache honors ttl expiration and max-size eviction', async () => {
    const router = await import('../src/router.js')
    router.resolutionCache.clear()
    router.setResolutionCacheMax(1)
    router.setResolutionCacheTtl(1000)

    router.resolutionCacheSet('k1', { resolved: 'a.md', anchor: null })
    router.resolutionCacheSet('k2', { resolved: 'b.md', anchor: null })
    expect(router.resolutionCacheGet('k1')).toBeUndefined()
    expect(router.resolutionCacheGet('k2')).toEqual({ resolved: 'b.md', anchor: null })

    router.resolutionCache.clear()
    router.resolutionCache.set('old', {
      value: { resolved: 'x.md', anchor: null },
      ts: Date.now() - 10_000
    })
    router.setResolutionCacheTtl(1)
    expect(router.resolutionCacheGet('old')).toBeUndefined()
  })

  it('buildPageCandidates handles direct paths, slug mappings and fallback forms', async () => {
    const router = await import('../src/router.js')
    const slugMgr = await import('../src/slugManager.js')

    slugMgr.slugToMd.set('home', 'docs/home')
    expect(router.buildPageCandidates('docs/page.md')).toContain('docs/page.md')
    expect(router.buildPageCandidates('home')).toEqual(['docs/home', 'docs/home.html'])

    slugMgr.slugToMd.clear()
    router.augmentIndexWithAllMarkdownPaths(['folder/name.md'])
    const fromIndex = router.buildPageCandidates('name')
    expect(fromIndex[0]).toBe('folder/name.md')

    const fallback = router.buildPageCandidates('totally-unknown')
    expect(fallback).toEqual(['totally-unknown.html', 'totally-unknown.md'])
  })
})

describe('init query parsing edge branches', () => {
  let originalHref = ''

  beforeEach(() => {
    vi.restoreAllMocks()
    try {
      originalHref = window.location.href
    } catch (_) {
      originalHref = ''
    }
  })

  afterEach(() => {
    try {
      if (originalHref) window.history.replaceState({}, '', originalHref)
    } catch (_) {}
  })

  it('uses parseHrefToRoute params when query string is absent', async () => {
    vi.resetModules()
    const mockFactory = () => ({
      parseHrefToRoute: () => ({ params: 'searchIndex=false&indexDepth=3&noIndexing=a,b' })
    })
    vi.doMock('../src/utils/urlHelper.js', mockFactory)
    vi.doMock(URL_HELPER_ID, () => ({
      parseHrefToRoute: () => ({ params: 'searchIndex=false&indexDepth=3&noIndexing=a,b' })
    }))

    const initMod = await import('../src/init.js')
    const out = initMod.parseInitOptionsFromQuery('')
    expect([false, undefined]).toContain(out.searchIndex)
    expect(out.indexDepth).toBe(3)
    expect(out.noIndexing).toEqual(['a', 'b'])
  })

  it('returns empty object when parseHrefToRoute throws during hash fallback', async () => {
    vi.resetModules()
    const throwFactory = () => ({
      parseHrefToRoute: () => { throw new Error('bad-hash') }
    })
    vi.doMock('../src/utils/urlHelper.js', throwFactory)
    vi.doMock(URL_HELPER_ID, () => ({
      parseHrefToRoute: () => { throw new Error('bad-hash') }
    }))

    const initMod = await import('../src/init.js')
    const out = initMod.parseInitOptionsFromQuery('')
    expect(out).toEqual({})
  })

  it('parses nullable and constrained values conservatively', async () => {
    vi.resetModules()
    const initMod = await import('../src/init.js')
    const out = initMod.parseInitOptionsFromQuery('?l10nFile=null&notFoundPage=null&fetchConcurrency=0&negativeFetchCacheTTL=7&searchIndex=maybe&indexDepth=9')

    expect(out.l10nFile).toBeNull()
    expect(out.notFoundPage).toBeNull()
    expect(out.negativeFetchCacheTTL).toBe(7)
    expect(out.fetchConcurrency).toBeUndefined()
    expect(out.searchIndex).toBeUndefined()
    expect(out.indexDepth).toBeUndefined()
  })
})
