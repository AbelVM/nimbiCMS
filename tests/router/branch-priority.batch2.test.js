import { beforeEach, test, expect, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  if (typeof document !== 'undefined') document.body.innerHTML = ''
})

test('skips falsy candidates in fetchPageData loop', async () => {
  const router = await import('../../src/router.js')
  const slugMgr = await import('../../src/slugManager.js')

  const origFetch = slugMgr.fetchMarkdown
  const buildSpy = vi.spyOn(router, 'buildPageCandidates').mockImplementation(() => ['', 'page.md'])
  try {
    slugMgr.setFetchMarkdown(async (path, base) => ({ raw: '# Test' }))
    const res = await router.fetchPageData('something', 'http://example.com/content/')
    expect(res).toBeTruthy()
    // Ensure we returned a non-empty pagePath and didn't crash on falsy candidate
    expect(typeof res.pagePath).toBe('string')
    expect(res.pagePath.length).toBeGreaterThan(0)
  } finally {
    buildSpy.mockRestore()
    try { slugMgr.setFetchMarkdown(origFetch) } catch (_) {}
  }
})

test('forwards AbortSignal to fetchMarkdown when AbortController exists', async () => {
  const router = await import('../../src/router.js')
  const slugMgr = await import('../../src/slugManager.js')

  const origFetch = slugMgr.fetchMarkdown
  const origAbort = global.AbortController
  try {
    // provide a minimal AbortController that exposes a `signal` property
    global.AbortController = function FakeAbort() { this.signal = 'FAKE_SIGNAL' }

    let captured = null
    slugMgr.setFetchMarkdown(async function (path, base, opts) { captured = opts; return { raw: '# Sig' } })

    const res = await router.fetchPageData('page.md', 'http://example.com/content/')
    expect(res).toBeTruthy()
    expect(captured).toBeTruthy()
    expect(Object.prototype.hasOwnProperty.call(captured, 'signal')).toBe(true)
  } finally {
    try { slugMgr.setFetchMarkdown(origFetch) } catch (_) {}
    global.AbortController = origAbort
  }
})
