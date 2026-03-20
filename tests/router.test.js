import { describe, it, expect, beforeEach, vi } from 'vitest'

import * as router from '../src/router.js'
import * as slugMgr from '../src/slugManager.js'
import { setLang } from '../src/l10nManager.js'
import { refreshIndexPaths } from '../src/indexManager.js'

const originalFetchMarkdown = slugMgr.fetchMarkdown

describe('router module', () => {
  beforeEach(() => {
    slugMgr.slugToMd.clear()
    slugMgr.mdToSlug.clear()
    // reset language to english to avoid bleed from other tests
    setLang('en')
    // also clear router's internal index cache so each test starts fresh
    router._clearIndexCache()
    // clear the resolution cache map
    router.resolutionCache.clear()

    // restore original fetchMarkdown implementation and cache
    slugMgr.setFetchMarkdown(originalFetchMarkdown)
    slugMgr.fetchCache.clear()

    // default fetchMarkdown stub rejects like a missing page; tests override when needed.
    slugMgr.setFetchMarkdown(vi.fn().mockRejectedValue(new Error('failed to fetch md')))

    // default network stub: 404 for any unexpected fetch call
    const stub = vi.fn((url) => {
      const res = { ok: false, status: 404, text: () => Promise.resolve('') }
      res.clone = () => res
      return Promise.resolve(res)
    })
    global.fetch = stub
    globalThis.fetch = stub
  })

  it('resolutionCache should evict oldest entries', () => {
    const max = router.RESOLUTION_CACHE_MAX
    // fill the cache
    for (let i = 0; i < max + 2; i++) {
      router.resolutionCacheSet('k' + i, { resolved: 'r' + i })
    }
    expect(router.resolutionCache.size).toBe(max)
    expect(router.resolutionCache.has('k0')).toBe(false)
    // inserting max+2 entries evicts k0 and k1, leaving k2..k101
    expect(router.resolutionCache.has('k1')).toBe(false)
  })

  it('cache entries expire after TTL', () => {
    // constant should be exported and a positive number by default
    expect(typeof router.RESOLUTION_CACHE_TTL).toBe('number')
    expect(router.RESOLUTION_CACHE_TTL).toBeGreaterThan(0)

    // use fake timers so we can advance time arbitrarily
    vi.useFakeTimers()
    const key = 'foo'
    router.resolutionCacheSet(key, { resolved: 'bar' })
    expect(router.resolutionCacheGet(key)).toEqual({ resolved: 'bar' })

    // move clock past the TTL and verify the record is gone
    vi.advanceTimersByTime(router.RESOLUTION_CACHE_TTL + 1)
    expect(router.resolutionCacheGet(key)).toBeUndefined()

    // restore real timers for subsequent tests
    vi.useRealTimers()
  })

  it('buildPageCandidates returns slug mapping and handles missing extensions', () => {
    slugMgr.slugToMd.set('foo', 'foo.md')
    slugMgr.mdToSlug.set('foo.md', 'foo')
    expect(router.buildPageCandidates('foo')).toEqual(['foo.md'])
    // when slugToMd value lacks extension we should still try .html
    slugMgr.slugToMd.set('bar', 'bar')
    slugMgr.mdToSlug.set('bar', 'bar')
    expect(router.buildPageCandidates('bar')).toEqual(['bar', 'bar.html'])
    // when no mapping exists, a bare slug should probe common extensions
    expect(router.buildPageCandidates('baz')).toEqual(['baz.html', 'baz.md'])
  })

  it('buildPageCandidates respects current language setting', () => {
    // simulate multilingual slug map object
    slugMgr.setLanguages(['en', 'fr'])
    slugMgr.slugToMd.set('foo', { default: 'foo.md', langs: { en: 'en/foo.md', fr: 'fr/foo.md' } })
    // default Lang is en
    expect(router.buildPageCandidates('foo')).toEqual(['en/foo.md'])
    setLang('fr')
    expect(router.buildPageCandidates('foo')).toEqual(['fr/foo.md'])
  })

  it('fetchPageData respects language-aware slug mappings', async () => {
    slugMgr.setLanguages(['en', 'fr'])
    slugMgr.slugToMd.set('foo', { default: 'foo.md', langs: { en: 'en/foo.md', fr: 'fr/foo.md' } })
    const mockFetch = vi.fn().mockResolvedValue({ raw: '# Hi', isHtml: false })
    slugMgr.setFetchMarkdown(mockFetch)

    const base = '/content/'
    // initial language en
    let result = await router.fetchPageData('foo', base)
    expect(result.pagePath).toBe('en/foo.md')
    setLang('fr')
    // show cache key being used by router (not directly accessible easily)
    result = await router.fetchPageData('foo', base)
    expect(result.pagePath).toBe('fr/foo.md')
  })

  it('fetchPageData resolves slugToMd entries, caches results, and uses supplied base without hardcoded paths', async () => {
    slugMgr.slugToMd.set('slug', 'page.md')
    const fakeData = { raw: '# Hello', isHtml: false }
    slugMgr.fetchMarkdown.mockResolvedValue(fakeData)

    const base = '/my/content/'
    const result = await router.fetchPageData('slug', base)
    expect(result.pagePath).toBe('page.md')
    expect(result.data).toBe(fakeData)
    expect(slugMgr.fetchMarkdown).toHaveBeenCalledWith('page.md', base)

    // second call will use cached slug but still invoke fetchMarkdown for content
    slugMgr.fetchMarkdown.mockClear()
    const result2 = await router.fetchPageData('slug', base)
    expect(result2.pagePath).toBe('page.md')
    expect(slugMgr.fetchMarkdown).toHaveBeenCalled()
  })

  it('tryDiscoverFromIndex falls back to scanning allMarkdownPaths', async () => {
    // simulate a markdown file whose H1 slug matches
    router.allMarkdownPaths.splice(0, router.allMarkdownPaths.length, 'blog/test.md')
    // inform router about the new path (mirrors what setContentBase does)
    refreshIndexPaths()
    const fakeMd = { raw: '# Test Page' }
    slugMgr.fetchMarkdown.mockResolvedValue(fakeMd)

    const result = await router.fetchPageData('test-page', '/content/')
    expect(result.pagePath).toBe('blog/test.md')
  })

  it('refreshIndexPaths must be called when allMarkdownPaths is modified', async () => {
    // initial index cache doesn't know about new path until refresh
    router.allMarkdownPaths.splice(0, router.allMarkdownPaths.length, 'new/path.md')
    const fakeMd = { raw: '# New Path' }
    // only succeed for the exact normalized path; everything else fails
    slugMgr.fetchMarkdown.mockImplementation((path, base) => {
      if (path === 'new/path.md') return Promise.resolve(fakeMd)
      return Promise.reject(new Error('not found'))
    })

    // without refresh we should still get page-data-not-found (candidates from extension fallback may exist)
    await expect(router.fetchPageData('new-path', '/content/')).rejects.toThrow('no page data')

    // Reset fetchMarkdown stub and clear cached result so lookup happens again
    slugMgr.fetchMarkdown.mockClear()
    router.resolutionCache.clear()
    refreshIndexPaths()
    // Ensure fetchMarkdown stub is still correct after cache clear
    slugMgr.fetchMarkdown.mockImplementation((path, base) => {
      if (path === 'new/path.md') return Promise.resolve(fakeMd)
      return Promise.reject(new Error('not found'))
    })
    const result = await router.fetchPageData('new-path', '/content/')
    expect(result.pagePath).toBe('new/path.md')
  })

  it('fetchPageData throws when slug is unknown (no fallback)', async () => {
    await expect(router.fetchPageData('unknown-slug', '/content/')).rejects.toThrow('no page data')
  })

  it('fetchPageData will try common extensions for a bare slug', async () => {
    const base = '/content/'
    const fakeData = { raw: '# Yo' }
    // stub fetchMarkdown: succeed on first (.html) and later (for sanity)
    slugMgr.fetchMarkdown
      .mockImplementation((path) => {
        if (path === 'bare.html') return Promise.resolve(fakeData)
        return Promise.reject(new Error('not found'))
      })
    const res = await router.fetchPageData('bare', base)
    expect(res.pagePath).toBe('bare.html')
    expect(res.data).toBe(fakeData)
    // verify we attempted at least the html variant first
    expect(slugMgr.fetchMarkdown).toHaveBeenCalledWith('bare.html', base)
    expect(slugMgr.fetchMarkdown).not.toHaveBeenCalledWith('bare.md', base)
  })

  it('fetchPageData ignores cosmetic `#/slug` as anchor', async () => {
    // Simulate a cosmetic hash route. `fetchPageData` must not interpret
    // the cosmetic `/slug` portion as a scroll anchor.
    try { history.replaceState(null, '', '/') } catch (e) {}
    try { location.hash = '#/foo' } catch (e) {}

    slugMgr.slugToMd.set('foo', 'page.md')
    const fakeData = { raw: '# Hello', isHtml: false }
    slugMgr.setFetchMarkdown(vi.fn().mockResolvedValue(fakeData))

    const res = await router.fetchPageData('foo', '/content/')
    expect(res.anchor).toBe(null)
    expect(res.pagePath).toBe('page.md')
  })

})
