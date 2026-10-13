import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import * as router from '../src/router.js'
import * as slugManager from '../src/slugManager.js'

describe('router: absolute URL site-shell fallback', () => {
  let origFetch
  beforeEach(() => {
    origFetch = global.fetch
    try { router._clearIndexCache && router._clearIndexCache() } catch (e) {}
    try { slugManager.clearFetchCache && slugManager.clearFetchCache() } catch (e) {}
  })
  afterEach(() => {
    try { if (origFetch) vi.stubGlobal('fetch', origFetch) } catch (e) {}
    try { slugManager.setFetchMarkdown && slugManager.setFetchMarkdown(slugManager.fetchMarkdown) } catch (e) {}
  })

  it('falls back to notFoundPage when absolute fetch returns site shell HTML', async () => {
    // Stub global fetch: simulate absolute fallback returning the SPA shell
    vi.stubGlobal('fetch', async (url, opts) => {
      const s = String(url ?? '')
      // Simulate contentBase host returning 404 for candidate content fetches
      if (s.includes('localhost:3000')) {
        return { ok: false, status: 404, statusText: 'Not Found', text: async () => '' }
      }
      // Absolute fallback (same-origin) returns site-shell HTML
      return { ok: true, text: async () => '<!doctype html><html><head></head><body><div id="app"></div><script>/* nimbiCMS */</script></body></html>', headers: { get: (k) => (k && k.toLowerCase && k.toLowerCase() === 'content-type') ? 'text/html' : null } }
    })

    // Stub fetchMarkdown to return configured notFoundPage when probed
    const orig = slugManager.fetchMarkdown
    slugManager.setFetchMarkdown(async (path, base) => {
      if (String(path ?? '') === String(slugManager.notFoundPage)) {
        return { raw: '# Not Found', status: 404 }
      }
      throw new Error('not found')
    })

    const res = await router.fetchPageData('/missing', 'http://localhost:3000/content/')
    expect(res.pagePath).toBe(slugManager.notFoundPage)
    expect(res.data && String(res.data.raw ?? '').includes('Not Found')).toBe(true)
  })
})
