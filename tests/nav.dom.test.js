import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { buildNav } from '../src/nav.js'

// Simple translator stub
const t = (k) => k

describe('buildNav DOM batching and search rendering', () => {
  let oldBuild
  beforeEach(() => {
    oldBuild = global.buildSearchIndex
  })
  afterEach(() => {
    if (typeof oldBuild === 'undefined') delete global.buildSearchIndex
    else global.buildSearchIndex = oldBuild
  })

  it('creates navbar items and appends them (batched)', async () => {
    const navbarWrap = document.createElement('header')
    const container = document.createElement('main')
    const navHtml = '<a href="README.md">Home</a><a href="about.md">About</a><a href="docs/index.html">Docs</a>'
    const homePage = 'README.md'
    const renderByQuery = () => Promise.resolve()

    const { navbar, linkEls } = await buildNav(navbarWrap, container, navHtml, '/content/', homePage, t, renderByQuery, false, 'eager', 1)
    // attach to document so document.querySelector can resolve elements
    try { document.body.appendChild(navbarWrap) } catch (e) {}

    // There should be a .navbar element returned
    expect(navbar).toBeTruthy()

    // Count .navbar-item elements; should match the number of links in navHtml
    const items = navbar.querySelectorAll('.navbar-item')
    expect(items.length).toBe(3)

    // Ensure brand (first link) is present as first .navbar-item
    expect(items[0]).toBeTruthy()
    try { document.body.removeChild(navbarWrap) } catch (e) {}
  })

  it('renders search results into the results container when typing', async () => {
    // Provide a fake buildSearchIndex implementation used by ensureSearchIndex
    global.buildSearchIndex = async (contentBase, indexDepth, noIndexing, seeds) => {
      return [
        { slug: 'about', title: 'About Page', excerpt: 'About excerpt', path: 'about.md' },
        { slug: 'docs', title: 'Docs Page', excerpt: 'Docs excerpt', path: 'docs/index.html' }
      ]
    }

    const navbarWrap = document.createElement('header')
    const container = document.createElement('main')
    const navHtml = '<a href="README.md">Home</a><a href="about.md">About</a><a href="docs/index.html">Docs</a>'
    const homePage = 'README.md'
    const renderByQuery = () => Promise.resolve()

    const { navbar } = await buildNav(navbarWrap, container, navHtml, '/content/', homePage, t, renderByQuery, true, 'eager', 1)
    try { document.body.appendChild(navbarWrap) } catch (e) {}

    // Find search input and results container
    const searchInput = navbarWrap.querySelector('input#nimbi-search')
    const resultsContainer = navbarWrap.querySelector('#nimbi-search-results')
    expect(searchInput).toBeTruthy()
    expect(resultsContainer).toBeTruthy()

    // Type a query that matches one entry
    searchInput.value = 'About'
    searchInput.dispatchEvent(new Event('input', { bubbles: true }))

    // Wait for debounce + async index build
    await new Promise((r) => setTimeout(r, 800))

    // The results container should now contain a panel with results
    const panel = resultsContainer.querySelector('.panel.nimbi-search-panel')
    expect(panel).toBeTruthy()
    // debug: dump results container html when empty
    const results = resultsContainer.querySelectorAll('.nimbi-search-result')
    expect(results.length).toBeGreaterThan(0)
    try { document.body.removeChild(navbarWrap) } catch (e) {}
  })

  it('search result links use slug for pages listed in navigationPage', async () => {
    // Simulate a builder that emits a file-path as the `slug` value
    global.buildSearchIndex = async (contentBase, indexDepth, noIndexing, seeds) => {
      return [
        { slug: 'about.md', title: 'About Page', excerpt: 'About excerpt', path: 'about.md' }
      ]
    }

    const navbarWrap = document.createElement('header')
    const container = document.createElement('main')
    const navHtml = '<a href="README.md">Home</a><a href="about.md">About</a>'
    const homePage = 'README.md'
    const renderByQuery = () => Promise.resolve()

    const { navbar } = await buildNav(navbarWrap, container, navHtml, '/content/', homePage, t, renderByQuery, true, 'eager', 1)
    try { document.body.appendChild(navbarWrap) } catch (e) {}

    const searchInput = navbarWrap.querySelector('input#nimbi-search')
    const resultsContainer = navbarWrap.querySelector('#nimbi-search-results')
    expect(searchInput).toBeTruthy()
    expect(resultsContainer).toBeTruthy()

    searchInput.value = 'About'
    searchInput.dispatchEvent(new Event('input', { bubbles: true }))
    await new Promise((r) => setTimeout(r, 800))

    const result = resultsContainer.querySelector('.nimbi-search-result')
    expect(result).toBeTruthy()
    const href = result.getAttribute && result.getAttribute('href')
    expect(href).toBeTruthy()
    // Should reference the slug (about) not the file name (about.md)
    expect(href).toContain('page=about')
    expect(href).not.toContain('about.md')
    try { document.body.removeChild(navbarWrap) } catch (e) {}
  })
})
