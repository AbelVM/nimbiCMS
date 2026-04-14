import { describe, it, expect, beforeEach } from 'vitest'
import { normalizeSearchIndexEntries, safeGet, storeSlugMapping } from '../src/nav.js'
import { allMarkdownPaths, allMarkdownPathsSet, mdToSlug, slugToMd } from '../src/slugManager.js'

describe('nav helper branches', () => {
  beforeEach(() => {
    try { slugToMd.clear() } catch (e) {}
    try { mdToSlug.clear() } catch (e) {}
    try { allMarkdownPathsSet.clear() } catch (e) {}
    try { allMarkdownPaths.splice(0, allMarkdownPaths.length) } catch (e) {}
  })

  it('safeGet handles missing module and default export fallback', () => {
    expect(safeGet(null, 'x')).toBeUndefined()
    expect(safeGet({ x: 1 }, 'x')).toBe(1)
    expect(safeGet({ default: { y: 2 } }, 'y')).toBe(2)
  })

  it('storeSlugMapping persists maps and markdown path list without duplicates', () => {
    storeSlugMapping('hello', 'docs/hello.md')
    storeSlugMapping('hello', 'docs/hello.md')

    expect(slugToMd.get('hello')).toBe('docs/hello.md')
    expect(mdToSlug.get('docs/hello.md')).toBe('hello')
    expect(allMarkdownPathsSet.has('docs/hello.md')).toBe(true)
    expect(allMarkdownPaths.filter(p => p === 'docs/hello.md').length).toBe(1)
  })

  it('normalizeSearchIndexEntries keeps anchors and slugifies title/path fallback', () => {
    const entries = [
      { slug: 'docs/item.md::section', path: 'docs/item.md', title: 'My Item' },
      { slug: '', title: 'Only Title' },
      { slug: 'custom/path/file.html', title: 'Ignored if file resolves' }
    ]

    const out = normalizeSearchIndexEntries(entries)

    expect(Array.isArray(out)).toBe(true)
    expect(out[0].slug.includes('::section')).toBe(true)
    expect(out[1].slug).toBe('only-title')
    expect(typeof out[2].slug).toBe('string')
    expect(mdToSlug.get('docs/item.md')).toBeTruthy()
  })

  it('normalizeSearchIndexEntries is resilient to invalid input', () => {
    expect(normalizeSearchIndexEntries(null)).toBeNull()
    expect(normalizeSearchIndexEntries(undefined)).toBeUndefined()
    expect(() => normalizeSearchIndexEntries([null, 1, 'x', { slug: 'ok' }])).not.toThrow()
  })
})
