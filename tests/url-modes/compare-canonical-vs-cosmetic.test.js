import { beforeEach, test, expect } from 'vitest'

beforeEach(() => {
  // ensure a fresh module graph and clean DOM before each test
  try { globalThis.vi && globalThis.vi.resetModules && globalThis.vi.resetModules() } catch (_) {}
  if (typeof document !== 'undefined') document.body.innerHTML = ''
})

test('fetchPageData behaves the same for canonical and cosmetic location hrefs', async () => {
  const router = await import('../../src/router.js')
  const slugMgr = await import('../../src/slugManager.js')
  const urlHelper = await import('../../src/utils/urlHelper.js')

  const origSetFetch = slugMgr.setFetchMarkdown
  const origHref = typeof location !== 'undefined' && location.href ? location.href : ''
  try {
    // Ensure a deterministic slug -> md mapping and provide a simple fetch implementation
    try { slugMgr.slugToMd.clear && slugMgr.slugToMd.clear() } catch (_) {}
    slugMgr.slugToMd.set('foo', 'foo.md')
    slugMgr.setFetchMarkdown(async (path, base) => {
      if (String(path || '').endsWith('foo.md')) return { raw: '# Foo Title' }
      return null
    })

    // canonical URL form
    location.href = 'http://example.com/?page=foo&x=1#bar'
    const resCanon = await router.fetchPageData('foo', 'https://example.com/content/')

    // cosmetic URL form
    location.href = 'http://example.com/#/foo#bar?x=1'
    const resCos = await router.fetchPageData('foo', 'https://example.com/content/')

    expect(resCanon).toBeTruthy()
    expect(resCos).toBeTruthy()
    expect(resCanon.pagePath).toEqual(resCos.pagePath)
    expect(resCanon.anchor).toEqual(resCos.anchor)

    // The canonical representation should be equal for both href forms
    const canonA = urlHelper.toCanonicalHref('http://example.com/?page=foo&x=1#bar')
    const canonB = urlHelper.toCanonicalHref('http://example.com/#/foo#bar?x=1')
    expect(canonA).toBe(canonB)
  } finally {
    try { slugMgr.setFetchMarkdown && slugMgr.setFetchMarkdown(origSetFetch) } catch (_) {}
    try { if (typeof location !== 'undefined') location.href = origHref } catch (_) {}
  }
})
