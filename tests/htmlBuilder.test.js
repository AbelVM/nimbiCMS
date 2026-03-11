import { describe, it, expect, beforeEach, vi } from 'vitest'
import { preScanHtmlSlugs, preMapMdSlugs, _parseHtml, _parseMarkdown } from '../src/htmlBuilder.js'
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

  it('preMapMdSlugs fetches markdown and registers slug from H1', async () => {
    const anchors = [makeAnchor('foo.md'), makeAnchor('sub/bar.md')]
    const responses = {
      'foo.md': '# Foo Title',
      'sub/bar.md': '# Another'
    }
    const spy = vi.spyOn(fm, 'fetchMarkdown').mockImplementation((path, base) => {
      return Promise.resolve({ raw: responses[path] })
    })
    // use absolute base to satisfy URL constructor
    await preMapMdSlugs(anchors, 'http://example.com/base/')
    spy.mockRestore()
    expect(slugToMd.get('foo-title')).toBe('foo.md')
    expect(slugToMd.get('another')).toBe('sub/bar.md')
  })

  it('parseHtml returns html and toc entries', () => {
    const raw = '<h1 id="foo">Foo</h1><p>bar</p>'
    const parsed = _parseHtml(raw)
    expect(parsed.html).toContain('Foo')
    expect(parsed.toc).toEqual([{ level: 1, text: 'Foo', id: 'foo' }])
  })

  it('parseMarkdown runs markdown conversion and registers languages', async () => {
    // use string concatenation to avoid closing the template early
    const md = [
      '```js',
      'console.log(1)',
      '```'
    ].join('\n')
    const parsed = await _parseMarkdown(md)
    expect(parsed.html).toContain('<code')
  })

  it('ensureScrollTopButton toggles label without a heading', () => {
    // set up simple DOM elements
    const article = document.createElement('article')
    const navWrap = document.createElement('div')
    navWrap.className = 'nimbi-nav-wrap'
    const toc = document.createElement('aside')
    toc.className = 'menu nimbi-toc-inner'
    const label = document.createElement('p')
    label.className = 'menu-label'
    toc.appendChild(label)
    navWrap.appendChild(toc)
    document.body.appendChild(navWrap)
    const container = document.createElement('div')
    container.className = 'nimbi-cms'
    container.style.height = '50px'
    container.style.overflow = 'auto'
    const filler = document.createElement('div')
    filler.style.height = '200px'
    container.appendChild(filler)
    document.body.appendChild(container)

    // call ensureScrollTopButton with no topH1
    const { ensureScrollTopButton } = require('../src/htmlBuilder.js')
    ensureScrollTopButton(article, null, { container, navWrap })

    // simulate scroll down
    container.scrollTop = 20
    container.dispatchEvent(new Event('scroll'))

    expect(label.classList.contains('show')).toBe(true)

    // scroll back up should hide
    container.scrollTop = 0
    container.dispatchEvent(new Event('scroll'))
    expect(label.classList.contains('show')).toBe(false)
  })
})