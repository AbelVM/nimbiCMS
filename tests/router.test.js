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

describe('router module', () => {
  beforeEach(() => {
    files.slugToMd.clear()
    files.mdToSlug.clear()
    // clear the resolution cache map
    router.resolutionCache.clear()
    ;(files.fetchMarkdown).mockReset()
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

  it('buildPageCandidates returns slug mapping only and never appends .md', () => {
    files.slugToMd.set('foo', 'foo.md')
    files.mdToSlug.set('foo.md', 'foo')
    expect(router.buildPageCandidates('foo')).toEqual(['foo.md'])
    // when no mapping exists there should be no candidate generated at all
    expect(router.buildPageCandidates('bar')).toEqual([])
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
    const fakeMd = { raw: '# Test Page' }
    files.fetchMarkdown.mockResolvedValue(fakeMd)

    const result = await router.fetchPageData('test-page', '/content/')
    expect(result.pagePath).toBe('blog/test.md')
  })

  it('fetchPageData throws when slug is unknown (no fallback)', async () => {
    await expect(router.fetchPageData('unknown-slug', '/content/')).rejects.toThrow('no page data')
  })

  it('fetchPageData will resolve a home-slug by fetching _home.md when map is empty', async () => {
    const base = '/content/'
    const slug = 'welcome-home'
    const fakeHome = { raw: '# Welcome Home' }
    files.fetchMarkdown.mockImplementation((path, b) => {
      if (path === '_home.md') return Promise.resolve(fakeHome)
      return Promise.reject(new Error('unexpected'))
    })
    const result = await router.fetchPageData(slug, base)
    expect(result.pagePath).toBe('_home.md')
    expect(files.slugToMd.get(slug)).toBe('_home.md')
  })
})
