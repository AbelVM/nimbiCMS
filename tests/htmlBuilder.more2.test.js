import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  attachTocClickHandler,
  ensureScrollTopButton,
  executeEmbeddedScripts,
  renderNotFound,
  scrollToAnchorOrTop
} from '../src/htmlBuilder.js'
import { setHomePage, setNotFoundPage } from '../src/slugManager.js'

describe('htmlBuilder late helper branches', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div class="nimbi-mount"><div class="nimbi-overlay"></div><div class="nimbi-cms"></div><div class="nimbi-nav-wrap"><p class="menu-label">TOC</p></div></div>'
    try { setHomePage('index.md') } catch (_) {}
    try { setNotFoundPage(null) } catch (_) {}
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('executeEmbeddedScripts skips duplicate external script tags', () => {
    const existing = document.createElement('script')
    existing.src = 'https://cdn.example.com/a.js'
    document.head.appendChild(existing)

    const article = document.createElement('article')
    article.innerHTML = '<script src="https://cdn.example.com/a.js"></script>'
    executeEmbeddedScripts(article)

    expect(article.querySelectorAll('script').length).toBe(0)
    expect(document.querySelectorAll('script[src="https://cdn.example.com/a.js"]').length).toBe(1)
  })

  it('renderNotFound clears wrapper and appends fallback home link when notFoundPage is disabled', () => {
    const wrap = document.createElement('div')
    wrap.innerHTML = '<p>old</p>'
    renderNotFound(wrap, (k) => (k === 'home' ? 'Home' : k), new Error('missing page'))

    expect(String(wrap.textContent ?? '')).toContain('missing page')
    const link = wrap.querySelector('a')
    expect(link).toBeTruthy()
    expect(String(link.getAttribute('href') || '')).toContain('?page=')
  })

  it('attachTocClickHandler handles same-page hash route via history.replaceState', () => {
    const toc = document.createElement('aside')
    toc.innerHTML = '<a href="?page=current#sec">Section</a>'
    const replaceSpy = vi.spyOn(history, 'replaceState')
    vi.spyOn(history, 'state', 'get').mockReturnValue({ page: 'current' })

    attachTocClickHandler(toc)
    toc.querySelector('a').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

    expect(replaceSpy).toHaveBeenCalled()
  })

  it('scrollToAnchorOrTop and ensureScrollTopButton handle no-observer fallback', () => {
    const container = document.querySelector('.nimbi-cms')
    const mountEl = document.querySelector('.nimbi-mount')
    const navWrap = document.querySelector('.nimbi-nav-wrap')
    container.scrollTo = vi.fn()
    window.scrollTo = vi.fn()

    const article = document.createElement('article')
    const topH1 = document.createElement('h1')
    topH1.id = 'top-id'
    article.appendChild(topH1)
    document.body.appendChild(article)

    const oldObserver = globalThis.IntersectionObserver
    delete globalThis.IntersectionObserver
    try {
      ensureScrollTopButton(article, null, { container, mountEl, navWrap, t: (k) => k })
      container.dispatchEvent(new Event('scroll'))
      scrollToAnchorOrTop(null)
      expect(container.scrollTo).toHaveBeenCalled()

      ensureScrollTopButton(article, topH1, { container, mountEl, navWrap, t: (k) => k })
      scrollToAnchorOrTop('top-id')
    } finally {
      globalThis.IntersectionObserver = oldObserver
    }
  })
})
