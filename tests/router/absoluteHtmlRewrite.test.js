import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import * as router from '../../src/router.js'
import * as slugManager from '../../src/slugManager.js'

describe('router: absolute HTML asset rewrite', () => {
  let origFetch
  let origFetchMd
  beforeEach(() => {
    try { router._clearIndexCache && router._clearIndexCache() } catch (e) {}
    origFetch = global.fetch
    origFetchMd = slugManager.fetchMarkdown
  })
  afterEach(() => {
    try { if (origFetch) vi.stubGlobal('fetch', origFetch) } catch (e) {}
    try { slugManager.setFetchMarkdown && slugManager.setFetchMarkdown(origFetchMd) } catch (e) {}
    vi.restoreAllMocks()
  })

  it('rewrites relative src/href/srcset to absolute URLs when parsing HTML', async () => {
    // Force candidate markdown fetches to fail so the absolute HTML fallback runs
    slugManager.setFetchMarkdown(async () => { throw new Error('not found') })

    const html = '<!doctype html><html><head><title>Test</title></head><body>' +
      '<img src="images/pic.png"><link rel="stylesheet" href="styles/main.css">' +
      '<img srcset="a.png 1x, b.png 2x"></body></html>'

    vi.stubGlobal('fetch', async (url, opts) => {
      return {
        ok: true,
        status: 200,
        text: async () => html,
        headers: { get: (k) => (k && k.toLowerCase && k.toLowerCase() === 'content-type') ? 'text/html' : null },
        clone: () => ({ ok: true, text: async () => html, headers: { get: (k) => (k && k.toLowerCase && k.toLowerCase() === 'content-type') ? 'text/html' : null } })
      }
    })

    const originalRaw = 'http://example.com/page.html'
    const res = await router.fetchPageData(originalRaw, 'http://example.com/content/')
    expect(res.pagePath).toBe(originalRaw)
    const raw = res.data && res.data.raw || ''
    expect(raw).toContain('http://example.com/images/pic.png')
    expect(raw).toContain('http://example.com/styles/main.css')
    // srcset rewritten to absolute URLs
    expect(raw).toContain('http://example.com/a.png')
    expect(raw).toContain('http://example.com/b.png')
  })
})
