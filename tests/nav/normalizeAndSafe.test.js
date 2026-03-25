import { describe, it, expect, beforeEach } from 'vitest'
import { normalizeSearchIndexEntries, safeGet, storeSlugMapping } from '../../src/nav.js'
import { slugToMd, mdToSlug, allMarkdownPaths, allMarkdownPathsSet } from '../../src/slugManager.js'

describe('nav internals: normalizeSearchIndexEntries, safeGet, storeSlugMapping', () => {
  beforeEach(() => {
    try { slugToMd.clear() } catch (_) {}
    try { mdToSlug.clear() } catch (_) {}
    try { allMarkdownPaths.length = 0 } catch (_) {}
    try { allMarkdownPathsSet.clear() } catch (_) {}
  })

  it('normalizeSearchIndexEntries slugifies titles and persists mapping for path entries', () => {
    const entries = [{ path: 'docs/foo.md', slug: 'docs/foo.md', title: 'My Title' }]
    normalizeSearchIndexEntries(entries)
    expect(entries[0].slug).toContain('my-title')
    // storeSlugMapping should have persisted mapping for the slug
    const pageOnly = String(entries[0].slug).split('::')[0]
    expect(slugToMd.has(pageOnly) || mdToSlug.has('docs/foo.md')).toBeTruthy()
  })

  it('safeGet returns nested default properties and undefined on missing', () => {
    const mod = { default: { foo: 'bar' } }
    expect(safeGet(mod, 'foo')).toBe('bar')
    expect(safeGet(null, 'x')).toBeUndefined()
  })
})
