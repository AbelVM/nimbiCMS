import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('router additional fetchPageData branches', () => {
  beforeEach(async () => {
    vi.resetModules()
    const slugMgr = await import('../src/slugManager.js')
    slugMgr.slugToMd.clear()
    slugMgr.mdToSlug.clear()
    slugMgr.setNotFoundPage(null)
    slugMgr.setHomePage(null)
  })

  it('short-circuits unknown slug without probing when no mappings exist', async () => {
    const slugMgr = await import('../src/slugManager.js')
    const router = await import('../src/router.js')
    router._clearIndexCache()

    const fetchSpy = vi.spyOn(slugMgr, 'fetchMarkdown').mockResolvedValue(null)
    await expect(router.fetchPageData('totally-unknown-slug', 'http://example.com/content/')).rejects.toThrow('no page data')
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('stores and reads anchored cache entries with LRU refresh', async () => {
    const router = await import('../src/router.js')
    router.resolutionCache.clear()
    router.setResolutionCacheTtl(60_000)

    router.resolutionCacheSet('hello|||en', { resolved: 'docs/hello.md', anchor: 'part' })
    router.resolutionCacheSet('other|||en', { resolved: 'docs/other.md', anchor: null })

    const first = router.resolutionCacheGet('hello|||en')
    const second = router.resolutionCacheGet('hello|||en')

    expect(first).toEqual({ resolved: 'docs/hello.md', anchor: 'part' })
    expect(second).toEqual({ resolved: 'docs/hello.md', anchor: 'part' })
  })

  it('accepts explicit markdown candidates when original request includes extension', async () => {
    const slugMgr = await import('../src/slugManager.js')
    const router = await import('../src/router.js')
    const fetchSpy = vi.spyOn(slugMgr, 'fetchMarkdown').mockImplementation(async (path) => {
      if (String(path) === 'docs/explicit.md') return { raw: '# Explicit', isHtml: false, meta: {} }
      return null
    })

    const out = await router.fetchPageData('docs/explicit.md', 'http://example.com/content/')
    expect(out.pagePath).toBe('docs/explicit.md')
    expect(fetchSpy).toHaveBeenCalled()
  })

  it('discovers candidates from navbar anchors and tolerates malformed URLs', async () => {
    const slugMgr = await import('../src/slugManager.js')
    const router = await import('../src/router.js')
    router._clearIndexCache()
    document.body.innerHTML = [
      '<nav class="navbar">',
      '  <a href="docs/guide.md">Guide</a>',
      '  <a href="http://[broken">Broken</a>',
      '</nav>'
    ].join('')

    vi.spyOn(slugMgr, 'fetchMarkdown').mockImplementation(async (path) => {
      if (String(path) === 'docs/guide.md') return { raw: '# Guide', isHtml: false, meta: {} }
      return null
    })

    const out = await router.fetchPageData('guide', 'http://example.com/content/')
    expect(out.pagePath).toBe('docs/guide.md')
    expect(String(out.data.raw ?? '')).toContain('# Guide')
  })
})
