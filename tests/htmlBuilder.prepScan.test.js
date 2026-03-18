import { describe, it, expect, vi, beforeEach } from 'vitest'

import * as slugMgr from '../src/slugManager.js'
import * as hb from '../src/htmlBuilder.js'

beforeEach(() => {
  slugMgr.slugToMd.clear()
  slugMgr.mdToSlug.clear()
  slugMgr.clearFetchCache && slugMgr.clearFetchCache()
})

describe('htmlBuilder preScanHtmlSlugs and prepareArticle', () => {
  it('preScanHtmlSlugs extracts title and sets slug mapping', async () => {
    // create anchors
    document.body.innerHTML = ''
    const a1 = document.createElement('a')
    a1.setAttribute('href', 'about.html')
    document.body.appendChild(a1)

    const a2 = document.createElement('a')
    a2.setAttribute('href', 'skip.txt')
    document.body.appendChild(a2)

    // mock fetchMarkdown
    vi.spyOn(slugMgr, 'fetchMarkdown').mockImplementation(async (path, base) => {
      if (path === 'about.html') return { raw: '<html><head><title>About Us</title></head><body><h1>About Us</h1></body></html>' }
      return { raw: '' }
    })

    await hb.preScanHtmlSlugs(document.querySelectorAll('a'), 'http://example.com/content/')

    const slug = slugMgr.slugify('About Us')
    expect(slugMgr.slugToMd.has(slug)).toBe(true)
    expect(slugMgr.mdToSlug.has('about.html')).toBe(true)
  })

  it('prepareArticle rewrites relative image src and wraps in figure, sets table class and computes slug', async () => {
    const raw = '<h1>My Title</h1><p><img src="img.png"></p><table></table>'
    // avoid actual anchor rewrite network calls: make rewriteAnchorsWorker throw and rewriteAnchors a no-op
    vi.spyOn(hb, 'rewriteAnchorsWorker').mockImplementation(async () => { throw new Error('worker fail') })
    vi.spyOn(hb, 'rewriteAnchors').mockImplementation(async () => {})

    const res = await hb.prepareArticle((k) => k, { raw, isHtml: true }, 'docs/page.html', null, 'http://example.com/content/')

    const article = res.article
    const img = article.querySelector('img')
    expect(img).toBeTruthy()
    expect(img.src).toContain('http://example.com')

    const figure = article.querySelector('figure.image')
    expect(figure).toBeTruthy()

    const table = article.querySelector('table')
    expect(table.classList.contains('table')).toBe(true)

    const slug = slugMgr.slugify('My Title')
    expect(res.slugKey).toBe(slug)

    hb.rewriteAnchorsWorker.mockRestore()
    hb.rewriteAnchors.mockRestore()
  })
})
