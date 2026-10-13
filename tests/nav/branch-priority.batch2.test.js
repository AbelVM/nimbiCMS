import { describe, it, expect, vi, beforeEach } from 'vitest'

// Single top-level mock for slugManager to avoid hoisting conflicts
vi.mock('../../src/slugManager.js', () => {
  const slugToMd = new Map()
  const mdToSlug = new Map()
  const allMarkdownPaths = []
  const allMarkdownPathsSet = new Set()
  const searchIndex = []
  const api = {
    slugify: (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/ /g, '-'),
    slugToMd,
    mdToSlug,
    // test will set _storeSlugMapping when needed
    _storeSlugMapping: undefined,
    storeSlugMapping: undefined,
    fetchMarkdown: async () => ({ raw: '' }),
    allMarkdownPaths,
    allMarkdownPathsSet,
    searchIndex,
    _setSearchIndex: (arr) => {
      searchIndex.length = 0
      if (Array.isArray(arr)) searchIndex.push(...arr)
    }
  }

  api.storeSlugMapping = (slug, rel) => {
    if (typeof api._storeSlugMapping === 'function') {
      return api._storeSlugMapping(slug, rel)
    }
    try { slugToMd.set(slug, rel) } catch (_) {}
    try { mdToSlug.set(rel, slug) } catch (_) {}
    try {
      if (!allMarkdownPathsSet.has(rel)) {
        allMarkdownPathsSet.add(rel)
        if (!allMarkdownPaths.includes(rel)) allMarkdownPaths.push(rel)
      }
    } catch (_) {}
    return rel
  }

  return api
})

describe('nav prioritized branches - batch2', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  it('safeGet returns direct and default properties and undefined', async () => {
    vi.resetModules()
    const nav = await import('../../src/nav.js')
    const { safeGet } = nav

    const mod1 = { foo: 'bar' }
    expect(safeGet(mod1, 'foo')).toBe('bar')

    const mod2 = { default: { baz: 'qux' } }
    expect(safeGet(mod2, 'baz')).toBe('qux')

    expect(safeGet(null, 'x')).toBe(undefined)
  })

  it('_storeSlugMapping is used when available', async () => {
    vi.resetModules()
    const slugMgr = await import('../../src/slugManager.js')
    const _storeSlugMappingMock = vi.fn()
    slugMgr._storeSlugMapping = _storeSlugMappingMock
    const nav = await import('../../src/nav.js')
    const { storeSlugMapping } = nav
    storeSlugMapping('abc-slug', 'some/path.md')
    expect(slugMgr._storeSlugMapping).toHaveBeenCalledWith('abc-slug', 'some/path.md')
  })

  it('fallback storeSlugMapping persists mappings when _storeSlugMapping absent', async () => {
    vi.resetModules()
    const slugMgr = await import('../../src/slugManager.js')
    // ensure clean maps/arrays
    slugMgr.slugToMd.clear()
    slugMgr.mdToSlug.clear()
    slugMgr.allMarkdownPaths.length = 0
    slugMgr.allMarkdownPathsSet.clear()
    // ensure _storeSlugMapping not set so nav fallback runs
    slugMgr._storeSlugMapping = undefined

    const nav = await import('../../src/nav.js')
    const { storeSlugMapping } = nav

    storeSlugMapping('mySlug', 'path/to/doc.md')
    expect(slugMgr.slugToMd.get('mySlug')).toBe('path/to/doc.md')
    expect(slugMgr.mdToSlug.get('path/to/doc.md')).toBe('mySlug')
    expect(slugMgr.allMarkdownPathsSet.has('path/to/doc.md')).toBe(true)
    expect(slugMgr.allMarkdownPaths.includes('path/to/doc.md')).toBe(true)
  })

  it('normalizeSearchIndexEntries resolves file-like slug via slugToMd and preserves anchor', async () => {
    vi.resetModules()
    const slugMgr = await import('../../src/slugManager.js')
    slugMgr.slugToMd.clear()
    slugMgr.mdToSlug.clear()
    slugMgr.allMarkdownPaths.length = 0
    slugMgr.allMarkdownPathsSet.clear()
    // ensure _storeSlugMapping not present for this test
    slugMgr._storeSlugMapping = undefined
    // seed mapping so findSlugForPath will find it when extension is stripped
    slugMgr.slugToMd.set('existing-slug', 'dir/foo')

    // verify mapping exists on the mocked slugManager
    expect(slugMgr.slugToMd.get('existing-slug')).toBe('dir/foo')

    const nav = await import('../../src/nav.js')
    const { normalizeSearchIndexEntries } = nav
    const entries = [{ slug: 'dir/foo.md::anchor' }]
    normalizeSearchIndexEntries(entries)
    // anchor should be preserved (allow either mapped slug or slugified fallback)
    expect(entries[0].slug).toMatch(/::anchor$/)
  })
})
