import { describe, it, expect } from 'vitest'
import { createNavTree, buildTocElement, _parseHtml, prepareArticle } from '../src/htmlBuilder.js'

describe('htmlBuilder extra tests', () => {
  it('createNavTree builds anchors and nested lists', () => {
    const t = k => k
    const tree = [{ path: 'home', name: 'Home', children: [{ path: 'about', name: 'About' }] }]
    const nav = createNavTree(t, tree)
    const anchors = nav.querySelectorAll('a')
    expect(anchors.length).toBe(2)
    expect(anchors[0].textContent).toBe('Home')
    expect(anchors[0].getAttribute('href')).toContain('?page=home')
    expect(anchors[1].textContent).toBe('About')
  })

  it('buildTocElement creates nested TOC and skips top-level entries', () => {
    const t = k => k
    const toc = [ { level: 1, text: 'Top' }, { level: 2, text: 'Section', id: 'section' }, { level: 3, text: 'Sub', id: 'section-sub' } ]
    const tocEl = buildTocElement(t, toc)
    expect(tocEl).toBeTruthy()
    const lis = tocEl.querySelectorAll('li')
    expect(lis.length).toBeGreaterThanOrEqual(2)
    const nested = tocEl.querySelector('ul ul li a')
    expect(nested && nested.textContent).toBe('Sub')
  })

  it('parseHtml adds heading ids and marks images for lazy loading', () => {
    const raw = '<h1>My Title</h1><p><img src="pic.jpg"></p>'
    const parsed = _parseHtml(raw)
    expect(parsed).toBeTruthy()
    const doc = new DOMParser().parseFromString(parsed.html, 'text/html')
    const h1 = doc.querySelector('h1')
    expect(h1).toBeTruthy()
    expect(h1.id).toBe(parsed.toc[0].id)
    const img = doc.querySelector('img')
    expect(img).toBeTruthy()
    expect(img.getAttribute('data-want-lazy') === '1' || img.hasAttribute('data-want-lazy')).toBe(true)
  })

  it('prepareArticle resolves relative image srcs, wraps images, and adds table class', async () => {
    const t = k => k
    const html = '<h1>Page</h1><p><img src="pic.jpg"></p><table></table>'
    const data = { isHtml: true, raw: html }
    const res = await prepareArticle(t, data, 'docs/page.md', null, 'http://example.com/content/')
    const { article } = res
    const img = article.querySelector('img')
    expect(img).toBeTruthy()
    expect(img.getAttribute('src')).toContain('http://example.com/content/docs/pic.jpg')
    // image should be wrapped in a figure.image
    const figure = article.querySelector('figure.image')
    expect(figure).toBeTruthy()
    const table = article.querySelector('table')
    expect(table).toBeTruthy()
    expect(table.classList.contains('table')).toBe(true)
  })
})
