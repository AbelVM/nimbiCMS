import { describe, it, expect } from 'vitest'
import { rewriteAnchors } from '../src/htmlBuilder.js'
import { slugToMd, mdToSlug } from '../src/slugManager.js'
import { JSDOM } from 'jsdom'

describe('repro slug pagePath anchor rewrite', () => {
  it('rewrites relative links when pagePath is a slug token', async () => {
    const dom = new JSDOM('<!doctype html><body><article><a href="foo.md">Foo</a><a href="./bar.md">Bar</a><a href="../baz.md">Baz</a></article></body>')
    const article = dom.window.document.querySelector('article')
    slugToMd.clear(); mdToSlug.clear()
    slugToMd.set('foo', 'foo.md')
    slugToMd.set('bar', 'bar.md')
    slugToMd.set('baz', 'baz.md')
    await rewriteAnchors(article, 'http://localhost/content/', 'nimbi-cms')
    const hrefs = Array.from(article.querySelectorAll('a')).map((a) => a.getAttribute('href'))
    expect(hrefs.every((h) => h && h.includes('?page='))).toBe(true)
  })
})
