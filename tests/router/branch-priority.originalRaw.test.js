import { beforeEach, test, expect, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  if (typeof document !== 'undefined') document.body.innerHTML = ''
})

test('originalRaw fallback (raw falsy) triggers notFoundPage fallback', async () => {
  const router = await import('../../src/router.js')
  const slugMgr = await import('../../src/slugManager.js')

  const origFetchMd = slugMgr.fetchMarkdown
  try {
    try { router.resolutionCache.clear() } catch (_) {}
    try { router._clearIndexCache && router._clearIndexCache() } catch (_) {}

    slugMgr.setNotFoundPage('nf.md')
    slugMgr.setFetchMarkdown(async (path, base) => {
      if (path === 'nf.md') return { raw: '# NF' }
      return null
    })

    // call with undefined raw to exercise `raw || ''` fallback
    const res = await router.fetchPageData(undefined, 'http://example.com/content/')
    expect(res).toBeTruthy()
    expect(res.pagePath).toBe('nf.md')
    expect(res.data && res.data.raw).toContain('# NF')
  } finally {
    try { slugMgr.setFetchMarkdown && slugMgr.setFetchMarkdown(origFetchMd) } catch (_) {}
    try { slugMgr.setNotFoundPage(null) } catch (_) {}
  }
})
