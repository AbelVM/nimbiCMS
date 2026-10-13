import { it, expect, vi } from 'vitest'

// Ensure module mocks are set before importing nimbi-cms
vi.resetModules()

vi.mock('../src/slugManager.js', () => {
  const slugToMd = new Map()
  const mdToSlug = new Map()
  const allMarkdownPaths = []
  const allMarkdownPathsSet = new Set()
  const searchIndex = []
  const api = {
    slugToMd,
    mdToSlug,
    allMarkdownPaths,
    allMarkdownPathsSet,
    searchIndex,
    slugify: (s) => String(s ?? '').toLowerCase().replace(/\s+/g, '-'),
    storeSlugMapping: undefined,
    fetchMarkdown: async (path) => {
      if (path === '_navigation.md') return { raw: '<a href="page.html">Page</a>' }
      if (path.endsWith('.html')) return { raw: '<html><head><title>Page Title</title></head><body><h1>Page Title</h1></body></html>' }
      return { raw: '# home' }
    },
    setContentBase: () => {},
    setNotFoundPage: () => {},
    buildSearchIndex: async () => [] ,
    _setSearchIndex: (arr) => {
      searchIndex.length = 0
      if (Array.isArray(arr)) searchIndex.push(...arr)
    },
    whenSearchIndexReady: async () => searchIndex,
    setDefaultCrawlMaxQueue: () => {},
    clearFetchCache: () => {}
  }

  api.storeSlugMapping = (slug, rel) => {
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

vi.mock('../src/bulmaManager.js', () => ({ ensureBulma: async () => {}, setStyle: () => {} }))
vi.mock('../src/markdown.js', async () => ({ parseMarkdownToHtml: async (md) => ({ html: String(md ?? '') }), detectFenceLanguages: (raw) => new Set() }))
vi.mock('../src/router.js', () => ({
  setResolutionCacheTtl: () => {},
  setResolutionCacheMax: () => {},
  RESOLUTION_CACHE_TTL: 0,
  RESOLUTION_CACHE_MAX: 0,
  fetchPageData: async () => ({ pagePath: '_home.md', data: { raw: '# home' } }),
}))

it('initCMS processes navigation html links and populates slug maps', async () => {
  // DOM container
  document.body.innerHTML = '<div id="app"></div>'
  const fm = await import('../src/slugManager.js')
  const { default: initCMS } = await import('../src/nimbi-cms.js')

  await expect(initCMS({ el: '#app', searchIndex: false })).resolves.toBeUndefined()

  // the mocked navigation had a link to page.html; slug should be created
  const slugKeys = Array.from(fm.slugToMd.keys())
  expect(slugKeys.length).toBeGreaterThan(0)
  const mapped = fm.slugToMd.get(slugKeys[0])
  expect(mapped).toMatch(/page\.html$/)
})
