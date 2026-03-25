import { describe, it, expect, beforeEach } from 'vitest'
import { augmentIndexWithAllMarkdownPaths, buildPageCandidates, _clearIndexCache } from '../../src/router.js'

describe('buildPageCandidates behavior', () => {
  beforeEach(() => { _clearIndexCache() })

  it('returns explicit .md candidate when provided', () => {
    const c = buildPageCandidates('some/path/page.md')
    expect(c).toContain('some/path/page.md')
  })

  it('returns explicit .html candidate when provided', () => {
    const c = buildPageCandidates('other/site/page.html')
    expect(c).toContain('other/site/page.html')
  })

  it('uses indexSet to find matching base name', () => {
    augmentIndexWithAllMarkdownPaths(['content/alpha/page.md', 'content/beta/other.md'])
    const c = buildPageCandidates('page')
    expect(c.length).toBeGreaterThan(0)
    expect(c[0]).toMatch(/page\.md$/)
  })

  it('falls back to .html and .md when no index entry found', () => {
    _clearIndexCache()
    const c = buildPageCandidates('missing-slug')
    expect(c).toContain('missing-slug.html')
    expect(c).toContain('missing-slug.md')
  })
})
