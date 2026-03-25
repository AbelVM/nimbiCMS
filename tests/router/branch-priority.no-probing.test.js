import { beforeEach, test, expect, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  if (typeof document !== 'undefined') document.body.innerHTML = ''
})

test('when probing disabled fetchPageData short-circuits (no page data)', async () => {
  const router = await import('../../src/router.js')
  const slugMgr = await import('../../src/slugManager.js')
  const indexMgr = await import('../../src/indexManager.js')

  try {
    // disable notFound fallback and ensure no index/slug mappings
    try { slugMgr.setNotFoundPage && slugMgr.setNotFoundPage(null) } catch (_) {}
    try { slugMgr.setHomePage && slugMgr.setHomePage(null) } catch (_) {}
    try { indexMgr.indexSet.clear() } catch (_) {}
    try { indexMgr.refreshIndexPaths._refreshed = false } catch (_) {}
    try { slugMgr.slugToMd && slugMgr.slugToMd.clear && slugMgr.slugToMd.clear() } catch (_) {}

    await expect(router.fetchPageData('definitely-missing-slug', undefined)).rejects.toThrow('no page data')
  } finally {
    // restore defaults via module re-import in consumer tests if needed
  }
})
