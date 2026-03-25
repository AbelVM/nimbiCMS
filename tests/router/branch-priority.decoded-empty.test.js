import { beforeEach, test, expect, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  if (typeof document !== 'undefined') document.body.innerHTML = ''
})

test('decoded falsy branch at L355 is exercised (empty raw)', async () => {
  const router = await import('../../src/router.js')
  const slugMgr = await import('../../src/slugManager.js')
  const indexMgr = await import('../../src/indexManager.js')

  // Ensure no home/notFound pages and empty index/slug mappings
  try { slugMgr.setHomePage && slugMgr.setHomePage(null) } catch (_) {}
  try { slugMgr.setNotFoundPage && slugMgr.setNotFoundPage(null) } catch (_) {}
  try { indexMgr.indexSet.clear() } catch (_) {}
  try { indexMgr.refreshIndexPaths._refreshed = false } catch (_) {}
  try { slugMgr.slugToMd && slugMgr.slugToMd.clear && slugMgr.slugToMd.clear() } catch (_) {}

  await expect(router.fetchPageData('', undefined)).rejects.toThrow('no page data')
})
