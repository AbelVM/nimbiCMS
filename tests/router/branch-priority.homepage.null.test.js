import { beforeEach, test, expect, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  if (typeof document !== 'undefined') document.body.innerHTML = ''
})

test('fetchPageData falls back to notFoundPage when homePage unset', async () => {
  const router = await import('../../src/router.js')
  const slugMgr = await import('../../src/slugManager.js')

  const origFetchMd = slugMgr.fetchMarkdown
  try {
    try { router.resolutionCache.clear() } catch (_) {}
    try { router._clearIndexCache && router._clearIndexCache() } catch (_) {}

    slugMgr.setHomePage(null)
    slugMgr.setNotFoundPage('_404.md')
    slugMgr.setFetchMarkdown(async (path, base) => {
      if (path === '_404.md') return { raw: '# Not Found\n\nMissing' }
      return null
    })

    const res = await router.fetchPageData('', 'http://example.com/content/')
    expect(res).toBeTruthy()
    expect(res.pagePath).toBe('_404.md')
    expect(res.data && res.data.raw).toContain('# Not Found')
  } finally {
    try { slugMgr.setFetchMarkdown && slugMgr.setFetchMarkdown(origFetchMd) } catch (_) {}
    try { slugMgr.setNotFoundPage(null) } catch (_) {}
  }
})
