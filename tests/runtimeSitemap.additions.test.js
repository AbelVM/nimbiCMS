import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as runtimeSitemap from '../src/runtimeSitemap.js'
import * as slugManager from '../src/slugManager.js'

describe('runtimeSitemap additions', () => {
  let origMdToSlugEntries
  let origFetchMarkdown
  let origWindow

  beforeEach(() => {
    origMdToSlugEntries = Array.from(slugManager.mdToSlug.entries())
    origFetchMarkdown = slugManager.fetchMarkdown
    origWindow = globalThis.window
    slugManager.mdToSlug.clear()
  })

  afterEach(() => {
    slugManager.mdToSlug.clear()
    for (const [k, v] of origMdToSlugEntries) slugManager.mdToSlug.set(k, v)
    try { slugManager.setFetchMarkdown(origFetchMarkdown) } catch (e) {}
    try { globalThis.window = origWindow } catch (e) {}
  })

  it('excludes notFoundPage when mdToSlug mapping exists', async () => {
    slugManager.mdToSlug.set('404.md', 'missing')
    const idx = [{ slug: 'missing', title: 'Missing', path: '404.md' }, { slug: 'home', title: 'Home', path: 'home.md' }]
    const json = await runtimeSitemap.generateSitemapJson({ includeAllMarkdown: false, index: idx, notFoundPage: '404.md' })
    const slugs = (json && json.entries) ? json.entries.map(e => e.slug) : []
    expect(slugs).not.toContain('missing')
    expect(slugs).toContain('home')
  })

  it('excludes notFoundPage when fetched content H1 slugifies to a slug', async () => {
    // ensure no mdToSlug mapping so fetch path is attempted
    // stub fetchMarkdown via provided helper
    slugManager.setFetchMarkdown(async (path, base) => {
      return { raw: '# Not Found' }
    })
    const idx = [{ slug: 'not-found', title: 'Not Found', path: '404.md' }, { slug: 'other', title: 'Other' }]
    const json = await runtimeSitemap.generateSitemapJson({ includeAllMarkdown: false, index: idx, notFoundPage: '404.md' })
    const slugs = (json && json.entries) ? json.entries.map(e => e.slug) : []
    expect(slugs).not.toContain('not-found')
    expect(slugs).toContain('other')
  })

  it('exposeSitemapGlobals sets window globals and returns deduped entries', async () => {
    const idx = [{ slug: 'a', title: 'A' }, { slug: 'b::anchor', title: 'B' }]
    // Ensure a writable window object exists for the module
    try { globalThis.window = globalThis.window || {} } catch (e) { globalThis.window = {} }
    const res = await runtimeSitemap.exposeSitemapGlobals({ index: idx })
    expect(res).toBeTruthy()
    expect(res.json).toBeTruthy()
    expect(Array.isArray(res.deduped)).toBe(true)
    expect(res.deduped.some(e => e.baseSlug === 'a')).toBe(true)
    expect(res.deduped.some(e => e.baseSlug === 'b')).toBe(true)
    expect(globalThis.window.__nimbiSitemapJson).toBeTruthy()
    expect(Array.isArray(globalThis.window.__nimbiSitemapFinal)).toBe(true)
  })
})
import { describe, it, expect } from 'vitest'

import { generateSitemapJson, generateSitemapXml, generateRssXml, generateAtomXml } from '../src/runtimeSitemap.js'

describe('runtimeSitemap generators', () => {
  it('generateSitemapJson produces entries from provided index', async () => {
    const idx = [{ slug: 'test-page', title: 'Test Title', excerpt: 'X', path: '/path/to/test.md' }]
    const out = await generateSitemapJson({ index: idx, includeAllMarkdown: false })
    expect(out).toHaveProperty('generatedAt')
    expect(Array.isArray(out.entries)).toBe(true)
    expect(out.entries.length).toBeGreaterThanOrEqual(1)
    const e = out.entries.find(x => x.slug === 'test-page')
    expect(e).toBeTruthy()
    expect(e.title).toBe('Test Title')
  })

  it('generateSitemapXml emits loc elements', () => {
    const xml = generateSitemapXml({ entries: [{ loc: 'http://example/?page=foo' }] })
    expect(xml).toContain('<urlset')
    expect(xml).toContain('http://example/?page=foo')
  })

  it('generateRssXml includes excerpt when present', () => {
    const rss = generateRssXml({ entries: [{ loc: 'http://x/?page=1', slug: 's', title: 'T', excerpt: 'E' }], generatedAt: new Date().toISOString() })
    expect(rss).toContain('<title>T</title>')
    expect(rss).toContain('<description>E</description>')
    expect(rss).toContain('<link>')
  })

  it('generateAtomXml uses provided lastmod or falls back to generatedAt', () => {
    const now = new Date().toISOString()
    const entries = [{ loc: 'http://x/?page=2', slug: 's2', title: 'TT', lastmod: now }]
    const atom = generateAtomXml({ entries, generatedAt: now })
    expect(atom).toContain('<feed')
    expect(atom).toContain(now)
  })
})
