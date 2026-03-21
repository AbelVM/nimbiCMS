import { describe, it, expect, vi } from 'vitest'
// Import modules dynamically inside tests so mocks can be applied first

describe('nav edge cases', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.resetModules()
  })

  it('brand uses first link page param when present and falls back to homePage', async () => {
    // first link has ?page=foo.html -> brand should take page param
    const navHtml = `<a href="/content/?page=foo.html">X</a>`
    const wrap = document.createElement('div')
    const container = document.createElement('main')
    const renderByQuery = () => {}
    const nav = await import('../src/nav.js')
    const res = await nav.buildNav(wrap, container, navHtml, 'http://base/', 'home', (k) => k, renderByQuery, false)
    const brand = wrap.querySelector('.navbar-brand .navbar-item')
    expect(brand).toBeTruthy()
    const brandHref = brand.getAttribute('href') || ''
    expect(brandHref.includes('?page=') || brandHref.includes('#/')).toBe(true)
  })

  it('md links with fragment produce encoded page param', async () => {
    // include a first link (brand) and a second link to test md fragment parsing
    const navHtml = `<a href="/">Home</a><a href="docs/page.md#section">Docs</a>`
    const wrap = document.createElement('div')
    const container = document.createElement('main')
    const renderByQuery = () => {}
    const nav = await import('../src/nav.js')
    const res = await nav.buildNav(wrap, container, navHtml, 'http://base/', 'home', (k) => k, renderByQuery, false)
    const items = wrap.querySelectorAll('.navbar-start .navbar-item')
    // second item corresponds to the link (first skipped for brand)
    const item = items[0]
    expect(item).toBeTruthy()
    const itemHref = item.getAttribute('href') || ''
    expect(itemHref).toMatch(/(\?page=.*page\.md|#\/.*page\.md)/) // encoded md path or slug
  })

  it('html link with title sets slug mapping when fetchMarkdown returns title', async () => {
    vi.mock('../src/slugManager.js', async (importOriginal) => {
      const actual = await importOriginal()
      return {
        ...actual,
        fetchMarkdown: async (p, base) => ({ raw: '<html><head><title>My Title</title></head><body></body></html>' })
      }
    })
    const slugModLocal = await import('../src/slugManager.js')
    const slug = slugModLocal.slugify('My Title')
    // include brand link first so buildNav creates a brand, then the html link
    const navHtml = `<a href="/">Home</a><a href="docs/index.html">Docs</a>`
    const wrap = document.createElement('div')
    const container = document.createElement('main')
    const renderByQuery = () => {}
    const mod = await import('../src/nav.js')
    const res = await mod.buildNav(wrap, container, navHtml, 'http://base/', 'home', (k) => k, renderByQuery, false)
    const items = wrap.querySelectorAll('.navbar-start .navbar-item')
    const item = items[0]
    const itemHref2 = item.getAttribute('href') || ''
    expect(itemHref2.includes(encodeURIComponent(slug)) || itemHref2.includes(slug)).toBe(true)
  })
})
