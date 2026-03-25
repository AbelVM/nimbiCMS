import { beforeEach, test, expect, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  if (typeof document !== 'undefined') document.body.innerHTML = ''
})

test('ensureSlug called when index not refreshed and contentBase is absolute', async () => {
  const router = await import('../../src/router.js')
  const slugMgr = await import('../../src/slugManager.js')
  const indexMgr = await import('../../src/indexManager.js')

  const origEnsure = slugMgr.ensureSlug
  const origFetchMd = slugMgr.fetchMarkdown
  try {
    // ensure index state indicates not refreshed and is empty
    try { indexMgr.indexSet.clear() } catch (_) {}
    try { indexMgr.refreshIndexPaths._refreshed = false } catch (_) {}
    // ensure no preexisting slug mapping interferes
    try { slugMgr.slugToMd && typeof slugMgr.slugToMd.clear === 'function' && slugMgr.slugToMd.clear() } catch (_) {}

    const ensureSpy = vi.spyOn(slugMgr, 'ensureSlug').mockResolvedValue('found-by-ensure.md')
    slugMgr.setFetchMarkdown(async (path, base) => {
      if (path === 'found-by-ensure.md') return { raw: '# Some Weird Slug\n\nvia ensureSlug' }
      return null
    })

    let res
    try {
      res = await router.fetchPageData('some-weird-slug', 'http://example.com/content/')
    } catch (e) {
      throw e
    }
    expect(res).toBeTruthy()
    expect(res.pagePath).toBe('found-by-ensure.md')
    expect(res.data && res.data.raw).toContain('via ensureSlug')
    expect(slugMgr.ensureSlug).toHaveBeenCalled()
    } finally {
    try { ensureSpy && ensureSpy.mockRestore() } catch (_) {}
    try { slugMgr.setFetchMarkdown && slugMgr.setFetchMarkdown(origFetchMd) } catch (_) {}
  }
})
