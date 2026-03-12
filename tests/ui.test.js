import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createUI } from '../src/ui.js'
import * as router from '../src/router.js'
import * as htmlBuilder from '../src/htmlBuilder.js'

function makeEl(tag = 'div') {
  const el = document.createElement(tag)
  document.body.appendChild(el)
  return el
}

describe('ui module', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('renderByQuery populates content and invokes hooks', async () => {
    const contentWrap = makeEl()
    const navWrap = makeEl()
    const container = makeEl()
    const t = s => s
    const runHooks = vi.fn(async () => {})

    // stub dependencies
    vi.spyOn(router, 'fetchPageData').mockResolvedValue({ data: {}, pagePath: 'foo', anchor: null })
    const fakeArticle = document.createElement('article')
    const fakeToc = document.createElement('nav')
    vi.spyOn(htmlBuilder, 'prepareArticle').mockResolvedValue({ article: fakeArticle, parsed: {}, toc: fakeToc, topH1: null, h1Text: null, slugKey: null })

    const ui = createUI({ contentWrap, navWrap, container, mountOverlay: null, t, contentBase: '/', homePage: 'home.md', initialDocumentTitle: '', runHooks })

    expect(ui.getCurrentPagePath()).toBeNull()
    await ui.renderByQuery()
    expect(contentWrap.contains(fakeArticle)).toBe(true)
    expect(runHooks).toHaveBeenCalledWith('onPageLoad', expect.any(Object))
    expect(ui.getCurrentPagePath()).toBe('foo')
  })

  it('getCurrentPagePath stays null before any render', () => {
    const contentWrap = makeEl()
    const navWrap = makeEl()
    const container = makeEl()
    const t = s => s
    const ui = createUI({ contentWrap, navWrap, container, mountOverlay: null, t, contentBase: '/', homePage: 'home.md', initialDocumentTitle: '', runHooks: async () => {} })
    expect(ui.getCurrentPagePath()).toBeNull()
  })
})