import { describe, it, expect, beforeEach, vi } from 'vitest'
import { preMapMdSlugs, rewriteAnchors, ensureScrollTopButton } from '../src/htmlBuilder.js'
import * as slugMgr from '../src/slugManager.js'

describe('htmlBuilder branch coverage extras', () => {
  beforeEach(() => {
    try { slugMgr.slugToMd.clear() } catch (e) {}
    try { slugMgr.mdToSlug.clear() } catch (e) {}
  })

  it('preMapMdSlugs sets slug mapping when fetchMarkdown returns title', async () => {
    const a = document.createElement('a')
    a.setAttribute('href', 'foo.md#frag')
    const anchors = [a]
    const orig = slugMgr.fetchMarkdown
    try {
      slugMgr.setFetchMarkdown(async (path, base) => {
        if (String(path).endsWith('foo.md')) return { raw: '# My Title\n' }
        throw new Error('not found')
      })
      await preMapMdSlugs(anchors, 'http://example.com/content/')
      expect(slugMgr.mdToSlug.has('foo.md')).toBe(true)
      const slug = slugMgr.mdToSlug.get('foo.md')
      expect(slug).toBe('my-title')
      expect(slugMgr.slugToMd.get(slug)).toBe('foo.md')
    } finally {
      slugMgr.setFetchMarkdown(orig)
    }
  })

  it('preMapMdSlugs tolerates fetch failures without throwing', async () => {
    const a = document.createElement('a')
    a.setAttribute('href', 'bar.md')
    const anchors = [a]
    const orig = slugMgr.fetchMarkdown
    try {
      slugMgr.setFetchMarkdown(async () => { throw new Error('boom') })
      await expect(preMapMdSlugs(anchors, '/content/')).resolves.toBeUndefined()
      expect(slugMgr.mdToSlug.has('bar.md')).toBe(false)
    } finally {
      slugMgr.setFetchMarkdown(orig)
    }
  })

  it('rewriteAnchors handles html pending and sets href from fetched title', async () => {
    const article = document.createElement('article')
    const a = document.createElement('a')
    a.setAttribute('href', 'docs/page.html')
    article.appendChild(a)
    const orig = slugMgr.fetchMarkdown
    try {
      slugMgr.setFetchMarkdown(async (path, base) => {
        if (String(path).endsWith('docs/page.html')) return { raw: '<!doctype html><html><head><title>HTML Page</title></head><body><h1>HTML Page</h1></body></html>' }
        throw new Error('not found')
      })
      await rewriteAnchors(article, 'http://example.com/content/', 'some/page.md')
      const out = a.getAttribute('href')
      expect(out).toContain('?page=')
      expect(out).toContain('html-page')
    } finally {
      slugMgr.setFetchMarkdown(orig)
    }
  })

  it('ensureScrollTopButton observes topH1 when IntersectionObserver present', () => {
    // provide a fake IntersectionObserver to exercise observer branch
    const observed = new Set()
    class FakeIO {
      constructor(cb) { this.cb = cb }
      observe(el) { observed.add(el) }
      disconnect() { observed.clear() }
    }
    // @ts-ignore
    global.IntersectionObserver = FakeIO

    const mount = document.createElement('div')
    mount.className = 'nimbi-cms'
    document.body.appendChild(mount)
    const topH1 = document.createElement('h1')
    topH1.textContent = 'Top'
    mount.appendChild(topH1)

    ensureScrollTopButton(document.createElement('article'), topH1, { container: mount, mountOverlay: null, mountEl: mount, navWrap: document.createElement('div'), t: (k)=>k })
    const btn = document.querySelector('.nimbi-scroll-top')
    expect(btn).toBeTruthy()
    expect(observed.has(topH1)).toBe(true)
    // clean up
    // @ts-ignore
    delete global.IntersectionObserver
    document.body.removeChild(mount)
  })
})
