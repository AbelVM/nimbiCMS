import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../src/slugManager.js', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    // safe defaults for tests
    fetchMarkdown: async (path) => {
      if (path && path.endsWith('some.html')) {
        return { raw: '<html><head><title>My Page Title</title></head><body><h1>My Page Title</h1></body></html>' }
      }
      return null
    },
    buildSearchIndex: async () => []
  }
})

import { buildNav } from '../src/nav.js'

describe('nav deep branches', () => {
  beforeEach(() => {
    // ensure a stable base URL for URL parsing
    Object.defineProperty(globalThis, 'location', { value: { href: 'http://example.com/' }, configurable: true })
    while (document.body.firstChild) document.body.removeChild(document.body.firstChild)
  })

  it('brand uses first link page param and clicking calls renderByQuery', async () => {
    const navbarWrap = document.createElement('header')
    const container = document.createElement('main')
    const navHtml = '<a href="http://example.com/?page=foo"></a>'
    const renderByQuery = vi.fn()

    const res = await buildNav(navbarWrap, container, navHtml, '/content/', 'home', (_t) => _t, renderByQuery, false)
    const brand = navbarWrap.querySelector('.navbar .navbar-brand .navbar-item')
    expect(brand).toBeTruthy()
    expect(brand.getAttribute('href')).toContain('?page=foo')

    // simulate click
    const ev = new MouseEvent('click', { bubbles: true })
    brand.dispatchEvent(ev)
    expect(renderByQuery).toHaveBeenCalled()
  })

  it('keeps extra query params when navigating via brand click', async () => {
    // Ensure that options passed via query string persist through SPA navigation.
    Object.defineProperty(globalThis, 'location', {
      value: { href: 'http://example.com/?lang=fr&page=foo', search: '?lang=fr&page=foo', pathname: '/', origin: 'http://example.com' },
      configurable: true
    })

    const navbarWrap = document.createElement('header')
    const container = document.createElement('main')
    const navHtml = '<a href="http://example.com/?page=foo"></a>'
    const renderByQuery = vi.fn()

    const pushSpy = vi.spyOn(history, 'pushState')
    await buildNav(navbarWrap, container, navHtml, '/content/', 'home', (_t) => _t, renderByQuery, false)

    const brand = navbarWrap.querySelector('.navbar .navbar-brand .navbar-item')
    expect(brand.getAttribute('href')).toContain('lang=fr')

    brand.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(pushSpy).toHaveBeenCalled()
    const pushedUrl = pushSpy.mock.calls[0][2]
    expect(pushedUrl).toContain('lang=fr')
    pushSpy.mockRestore()
  })

  it('creates md link navbar-item with page param for .md links', async () => {
    const navbarWrap = document.createElement('header')
    const container = document.createElement('main')
    const navHtml = '<a href="#home"></a><a href="page.md">My Page</a>'
    const renderByQuery = () => {}

    const { navbar } = await buildNav(navbarWrap, container, navHtml, '/content/', 'home', (_t) => _t, renderByQuery, false)
    const items = navbar.querySelectorAll('.navbar-start .navbar-item')
    // first item is brand skipped in loop; second should map to page.md
    expect(items.length).toBeGreaterThanOrEqual(1)
    const found = Array.from(items).some(a => (a.getAttribute('href') || '').includes('page.md'))
    expect(found).toBe(true)
  })

  it('processes html link and sets slug mapping when title present', async () => {
    const navbarWrap = document.createElement('header')
    const container = document.createElement('main')
    const navHtml = '<a href="#home"></a><a href="some.html">Some</a>'
    const renderByQuery = () => {}

    const { navbar } = await buildNav(navbarWrap, container, navHtml, '/content/', 'home', (_t) => _t, renderByQuery, false)
    // after processing, the navbar links should include a page slug derived from title
    const items = navbar.querySelectorAll('.navbar-start .navbar-item')
    const hasSlugLink = Array.from(items).some(a => (a.getAttribute('href') || '').includes('?page='))
    expect(hasSlugLink).toBe(true)
  })

  it('container click navigates for internal page links and calls renderByQuery', async () => {
    const navbarWrap = document.createElement('header')
    const container = document.createElement('main')
    document.body.appendChild(container)
    const navHtml = '<a href="#home"></a>'
    const renderByQuery = vi.fn()

    await buildNav(navbarWrap, container, navHtml, '/content/', 'home', (_t) => _t, renderByQuery, false)

    const a = document.createElement('a')
    a.href = '?page=abc#frag'
    a.textContent = 'go'
    container.appendChild(a)

    const ev = new MouseEvent('click', { bubbles: true })
    a.dispatchEvent(ev)

    expect(renderByQuery).toHaveBeenCalled()
  })
})
