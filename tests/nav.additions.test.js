import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { buildNav } from '../src/nav.js'
import * as slugMgr from '../src/slugManager.js'

describe('nav additional branches', () => {
  let origFetch

  beforeEach(() => {
    document.head.innerHTML = ''
    document.body.innerHTML = ''
    slugMgr.slugToMd.clear()
    slugMgr.mdToSlug.clear()
    origFetch = slugMgr.fetchMarkdown
    try { slugMgr.clearFetchCache && slugMgr.clearFetchCache() } catch (e) {}
  })

  afterEach(() => {
    try { slugMgr.setFetchMarkdown && slugMgr.setFetchMarkdown(origFetch) } catch (e) {}
  })

  it('brand prefers slug from mdToSlug mapping', async () => {
    slugMgr.mdToSlug.set('foo.md', 'foo-slug')

    const navWrap = document.createElement('div')
    const container = document.createElement('div')
    document.body.appendChild(navWrap)
    document.body.appendChild(container)

    const navHtml = '<a href="?page=foo.md">Home</a><a href="?page=bar.md">Bar</a>'

    const { navbar } = await buildNav(navWrap, container, navHtml, 'http://example.com/base/', 'home.md', s => s, () => {}, false, 'eager')

    const brand = navbar.querySelector('.navbar-brand .navbar-item')
    expect(brand).toBeTruthy()
    expect(brand.getAttribute('href')).toContain('foo-slug')
  })

  it('resolves favicon and inserts logo img', async () => {
    const link = document.createElement('link')
    link.rel = 'icon'
    link.href = 'logo.png'
    document.head.appendChild(link)

    const navWrap = document.createElement('div')
    const container = document.createElement('div')
    document.body.appendChild(navWrap)
    document.body.appendChild(container)

    const navHtml = '<a href="?page=home.md">Home</a>'

    const { navbar } = await buildNav(navWrap, container, navHtml, 'http://example.com/base/', '_home.md', s => s, () => {}, false, 'eager', 1, undefined, 'favicon')

    const img = navbar.querySelector('img.nimbi-navbar-logo')
    expect(img).toBeTruthy()
    expect(img.src).toContain('logo.png')
  })

  it('move-first sets data-nimbi-logo-moved and inserts logo img', async () => {
    const fakeFetch = async (path, base) => ({ raw: '<p><img src="/assets/logo.png"></p>' })
    slugMgr.setFetchMarkdown(fakeFetch)

    const navWrap = document.createElement('div')
    const container = document.createElement('div')
    document.body.appendChild(navWrap)
    document.body.appendChild(container)

    const navHtml = '<a href="?page=home.md">Home</a>'

    const { navbar } = await buildNav(navWrap, container, navHtml, 'http://example.com/base/', 'home.md', s => s, () => {}, false, 'eager', 1, undefined, 'move-first')

    const moved = document.documentElement.getAttribute('data-nimbi-logo-moved')
    expect(moved).toBeTruthy()
    expect(moved).toContain('/assets/logo.png')

    const img = navbar.querySelector('img.nimbi-navbar-logo')
    expect(img).toBeTruthy()
    expect(img.src).toContain('/assets/logo.png')
  })

  it('html path fetch populates slug and sets item href to slug', async () => {
    const fakeFetch = async (path, base) => ({ raw: '<title>My Page</title><h1>My Page</h1>' })
    slugMgr.setFetchMarkdown(fakeFetch)

    const navWrap = document.createElement('div')
    const container = document.createElement('div')
    document.body.appendChild(navWrap)
    document.body.appendChild(container)

    const navHtml = '<a href="?page=home.md">Home</a><a href="about.html">About</a>'

    const { navbar } = await buildNav(navWrap, container, navHtml, 'http://example.com/base/', 'home.md', s => s, () => {}, false, 'eager')

    const item = navbar.querySelector('a[href*="my-page"]')
    expect(item).toBeTruthy()
  })
})
