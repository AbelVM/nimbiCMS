import { describe, it, expect, beforeEach, vi } from 'vitest'

// stub fetchMarkdown so tests do not make network requests
vi.mock('../src/filesManager.js', async () => {
  const actual = await vi.importActual('../src/filesManager.js')
  // explicitly re-export helpers to avoid missing functions when the mock is used
  return {
    ...actual,
    fetchMarkdown: vi.fn(),
    slugToMd: actual.slugToMd,
    mdToSlug: actual.mdToSlug,
    allMarkdownPaths: actual.allMarkdownPaths,
    fetchCache: actual.fetchCache,
    clearFetchCache: actual.clearFetchCache || actual.clearCache,
    slugify: actual.slugify,
  }
})

import * as router from '../src/router.js'
import * as files from '../src/filesManager.js'
import * as slugMgr from '../src/slugManager.js'

describe('router module', () => {
  beforeEach(() => {
    files.slugToMd.clear()
    files.mdToSlug.clear()
    // also clear router's internal index cache so each test starts fresh
    router._clearIndexCache()
    // clear the resolution cache map
    router.resolutionCache.clear()
    ;(files.fetchMarkdown).mockReset()
    // stub network fetch to avoid real HTTP during tests
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

  it('buildPageCandidates returns slug mapping and handles missing extensions', () => {
    files.slugToMd.set('foo', 'foo.md')
    files.mdToSlug.set('foo.md', 'foo')
    expect(router.buildPageCandidates('foo')).toEqual(['foo.md'])
    // when slugToMd value lacks extension we should still try .html
    files.slugToMd.set('bar', 'bar')
    files.mdToSlug.set('bar', 'bar')
    expect(router.buildPageCandidates('bar')).toEqual(['bar', 'bar.html'])
    // when no mapping exists, a bare slug should probe common extensions
    expect(router.buildPageCandidates('baz')).toEqual(['baz.html', 'baz.md'])
  })

  it('fetchPageData resolves slugToMd entries, caches results, and uses supplied base without hardcoded paths', async () => {
    files.slugToMd.set('slug', 'page.md')
    const fakeData = { raw: '# Hello', isHtml: false }
    files.fetchMarkdown.mockResolvedValue(fakeData)

    const base = '/my/content/'
    const result = await router.fetchPageData('slug', base)
    expect(result.pagePath).toBe('page.md')
    expect(result.data).toBe(fakeData)
    expect(files.fetchMarkdown).toHaveBeenCalledWith('page.md', base)

    // second call will use cached slug but still invoke fetchMarkdown for content
    files.fetchMarkdown.mockClear()
    const result2 = await router.fetchPageData('slug', base)
    expect(result2.pagePath).toBe('page.md')
    expect(files.fetchMarkdown).toHaveBeenCalled()
  })

  it('tryDiscoverFromIndex falls back to scanning allMarkdownPaths', async () => {
    // simulate a markdown file whose H1 slug matches
    router.allMarkdownPaths.splice(0, router.allMarkdownPaths.length, 'blog/test.md')
    // inform router about the new path (mirrors what setContentBase does)
    router.refreshIndexPaths()
    const fakeMd = { raw: '# Test Page' }
    files.fetchMarkdown.mockResolvedValue(fakeMd)

    const result = await router.fetchPageData('test-page', '/content/')
    expect(result.pagePath).toBe('blog/test.md')
  })

  it('refreshIndexPaths must be called when allMarkdownPaths is modified', async () => {
    // initial index cache doesn't know about new path until refresh
    router.allMarkdownPaths.splice(0, router.allMarkdownPaths.length, 'new/path.md')
    const fakeMd = { raw: '# New Path' }
    // only succeed for the exact normalized path; everything else fails
    files.fetchMarkdown.mockImplementation((path, base) => {
      if (path === 'new/path.md') return Promise.resolve(fakeMd)
      return Promise.reject(new Error('not found'))
    })

    // without refresh we should still get not-found (candidates from extension fallback may exist)
    await expect(router.fetchPageData('new-path', '/content/')).rejects.toThrow('not found')

    // clear cached result so lookup happens again, then tell router about
    // the updated paths and retry
    router.resolutionCache.clear()
    router.refreshIndexPaths()
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
    files.fetchMarkdown
      .mockImplementation((path) => {
        if (path === 'bare.html') return Promise.resolve(fakeData)
        return Promise.reject(new Error('not found'))
      })
    const res = await router.fetchPageData('bare', base)
    expect(res.pagePath).toBe('bare.html')
    expect(res.data).toBe(fakeData)
    // verify we attempted at least the html variant first
    expect(files.fetchMarkdown).toHaveBeenCalledWith('bare.html', base)
    expect(files.fetchMarkdown).not.toHaveBeenCalledWith('bare.md', base)
  })

})
