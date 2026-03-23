import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
let origFetch
let origGlobalManifest
let origWindowManifest
import { buildSearchIndex, setFetchMarkdown, setContentBase, _setAllMd, slugToMd, mdToSlug } from '../src/slugManager.js'

describe('navigation-driven indexing and slug mapping', () => {
  beforeEach(() => {
    // Reset slug maps and internal manifest to avoid interference
    slugToMd.clear()
    mdToSlug.clear()
    _setAllMd({})
    // Ensure no injected build manifest affects the test
    try {
      origGlobalManifest = (typeof globalThis !== 'undefined') ? globalThis.__NIMBI_CMS_MANIFEST__ : undefined
      try { if (typeof globalThis !== 'undefined') delete globalThis.__NIMBI_CMS_MANIFEST__ } catch (_) {}
    } catch (e) { origGlobalManifest = undefined }
    try {
      if (typeof window !== 'undefined') {
        origWindowManifest = window.__NIMBI_CMS_MANIFEST__
        try { delete window.__NIMBI_CMS_MANIFEST__ } catch (_) {}
      }
    } catch (e) { origWindowManifest = undefined }
    // Stub global.fetch so crawlAllMarkdown won't fetch directory listings
    // and discover unexpected pages during the test run.
    // Page content fetches are handled by `setFetchMarkdown` below.
    try {
      origFetch = global.fetch
    } catch (e) { origFetch = undefined }
    global.fetch = vi.fn(async () => ({ ok: false, status: 404, text: async () => '' }))
  })

  afterEach(() => {
    try {
      if (typeof origFetch !== 'undefined') global.fetch = origFetch
    } catch (e) {}
    try {
      if (typeof globalThis !== 'undefined') {
        if (typeof origGlobalManifest === 'undefined') try { delete globalThis.__NIMBI_CMS_MANIFEST__ } catch (_) {} 
        else try { globalThis.__NIMBI_CMS_MANIFEST__ = origGlobalManifest } catch (_) {}
      }
    } catch (e) {}
    try {
      if (typeof window !== 'undefined') {
        if (typeof origWindowManifest === 'undefined') try { delete window.__NIMBI_CMS_MANIFEST__ } catch (_) {}
        else try { window.__NIMBI_CMS_MANIFEST__ = origWindowManifest } catch (_) {}
      }
    } catch (e) {}
  })

  it('indexes 9 unique pages and populates slug->md mapping (5 nav pages, linked pages produce 9 total)', async () => {
    const contentBase = '/content/'
    const manifest = {}

    // Build 9 pages. Navigation contains 5 pages (page-1 .. page-5)
    // and those pages link to a small tree that ultimately references
    // pages 6..9. The runtime should only discover the reachable tree
    // (1..9), not unrelated pages.
    for (let i = 1; i <= 9; i++) {
      const name = `page-${i}.md`
      let raw = `# Page ${i}\n\nContent for page ${i}.\n`
      // Add links from the first five navigation pages to form the tree
      if (i === 1) raw += '\n' + [6,7].map(n => `[link${n}](page-${n}.md)`).join('\n') + '\n'
      if (i === 2) raw += '\n' + [7,8].map(n => `[link${n}](page-${n}.md)`).join('\n') + '\n'
      if (i === 3) raw += '\n' + [8,9].map(n => `[link${n}](page-${n}.md)`).join('\n') + '\n'
      if (i === 4) raw += '\n' + [9,6].map(n => `[link${n}](page-${n}.md)`).join('\n') + '\n'
      if (i === 5) raw += '\n' + [].join('\n') + '\n'
      manifest[`${contentBase}${name}`] = raw
    }

    // Register the in-memory manifest and provide a fetchMarkdown shim
    _setAllMd(manifest)
    setFetchMarkdown(async (path, base) => {
      const rel = String(path || '').replace(/^\//, '')
      const baseClean = String(base || '').replace(/^\//, '').replace(/\/$/, '')
      const key = baseClean ? `/${baseClean}/${rel}` : `/${rel}`
      const raw = manifest[key]
      if (!raw) throw new Error('manifest missing: ' + key)
      return { raw }
    })

    // Seed the runtime and build the index
    setContentBase(contentBase)
    const idx = await buildSearchIndex(contentBase, 1)

    const uniquePathsArr = Array.from(new Set((idx || []).map(e => e.path)))
    const uniquePaths = uniquePathsArr.length
    expect(uniquePaths).toBe(9)
    expect(slugToMd.size).toBe(9)
  })
})
