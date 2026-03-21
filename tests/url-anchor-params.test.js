import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock htmlBuilder and router to observe anchor handling without fetching
vi.mock('../src/htmlBuilder.js', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    prepareArticle: vi.fn(async () => {
      const article = document.createElement('article')
      return { article, parsed: { meta: {}, toc: [] }, toc: null, topH1: null, h1Text: null, slugKey: null }
    }),
    scrollToAnchorOrTop: vi.fn(),
    attachTocClickHandler: vi.fn(),
    ensureScrollTopButton: vi.fn(),
    createNavTree: vi.fn(() => document.createElement('nav')),
    executeEmbeddedScripts: vi.fn(),
    renderNotFound: vi.fn()
  }
})

vi.mock('../src/router.js', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    fetchPageData: vi.fn()
  }
})

describe('anchor/param precedence in UI and router', () => {
  beforeEach(() => {
    // ensure a fresh module graph and clean DOM before each test
    vi.resetModules()
    document.body.innerHTML = ''
  })

  it('prefers fetchPageData anchor over parsed anchor', async () => {
    // location contains a parsed anchor; router will return a different anchor
    location.href = 'http://localhost/#/foo#parsedAnchor?x=1'

    const htmlBuilder = await import('../src/htmlBuilder.js')
    const router = await import('../src/router.js')

    router.fetchPageData.mockResolvedValue({ data: { raw: '' }, pagePath: 'foo.md', anchor: 'fetchAnchor' })

    const uiMod = await import('../src/ui.js')
    const { createUI } = uiMod

    const contentWrap = document.createElement('div')
    const navWrap = document.createElement('div')
    const ui = createUI({ contentWrap, navWrap, container: document.body, t: k => k, contentBase: 'http://content/', homePage: 'home', initialDocumentTitle: 'title', runHooks: async () => {} })

    await ui.renderByQuery()

    // scrollToAnchorOrTop is called twice (null then final anchor). Assert final call.
    expect(htmlBuilder.scrollToAnchorOrTop).toHaveBeenLastCalledWith('fetchAnchor')
  })

    it('uses parsed anchor when fetchPageData returns no anchor', async () => {
      // Use canonical form for this test (stable in JSDOM)
      location.search = '?page=foo'
      location.hash = '#parsedAnchor'

      const htmlBuilder = await import('../src/htmlBuilder.js')
      const router = await import('../src/router.js')

      router.fetchPageData.mockResolvedValue({ data: { raw: '' }, pagePath: 'foo.md', anchor: null })

      const uiMod = await import('../src/ui.js')
      const { createUI } = uiMod

      const contentWrap = document.createElement('div')
      const navWrap = document.createElement('div')
      const ui = createUI({ contentWrap, navWrap, container: document.body, t: k => k, contentBase: 'http://content/', homePage: 'home', initialDocumentTitle: 'title', runHooks: async () => {} })

      await ui.renderByQuery()

      expect(htmlBuilder.scrollToAnchorOrTop).toHaveBeenLastCalledWith('parsedAnchor')
    })
})
