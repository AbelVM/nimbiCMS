import { describe, it, expect, vi } from 'vitest'

// Mock importCache used by importModuleWithCache
vi.mock('../../src/utils/importCache.js', () => ({
  importUrlWithCache: vi.fn(async () => 'IMPORTED'),
  runImportWithCache: vi.fn(),
  clearImportCache: vi.fn(),
  setImportNegativeCacheTTL: vi.fn()
}), { virtual: true })

import { decodeHtmlEntitiesLocal, _splitIntoSections, slugifyHeading, importModuleWithCache } from '../../src/worker/renderer.js'

describe('renderer internal helpers', () => {
  it('decodes named and unknown HTML entities correctly', () => {
    expect(decodeHtmlEntitiesLocal('&amp;')).toBe('&')
    expect(decodeHtmlEntitiesLocal('&unknown;')).toBe('&unknown;')
    expect(decodeHtmlEntitiesLocal('')).toBe('')
  })

  it('slugifyHeading returns fallback when toString throws', () => {
    const bad = { toString() { throw new Error('boom') } }
    expect(slugifyHeading(bad)).toBe('heading')
  })

  it('splitIntoSections returns intro-first and multiple sections when headings present', () => {
    const md = 'Intro text\n\n# One\ncontent\n# Two\nmore'
    const sections = _splitIntoSections(md, 10)
    expect(Array.isArray(sections)).toBeTruthy()
    expect(sections[0]).toContain('Intro text')
    expect(sections.length).toBeGreaterThanOrEqual(2)
  })

  it('importModuleWithCache calls importUrlWithCache and returns value', async () => {
    const res = await importModuleWithCache('http://example.com/x')
    expect(res).toBe('IMPORTED')
  })
})
