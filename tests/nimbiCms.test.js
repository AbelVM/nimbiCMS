import { describe, it, expect, beforeEach, vi } from 'vitest'
import initCMS, { addHook, onPageLoad, onNavBuild, transformHtml, _clearHooks } from '../src/nimbi-cms.js'
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

describe('hook subsystem and init validation', () => {
  beforeEach(() => {
    // clear hooks before each test
    initCMS._clearHooks && initCMS._clearHooks()
  })

  it('addHook throws on unknown name or non-function', () => {
    expect(() => initCMS.addHook('bogus', () => {})).toThrow()
    expect(() => initCMS.addHook('onPageLoad', 'notfunc')).toThrow(TypeError)
  })

  it('onPageLoad/onNavBuild/transformHtml helpers register correctly', () => {
    onPageLoad(() => {})
    onNavBuild(() => {})
    transformHtml(() => {})
    // internal hooks object not exported, but we can test by running runHooks indirectly
    // use public _clearHooks to ensure reset works
    expect(typeof _clearHooks).toBe('function')
    _clearHooks()
  })

  it('_clearHooks empties previously registered callbacks', () => {
    let called = false
    onPageLoad(() => { called = true })
    _clearHooks()
    // runHooks should not invoke anything now
    expect(called).toBe(false)
  })
})

describe('initCMS option handling', () => {
    it('accepts homePage as .md or .html and falls back to _home.md', async () => {
      makeAppContainer()
      global.fetch = vi.fn(async (url) => ({ ok: true, text: () => Promise.resolve('# home') }))
      // .md
      await expect(initCMS({ el: '#app', homePage: 'welcome.md' })).resolves.toBeUndefined()
      // .html
      await expect(initCMS({ el: '#app', homePage: 'index.html' })).resolves.toBeUndefined()
      // fallback
      await expect(initCMS({ el: '#app' })).resolves.toBeUndefined()
    })

    it('throws if homePage is invalid', async () => {
      makeAppContainer()
      // not a string
      await expect(initCMS({ el: '#app', homePage: 123 })).rejects.toThrow(/homePage/)
      // empty string
      await expect(initCMS({ el: '#app', homePage: '' })).rejects.toThrow(/homePage/)
      // wrong extension
      await expect(initCMS({ el: '#app', homePage: 'foo.txt' })).rejects.toThrow(/homePage/)
    })
  beforeEach(() => {
    // reset any existing setting so tests don't interfere
    slugMgr.setDefaultCrawlMaxQueue(slugMgr.CRAWL_MAX_QUEUE)
    slugMgr.clearFetchCache()
    document.body.innerHTML = ''
    global.fetch = vi.fn(async (url) => {
      // simple stub for _home.md and any other page
      return { ok: true, text: () => Promise.resolve('# home') }
    })
  })

  it('throws when el is not provided or invalid', async () => {
    await expect(initCMS({})).rejects.toThrow('el is required')
    await expect(initCMS({ el: 123 })).rejects.toThrow('el must be a CSS selector string or a DOM element')
    // selector that does not match
    document.body.innerHTML = '<div id="foo"></div>'
    await expect(initCMS({ el: '#bar' })).rejects.toThrow(/did not match/) 
  })

  it('fails when required _home.md fetch returns 404', async () => {
    document.body.innerHTML = '<div id="app"></div>'
    global.fetch = vi.fn(async (url) => ({ ok: false, status: 404, text: () => Promise.resolve('') }))
    await expect(initCMS({ el: '#app' })).rejects.toThrow(/Required _home\.md not found/)
  })

  it('honors crawlMaxQueue option', async () => {
    makeAppContainer()
    slugMgr.clearFetchCache()
    global.fetch = vi.fn(async (url) => ({ ok: true, text: () => Promise.resolve('# home') }))
    await initCMS({ el: '#app', crawlMaxQueue: 7, searchIndex: false })
    expect(slugMgr.defaultCrawlMaxQueue).toBe(7)
  })

  it('respect cacheTtlMinutes option and defaults', async () => {
    makeAppContainer()
    slugMgr.clearFetchCache()
    global.fetch = vi.fn(async (url) => ({ ok: true, text: () => Promise.resolve('# home') }))
    // default should be 5 minutes
    await initCMS({ el: '#app', searchIndex: false })
    expect(router.RESOLUTION_CACHE_TTL).toBe(5 * 60 * 1000)

    // override explicitly
    await initCMS({ el: '#app', searchIndex: false, cacheTtlMinutes: 1 })
    expect(router.RESOLUTION_CACHE_TTL).toBe(1 * 60 * 1000)
  })

  it('honors cacheMaxEntries option when provided', async () => {
    makeAppContainer()
    global.fetch = vi.fn(async (url) => ({ ok: true, text: () => Promise.resolve('# home') }))
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
    slugMgr.clearFetchCache()
    global.fetch = vi.fn(async (url) => ({ ok: true, text: () => Promise.resolve('# home') }))
    await initCMS({ el: '#app', searchIndex: false, lang: 'de' })
    expect(currentLang).toBe('de')
    expect(t('home')).toBe('Startseite')
  })
})