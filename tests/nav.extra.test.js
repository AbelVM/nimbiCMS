import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as nav from '../src/nav.js'
import { slugToMd, mdToSlug } from '../src/slugManager.js'

describe('nav focused branches', () => {
  let navbarWrap, container
  beforeEach(() => {
    // reset DOM
    document.body.innerHTML = ''
    navbarWrap = document.createElement('header')
    container = document.createElement('main')
    document.body.appendChild(navbarWrap)
    document.body.appendChild(container)
    // clear slug maps
    slugToMd.clear()
    mdToSlug.clear()
  })

  it('throws when navbarWrap is not an HTMLElement', async () => {
    await expect(nav.buildNav(null, container, '<a></a>', '/content/', 'home', (k)=>k, () => {}, false)).rejects.toThrow(TypeError)
  })

  it('brand uses first link page param when present', async () => {
    const navHtml = '<a href="?page=foo">Root</a><a href="page.md">x</a>'
    const res = await nav.buildNav(navbarWrap, container, navHtml, '/content/', 'home', (s)=>s, () => {}, false)
    const brand = res.navbar.querySelector('.navbar-brand .navbar-item')
    expect(brand).toBeTruthy()
    expect(brand.getAttribute('href')).toContain('page=foo')
  })

  it('burger toggles active class on menu and burger', async () => {
    const navHtml = ''
    const res = await nav.buildNav(navbarWrap, container, navHtml, '/content/', 'home', (s)=>s, () => {}, false)
    const burger = res.navbar.querySelector('.navbar-burger')
    const menu = res.navbar.querySelector('#nimbi-navbar-menu')
    expect(burger).toBeTruthy()
    expect(menu).toBeTruthy()
    // initial state
    expect(burger.classList.contains('is-active')).toBe(false)
    expect(menu.classList.contains('is-active')).toBe(false)
    // click to activate
    burger.click()
    expect(burger.classList.contains('is-active')).toBe(true)
    expect(menu.classList.contains('is-active')).toBe(true)
    // click to deactivate
    burger.click()
    expect(burger.classList.contains('is-active')).toBe(false)
    expect(menu.classList.contains('is-active')).toBe(false)
  })

  it('creates md link navbar-item with page param', async () => {
    const navHtml = '<a href="?page=home">Root</a><a href="foo.md">Foo</a>'
    const res = await nav.buildNav(navbarWrap, container, navHtml, '/content/', 'home', (s)=>s, () => {}, false)
    const items = Array.from(res.navbar.querySelectorAll('.navbar-start .navbar-item'))
    // second item should correspond to foo.md
    expect(items.length).toBeGreaterThanOrEqual(1)
    const hrefs = items.map(i => i.getAttribute('href'))
    expect(hrefs.some(h => h && h.includes('foo.md'))).toBe(true)
  })

  it('processes html link, sets slug mapping when title present', async () => {
    const navHtml = '<a href="?page=home">Root</a><a href="bar.html">Bar</a>'
    // stub fetchMarkdown to return an HTML document with title
    const origFetchMd = global.fetch
    // nav.buildNav calls fetchMarkdown (imported from slugManager); stub via fetch
    global.fetch = vi.fn(async (url) => ({ ok: true, text: async () => '<html><head><title>BarTitle</title></head><body></body></html>' }))
    try {
      const res = await nav.buildNav(navbarWrap, container, navHtml, '/content/', 'home', (s)=>s, () => {}, false)
      // slug should be set from title
      expect(slugToMd.get('bartitle')).toBe('bar.html')
      // find created navbar items and assert one uses the slug page
      const items = Array.from(res.navbar.querySelectorAll('.navbar-start .navbar-item'))
      expect(items.some(i => i.getAttribute('href') && i.getAttribute('href').includes('bartitle'))).toBe(true)
    } finally {
      global.fetch = origFetchMd
    }
  })

  it('container click navigates for internal page links and calls renderByQuery', async () => {
    const navHtml = '<a href="?page=home">Root</a>'
    const renderSpy = vi.fn()
    const res = await nav.buildNav(navbarWrap, container, navHtml, '/content/', 'home', (s)=>s, renderSpy, false)
    // create an internal link inside container and simulate click
    const a = document.createElement('a')
    a.href = '?page=somepage'
    a.textContent = 'link'
    container.appendChild(a)
    // dispatch click event
    const ev = new MouseEvent('click', { bubbles: true, cancelable: true })
    a.dispatchEvent(ev)
    expect(renderSpy).toHaveBeenCalled()
  })
})
