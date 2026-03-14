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
