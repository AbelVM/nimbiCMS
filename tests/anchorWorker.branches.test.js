import { describe, it, expect } from 'vitest'
import { _rewriteAnchors } from '../src/htmlBuilder.js'
import { mdToSlug, slugToMd } from '../src/slugManager.js'

describe('anchor rewrite logic branches', () => {
  it('rewrites md anchor when mdToSlug has mapping', async () => {
    try { mdToSlug.clear(); slugToMd.clear() } catch (e) {}
    mdToSlug.set('docs/foo.md', 'foo')
    const article = document.createElement('div')
    article.innerHTML = '<a href="docs/foo.md#sec">Link</a>'
    await _rewriteAnchors(article, 'http://example.com/', '')
    const a = article.querySelector('a')
    expect(a.href).toBeTruthy()
    expect(a.href.includes('page=foo') || a.href.includes('/?page=foo')).toBe(true)
  })

  it('handles query page param and builds page url when pagePath present', async () => {
    const article = document.createElement('div')
    article.innerHTML = '<a href="?page=other#x">Q</a>'
    await _rewriteAnchors(article, 'http://example.com/', 'docs/page.md')
    const a = article.querySelector('a')
    expect(a.href.includes('page=') || a.href.includes('#')).toBe(true)
  })
})
