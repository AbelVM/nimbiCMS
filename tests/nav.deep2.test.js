import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../src/slugManager.js', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    buildSearchIndex: async () => [{ slug: 's', title: 'Title' }],
    buildSearchIndexWorker: async () => [{ slug: 'w', title: 'Worker' }]
  }
})

import { buildNav } from '../src/nav.js'

describe('nav search and burger deeper branches', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'location', { value: { href: 'http://example.com/' }, configurable: true })
    while (document.body.firstChild) document.body.removeChild(document.body.firstChild)
  })

  it('eager search initializes index and enables input', async () => {
    const navbarWrap = document.createElement('header')
    const container = document.createElement('main')
    const navHtml = '<a href="#home"></a>'
    document.body.appendChild(navbarWrap)
    await buildNav(navbarWrap, container, navHtml, '/content/', 'home', (_t) => _t, () => {}, true, 'eager')
    // allow async eager init to complete
    await new Promise(r => setTimeout(r, 300))
    const input = navbarWrap.querySelector('input#nimbi-search')
    expect(input).toBeTruthy()
    // if eager index finished, input should not be disabled or loading
    expect(input.disabled).toBe(false)
    expect(input.classList.contains('is-loading')).toBe(false)
  })

  it('lazy search uses worker when available on input', async () => {
    const navbarWrap = document.createElement('header')
    const container = document.createElement('main')
    const navHtml = '<a href="#home"></a>'
    document.body.appendChild(navbarWrap)
    await buildNav(navbarWrap, container, navHtml, '/content/', 'home', (_t) => _t, () => {}, true, 'lazy')
    const input = navbarWrap.querySelector('input#nimbi-search')
    expect(input).toBeTruthy()
    input.value = 'Worker'
    // trigger input event to run the debounce handler
    input.dispatchEvent(new Event('input', { bubbles: true }))
    // wait for debounce + async handlers
    await new Promise(r => setTimeout(r, 400))
    const results = navbarWrap.querySelector('#nimbi-search-results')
    expect(results && results.style.display === 'block').toBe(true)
  })

  it('burger toggles is-active and menu closes on menu click', async () => {
    const navbarWrap = document.createElement('header')
    const container = document.createElement('main')
    // create a menu target so toggle can add/remove class
    const menuTarget = document.createElement('div')
    menuTarget.id = 'nimbi-navbar-menu'
    document.body.appendChild(menuTarget)

    const navHtml = '<a href="#home"></a><a href="?page=abc">Link</a>'
    const renderByQuery = vi.fn()
    const { navbar } = await buildNav(navbarWrap, container, navHtml, '/content/', 'home', (_t) => _t, renderByQuery, false)

    const burger = navbar.querySelector('.navbar-burger')
    expect(burger).toBeTruthy()
    // open menu
    burger.dispatchEvent(new Event('click', { bubbles: true }))
    expect(burger.classList.contains('is-active')).toBe(true)

    // simulate click on menu link inside menu
    const menu = navbar.querySelector('.navbar-menu')
    const link = menu.querySelector('a[href*="?page=abc"]')
    expect(link).toBeTruthy()
    link.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    // burger should be closed after navigation
    expect(burger.classList.contains('is-active')).toBe(false)
    expect(renderByQuery).toHaveBeenCalled()
  })
})
