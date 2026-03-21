import { beforeEach, describe, it, expect, vi } from 'vitest'

// Tests for navbar burger toggle and search interactions.
vi.mock('../src/slugManager.js', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    buildSearchIndex: async () => [{ slug: 'about', title: 'About page', excerpt: 'about excerpt' }]
  }
})

import { buildNav } from '../src/nav.js'

describe('nav search & burger', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'location', { value: { href: 'http://example.com/' }, configurable: true })
    while (document.body.firstChild) document.body.removeChild(document.body.firstChild)
  })

  it('toggles burger and menu active state', async () => {
    const navbarWrap = document.createElement('header')
    const container = document.createElement('main')
    const navHtml = '<a href="#home"></a>'
    document.body.appendChild(navbarWrap)
    await buildNav(navbarWrap, container, navHtml, '/content/', 'home', (_t) => _t, () => {}, false)

    const burger = navbarWrap.querySelector('.navbar-burger')
    const target = navbarWrap.querySelector('#nimbi-navbar-menu')
    expect(burger).toBeTruthy()
    expect(burger.getAttribute('aria-expanded')).toBe('false')

    burger.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(burger.classList.contains('is-active')).toBe(true)
    expect(burger.getAttribute('aria-expanded')).toBe('true')
    expect(target.classList.contains('is-active')).toBe(true)

    // toggle back
    burger.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(burger.classList.contains('is-active')).toBe(false)
    expect(burger.getAttribute('aria-expanded')).toBe('false')
  })

  it('shows search results when typing and uses buildSearchIndex', async () => {
    const navbarWrap = document.createElement('header')
    const container = document.createElement('main')
    const navHtml = '<a href="#home"></a>'
    document.body.appendChild(navbarWrap)
    await buildNav(navbarWrap, container, navHtml, '/content/', 'home', (_t) => _t, () => {}, true, 'eager')

    const input = navbarWrap.querySelector('input#nimbi-search')
    const results = navbarWrap.querySelector('#nimbi-search-results')
    expect(input).toBeTruthy()
    expect(results).toBeTruthy()

    // simulate user typing; debounce in buildNav uses 50ms
    input.value = 'about'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    // wait for debounce + promise resolution
    await new Promise((r) => setTimeout(r, 150))

    expect(results.style.display).toBe('block')
    const link = results.querySelector('a')
    expect(link).toBeTruthy()
    const linkHref = link.getAttribute('href') || ''
    expect(linkHref.includes('?page=about') || linkHref.includes('#/about')).toBe(true)
    expect(link.textContent).toContain('About')
  })
})
