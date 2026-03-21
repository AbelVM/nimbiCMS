import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as runtimeSitemap from '../src/runtimeSitemap.js'
import * as slugManager from '../src/slugManager.js'

describe('runtimeSitemap', () => {
  let origAllMarkdownPaths
  let origSlugEntries
  let origLocation
  let origDocOpen
  let origDocWrite
  let origDocClose
  let origFetch

  beforeEach(() => {
    origSlugEntries = Array.from(slugManager.slugToMd.entries())
    origLocation = globalThis.location

    // start from a known, clean state
    slugManager.slugToMd.clear()

    // provide a predictable base used by _getBase()
    Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/' }, configurable: true })
    origFetch = globalThis.fetch
  })

  afterEach(() => {
    slugManager.slugToMd.clear()
    for (const [k, v] of origSlugEntries) slugManager.slugToMd.set(k, v)

    try {
      Object.defineProperty(globalThis, 'location', { value: origLocation, configurable: true })
    } catch (e) { /* best-effort restore */ }

    try { globalThis.fetch = origFetch } catch (e) { /* best effort */ }

    if (origDocOpen !== undefined) document.open = origDocOpen
    if (origDocWrite !== undefined) document.write = origDocWrite
    if (origDocClose !== undefined) document.close = origDocClose
  })

  it('generateSitemapJson includes `allMarkdownPaths` entries and encodes paths', () => {
    slugManager.slugToMd.set('s1', 'page1.md')
    slugManager.slugToMd.set('s2', 'dir/page2.md')
    const json = runtimeSitemap.generateSitemapJson({ includeAllMarkdown: false })
    expect(json).toBeTruthy()
    expect(Array.isArray(json.entries)).toBe(true)
    expect(json.entries.length).toBe(2)
    expect(json.entries[0].path).toBe('page1.md')
    expect(json.entries[0].loc).toContain('?page=' + encodeURIComponent('page1.md'))
    expect(json.entries[1].loc).toContain('?page=' + encodeURIComponent('dir/page2.md'))
  })

  it('generateSitemapXml converts sitemap JSON into XML containing <urlset> and <loc>', () => {
    slugManager.slugToMd.set('h', 'hello.md')
    const json = runtimeSitemap.generateSitemapJson({ includeAllMarkdown: false })
    const xml = runtimeSitemap.generateSitemapXml(json)
    expect(xml).toContain('<?xml')
    expect(xml).toContain('<urlset')
    expect(xml).toContain('<loc>')
    expect(xml).toContain('?page=' + encodeURIComponent('hello.md'))
  })

  it('handleSitemapRequest serves sitemap.xml when pathname ends with sitemap.xml', async () => {
    Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/sitemap.xml' }, configurable: true })
    slugManager.slugToMd.set('one', 'one.md')

    // Provide a pre-built searchIndex so the handler's index build is fast in tests
    slugManager.searchIndex.length = 0
    slugManager.searchIndex.push({ slug: 'one', title: 'One Title', path: 'one.md' })

    // intercept document.write to capture output instead of replacing DOM
    const writes = []
    origDocOpen = document.open
    origDocWrite = document.write
    origDocClose = document.close
    document.open = () => {}
    document.write = (s) => writes.push(String(s || ''))
    document.close = () => {}

    const handled = await runtimeSitemap.handleSitemapRequest({ includeAllMarkdown: true })
    expect(handled).toBe(true)
    expect(writes.length).toBeGreaterThan(0)
    const written = writes.join('')
    // Accept either XML or HTML rendering; ensure sitemap entries are present
    expect(written).toContain('?page=' + encodeURIComponent('one.md'))
  })

  it('handleSitemapRequest serves sitemap.html when pathname ends with sitemap.html', async () => {
    Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/sitemap.html' }, configurable: true })
    slugManager.slugToMd.set('a', 'a.md')
    slugManager.slugToMd.set('b', 'b.md')

    slugManager.searchIndex.length = 0
    slugManager.searchIndex.push({ slug: 'a', title: 'A Title', path: 'a.md' })
    slugManager.searchIndex.push({ slug: 'b', title: 'B Title', path: 'b.md' })

    const writes = []
    origDocOpen = document.open
    origDocWrite = document.write
    origDocClose = document.close
    document.open = () => {}
    document.write = (s) => writes.push(String(s || ''))
    document.close = () => {}

    const handled = await runtimeSitemap.handleSitemapRequest({ includeAllMarkdown: true })
    expect(handled).toBe(true)
    const out = writes.join('')
    expect(out).toContain('<h1>Sitemap</h1>')
    expect(out).toContain('?page=' + encodeURIComponent('a.md'))
    expect(out).toContain('?page=' + encodeURIComponent('b.md'))
  })

  it('handleSitemapRequest returns false for unrelated paths', async () => {
    Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/other' }, configurable: true })
    slugManager.slugToMd.set('x', 'x.md')
    const handled = await runtimeSitemap.handleSitemapRequest({ includeAllMarkdown: true })
    expect(handled).toBe(false)
  })

  it('handleSitemapRequest serves sitemap.xml when search contains ?sitemap and no other params', async () => {
    Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/', search: '?sitemap' }, configurable: true })
    slugManager.slugToMd.set('one', 'one.md')

    slugManager.searchIndex.length = 0
    slugManager.searchIndex.push({ slug: 'one', title: 'One Title', path: 'one.md' })

    const writes = []
    origDocOpen = document.open
    origDocWrite = document.write
    origDocClose = document.close
    document.open = () => {}
    document.write = (s) => writes.push(String(s || ''))
    document.close = () => {}

    const handled = await runtimeSitemap.handleSitemapRequest({ includeAllMarkdown: true })
    expect(handled).toBe(true)
    expect(writes.length).toBeGreaterThan(0)
    const written = writes.join('')
    // Accept either XML or HTML rendering; ensure sitemap entries are present
    expect(written).toContain('?page=' + encodeURIComponent('one.md'))
  })

  it('handleSitemapRequest ignores ?sitemap when other params are present', async () => {
    Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/', search: '?sitemap=1&page=home' }, configurable: true })
    slugManager.slugToMd.set('two', 'two.md')
    const handled = await runtimeSitemap.handleSitemapRequest({ includeAllMarkdown: true })
    expect(handled).toBe(false)
  })

  it('handleSitemapRequest serves sitemap.xml when hash contains #/?sitemap', async () => {
    Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/', hash: '#/?sitemap' }, configurable: true })
    slugManager.slugToMd.set('one', 'one.md')

    slugManager.searchIndex.length = 0
    slugManager.searchIndex.push({ slug: 'one', title: 'One Title', path: 'one.md' })

    const writes = []
    origDocOpen = document.open
    origDocWrite = document.write
    origDocClose = document.close
    document.open = () => {}
    document.write = (s) => writes.push(String(s || ''))
    document.close = () => {}

    const handled = await runtimeSitemap.handleSitemapRequest({ includeAllMarkdown: true })
    expect(handled).toBe(true)
    expect(writes.length).toBeGreaterThan(0)
    const written = writes.join('')
    expect(written).toContain('<urlset')
    expect(written).toContain('?page=' + encodeURIComponent('one.md'))
  })

  it('handleSitemapRequest fetches navigation file when no entries and populates sitemap', async () => {
    Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/', search: '?sitemap' }, configurable: true })
    // ensure no known slug entries and empty search index
    slugManager.slugToMd.clear()
    slugManager.searchIndex.length = 0

    // stub fetch to return a simple navigation markdown
    const navText = '[Home](_home.md)\n[Blog](/blog/page.md)'
    globalThis.fetch = async (url) => ({ ok: true, text: async () => navText })

    const writes = []
    origDocOpen = document.open
    origDocWrite = document.write
    origDocClose = document.close
    document.open = () => {}
    document.write = (s) => writes.push(String(s || ''))
    document.close = () => {}

    const handled = await runtimeSitemap.handleSitemapRequest({ includeAllMarkdown: true })
    expect(handled).toBe(true)

    expect(writes.length).toBeGreaterThan(0)
    const out = writes.join('')
    expect(out).toContain('?page=' + encodeURIComponent('blog/page.md'))
  })
})
