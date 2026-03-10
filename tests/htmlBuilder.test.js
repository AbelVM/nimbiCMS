import { describe, it, expect, beforeEach, vi } from 'vitest'
import { preScanHtmlSlugs, _parseHtml, _parseMarkdown } from '../src/htmlBuilder.js'
import { slugify, slugToMd, mdToSlug } from '../src/filesManager.js'
import * as fm from '../src/filesManager.js'

// helper to craft an anchor element
function makeAnchor(href) {
  const a = document.createElement('a')
  a.setAttribute('href', href)
  return a
}

describe('htmlBuilder utilities', () => {

  beforeEach(() => {
    // clear maps before each test
    slugToMd.clear()
    mdToSlug.clear()
  })

  it('preScanHtmlSlugs ignores non-html links', async () => {
    const anchors = [makeAnchor('foo.md'), makeAnchor('http://example.com/test')]
    await preScanHtmlSlugs(anchors, 'http://dummy/')
    expect(slugToMd.size).toBe(0)
    expect(mdToSlug.size).toBe(0)
  })

  it('preScanHtmlSlugs maps title/h1 to slug', async () => {
    const anchors = [makeAnchor('page.html')]
    // stub fetchMarkdown to return HTML with both title and h1
    const fake = '<html><head><title>My Page</title></head><body><h1>My Page</h1></body></html>'
    const spy = vi.spyOn(fm, 'fetchMarkdown').mockResolvedValue({ raw: fake })
    await preScanHtmlSlugs(anchors, '/base/')
    spy.mockRestore()
    const expectedSlug = slugify('My Page')
    expect(slugToMd.get(expectedSlug)).toBe('page.html')
    expect(mdToSlug.get('page.html')).toBe(expectedSlug)
  })

  it('preScanHtmlSlugs skips already mapped paths', async () => {
    slugToMd.set('already', 'page.html')
    const anchors = [makeAnchor('page.html')]
    const spy = vi.spyOn(fm, 'fetchMarkdown').mockResolvedValue({ raw: '<h1>Other</h1>' })
    await preScanHtmlSlugs(anchors, '/base/')
    spy.mockRestore()
    expect(slugToMd.get('already')).toBe('page.html')
    // no new mappings
    expect(slugToMd.size).toBe(1)
  })

  it('parseHtml returns html and toc entries', () => {
    const raw = '<h1 id="foo">Foo</h1><p>bar</p>'
    const parsed = _parseHtml(raw)
    expect(parsed.html).toContain('Foo')
    expect(parsed.toc).toEqual([{ level: 1, text: 'Foo', id: 'foo' }])
  })

  it('parseMarkdown runs markdown conversion and registers languages', async () => {
    const md = '```js\nconsole.log(1)\n```'
    const parsed = await _parseMarkdown(md)
    expect(parsed.html).toContain('<code')
  })
})