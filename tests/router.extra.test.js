import { describe, it, expect, beforeEach } from 'vitest'
import * as router from '../src/router.js'
import { setLang, currentLang } from '../src/l10nManager.js'

describe('router extra branches', () => {
  beforeEach(() => {
    // reset caches and language
    router._clearIndexCache && router._clearIndexCache()
    router.setResolutionCacheTtl && router.setResolutionCacheTtl(router.RESOLUTION_CACHE_TTL)
    setLang('en')
    // clear runtime resolution cache map
    try { router.resolutionCache.clear && router.resolutionCache.clear() } catch (e) {}
    global.fetch = () => { throw new Error('unexpected fetch') }
  })

  it('throws when single candidate is index.html and fallback is prevented', async () => {
    const raw = 'home'
    // cache the resolution so resolved becomes 'index.html' while originalRaw remains non-explicit
    const cacheKey = `${raw}|||${currentLang}`
    router.resolutionCache.set(cacheKey, { value: { resolved: 'index.html', anchor: null }, ts: Date.now() })
    await expect(router.fetchPageData(raw, '/content/')).rejects.toThrow('Unknown slug: index.html fallback prevented')
  })

  it('absolute HTML fetch fallback returns rewritten HTML and pagePath', async () => {
    const originalRaw = 'docs/index.html'
    const cacheKey = `${originalRaw}|||${currentLang}`
    // ensure resolved will be docs/index.html so pageCandidates lead to failed contentBase fetch
    router.resolutionCache.set(cacheKey, { value: { resolved: 'docs/index.html', anchor: null }, ts: Date.now() })

    // stub fetch: fail for contentBase attempts, succeed for absolute URL (location.href + originalRaw)
    const abs = new URL(originalRaw, location.href).toString()
    global.fetch = async (url) => {
      const su = String(url ?? '')
      if (su === abs) {
        return {
          ok: true,
          text: async () => Promise.resolve(`<html><head><title>Doc</title></head><body><img src="images/pic.jpg"><link rel="stylesheet" href="css/main.css"></body></html>`),
          headers: { get: (k) => (k === 'content-type' ? 'text/html' : null) }
        }
      }
      // any other fetch represents contentBase attempts and should fail
      return { ok: false, status: 404, text: async () => '' }
    }

    const res = await router.fetchPageData(originalRaw, 'http://contentbase/')
    expect(res).toBeTruthy()
    expect(res.data && res.data.isHtml).toBe(true)
    expect(res.pagePath).toBe(originalRaw)
    // rewritten/returned HTML should include absolute URLs for the previously-relative assets
    const raw = res.data.raw || ''
    expect(raw.includes('images/pic.jpg')).toBe(true)
    expect(raw.includes('css/main.css')).toBe(true)
  })
})
