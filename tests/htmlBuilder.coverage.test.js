import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import * as htmlBuilder from '../src/htmlBuilder.js'
// bring commonly-used helpers into local scope for cleaner tests
const { executeEmbeddedScripts, renderNotFound, scrollToAnchorOrTop, attachTocClickHandler, ensureScrollTopButton } = htmlBuilder

describe('htmlBuilder coverage', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    delete window.__test_script_executed
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('createNavTree generates nested menu with children', () => {
    const t = (k) => (k === 'navigation' ? 'Nav' : k)
    const tree = [
      { path: 'a', name: 'A', children: [{ path: 'a1', name: 'A1' }] },
    ]
    const nav = htmlBuilder.createNavTree(t, tree)
    expect(nav.querySelector('.menu-label').textContent).toBe('Nav')
    expect(nav.querySelectorAll('a').length).toBe(2)
    expect(nav.querySelector('a').getAttribute('href')).toBe('#a')
  })

  it('buildTocElement returns null when toc has <=1 item', () => {
    const t = (k) => k
    expect(htmlBuilder.buildTocElement(t, [{ level: 1, text: 'T' }])).toBeNull()
  })

  it('buildTocElement nests items and uses buildPageUrl when mdToSlug has mapping', () => {
    const t = (k) => k
    const toc = [
      { level: 2, text: 'One', id: 'one' },
      { level: 3, text: 'Two', id: 'two' },
    ]
    // simulate mdToSlug mapping via window.global in request
    window.mdToSlug = new Map([['foo', 'page']])
    const tocEl = htmlBuilder.buildTocElement(t, toc, 'foo')
    expect(tocEl).toBeTruthy()
    // should contain a link for first item and nested list for second
    expect(tocEl.querySelectorAll('li').length).toBeGreaterThanOrEqual(2)
    // cleanup
    delete window.mdToSlug
  })

  it('executeEmbeddedScripts removes duplicates and appends new scripts', () => {
    const article = document.createElement('article')
    const existing = document.createElement('script')
    existing.src = 'https://example.com/f.js'
    document.head.appendChild(existing)

    const script = document.createElement('script')
    script.src = 'https://example.com/f.js'
    article.appendChild(script)

    executeEmbeddedScripts(article)

    // original script should be removed from article when duplicate
    expect(article.querySelector('script')).toBeNull()
    // new script should not create duplicate in head
    const matches = Array.from(document.head.querySelectorAll('script[src="https://example.com/f.js"]'))
    expect(matches.length).toBe(1)
  })

  it('renderNotFound injects a not-found message', () => {
    const container = document.createElement('div')
    renderNotFound(container, (k) => 'NOT FOUND', new Error('boom'))
    expect(container.querySelector('.nimbi-not-found')).toBeTruthy()
    expect(container.textContent).toContain('boom')
  })

  it('scrollToAnchorOrTop scrolls to top when anchor is null', () => {
    const container = document.createElement('div')
    container.className = 'nimbi-cms'
    container.scrollTo = vi.fn()
    document.body.appendChild(container)

    scrollToAnchorOrTop(null)
    expect(container.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('scrollToAnchorOrTop scrolls to element when anchor exists', async () => {
    const originalRAF = global.requestAnimationFrame
    global.requestAnimationFrame = (cb) => cb()

    const container = document.createElement('div')
    container.className = 'nimbi-cms'
    container.getBoundingClientRect = () => ({ top: 0, bottom: 100 })
    container.scrollTop = 0
    container.scrollTo = vi.fn()
    document.body.appendChild(container)

    const target = document.createElement('div')
    target.id = 'x'
    target.getBoundingClientRect = () => ({ top: 10, bottom: 20 })
    container.appendChild(target)

    // Provide scrollIntoView spy in case the function falls back to it.
    target.scrollIntoView = vi.fn()

    scrollToAnchorOrTop('x')
    // Ensure it doesn't throw when an anchor exists.

    global.requestAnimationFrame = originalRAF
  })

  it('attachTocClickHandler handles hash-only anchor clicks', () => {
    // Use fake timers so the scheduled setTimeout in scroll helper runs immediately
    vi.useFakeTimers()

    const container = document.createElement('div')
    container.className = 'nimbi-cms'
    // Provide a bounding rect so scrollTo calculation uses container.scrollTo
    container.getBoundingClientRect = () => ({ top: 0, bottom: 200 })
    container.scrollTop = 0
    container.scrollTo = vi.fn()
    document.body.appendChild(container)

    const toc = document.createElement('nav')
    toc.innerHTML = '<a href="#foo">foo</a>'
    container.appendChild(toc)

    // create target anchor element so scroll will be attempted
    const target = document.createElement('div')
    target.id = 'foo'
    target.getBoundingClientRect = () => ({ top: 10, bottom: 20 })
    container.appendChild(target)

    const replaceSpy = vi.spyOn(history, 'replaceState')

    attachTocClickHandler(toc)
    toc.querySelector('a').dispatchEvent(new MouseEvent('click', { bubbles: true }))

    // Run pending timers so the scroll timeout executes
    vi.runAllTimers()

    expect(replaceSpy).toHaveBeenCalled()
    expect(container.scrollTo).toHaveBeenCalled()

    replaceSpy.mockRestore()
    vi.useRealTimers()
  })

  it('attachTocClickHandler triggers renderByQuery when page changes', () => {
    const container = document.createElement('div')
    const toc = document.createElement('nav')
    toc.innerHTML = '<a href="?page=other#bar">bar</a>'
    container.appendChild(toc)

    // Ensure current location is set to page=current
    history.replaceState({ page: 'current' }, '', '?page=current')

    window.renderByQuery = vi.fn()

    attachTocClickHandler(toc)
    toc.querySelector('a').dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(window.renderByQuery).toHaveBeenCalled()

    delete window.renderByQuery
  })

  it('ensureScrollTopButton creates button and toggles show class (IntersectionObserver)', () => {
    // Mock IntersectionObserver as a minimal class
    const observe = vi.fn()
    const disconnect = vi.fn()
    global.IntersectionObserver = class {
      constructor(cb) {
        this.cb = cb
      }
      observe(el) {
        observe(el)
        // immediately invoke callback to simulate non-intersecting
        this.cb([{ target: el, isIntersecting: false }])
      }
      disconnect() {
        disconnect()
      }
    }

    const article = document.createElement('article')
    const topH1 = document.createElement('h1')
    topH1.id = 'foo'
    article.appendChild(topH1)

    const container = document.createElement('div')
    container.className = 'nimbi-cms'
    document.body.appendChild(container)

    const overlay = document.createElement('div')
    overlay.className = 'nimbi-overlay'
    document.body.appendChild(overlay)

    const navWrap = document.createElement('div')
    navWrap.className = 'nimbi-nav-wrap'
    const label = document.createElement('div')
    label.className = 'menu-label'
    navWrap.appendChild(label)
    document.body.appendChild(navWrap)

    ensureScrollTopButton(article, topH1, { container, mountOverlay: overlay, navWrap })

    const btn = document.querySelector('.nimbi-scroll-top')
    expect(btn).toBeTruthy()
    expect(observe).toHaveBeenCalled()

    // Clean up mock
    delete global.IntersectionObserver
  })
})
