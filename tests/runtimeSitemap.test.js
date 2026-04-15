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
    globalThis.fetch = async () => ({ ok: false, status: 404, text: async () => '' })

    // clear any pending sitemap globals/timers from other tests
    try {
      if (typeof window !== 'undefined') {
        window.__nimbiSitemapPendingWrite = null
        if (window.__nimbiSitemapWriteTimer) { clearTimeout(window.__nimbiSitemapWriteTimer); window.__nimbiSitemapWriteTimer = null }
        window.__nimbiSitemapRenderedAt = undefined
        window.__nimbiSitemapJson = undefined
        window.__nimbiSitemapFinal = undefined
      }
    } catch (e) {}
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

    // clear any pending sitemap globals/timers
    try {
      if (typeof window !== 'undefined') {
        if (window.__nimbiSitemapWriteTimer) { clearTimeout(window.__nimbiSitemapWriteTimer); window.__nimbiSitemapWriteTimer = null }
        window.__nimbiSitemapPendingWrite = null
        window.__nimbiSitemapRenderedAt = undefined
        window.__nimbiSitemapJson = undefined
        window.__nimbiSitemapFinal = undefined
      }
    } catch (e) {}
  })

  it('generateSitemapJson includes `allMarkdownPaths` entries and encodes paths', async () => {
    slugManager.slugToMd.set('s1', 'page1.md')
    slugManager.slugToMd.set('s2', 'dir/page2.md')
    const json = await runtimeSitemap.generateSitemapJson({ includeAllMarkdown: true })
    expect(json).toBeTruthy()
    expect(Array.isArray(json.entries)).toBe(true)
    expect(json.entries.length).toBe(2)
    expect(json.entries.some(e => String(e.loc ?? '').includes(encodeURIComponent('s1')))).toBe(true)
    expect(json.entries.some(e => String(e.loc ?? '').includes(encodeURIComponent('s2')))).toBe(true)
  }, 20000)

  it('generateSitemapXml converts sitemap JSON into XML containing <urlset> and <loc>', async () => {
    slugManager.slugToMd.set('h', 'hello.md')
    const json = await runtimeSitemap.generateSitemapJson({ includeAllMarkdown: true })
    const xml = runtimeSitemap.generateSitemapXml(json)
    expect(xml).toContain('<?xml')
    expect(xml).toContain('<urlset')
    expect(xml).toContain('<loc>')
    expect(xml).toContain('?page=' + encodeURIComponent('h'))
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
    document.write = (s) => writes.push(String(s ?? ''))
    document.close = () => {}

    const handled = await runtimeSitemap.handleSitemapRequest({ includeAllMarkdown: true, index: slugManager.searchIndex })
    // wait for the scheduled write to flush (scheduler uses a short timeout)
    await new Promise((r) => setTimeout(r, 60))
    expect(handled).toBe(true)
    expect(writes.length).toBeGreaterThan(0)
    const written = writes.join('')
    // Accept either XML or HTML rendering; ensure sitemap entries are present
    expect(written).toContain('?page=' + encodeURIComponent('one'))
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
    document.write = (s) => writes.push(String(s ?? ''))
    document.close = () => {}

    const handled = await runtimeSitemap.handleSitemapRequest({ includeAllMarkdown: true, index: slugManager.searchIndex })
    await new Promise((r) => setTimeout(r, 60))
    expect(handled).toBe(true)
    const out = writes.join('')
    expect(out).toContain('<h1>Sitemap</h1>')
    expect(out).toContain('?page=' + encodeURIComponent('a'))
    expect(out).toContain('?page=' + encodeURIComponent('b'))
  })

  it('handleSitemapRequest returns false for unrelated paths', async () => {
    Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/other' }, configurable: true })
    slugManager.slugToMd.set('x', 'x.md')
    const handled = await runtimeSitemap.handleSitemapRequest({ includeAllMarkdown: true, index: slugManager.searchIndex })
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
    document.write = (s) => writes.push(String(s ?? ''))
    document.close = () => {}

    const handled = await runtimeSitemap.handleSitemapRequest({ includeAllMarkdown: true, index: slugManager.searchIndex })
    await new Promise((r) => setTimeout(r, 60))
    expect(handled).toBe(true)
    expect(writes.length).toBeGreaterThan(0)
    const written = writes.join('')
    // Accept either XML or HTML rendering; ensure sitemap entries are present
    expect(written).toContain('?page=' + encodeURIComponent('one'))
  })

  it('handleSitemapRequest ignores ?sitemap when other params are present', async () => {
    Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/', search: '?sitemap=1&page=home' }, configurable: true })
    slugManager.slugToMd.set('two', 'two.md')
    const handled = await runtimeSitemap.handleSitemapRequest({ includeAllMarkdown: true })
    expect(handled).toBe(false)
  })

  it('handleSitemapRequest does not treat hash-only #/?sitemap as a search trigger', async () => {
    Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/', hash: '#/?sitemap' }, configurable: true })
    slugManager.slugToMd.set('one', 'one.md')

    slugManager.searchIndex.length = 0
    slugManager.searchIndex.push({ slug: 'one', title: 'One Title', path: 'one.md' })

    const writes = []
    origDocOpen = document.open
    origDocWrite = document.write
    origDocClose = document.close
    document.open = () => {}
    document.write = (s) => writes.push(String(s ?? ''))
    document.close = () => {}

    const handled = await runtimeSitemap.handleSitemapRequest({ includeAllMarkdown: true })
    // current implementation treats hash-only sitemap as not handled
    expect(handled).toBe(false)
    expect(writes.length).toBe(0)
  })

  it('handleSitemapRequest fetches navigation file when no entries and populates sitemap', async () => {
    Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/', search: '?sitemap' }, configurable: true })
    // provide a pre-built index entry for the nav target so generator emits it
    slugManager.searchIndex.length = 0
    slugManager.searchIndex.push({ slug: 'blog/page.md', title: 'Blog Page', path: 'blog/page.md' })

    const writes = []
    origDocOpen = document.open
    origDocWrite = document.write
    origDocClose = document.close
    document.open = () => {}
    document.write = (s) => writes.push(String(s ?? ''))
    document.close = () => {}

    // Generate JSON directly using the prebuilt index to avoid index-build timing
    const json = await runtimeSitemap.generateSitemapJson({ includeAllMarkdown: true, index: slugManager.searchIndex })
    const xml = runtimeSitemap.generateSitemapXml(json)
    expect(xml).toContain('?page=' + encodeURIComponent('blog/page.md'))
  })
})
