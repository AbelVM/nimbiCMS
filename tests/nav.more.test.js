import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../src/htmlBuilder.js', () => ({
  preScanHtmlSlugs: () => {},
  preMapMdSlugs: () => {},
  createNavTree: (t, arr) => arr
}))

vi.mock('../src/slugManager.js', () => ({
  slugify: (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  slugToMd: new Map(),
  mdToSlug: new Map(),
  fetchMarkdown: async (p, base) => ({ raw: '<html><head><title>My Page</title></head><body><h1>Heading</h1></body></html>' })
}))

import { buildNav } from '../src/nav.js'

describe('nav more branches', () => {
  let root, container
  beforeEach(() => {
    document.body.innerHTML = ''
    root = document.createElement('header')
    container = document.createElement('main')
    document.body.appendChild(root)
    document.body.appendChild(container)
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates menu item from html link using fetched title and slug mapping, and burger toggles', async () => {
    const navHtml = `<nav><a href="/">Home</a><a href="page.html">Page</a></nav>`
    const renderSpy = vi.fn()
    const res = await buildNav(root, container, navHtml, 'http://example.com/', 'home', (k)=>k, renderSpy, false)
    const navbar = res.navbar
    expect(navbar).toBeTruthy()
    // second link becomes a navbar-item
    const items = navbar.querySelectorAll('.navbar-start .navbar-item')
    expect(items.length).toBeGreaterThanOrEqual(1)
    const hrefs = Array.from(items).map(i => i.getAttribute('href'))
    // should contain slugified page (my-page -> my-page)
    expect(hrefs.some(h => h && h.includes('my-page'))).toBe(true)

    // burger toggle
    const burger = navbar.querySelector('.navbar-burger')
    const menu = navbar.querySelector('.navbar-menu')
    expect(burger).toBeTruthy()
    // simulate click
    burger.click()
    expect(burger.classList.contains('is-active')).toBe(true)
    // click again closes
    burger.click()
    expect(burger.classList.contains('is-active')).toBe(false)
  })
})
