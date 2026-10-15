import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createUI } from '../src/ui.js'
import * as router from '../src/router.js'
import * as htmlBuilder from '../src/htmlBuilder.js'
import { slugToMd, mdToSlug } from '../src/slugManager.js'

function makeEl(tag = 'div') {
  const el = document.createElement(tag)
  document.body.appendChild(el)
  return el
}

/**
 * Regression guard: rendering a page canonicalizes the URL to its cosmetic
 * form (`computeSlug` -> `history.replaceState`). A cold load at the site root
 * has no slug, so mid-render the URL gains the home page's slug. The
 * `routeIsCurrent()` guard used to treat that as "navigated away" and abort the
 * render, leaving the mount blank.
 */
describe('ui renderPage survives URL canonicalization mid-render', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
    try { slugToMd.clear(); mdToSlug.clear() } catch (_) {}
    // Cold load at the site root: no slug, no query params.
    history.replaceState({}, '', '/')
  })

  it('commits the home page when the URL is rewritten to its slug mid-render', async () => {
    const contentWrap = makeEl()
    const navWrap = makeEl()
    const container = makeEl()

    vi.spyOn(router, 'fetchPageData').mockResolvedValue({
      data: { raw: '# Home' },
      pagePath: 'assets/brochure.md',
      anchor: null,
    })

    const fakeArticle = document.createElement('article')
    const fakeToc = document.createElement('nav')

    // Simulate `computeSlug` canonicalizing the URL while the article is
    // being prepared, and register the slug mapping it would create.
    vi.spyOn(htmlBuilder, 'prepareArticle').mockImplementation(async () => {
      slugToMd.set('home-slug', 'assets/brochure.md')
      history.replaceState({ page: 'home-slug' }, '', '/#/home-slug')
      return {
        article: fakeArticle,
        parsed: {},
        toc: fakeToc,
        topH1: null,
        h1Text: 'Home',
        slugKey: 'home-slug',
      }
    })

    const ui = createUI({
      contentWrap,
      navWrap,
      container,
      mountOverlay: null,
      t: (s) => s,
      contentBase: '/',
      homePage: 'assets/brochure.md',
      initialDocumentTitle: '',
      runHooks: async () => {},
    })

    await ui.renderByQuery()

    // The render must not have been aborted by the URL rewrite.
    expect(contentWrap.contains(fakeArticle)).toBe(true)
    expect(ui.getCurrentPagePath()).toBe('assets/brochure.md')
  })

  it('still aborts when the user navigates to a different page mid-render', async () => {
    const contentWrap = makeEl()
    const navWrap = makeEl()
    const container = makeEl()

    vi.spyOn(router, 'fetchPageData').mockResolvedValue({
      data: { raw: '# Home' },
      pagePath: 'assets/brochure.md',
      anchor: null,
    })

    const fakeArticle = document.createElement('article')
    const fakeToc = document.createElement('nav')

    // A genuine navigation to an unrelated page must still abort the render.
    vi.spyOn(htmlBuilder, 'prepareArticle').mockImplementation(async () => {
      history.replaceState({}, '', '/?page=some-other-page')
      return {
        article: fakeArticle,
        parsed: {},
        toc: fakeToc,
        topH1: null,
        h1Text: 'Home',
        slugKey: 'home-slug',
      }
    })

    const ui = createUI({
      contentWrap,
      navWrap,
      container,
      mountOverlay: null,
      t: (s) => s,
      contentBase: '/',
      homePage: 'assets/brochure.md',
      initialDocumentTitle: '',
      runHooks: async () => {},
    })

    await ui.renderByQuery()

    expect(contentWrap.contains(fakeArticle)).toBe(false)
    expect(ui.getCurrentPagePath()).toBeNull()
  })

  it('still aborts when the URL points at a different mapped slug', async () => {
    const contentWrap = makeEl()
    const navWrap = makeEl()
    const container = makeEl()

    vi.spyOn(router, 'fetchPageData').mockResolvedValue({
      data: { raw: '# Home' },
      pagePath: 'assets/brochure.md',
      anchor: null,
    })

    const fakeArticle = document.createElement('article')
    const fakeToc = document.createElement('nav')

    // A mapped slug that resolves to a *different* page must still abort the
    // render, otherwise a stale render could commit over a real navigation.
    vi.spyOn(htmlBuilder, 'prepareArticle').mockImplementation(async () => {
      slugToMd.set('other-page', 'assets/other.md')
      history.replaceState({}, '', '/?page=other-page')
      return {
        article: fakeArticle,
        parsed: {},
        toc: fakeToc,
        topH1: null,
        h1Text: 'Home',
        slugKey: 'home-slug',
      }
    })

    const ui = createUI({
      contentWrap,
      navWrap,
      container,
      mountOverlay: null,
      t: (s) => s,
      contentBase: '/',
      homePage: 'assets/brochure.md',
      initialDocumentTitle: '',
      runHooks: async () => {},
    })

    await ui.renderByQuery()

    expect(contentWrap.contains(fakeArticle)).toBe(false)
    expect(ui.getCurrentPagePath()).toBeNull()
  })

  it('commits when the slug maps to a non-first language variant', async () => {
    const contentWrap = makeEl()
    const navWrap = makeEl()
    const container = makeEl()

    vi.spyOn(router, 'fetchPageData').mockResolvedValue({
      data: { raw: '# Home' },
      pagePath: 'index.es.md',
      anchor: null,
    })

    const fakeArticle = document.createElement('article')
    const fakeToc = document.createElement('nav')

    // The rendered page is the second language variant, so resolving only the
    // first-inserted `langs` value would wrongly abort the render.
    vi.spyOn(htmlBuilder, 'prepareArticle').mockImplementation(async () => {
      slugToMd.set('home-slug', {
        default: undefined,
        langs: { en: 'index.en.md', es: 'index.es.md' },
      })
      history.replaceState({ page: 'home-slug' }, '', '/#/home-slug')
      return {
        article: fakeArticle,
        parsed: {},
        toc: fakeToc,
        topH1: null,
        h1Text: 'Home',
        slugKey: 'home-slug',
      }
    })

    const ui = createUI({
      contentWrap,
      navWrap,
      container,
      mountOverlay: null,
      t: (s) => s,
      contentBase: '/',
      homePage: 'index.es.md',
      initialDocumentTitle: '',
      runHooks: async () => {},
    })

    await ui.renderByQuery()

    expect(contentWrap.contains(fakeArticle)).toBe(true)
    expect(ui.getCurrentPagePath()).toBe('index.es.md')
  })
})
