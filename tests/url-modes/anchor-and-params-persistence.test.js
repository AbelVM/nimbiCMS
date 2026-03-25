import { beforeEach, test, expect } from 'vitest'

beforeEach(() => {
  try { globalThis.vi && globalThis.vi.resetModules && globalThis.vi.resetModules() } catch (_) {}
  if (typeof document !== 'undefined') document.body.innerHTML = ''
})

test('buildCosmeticUrl preserves query params and strips `page` when location.search is canonical', async () => {
  const urlHelper = await import('../../src/utils/urlHelper.js')
  const origHref = typeof location !== 'undefined' && location.href ? location.href : ''
  try {
    // Provide the base search explicitly (avoids JSDOM navigation behavior)
    const out = urlHelper.buildCosmeticUrl('foo', 'theAnchor', '?page=foo&session=abc')
    expect(out).toBe('#/foo#theAnchor?session=abc')

    // When explicitly passing a baseSearch, page is removed and params preserved
    const out2 = urlHelper.buildCosmeticUrl('foo', 'theAnchor', '?page=baz&x=1')
    expect(out2).toBe('#/foo#theAnchor?x=1')
  } finally {
    try { if (typeof location !== 'undefined') location.href = origHref } catch (_) {}
  }
})
