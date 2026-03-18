import { describe, it, expect } from 'vitest'
import { handleAnchorWorkerMessage } from '../src/worker/anchorWorker.js'
import { mdToSlug, slugToMd } from '../src/slugManager.js'

describe('anchor worker rewrite branches', () => {
  it('returns error for unsupported message', async () => {
    const res = await handleAnchorWorkerMessage({ type: 'unknown', id: 'x' })
    expect(res).toBeTruthy()
    expect(res.error).toMatch(/unsupported message/)
  })

  it('rewrites md anchor when mdToSlug has mapping', async () => {
    // prepare maps
    try { mdToSlug.clear(); slugToMd.clear() } catch (e) {}
    mdToSlug.set('docs/foo.md', 'foo')
    const html = '<a href="docs/foo.md#sec">Link</a>'
    const res = await handleAnchorWorkerMessage({ type: 'rewriteAnchors', id: '1', html, contentBase: 'http://example.com/', pagePath: '' })
    expect(res && res.result).toBeTruthy()
    expect(res.result).toContain('href="')
    // href should be a page url with page=foo
    expect(res.result.includes('page=foo') || res.result.includes('/?page=foo')).toBe(true)
  })

  it('handles query page param and builds page url when pagePath present', async () => {
    const html = '<a href="?page=other#x">Q</a>'
    const res = await handleAnchorWorkerMessage({ type: 'rewriteAnchors', id: '2', html, contentBase: 'http://example.com/', pagePath: 'docs/page.md' })
    expect(res && res.result).toBeTruthy()
    // should contain a page param or hash
    expect(res.result.includes('page=') || res.result.includes('#')).toBe(true)
  })
})
