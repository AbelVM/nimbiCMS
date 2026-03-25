import { beforeEach, test, expect, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  if (typeof document !== 'undefined') document.body.innerHTML = ''
})

test('fetchPageData uses configured homePage when raw is empty', async () => {
  const router = await import('../../src/router.js')
  const slugMgr = await import('../../src/slugManager.js')

  const origFetchMd = slugMgr.fetchMarkdown
  try {
    try { router.resolutionCache.clear() } catch (_) {}
    try { router._clearIndexCache && router._clearIndexCache() } catch (_) {}

    // Ensure a configured homePage is used when `raw` is empty
    slugMgr.setHomePage('home.md')
    slugMgr.setFetchMarkdown(async (path, base) => {
      if (path === 'home.md') return { raw: '# Home\n\nWelcome' }
      return null
    })

    const res = await router.fetchPageData('', 'http://example.com/content/')
    expect(res).toBeTruthy()
    expect(res.pagePath).toBe('home.md')
    expect(res.data && res.data.raw).toContain('# Home')
  } finally {
    try { slugMgr.setFetchMarkdown && slugMgr.setFetchMarkdown(origFetchMd) } catch (_) {}
    try { slugMgr.setHomePage(null) } catch (_) {}
  }
})
