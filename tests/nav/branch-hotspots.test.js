import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { buildNav } from '../../src/nav.js'
import { setFetchMarkdown, slugToMd, mdToSlug, slugify } from '../../src/slugManager.js'
import { setSharedParser, resetSharedParser } from '../../src/utils/sharedDomParser.js'
import { buildPageUrl } from '../../src/utils/helpers.js'

describe('nav branch hotspots', () => {
  let navbarWrap, container
  let origFetchSetter

  beforeEach(() => {
    document.body.innerHTML = ''
    navbarWrap = document.createElement('header')
    container = document.createElement('main')
    document.body.appendChild(navbarWrap)
    document.body.appendChild(container)
    // reset slug maps
    slugToMd.clear()
    mdToSlug.clear()
    // ensure default parser state is fresh
    resetSharedParser()
  })

  afterEach(() => {
    // restore parser to default
    resetSharedParser()
    // leave fetchMarkdown as-is (tests set explicit shims when needed)
  })

  it('fetchMarkdown success with title/H1 adds slug mapping and updates href', async () => {
    // Arrange
    setFetchMarkdown(async (path, base) => ({ raw: '<!doctype html><html><head><title>My Title</title></head><body><h1>My Title</h1></body></html>', isHtml: true }))
    setSharedParser(new DOMParser())
    const navHtml = '<a href="?page=home.md">Home</a><a href="page.html">Page</a>'

    // Act
    const res = await buildNav(navbarWrap, container, navHtml, '/content/', '_home.md', (s) => s, () => {}, false)

    // Assert: last navbar-item corresponds to second anchor
    const items = res.navbar.querySelectorAll('.navbar-item')
    expect(items.length).toBeGreaterThan(0)
    const pageItem = items[items.length - 1]
    const expected = slugify('My Title')
    expect(pageItem.getAttribute('href') || '').toContain(`page=${expected}`)
    expect(slugToMd.has(expected)).toBe(true)
    expect(slugToMd.get(expected)).toBe('page.html')
  })

  it('fetchMarkdown returns HTML with no title falls back to page URL', async () => {
    setFetchMarkdown(async (path, base) => ({ raw: '<!doctype html><html><head></head><body></body></html>', isHtml: true }))
    setSharedParser(new DOMParser())
    const navHtml = '<a href="?page=home.md">Home</a><a href="page.html">Page</a>'

    const res = await buildNav(navbarWrap, container, navHtml, '/content/', '_home.md', (s) => s, () => {}, false)
    const items = res.navbar.querySelectorAll('.navbar-item')
    const pageItem = items[items.length - 1]
    const href = pageItem.getAttribute('href') || ''
    // Expect fallback to canonical page URL for htmlPath
    expect(href).toBe(buildPageUrl('page.html'))
  })

  it('fetchMarkdown rejects results in leaving original href unchanged', async () => {
    setFetchMarkdown(async () => { throw new Error('boom') })
    setSharedParser(new DOMParser())
    const navHtml = '<a href="?page=home.md">Home</a><a href="page.html">Page</a>'

    const res = await buildNav(navbarWrap, container, navHtml, '/content/', '_home.md', (s) => s, () => {}, false)
    const items = res.navbar.querySelectorAll('.navbar-item')
    const pageItem = items[items.length - 1]
    const href = pageItem.getAttribute('href') || ''
    expect(href).toBe('page.html')
  })

  it('displayName mapping persists for HTML targets (persistMapping=true)', async () => {
    // Use canonical form so parseHrefToRoute picks up page token
    setFetchMarkdown(async () => ({ raw: '', isHtml: false }))
    const navHtml = '<a href="?page=home.md">Home</a><a href="?page=page.html">Display</a>'

    const res = await buildNav(navbarWrap, container, navHtml, '/content/', '_home.md', (s) => s, () => {}, false)
    // slug derived from link text
    const slugKey = slugify('Display')
    expect(slugToMd.has(slugKey)).toBe(true)
    expect(slugToMd.get(slugKey)).toBe('page.html')
    expect(mdToSlug.has('page.html')).toBe(true)
    expect(mdToSlug.get('page.html')).toBe(slugKey)
  })

  it('displayName mapping skipped for plain .md targets (persistMapping=false)', async () => {
    setFetchMarkdown(async () => ({ raw: '', isHtml: false }))
    const navHtml = '<a href="?page=home.md">Home</a><a href="?page=page.md">Display</a>'

    const res = await buildNav(navbarWrap, container, navHtml, '/content/', '_home.md', (s) => s, () => {}, false)
    const slugKey = slugify('Display')
    expect(slugToMd.has(slugKey)).toBe(false)
    expect(mdToSlug.has('page.md')).toBe(false)
  })
})
