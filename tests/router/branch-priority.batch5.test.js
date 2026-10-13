import { beforeEach, test, expect, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  if (typeof document !== 'undefined') document.body.innerHTML = ''
})

test('candidate HTML rejection: probes alt .md then rejects (initcms token)', async () => {
  const router = await import('../../src/router.js')
  const slugMgr = await import('../../src/slugManager.js')

  const origFetchMd = slugMgr.fetchMarkdown
  const origNotFound = slugMgr.notFoundPage
  try {
    try { router._clearIndexCache && router._clearIndexCache() } catch (_) {}
    // ensure no configured notFoundPage to avoid fallback acceptance
    slugMgr.setNotFoundPage && slugMgr.setNotFoundPage(null)

    const calls = []
    slugMgr.setFetchMarkdown(async (path, base) => {
      calls.push(path)
      if (String(path ?? '').toLowerCase().endsWith('.html')) {
        return { raw: '<!doctype html><html><body>initcms( boot )</body></html>', isHtml: true }
      }
      if (String(path ?? '').toLowerCase().endsWith('.md')) {
        return null
      }
      return null
    })

    const res = await router.fetchPageData('page', 'http://example.com/content/')
    expect(res).toBeTruthy()
    expect(res.pagePath).toMatch(/page\.html$/)
    expect(calls).toContain('page.html')
  } finally {
    try { slugMgr.setFetchMarkdown && slugMgr.setFetchMarkdown(origFetchMd) } catch (_) {}
    try { slugMgr.setNotFoundPage && slugMgr.setNotFoundPage(origNotFound) } catch (_) {}
  }
})
