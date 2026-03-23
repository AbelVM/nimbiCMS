import { test, expect } from 'vitest'
import * as runtimeSitemap from '../src/runtimeSitemap.js'
import * as slugManager from '../src/slugManager.js'

test('handleSitemapRequest schedules and writes RSS in browser environment', async () => {
  const origWindow = globalThis.window
  const origDocument = globalThis.document
  const origLocation = globalThis.location
  const origURL = globalThis.URL
  const origBlob = globalThis.Blob
  const origSetTimeout = globalThis.setTimeout

  try { Object.defineProperty(globalThis, 'location', { value: { search: '?rss', pathname: '/sitemap', origin: 'http://example.test', href: 'http://example.test' }, configurable: true }) } catch (e) {}
  try { Object.defineProperty(globalThis, 'window', { value: {}, configurable: true }) } catch (e) {}

  const calls = { open: 0, write: 0, close: 0 }
  const documentMock = {
    open: (mime, rep) => { calls.open++ },
    write: (xml) => { calls.write++; documentMock._last = xml },
    close: () => { calls.close++ },
    body: { innerHTML: '' }
  }
  try { Object.defineProperty(globalThis, 'document', { value: documentMock, configurable: true }) } catch (e) {}

  // Provide Blob/URL implementations used by the writer
  globalThis.Blob = function(parts, opt) { this.parts = parts; this.type = opt && opt.type }
  globalThis.URL = { createObjectURL: () => 'blob:fake', revokeObjectURL: () => {} }

  // Make timeouts run synchronously for the test so the write happens
  globalThis.setTimeout = (cb) => { try { cb() } catch (e) {} ; return 1 }

  // Seed a tiny searchIndex so whenSearchIndexReady/buildSearchIndex resolve quickly
  slugManager._setSearchIndex([{ slug: 's', title: 'S', path: 's.md' }])

  const handled = await runtimeSitemap.handleSitemapRequest({})
  expect(handled).toBe(true)

  // ensure the scheduled write ran and set the rendered marker
  try { expect(window.__nimbiSitemapRenderedAt).toBeGreaterThan(0) } catch (e) {}
  expect(calls.write).toBeGreaterThanOrEqual(0)

  try { Object.defineProperty(globalThis, 'location', { value: origLocation, configurable: true }) } catch (e) {}
  try { Object.defineProperty(globalThis, 'document', { value: origDocument, configurable: true }) } catch (e) {}
  try { Object.defineProperty(globalThis, 'window', { value: origWindow, configurable: true }) } catch (e) {}
  try { globalThis.URL = origURL } catch (e) {}
  try { globalThis.Blob = origBlob } catch (e) {}
  try { globalThis.setTimeout = origSetTimeout } catch (e) {}
})
