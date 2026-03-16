import { describe, it, expect, beforeEach, vi } from 'vitest'
import initCMS from '../src/nimbi-cms.js'

// Ensure a clean DOM between tests
beforeEach(() => {
  document.body.innerHTML = '<div id="app"></div>'
  // reset any globals that tests may rely on
  if (!(global.location && typeof global.location === 'object')) {
    global.location = new URL('http://localhost/')
  }
  // remove any leftover nimbi elements
  document.querySelectorAll('.nimbi-cms, .nimbi-overlay, .nimbi-version-label').forEach(el => el.remove())
})

describe('initCMS URL override security', () => {
  it('ignores contentPath provided via URL by default', async () => {
    // craft a location with a contentPath query param
    global.location = new URL('http://localhost/?contentPath=./evil/')
    // spy on fetch to capture requested URLs
    const calls = []
    global.fetch = vi.fn(async (u) => {
      calls.push(String(u))
      return { ok: true, text: () => Promise.resolve('# Home') }
    })

    await initCMS({ el: '#app', searchIndex: false })
    // ensure none of the fetch calls went to the evil path
    const combined = calls.join('\n')
    expect(combined).not.toContain('/evil/')
    expect(combined).toContain('/content')
  })

  it('honors contentPath when host enables allowUrlPathOverrides', async () => {
    global.location = new URL('http://localhost/?contentPath=./evil/')
    const calls = []
    global.fetch = vi.fn(async (u) => {
      calls.push(String(u))
      return { ok: true, text: () => Promise.resolve('# Home') }
    })

    // opt-in via explicit option (must be passed as boolean true)
    await initCMS({ el: '#app', searchIndex: false, allowUrlPathOverrides: true })
    const combined = calls.join('\n')
    // when honored, we expect to see the evil path in the fetch URL
    expect(combined).toContain('/evil')
  })

  it('honors bulmaCustomize when provided via URL query', async () => {
    global.location = new URL('http://localhost/?bulmaCustomize=cerulean')
    const calls = []
    global.fetch = vi.fn(async (u) => {
      calls.push(String(u))
      return { ok: true, text: () => Promise.resolve('# Home') }
    })

    // Spy on ensureBulma so we can verify it was called with the query value
    const bulmaManager = await import('../src/bulmaManager.js')
    const spy = vi.spyOn(bulmaManager, 'ensureBulma')
    spy.mockImplementation(async () => {})

    await initCMS({ el: '#app', searchIndex: false })
    expect(spy).toHaveBeenCalledWith('cerulean', expect.any(String))

    spy.mockRestore()
  })

  it('injects bulmaswatch theme link when bulmaCustomize is set via URL', async () => {
    global.location = new URL('http://localhost/?bulmaCustomize=cerulean')
    global.fetch = vi.fn(async () => ({ ok: true, text: () => Promise.resolve('# Home') }))

    await initCMS({ el: '#app', searchIndex: false })

    const link = document.querySelector('link[data-bulmaswatch-theme="cerulean"]')
    expect(link).toBeTruthy()
    expect((link && link.getAttribute('href')) || '').toContain('bulmaswatch/cerulean')
  })

  it('applies all supported init options from URL query params', async () => {
    global.location = new URL('http://localhost/docs/?searchIndex=false&searchIndexMode=lazy&defaultStyle=dark&bulmaCustomize=cerulean&lang=es&l10nFile=foo.json&cacheTtlMinutes=7&cacheMaxEntries=22&homePage=custom.md&notFoundPage=missing.md&availableLanguages=en,fr&indexDepth=2&noIndexing=secret,private&contentPath=./content/')

    global.fetch = vi.fn(async () => ({ ok: true, text: () => Promise.resolve('# Home') }))

    const bulmaManager = await import('../src/bulmaManager.js')
    const setStyleSpy = vi.spyOn(bulmaManager, 'setStyle')
    const ensureBulmaSpy = vi.spyOn(bulmaManager, 'ensureBulma').mockImplementation(async () => {})

    const l10n = await import('../src/l10nManager.js')
    const setLangSpy = vi.spyOn(l10n, 'setLang')
    const loadL10nFileSpy = vi.spyOn(l10n, 'loadL10nFile').mockImplementation(async () => {})

    const slugMgr = await import('../src/slugManager.js')
    const setNotFoundSpy = vi.spyOn(slugMgr, 'setNotFoundPage')

    const router = await import('../src/router.js')
    const setCacheTtlSpy = vi.spyOn(router, 'setResolutionCacheTtl')
    const setCacheMaxSpy = vi.spyOn(router, 'setResolutionCacheMax')

    const nav = await import('../src/nav.js')
    const buildNavSpy = vi.spyOn(nav, 'buildNav').mockResolvedValue({ navbar: document.createElement('div'), linkEls: [] })

    const ui = await import('../src/ui.js')
    const createUISpy = vi.spyOn(ui, 'createUI').mockReturnValue({ renderByQuery: async () => {} })

    await initCMS({ el: '#app', allowUrlPathOverrides: true })

    expect(setStyleSpy).toHaveBeenCalledWith('dark')
    expect(ensureBulmaSpy).toHaveBeenCalledWith('cerulean', expect.any(String))
    expect(setLangSpy).toHaveBeenCalledWith('es')
    expect(loadL10nFileSpy).toHaveBeenCalledWith('foo.json', expect.any(String))
    expect(setCacheTtlSpy).toHaveBeenCalledWith(7 * 60 * 1000)
    expect(setCacheMaxSpy).toHaveBeenCalledWith(22)
    expect(buildNavSpy).toHaveBeenCalled()
    const buildNavArgs = buildNavSpy.mock.calls[0]
    expect(buildNavArgs[4]).toBe('custom.md')
    expect(buildNavArgs[7]).toBe(false)
    expect(buildNavArgs[8]).toBe('lazy')
    expect(buildNavArgs[9]).toBe(2)
    expect(buildNavArgs[10]).toEqual(['secret', 'private'])

    // Ensure homePage override was used in fetchMarkdown
    const fetchCalls = global.fetch.mock.calls.map(c => String(c[0]))
    expect(fetchCalls.some(u => u.includes('custom.md'))).toBe(true)

    // Ensure notFoundPage override was applied
    expect(setNotFoundSpy).toHaveBeenCalledWith('missing.md')
    setNotFoundSpy.mockRestore()

    // cleanup spies
    setStyleSpy.mockRestore()
    ensureBulmaSpy.mockRestore()
    setLangSpy.mockRestore()
    loadL10nFileSpy.mockRestore()
    setCacheTtlSpy.mockRestore()
    setCacheMaxSpy.mockRestore()
    buildNavSpy.mockRestore()
    createUISpy.mockRestore()
  })
})
