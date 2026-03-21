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

  beforeEach(() => {
    origSlugEntries = Array.from(slugManager.slugToMd.entries())
    origLocation = globalThis.location

    // start from a known, clean state
    slugManager.slugToMd.clear()

    // provide a predictable base used by _getBase()
    Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/' }, configurable: true })
  })

  afterEach(() => {
    slugManager.slugToMd.clear()
    for (const [k, v] of origSlugEntries) slugManager.slugToMd.set(k, v)

    try {
      Object.defineProperty(globalThis, 'location', { value: origLocation, configurable: true })
    } catch (e) { /* best-effort restore */ }

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

  it('handleSitemapRequest serves sitemap.xml when pathname ends with sitemap.xml', () => {
    Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/sitemap.xml' }, configurable: true })
    slugManager.slugToMd.set('one', 'one.md')

    // intercept document.write to capture output instead of replacing DOM
    const writes = []
    origDocOpen = document.open
    origDocWrite = document.write
    origDocClose = document.close
    document.open = () => {}
    document.write = (s) => writes.push(String(s || ''))
    document.close = () => {}

    const handled = runtimeSitemap.handleSitemapRequest({ includeAllMarkdown: true })
    expect(handled).toBe(true)
    expect(writes.length).toBeGreaterThan(0)
    const written = writes.join('')
    expect(written).toContain('<urlset')
    expect(written).toContain('?page=' + encodeURIComponent('one.md'))
  })

  it('handleSitemapRequest serves sitemap.html when pathname ends with sitemap.html', () => {
    Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/sitemap.html' }, configurable: true })
    slugManager.slugToMd.set('a', 'a.md')
    slugManager.slugToMd.set('b', 'b.md')

    const writes = []
    origDocOpen = document.open
    origDocWrite = document.write
    origDocClose = document.close
    document.open = () => {}
    document.write = (s) => writes.push(String(s || ''))
    document.close = () => {}

    const handled = runtimeSitemap.handleSitemapRequest({ includeAllMarkdown: true })
    expect(handled).toBe(true)
    const out = writes.join('')
    expect(out).toContain('<h1>Sitemap</h1>')
    expect(out).toContain('?page=' + encodeURIComponent('a.md'))
    expect(out).toContain('?page=' + encodeURIComponent('b.md'))
  })

  it('handleSitemapRequest returns false for unrelated paths', () => {
    Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/other' }, configurable: true })
    slugManager.slugToMd.set('x', 'x.md')
    const handled = runtimeSitemap.handleSitemapRequest({ includeAllMarkdown: true })
    expect(handled).toBe(false)
  })
})
