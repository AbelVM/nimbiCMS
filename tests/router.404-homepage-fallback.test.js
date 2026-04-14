import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as router from '../src/router.js'
import * as slugManager from '../src/slugManager.js'

describe('router: 404 -> homepage fallback', () => {
  let origFetch
  beforeEach(() => {
    origFetch = slugManager.fetchMarkdown
    try { router._clearIndexCache && router._clearIndexCache() } catch (e) {}
    try { slugManager.clearFetchCache && slugManager.clearFetchCache() } catch (e) {}
  })
  afterEach(() => {
    try { slugManager.setFetchMarkdown(origFetch) } catch (e) {}
  })

  it('returns notFoundPage when server returns site shell for missing page', async () => {
    slugManager.setFetchMarkdown(async (path, base) => {
      if (String(path ?? '').toLowerCase().endsWith('.html')) {
        return { raw: '<!doctype html><html><head></head><body><div id="app"></div><script>/* nimbiCMS */</script></body></html>', isHtml: true }
      }
      if (String(path ?? '') === String(slugManager.notFoundPage)) {
        return { raw: '# Not Found', status: 404 }
      }
      throw new Error('not found')
    })

    const res = await router.fetchPageData('missing', '')
    expect(res.pagePath).toBe(slugManager.notFoundPage)
    expect(res.data && String(res.data.raw ?? '').includes('Not Found')).toBe(true)
  })
})
