import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as slugMgr from '../src/slugManager.js'

describe('buildSearchIndex H2 indexing', () => {
  beforeEach(() => {
    slugMgr.searchIndex.splice(0)
    slugMgr.clearFetchCache()
    slugMgr.allMarkdownPaths.splice(0)
    slugMgr.slugToMd.clear()
    slugMgr.mdToSlug.clear()
    global.fetch = vi.fn()
  })

  it('includes H2 entries with parentTitle when indexDepth=2 for markdown', async () => {
    const base = 'http://example.com/content/'
    slugMgr.allMarkdownPaths.splice(0, slugMgr.allMarkdownPaths.length, 'page.md')
    global.fetch = vi.fn(async (url) => {
      if (url.endsWith('page.md')) {
        return { ok: true, text: () => Promise.resolve('# My Page\n\nIntro\n\n## Section A\n\nContent A\n\n## Section B\n\nContent B') }
      }
      return { ok: false, status: 404, text: () => Promise.resolve('') }
    })

    const idx = await slugMgr.buildSearchIndex(base, 2)
    const h2s = idx.filter(e => e.title === 'Section A' || e.title === 'Section B')
    expect(h2s.length).toBe(2)
    for (const e of h2s) {
      expect(e.parentTitle).toBe('My Page')
      expect(e.path).toBe('page.md')
      expect(e.slug).toContain('::')
    }
  })

  it('includes H2 entries with parentTitle when indexDepth=2 for HTML', async () => {
    slugMgr.searchIndex.splice(0)
    slugMgr.allMarkdownPaths.splice(0, slugMgr.allMarkdownPaths.length, 'page.html')
    global.fetch = vi.fn(async (url) => {
      if (url.endsWith('page.html')) {
        return { ok: true, text: () => Promise.resolve('<html><body><h1>Top H1</h1><p>Intro</p><h2 id="s1">Sub 1</h2><p>Para1</p></body></html>') }
      }
      return { ok: false, status: 404, text: () => Promise.resolve('') }
    })

    const idx = await slugMgr.buildSearchIndex('http://example.com/', 2)
    const h2 = idx.find(e => e.title === 'Sub 1')
    expect(h2).toBeTruthy()
    expect(h2.parentTitle).toBe('Top H1')
    expect(h2.path).toBe('page.html')
    expect(h2.slug).toContain('::')
    expect(h2.excerpt).toBe('Para1')
  })

  it('includes H3 entries with parentTitle when indexDepth=3 for markdown', async () => {
    slugMgr.searchIndex.splice(0)
    slugMgr.allMarkdownPaths.splice(0, slugMgr.allMarkdownPaths.length, 'page.md')
    global.fetch = vi.fn(async (url) => {
      if (url.endsWith('page.md')) {
        return { ok: true, text: () => Promise.resolve('# My Page\n\nIntro\n\n## Section A\n\nContent A\n\n### Subsection A1\n\nDetail A1') }
      }
      return { ok: false, status: 404, text: () => Promise.resolve('') }
    })

    const idx = await slugMgr.buildSearchIndex('http://example.com/content/', 3)
    const h3 = idx.find(e => e.title === 'Subsection A1')
    expect(h3).toBeTruthy()
    expect(h3.parentTitle).toBe('My Page')
    expect(h3.path).toBe('page.md')
    expect(h3.slug).toContain('::')
  })

  it('includes H3 entries with parentTitle when indexDepth=3 for HTML', async () => {
    slugMgr.searchIndex.splice(0)
    slugMgr.allMarkdownPaths.splice(0, slugMgr.allMarkdownPaths.length, 'page.html')
    global.fetch = vi.fn(async (url) => {
      if (url.endsWith('page.html')) {
        return { ok: true, text: () => Promise.resolve('<html><body><h1>Top H1</h1><p>Intro</p><h2 id="s1">Sub 1</h2><p>Para1</p><h3 id="s1a">Sub 1a</h3><p>Para1a</p></body></html>') }
      }
      return { ok: false, status: 404, text: () => Promise.resolve('') }
    })

    const idx = await slugMgr.buildSearchIndex('http://example.com/', 3)
    const h3 = idx.find(e => e.title === 'Sub 1a')
    expect(h3).toBeTruthy()
    expect(h3.parentTitle).toBe('Top H1')
    expect(h3.path).toBe('page.html')
    expect(h3.slug).toContain('::')
    expect(h3.excerpt).toBe('Para1a')
  })
})
