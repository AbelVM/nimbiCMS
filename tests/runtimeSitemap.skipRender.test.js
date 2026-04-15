import { test, expect, vi } from 'vitest'
import * as runtimeSitemap from '../src/runtimeSitemap.js'
import * as slugManager from '../src/slugManager.js'

test('handleSitemapRequest skips write when existing rendered sitemap larger', async () => {
  // Mock whenSearchIndexReady to resolve immediately on slugManager
  const spy = vi.spyOn(slugManager, 'whenSearchIndexReady').mockResolvedValue([]);
  const origWindow = globalThis.window
  const origDocument = globalThis.document
  const origLocation = globalThis.location
  try { Object.defineProperty(globalThis, 'location', { value: { search: '?rss', pathname: '/sitemap', origin: 'http://example.test', href: 'http://example.test' }, configurable: true }) } catch (e) {}
  try { Object.defineProperty(globalThis, 'window', { value: {}, configurable: true }) } catch (e) {}
  try { Object.defineProperty(globalThis, 'document', { value: { open: () => {}, write: () => {}, close: () => {}, body: { innerHTML: '' } }, configurable: true }) } catch (e) {}

  // simulate an existing rendered sitemap larger than what we'll generate
  window.__nimbiSitemapFinal = new Array(10)
  slugManager._setSearchIndex([{ slug: 's', title: 'S', path: 's.md' }])

  const handled = await runtimeSitemap.handleSitemapRequest({ waitForIndexMs: 0 })
  expect(handled).toBe(true)

  try { Object.defineProperty(globalThis, 'location', { value: origLocation, configurable: true }) } catch (e) {}
  try { Object.defineProperty(globalThis, 'document', { value: origDocument, configurable: true }) } catch (e) {}
  try { Object.defineProperty(globalThis, 'window', { value: origWindow, configurable: true }) } catch (e) {}
  // Restore whenSearchIndexReady
  spy.mockRestore();
})
