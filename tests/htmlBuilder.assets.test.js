import { describe, it, expect } from 'vitest'
import { prepareArticle, executeEmbeddedScripts } from '../src/htmlBuilder.js'

describe('htmlBuilder asset handling', () => {
  it('prepareArticle rewrites relative image src and wraps single-image paragraph', async () => {
    const raw = '<p><img src="pic.png"/></p>'
    const data = { raw, isHtml: true }
    const t = (k) => k
    const { article } = await prepareArticle(t, data, 'docs/page.md', null, 'http://example.com/content/')
    const img = article.querySelector('img')
    expect(img).toBeTruthy()
    expect(img.src).toMatch(/^http:\/\/example.com\//)
    expect(img.getAttribute('data-want-lazy') === '1' || img.getAttribute('loading') === 'lazy').toBe(true)
    // parent should be a figure wrapper
    expect(img.parentElement.tagName.toLowerCase()).toBe('figure')
  })

  it('prepareArticle rewrites srcset and link hrefs', async () => {
    const raw = '<p><img srcset="a.png 1x, b.png 2x"></p><link rel="stylesheet" href="style.css"><svg><use xlink:href="icon.svg"></use></svg>'
    const data = { raw, isHtml: true }
    const t = (k) => k
    const { article } = await prepareArticle(t, data, 'docs/page.md', null, 'http://example.com/content/')
    const img = article.querySelector('img')
    expect(img).toBeTruthy()
    expect(img.getAttribute('srcset')).toMatch(/http:\/\/example.com\//)
    const link = article.querySelector('link')
    expect(link).toBeTruthy()
    expect(link.href).toMatch(/^http:\/\/example.com\//)
    const use = article.querySelector('use')
    expect(use).toBeTruthy()
    expect(use.getAttribute('xlink:href')).toMatch(/http:\/\/example.com\//)
  })

  it('executeEmbeddedScripts runs inline script and removes it when successful', () => {
    const article = document.createElement('article')
    const s = document.createElement('script')
    s.textContent = 'window.__HTMLBUILDER_TEST = true;'
    article.appendChild(s)
    executeEmbeddedScripts(article)
    expect(window.__HTMLBUILDER_TEST).toBe(true)
    // script should be removed
    expect(article.querySelectorAll('script').length).toBe(0)
  })
})
import { it, describe, expect, beforeEach } from 'vitest'
import { prepareArticle } from '../src/htmlBuilder.js'

describe('htmlBuilder asset rewriting', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('resolves relative src, srcset, poster and SVG use hrefs against page directory', async () => {
    const contentBase = 'http://localhost/base/'
    const pagePath = 'dir/page.md'
    const html = `
      <img src="pic.png" />
      <img srcset="a.png 1x, b.png 2x" />
      <video poster="poster.jpg"></video>
      <svg><use xlink:href="icons.svg#sym"></use></svg>
    `
    const result = await prepareArticle(k => k, { raw: html, isHtml: true }, pagePath, null, contentBase)
    const { article } = result
    const img = article.querySelector('img')
    expect(img).toBeTruthy()
    expect(img.src).toContain('http://localhost/base/dir/pic.png')

    const img2 = article.querySelectorAll('img')[1]
    const ss = img2.getAttribute('srcset')
    expect(ss).toContain('http://localhost/base/dir/a.png')
    expect(ss).toContain('http://localhost/base/dir/b.png')

    const video = article.querySelector('video')
    expect(video.getAttribute('poster')).toContain('http://localhost/base/dir/poster.jpg')

    const use = article.querySelector('use')
    const xlink = use.getAttribute('xlink:href') || use.getAttribute('href')
    expect(xlink).toContain('http://localhost/base/dir/icons.svg')
  })
})
