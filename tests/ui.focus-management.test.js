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

const stubDeps = (pagePath) => {
  vi.spyOn(router, 'fetchPageData').mockResolvedValue({
    data: { raw: '# Page' },
    pagePath,
    anchor: null,
  })
  const fakeArticle = document.createElement('article')
  const fakeToc = document.createElement('nav')
  vi.spyOn(htmlBuilder, 'prepareArticle').mockResolvedValue({
    article: fakeArticle,
    parsed: {},
    toc: fakeToc,
    topH1: null,
    h1Text: 'Page',
    slugKey: 'page-slug',
  })
  return { fakeArticle, fakeToc }
}

const makeUI = (homePage = 'index.md') =>
  createUI({
    contentWrap: makeEl(),
    navWrap: makeEl(),
    container: makeEl(),
    mountOverlay: null,
    t: (s) => s,
    contentBase: '/',
    homePage,
    initialDocumentTitle: '',
    runHooks: async () => {},
  })

/**
 * Regression guard: a cold load leaves focus on `document.body`, and the
 * initial render must not move focus to the main landmark. Doing so paints the
 * browser's default focus ring around the whole content area on every cold
 * load. Focus is only moved when the element that held focus is about to be
 * replaced by the render, which is the client-side navigation case.
 */
describe('ui focus management', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
    try { slugToMd.clear(); mdToSlug.clear() } catch (_) {}
    history.replaceState({}, '', '/')
  })

  it('does not focus the main landmark on a cold load', async () => {
    stubDeps('index.md')
    const ui = makeUI()

    // Nothing has been focused yet, which is the cold-load condition.
    expect(document.activeElement).toBe(document.body)

    await ui.renderByQuery()

    const main = document.querySelector('main.nimbi-main')
    expect(main).not.toBeNull()
    // The main landmark must not have been focused, and must not have been
    // made programmatically focusable either.
    expect(document.activeElement).toBe(document.body)
    expect(main.getAttribute('tabindex')).toBeNull()
  })

  it('focuses the main landmark when focus was inside the replaced content', async () => {
    stubDeps('index.md')
    const ui = makeUI()

    // Focus sits on a link inside the content that the render replaces, which
    // is the client-side navigation condition.
    const oldLink = document.createElement('a')
    oldLink.href = '?page=old'
    const contentWrap = document.querySelectorAll('div')[0]
    contentWrap.appendChild(oldLink)
    oldLink.focus()
    expect(document.activeElement).toBe(oldLink)

    await ui.renderByQuery()

    const main = document.querySelector('main.nimbi-main')
    expect(document.activeElement).toBe(main)
    expect(main.getAttribute('tabindex')).toBe('-1')
  })

  it('focuses the main landmark on a subsequent navigation when focus fell back to body', async () => {
    stubDeps('index.md')
    const ui = makeUI()

    // First render: the cold load, which must not steal focus.
    await ui.renderByQuery()
    expect(document.activeElement).toBe(document.body)

    // Second render: a client-side navigation. The focused link was replaced,
    // so focus fell back to `body`; it must still move to the new main.
    stubDeps('other.md')
    await ui.renderByQuery()

    const main = document.querySelector('main.nimbi-main')
    expect(document.activeElement).toBe(main)
    expect(main.getAttribute('tabindex')).toBe('-1')
  })

  it('focuses the main landmark when focus was inside the replaced nav', async () => {
    stubDeps('index.md')
    const ui = makeUI()

    await ui.renderByQuery()
    expect(document.activeElement).toBe(document.body)

    // Simulate a keyboard user with focus on a navigation link that is about
    // to be replaced by the next render.
    const navLink = document.createElement('a')
    navLink.href = '#/other'
    const navWrap = document.querySelectorAll('nav')[0]
    navWrap.appendChild(navLink)
    navLink.focus()
    expect(document.activeElement).toBe(navLink)

    stubDeps('other.md')
    await ui.renderByQuery()

    const main = document.querySelector('main.nimbi-main')
    expect(document.activeElement).toBe(main)
  })
})
