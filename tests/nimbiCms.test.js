import { describe, it, expect, beforeEach, vi } from 'vitest'
import initCMS from '../src/nimbi-cms.js'
import * as slugMgr from '../src/slugManager.js'
import * as router from '../src/router.js'
import { t, setLang, currentLang } from '../src/l10nManager.js'

// minimal DOM support
function makeAppContainer() {
  const div = document.createElement('div')
  div.id = 'app'
  document.body.appendChild(div)
  return div
}

describe('initCMS option handling', () => {
  beforeEach(() => {
    // reset any existing setting so tests don't interfere
    slugMgr.setDefaultCrawlMaxQueue(slugMgr.CRAWL_MAX_QUEUE)
    document.body.innerHTML = ''
    global.fetch = vi.fn(async (url) => {
      // simple stub for _home.md and any other page
      return { ok: true, text: () => Promise.resolve('# home') }
    })
  })

  it('honors crawlMaxQueue option', async () => {
    makeAppContainer()
    await initCMS({ el: '#app', crawlMaxQueue: 7, searchIndex: false })
    expect(slugMgr.defaultCrawlMaxQueue).toBe(7)
  })

  it('respect cacheTtlMinutes option and defaults', async () => {
    makeAppContainer()
    // default should be 5 minutes
    await initCMS({ el: '#app', searchIndex: false })
    expect(router.RESOLUTION_CACHE_TTL).toBe(5 * 60 * 1000)

    // override explicitly
    await initCMS({ el: '#app', searchIndex: false, cacheTtlMinutes: 1 })
    expect(router.RESOLUTION_CACHE_TTL).toBe(1 * 60 * 1000)
  })

  it('honors cacheMaxEntries option when provided', async () => {
    makeAppContainer()
    // default is whatever current constant is (100)
    const orig = router.RESOLUTION_CACHE_MAX
    expect(orig).toBeGreaterThan(0)

    await initCMS({ el: '#app', searchIndex: false, cacheMaxEntries: 5 })
    expect(router.RESOLUTION_CACHE_MAX).toBe(5)

    // restore original value manually and verify
    if (typeof router.setResolutionCacheMax === 'function') {
      router.setResolutionCacheMax(orig)
    }
    expect(router.RESOLUTION_CACHE_MAX).toBe(orig)
  })

  it('uses the lang option to set initial UI language', async () => {
    makeAppContainer()
    setLang('en') // ensure we start from english
    await initCMS({ el: '#app', searchIndex: false, lang: 'de' })
    expect(currentLang).toBe('de')
    expect(t('home')).toBe('Startseite')
  })
})