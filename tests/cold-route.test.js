import { describe, it, expect, beforeEach } from 'vitest'
import { watchForColdHashRoute, slugToMd, mdToSlug, HOME_SLUG } from '../src/slugManager.js'
import { parseHrefToRoute } from '../src/utils/urlHelper.js'

describe('cold route watchers', () => {
  beforeEach(() => {
    try { slugToMd.clear(); mdToSlug.clear() } catch (e) { /* ignore */ }
    try { delete globalThis.__nimbiColdRouteResolved } catch (e) { /* ignore */ }
  })

  it('resolves cosmetic hash watcher when slug is added', () => {
    watchForColdHashRoute(parseHrefToRoute('#/test-slug'))
    expect(globalThis.__nimbiColdRouteResolved || []).toHaveLength(0)
    slugToMd.set('test-slug', 'assets/test.md')
    const arr = globalThis.__nimbiColdRouteResolved || []
    expect(arr.length).toBeGreaterThan(0)
    const rec = arr.find(r => r.slug === 'test-slug')
    expect(rec).toBeTruthy()
    expect(rec.token).toContain('#/test-slug')
    expect(rec.rel).toBe('assets/test.md')
  })

  it('resolves canonical ?page= watcher when slug added', () => {
    watchForColdHashRoute(parseHrefToRoute('?page=foo'))
    slugToMd.set('foo', 'assets/foo.md')
    const arr = globalThis.__nimbiColdRouteResolved || []
    const rec = arr.find(r => r.slug === 'foo')
    expect(rec).toBeTruthy()
    expect(rec.token).toContain('?page=foo')
    expect(rec.rel).toBe('assets/foo.md')
  })

  it('resolves no-slug cosmetic mapped to HOME_SLUG', () => {
    watchForColdHashRoute(parseHrefToRoute('#/'))
    slugToMd.set(HOME_SLUG, 'assets/brochure.md')
    const arr = globalThis.__nimbiColdRouteResolved || []
    const rec = arr.find(r => r.slug === HOME_SLUG)
    expect(rec).toBeTruthy()
    expect(rec.token).toContain('#/')
    expect(rec.rel).toBe('assets/brochure.md')
  })
})
