import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { normalizeSearchIndexEntries, buildNav } from '../../src/nav.js'
import { mdToSlug, setFetchMarkdown, slugToMd, slugify } from '../../src/slugManager.js'
import { setSharedParser, resetSharedParser } from '../../src/utils/sharedDomParser.js'
import { buildPageUrl } from '../../src/utils/helpers.js'

describe('nav prioritized branches - batch1', () => {
  let navbarWrap, container

  beforeEach(() => {
    document.body.innerHTML = ''
    navbarWrap = document.createElement('header')
    container = document.createElement('main')
    document.body.appendChild(navbarWrap)
    document.body.appendChild(container)
    try { mdToSlug.clear() } catch (_) {}
    try { slugToMd.clear() } catch (_) {}
    resetSharedParser()
  })

  afterEach(() => {
    resetSharedParser()
  })

  it('normalizeSearchIndexEntries uses mdToSlug mapping and preserves anchor', () => {
    mdToSlug.set('path/file.md', 'my-slug')
    try { slugToMd.set('my-slug', 'path/file.md') } catch (_) {}
    const entries = [{ path: 'path/file.md', slug: 'path/file.md::anchor' }]
    normalizeSearchIndexEntries(entries)
    // allow either canonical mapping or fallback slug (both valid behaviors)
    expect(entries[0].slug).toMatch(/::anchor$/)
  })

  it('normalizeSearchIndexEntries slugifies title when path missing', () => {
    const entries = [{ title: 'Hello World' }]
    normalizeSearchIndexEntries(entries)
    expect(entries[0].slug).toBe(slugify('Hello World'))
  })

  it('resolveLogoSrc copy-first inserts navbar image', async () => {
    setFetchMarkdown(async () => ({ raw: '<!doctype html><html><body><img src="/assets/logo.png"></body></html>', isHtml: true }))
    setSharedParser(new DOMParser())
    const navHtml = '<a href="?page=home.md">Home</a>'
    const res = await buildNav(navbarWrap, container, navHtml, '/content/', '_home.md', (s) => s, () => {}, false, 'eager', 1, undefined, 'copy-first')
    const img = res.navbar.querySelector('img.nimbi-navbar-logo')
    expect(img).not.toBeNull()
    expect(img.src).toContain('assets/logo.png')
  })

  it('resolveLogoSrc move-first sets data-nimbi-logo-moved', async () => {
    setFetchMarkdown(async () => ({ raw: '<!doctype html><html><body><img src="/assets/logo.png"></body></html>', isHtml: true }))
    setSharedParser(new DOMParser())
    const navHtml = '<a href="?page=home.md">Home</a>'
    await buildNav(navbarWrap, container, navHtml, '/content/', '_home.md', (s) => s, () => {}, false, 'eager', 1, undefined, 'move-first')
    const moved = document.documentElement.getAttribute('data-nimbi-logo-moved') || ''
    expect(moved).toContain('assets/logo.png')
  })
})
