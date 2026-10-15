import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock heavy dependencies so the init flow can be observed in isolation.
vi.mock('../src/bulmaManager.js', () => ({
  ensureBulma: async () => {},
  setStyle: () => {},
  registerThemedElement: () => {},
  disconnectBulmaObservers: () => {},
}))
vi.mock('../src/markdown.js', () => ({
  // Minimal markdown->HTML that converts [text](href) links so the
  // navigation-based homePage derivation can find a first <a>.
  parseMarkdownToHtml: async (md) => ({
    html: String(md ?? '').replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2">$1</a>',
    ),
  }),
  detectFenceLanguages: () => new Set(),
  addMarkdownExtension: () => {},
  teardownRendererWorkerPool: async () => {},
}))
vi.mock('../src/nav.js', () => ({
  buildNav: async () => ({ navbar: document.createElement('div'), linkEls: [] }),
}))
vi.mock('../src/runtimeSitemap.js', () => ({
  handleSitemapRequest: async () => false,
  exposeSitemapGlobals: async () => {},
  clearSitemapWriteTimer: () => {},
}))
vi.mock('../src/codeblocksManager.js', () => ({
  observeCodeBlocks: () => {},
  disposeCodeblocksObserver: () => {},
}))
vi.mock('../src/imagePreview.js', () => ({
  attachImagePreview: () => {},
  disposeImagePreview: () => {},
}))
vi.mock('../src/slugSearchRuntime.js', () => ({
  awaitSearchIndex: async () => [],
  clearSearchIndexCache: () => {},
}))

/**
 * Regression guard: a cold load at the site root with no slug must always
 * trigger exactly one initial render. Previously, when no `homePage` was
 * configured (and none could be derived from the navigation page),
 * `setHomePage(null)` returned before releasing the `HOME_SLUG` cold-route
 * watcher, so `renderByQuery` never fired and the mount stayed blank.
 */
describe('initCMS cold load at site root renders the home page', () => {
  const mountApp = () => {
    document.body.innerHTML = '<div id="app"></div>'
  }

  const stubCreateUI = async () => {
    const ui = await import('../src/ui.js')
    const renderSpy = vi.fn(async () => {})
    vi.spyOn(ui, 'createUI').mockReturnValue({
      renderByQuery: renderSpy,
      siteNav: null,
      getCurrentPagePath: () => null,
    })
    return renderSpy
  }

  const settle = () => new Promise((r) => setTimeout(r, 50))

  beforeEach(() => {
    vi.resetModules()
    mountApp()
    // Cold load at the site root: no slug, no query params.
    Object.defineProperty(globalThis, 'location', {
      value: new URL('http://localhost/'),
      configurable: true,
      writable: true,
    })
    global.fetch = vi.fn(async (u) => {
      const s = String(u ?? '')
      if (s.includes('_navigation.md')) {
        return { ok: true, text: () => Promise.resolve('[Home](index.md)') }
      }
      return { ok: true, text: () => Promise.resolve('# Home page content') }
    })
  })

  it('renders once when homePage is provided explicitly', async () => {
    const renderSpy = await stubCreateUI()
    const { initCMS } = await import('../src/init.js')

    await initCMS({ el: '#app', searchIndex: false, homePage: 'index.md' })
    await settle()

    expect(renderSpy).toHaveBeenCalledTimes(1)
  })

  it('renders once when homePage is derived from the navigation page', async () => {
    const renderSpy = await stubCreateUI()
    const { initCMS } = await import('../src/init.js')

    // No homePage provided — derived from the navigation first link.
    await initCMS({ el: '#app', searchIndex: false })
    await settle()

    expect(renderSpy).toHaveBeenCalledTimes(1)
  })

  it('renders once when no homePage can be resolved at all', async () => {
    // Navigation has no usable first link, so homePage stays null. This is the
    // case that previously left the mount blank.
    global.fetch = vi.fn(async (u) => {
      const s = String(u ?? '')
      if (s.includes('_navigation.md')) {
        return { ok: true, text: () => Promise.resolve('[no link here]') }
      }
      return { ok: true, text: () => Promise.resolve('# Home page content') }
    })

    const renderSpy = await stubCreateUI()
    const { initCMS } = await import('../src/init.js')

    await initCMS({ el: '#app', searchIndex: false })
    await settle()

    expect(renderSpy).toHaveBeenCalledTimes(1)
  })

  it('does not render immediately for a slug route that has not resolved yet', async () => {
    // A slug route must still wait for its slug to be crawled/resolved rather
    // than firing an immediate render that would flash the not-found page.
    Object.defineProperty(globalThis, 'location', {
      value: new URL('http://localhost/?page=not-crawled-yet'),
      configurable: true,
      writable: true,
    })

    const renderSpy = await stubCreateUI()
    const { initCMS } = await import('../src/init.js')

    await initCMS({ el: '#app', searchIndex: false, homePage: 'index.md' })
    await settle()

    expect(renderSpy).not.toHaveBeenCalled()
  })

  it('renders once for a deep path cold load that has no watcher', async () => {
    // Path routes only register a watcher when the location matches the site
    // root, so a deep path like /docs/guide has no watcher at all and would
    // otherwise leave the mount permanently blank.
    Object.defineProperty(globalThis, 'location', {
      value: new URL('http://localhost/docs/guide'),
      configurable: true,
      writable: true,
    })

    const renderSpy = await stubCreateUI()
    const { initCMS } = await import('../src/init.js')

    await initCMS({ el: '#app', searchIndex: false, homePage: 'index.md' })
    await settle()

    expect(renderSpy).toHaveBeenCalledTimes(1)
  })

  it('does not render immediately for a cosmetic slug route that has not resolved yet', async () => {
    // Cosmetic (`#/`) slug routes do register a watcher, so they must keep
    // waiting rather than flashing the not-found page.
    Object.defineProperty(globalThis, 'location', {
      value: new URL('http://localhost/#/not-crawled-yet'),
      configurable: true,
      writable: true,
    })

    const renderSpy = await stubCreateUI()
    const { initCMS } = await import('../src/init.js')

    await initCMS({ el: '#app', searchIndex: false, homePage: 'index.md' })
    await settle()

    expect(renderSpy).not.toHaveBeenCalled()
  })
})
