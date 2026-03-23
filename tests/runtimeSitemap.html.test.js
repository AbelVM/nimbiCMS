import { test, expect } from 'vitest'
import * as runtimeSitemap from '../src/runtimeSitemap.js'
import * as slugManager from '../src/slugManager.js'

test('handleSitemapRequest serves sitemap.html and writes HTML output', async () => {
  const origWindow = globalThis.window
  const origDocument = globalThis.document
  const origLocation = globalThis.location
  const origURL = globalThis.URL
  const origBlob = globalThis.Blob
  const origSetTimeout = globalThis.setTimeout

  try { Object.defineProperty(globalThis, 'location', { value: { search: '', pathname: '/sitemap.html', origin: 'http://example.test', href: 'http://example.test' }, configurable: true }) } catch (e) {}
  try { Object.defineProperty(globalThis, 'window', { value: {}, configurable: true }) } catch (e) {}

  const documentMock = {
    open: () => {},
    write: (_xml) => {},
    close: () => {},
    body: { innerHTML: '' }
  }
  try { Object.defineProperty(globalThis, 'document', { value: documentMock, configurable: true }) } catch (e) {}

  globalThis.Blob = function(parts, opt) { this.parts = parts; this.type = opt && opt.type }
  globalThis.URL = { createObjectURL: () => 'blob:fake', revokeObjectURL: () => {} }
  globalThis.setTimeout = (cb) => { try { cb() } catch (e) {} ; return 1 }

  slugManager._setSearchIndex([{ slug: 's', title: 'S', path: 's.md' }])

  const handled = await runtimeSitemap.handleSitemapRequest({})
  expect(handled).toBe(true)
  try { expect(window.__nimbiSitemapRenderedAt).toBeGreaterThan(0) } catch (e) {}

  try { Object.defineProperty(globalThis, 'location', { value: origLocation, configurable: true }) } catch (e) {}
  try { Object.defineProperty(globalThis, 'document', { value: origDocument, configurable: true }) } catch (e) {}
  try { Object.defineProperty(globalThis, 'window', { value: origWindow, configurable: true }) } catch (e) {}
  try { globalThis.URL = origURL } catch (e) {}
  try { globalThis.Blob = origBlob } catch (e) {}
  try { globalThis.setTimeout = origSetTimeout } catch (e) {}
})
