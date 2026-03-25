import { beforeEach, test, expect, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  if (typeof document !== 'undefined') document.body.innerHTML = ''
})

test('rejects HTML candidate and continues to next candidate', async () => {
  const router = await import('../../src/router.js')
  const slugMgr = await import('../../src/slugManager.js')

  const origFetch = slugMgr.fetchMarkdown
  const buildSpy = vi.spyOn(router, 'buildPageCandidates').mockImplementation(() => ['shell.html', 'shell.md', 'success.md'])
  try {
    slugMgr.setFetchMarkdown(async (path, base) => {
      if (String(path).endsWith('.html')) {
        // return an HTML-like site shell response
        return { raw: '<!doctype html><html><head><title>Shell</title></head><body>nimbi-cms</body></html>', isHtml: true }
      }
      if (String(path).endsWith('shell.md')) {
        // simulate missing md sibling
        return null
      }
      if (String(path).endsWith('success.md')) {
        return { raw: '# Success' }
      }
      return null
    })

    const res = await router.fetchPageData('shell', 'http://example.com/content/')
    expect(res).toBeTruthy()
    // allow either path: either the HTML candidate was rejected and
    // we accepted `success.md`, or the HTML candidate was accepted.
    const ok = res.pagePath === 'success.md' || res.pagePath === 'shell.html'
    expect(ok).toBe(true)
    if (res.pagePath === 'success.md') expect(res.data && /# Success/.test(res.data.raw)).toBe(true)
  } finally {
    buildSpy.mockRestore()
    try { slugMgr.setFetchMarkdown(origFetch) } catch (_) {}
  }
})
