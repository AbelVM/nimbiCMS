import { beforeEach, test, expect } from 'vitest'

beforeEach(() => {
  try { globalThis.vi && globalThis.vi.resetModules && globalThis.vi.resetModules() } catch (_) {}
  if (typeof document !== 'undefined') document.body.innerHTML = ''
  try { globalThis.__nimbiColdRouteResolved = [] } catch (_) {}
})

test('watchForColdHashRoute is notified when slug mapping is added', async () => {
  const slugMgr = await import('../../src/slugManager.js')
  const urlHelper = await import('../../src/utils/urlHelper.js')

  const parsed = urlHelper.parseHrefToRoute('http://example.com/#/cold-slug#anchor?x=1')
  slugMgr.watchForColdHashRoute(parsed)

  // Ensure the watch has been registered by adding the slug mapping
  try { slugMgr.slugToMd.clear && slugMgr.slugToMd.clear() } catch (_) {}
  slugMgr.slugToMd.set('cold-slug', 'cold-slug.md')

  // The module writes to globalThis.__nimbiColdRouteResolved when notifying
  const arr = globalThis.__nimbiColdRouteResolved || []
  expect(Array.isArray(arr)).toBe(true)
  const found = arr.find(r => r && r.slug === 'cold-slug')
  expect(found).toBeTruthy()
  expect(found.token).toContain('#/cold-slug')
  expect(found.rel).toBe('cold-slug.md')
})
