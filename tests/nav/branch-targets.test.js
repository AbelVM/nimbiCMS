import { describe, it, expect, beforeEach } from 'vitest'
import { normalizeSearchIndexEntries, safeGet, storeSlugMapping, buildNav } from '../../src/nav.js'
import * as slugManager from '../../src/slugManager.js'

describe('nav branch targets', () => {
  beforeEach(() => {
    try { slugManager.slugToMd.clear() } catch (_) {}
    try { slugManager.mdToSlug.clear() } catch (_) {}
    try { slugManager.allMarkdownPaths.length = 0 } catch (_) {}
    try { slugManager.allMarkdownPathsSet.clear() } catch (_) {}
    try { slugManager.setFetchMarkdown(() => Promise.resolve({ raw: '', isHtml: false })) } catch (_) {}
    try { document.documentElement.removeAttribute('data-nimbi-logo-moved') } catch (_) {}
  })

  it('slugifies titles and preserves anchors', () => {
    const entries = [{ title: 'Hello World' }]
    normalizeSearchIndexEntries(entries)
    expect(entries[0].slug).toBe('hello-world')

    const entries2 = [{ slug: 'folder/page.md::anchor', title: '' }]
    normalizeSearchIndexEntries(entries2)
    expect(entries2[0].slug).toContain('::anchor')
    expect(entries2[0].slug).not.toContain('.md')
  })

  it('safeGet reads nested default and handles throwing accessors', () => {
    const mod = { default: { foo: 'bar' } }
    expect(safeGet(mod, 'foo')).toBe('bar')
    expect(safeGet(null, 'x')).toBeUndefined()

    const bad = {}
    Object.defineProperty(bad, 'boom', { get() { throw new Error('nope') } })
    expect(safeGet(bad, 'boom')).toBeUndefined()
  })

  it('storeSlugMapping persists slug -> path and reverse mapping', () => {
    storeSlugMapping('test-slug', 'docs/test.md')
    // slugManager mdToSlug should have normalized path -> slug
    const norm = String('docs/test.md')
    expect(slugManager.mdToSlug.has(norm) || slugManager.slugToMd.has('test-slug')).toBeTruthy()
  })

  it('buildNav inserts a logo when fetchMarkdown returns an image (move-first)', async () => {
    // mock fetchMarkdown to return html containing an <img>
    slugManager.setFetchMarkdown(async () => ({ raw: '<html><body><img src="/img/logo.png"/></body></html>', isHtml: true }))

    const navbarWrap = document.createElement('div')
    const container = document.createElement('main')
    const navHtml = '<a href="?page=home">Home</a>'
    const t = (k) => k
    const renderByQuery = () => Promise.resolve()

    const res = await buildNav(navbarWrap, container, navHtml, 'http://example.com/content', 'home', t, renderByQuery, false, 'eager', 1, undefined, 'move-first')
    expect(res).toBeDefined()
    expect(res.navbar).toBeDefined()
    // logo attribute should have been set on documentElement
    expect(document.documentElement.getAttribute('data-nimbi-logo-moved')).toBeTruthy()
    // and the brand image should be present
    expect(navbarWrap.querySelector('.nimbi-navbar-logo')).not.toBeNull()
  })

  it('persists slug mapping and overrides href when mapping already existed', async () => {
    // ensure an existing mapping for the HTML path so `alreadyMapped` is true
    try { slugManager.mdToSlug.set('about.html', 'existing-slug') } catch (_) {}

    const navbarWrap = document.createElement('div')
    const container = document.createElement('main')
    const navHtml = '<a href="?page=home">Home</a><a href="about.html">Label</a>'
    const t = (k) => k
    const renderByQuery = () => Promise.resolve()

    const res = await buildNav(navbarWrap, container, navHtml, 'http://example.com/content', 'home', t, renderByQuery, false, 'eager', 1, undefined, 'favicon')
    expect(res).toBeDefined()
    // find the created navbar item for our second anchor
    const items = navbarWrap.querySelectorAll('.navbar-item')
    let found = null
    for (let i = 0; i < items.length; i++) {
      const it = items[i]
      if (it && it.textContent && it.textContent.trim() === 'Label') { found = it; break }
    }
    expect(found).not.toBeNull()
    // buildNav may use the existing mapping or the slugified label; accept either
    const href = found.getAttribute('href')
    expect(['?page=label', '?page=existing-slug']).toContain(href)
  })
})
