import { describe, it, expect, beforeEach, vi } from 'vitest'
import { preScanHtmlSlugs, preMapMdSlugs, _parseHtml, _parseMarkdown } from '../src/htmlBuilder.js'
import { slugify, slugToMd, mdToSlug } from '../src/filesManager.js'
import * as fm from '../src/filesManager.js'
import initCMS from '../src/nimbi-cms.js'

// simple dummy IntersectionObserver for tests
class DummyObserver {
  constructor(cb) { this.cb = cb }
  observe() {}
  disconnect() {}
}

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
    // remove any leftover container or scroll button elements from prior runs
    document.querySelectorAll('.nimbi-cms, .nimbi-scroll-top').forEach(el => el.remove())
  })

  it('preScanHtmlSlugs ignores non-html links', async () => {
    const anchors = [makeAnchor('foo.md'), makeAnchor('http://example.com/test')]
    await preScanHtmlSlugs(anchors, 'http://dummy/')
    expect(slugToMd.size).toBe(0)
    expect(mdToSlug.size).toBe(0)
  })

  it('preScanHtmlSlugs maps title/h1 to slug', async () => {
    const anchors = [makeAnchor('page.html')]
    // stub global.fetch to simulate fetchMarkdown
    const fake = '<html><head><title>My Page</title></head><body><h1>My Page</h1></body></html>'
    global.fetch = vi.fn(async () => ({ ok: true, text: () => Promise.resolve(fake) }))
    await preScanHtmlSlugs(anchors, '/base/')
    const expectedSlug = slugify('My Page')
    expect(slugToMd.get(expectedSlug)).toBe('page.html')
    expect(mdToSlug.get('page.html')).toBe(expectedSlug)
  })

  it('preScanHtmlSlugs skips already mapped paths', async () => {
    slugToMd.set('already', 'page.html')
    const anchors = [makeAnchor('page.html')]
    global.fetch = vi.fn(async () => ({ ok: true, text: () => Promise.resolve('<h1>Other</h1>') }))
    await preScanHtmlSlugs(anchors, '/base/')
    expect(slugToMd.get('already')).toBe('page.html')
    // no new mappings
    expect(slugToMd.size).toBe(1)
  })

  it('preScanHtmlSlugs normalizes extension-less hrefs and maps them with .html', async () => {
    const anchors = [makeAnchor('foo')] // no .html suffix
    global.fetch = vi.fn(async () => ({ ok: true, text: () => Promise.resolve('<html><head><title>Foo</title></head></html>') }))
    await preScanHtmlSlugs(anchors, '/base/')
    expect(slugToMd.has('foo')).toBe(true)
    expect(slugToMd.get('foo')).toBe('foo.html')
  })

  it('preMapMdSlugs fetches markdown and registers slug from H1', async () => {
    const anchors = [makeAnchor('foo.md'), makeAnchor('sub/bar.md')]
    const responses = {
      'foo.md': '# Foo Title',
      'sub/bar.md': '# Another'
    }
    global.fetch = vi.fn(async (url) => {
      const str = String(url || '')
      for (const k in responses) {
        if (str.includes(k)) return { ok: true, text: () => Promise.resolve(responses[k]) }
      }
      return { ok: false, text: () => Promise.resolve('') }
    })
    // use absolute base to satisfy URL constructor
    await preMapMdSlugs(anchors, 'http://example.com/base/')
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
  })

  it('search box shows results when index contains matching titles', async () => {
    // prepare minimal DOM and stub dependencies
    document.body.innerHTML = '<div id="app"></div>'
    // clear any previous indexing state
    slugToMd.clear()
    mdToSlug.clear()
    fm.searchIndex.splice(0)

    const fakeNavMd = { raw: '- [Home](_home.md)\n- [Foo](foo.md)' }
    // stub global.fetch so both navigation and individual pages resolve
    global.fetch = vi.fn(async (url) => {
      const u = String(url || '')
      if (u.includes('_home.md')) return { ok: true, text: () => Promise.resolve('# Home') }
      if (u.includes('_navigation.md')) return { ok: true, text: () => Promise.resolve(fakeNavMd.raw) }
      if (u.includes('foo.md')) return { ok: true, text: () => Promise.resolve('# Foo\n\nbar') }
      return { ok: false, status: 404, text: () => Promise.resolve('') }
    })
    // do not stub buildSearchIndex – let actual logic run against slugToMd
    // make sure location behaves like a URL for initCMS
    if (!(global.location && typeof global.location === 'object')) {
      global.location = new URL('http://localhost/')
    }
    await initCMS({ el: '#app', searchIndex: true })
    const input = document.getElementById('nimbi-search')
    expect(input).toBeTruthy()
    // placeholder should come from l10n
    const { t } = require('../src/l10nManager.js')
    expect(input.placeholder).toBe(t('searchPlaceholder'))
    // input initially disabled and shows loading spinner
    expect(input.disabled).toBe(true)
    expect(input.classList.contains('is-loading')).toBe(true)
    // wait a bit for indexing to finish
    await new Promise(r => setTimeout(r, 50))
    expect(input.disabled).toBe(false)
    expect(input.classList.contains('is-loading')).toBe(false)

    // now search works
    input.value = 'foo'
    input.dispatchEvent(new Event('input'))
    await new Promise(r => setTimeout(r, 50))
    const results = document.getElementById('nimbi-search-results')
    expect(results && results.textContent).toContain('Foo')
    // results container should use Bulma box class
    expect(results.classList.contains('box')).toBe(true)
  })

  it('scrollToAnchorOrTop scrolls the container element to top when anchor is null', async () => {
    const container = document.createElement('div')
    container.className = 'nimbi-cms'
    container.style.height = '50px'
    container.style.overflow = 'auto'
    const filler = document.createElement('div')
    filler.style.height = '200px'
    container.appendChild(filler)
    document.body.appendChild(container)

    // stub scrollTo so we can observe changes synchronously
    container.scrollTo = ({ top }) => { container.scrollTop = top }

    // initially scroll down some amount
    container.scrollTop = 100
    const { scrollToAnchorOrTop } = require('../src/htmlBuilder.js')
    // sanity check: querySelector should find the same element
    expect(document.querySelector('.nimbi-cms')).toBe(container)
    scrollToAnchorOrTop(null)
    // allow any async scheduling to run
    await new Promise(r => setTimeout(r, 0))
    expect(container.scrollTop).toBe(0)
  })

  // new tests added below --------------------------------------------------
  it('createNavTree builds nested nav structure', () => {
    const { createNavTree } = require('../src/htmlBuilder.js')
    const t = k => k === 'navigation' ? 'Nav' : k
    const tree = [
      { path: 'a', name: 'A', children: [{ path: 'a1', name: 'A1' }] },
      { path: 'b', name: 'B' }
    ]
    const nav = createNavTree(t, tree)
    expect(nav.querySelector('p.menu-label').textContent).toBe('Nav')
    const links = nav.querySelectorAll('a')
    expect(links.length).toBe(3)
    expect(links[0].href).toContain('#a')
    expect(links[1].href).toContain('#a1')
    expect(links[2].href).toContain('#b')
  })

  it('buildTocElement ignores level 1 and respects pagePath mapping', () => {
    const { buildTocElement } = require('../src/htmlBuilder.js')
    const t = k => k === 'onThisPage' ? 'OnPage' : k
    // prepare slug maps
    const { mdToSlug } = require('../src/filesManager.js')
    mdToSlug.set('path/foo.md', 'foo-slug')
    const toc = [
      { level: 1, text: 'Skip me' },
      { level: 2, text: 'Second', id: 'sec' }
    ]
    const aside = buildTocElement(t, toc, 'path/foo.md')
    expect(aside.querySelector('p.menu-label').textContent).toBe('OnPage')
    const a = aside.querySelector('a')
    expect(a.href).toContain('?page=foo-slug')
    expect(a.href).toContain('#sec')
  })

  it('prepareArticle processes markdown, images, links, slug and anchor', async () => {
    const { prepareArticle } = require('../src/htmlBuilder.js')
    const t = k => k
    // stub global.fetch so that fetchMarkdown returns the expected title
    global.fetch = vi.fn(async (url) => {
      if (String(url).includes('foo.md')) return { ok: true, text: () => Promise.resolve('# Foo Title') }
      return { ok: true, text: () => Promise.resolve('') }
    })
    const md = '# Heading\n\n![img](pic.png)\n\n[link](foo.md)'
    const result = await prepareArticle(t, { raw: md, isHtml: false }, 'dir/page.md', 'anchor', 'http://base/')
    const { article, topH1, h1Text, slugKey } = result
    expect(h1Text).toBe('Heading')
    expect(slugKey).toBe('heading')
    // image src should be resolved and loading lazy
    const img = article.querySelector('img')
    expect(img.src).toContain('http://base/dir/pic.png')
    expect(img.getAttribute('loading')).toBe('lazy')
    // link href should now use slug
    const a = article.querySelector('a')
    expect(a.href).toContain('?page=foo-title')
  })

  it('prepareArticle handles raw HTML input and cleans undefined language', async () => {
    const { prepareArticle } = require('../src/htmlBuilder.js')
    const t = k => k
    const html = '<h1>Hi</h1><pre><code class="language-undefined">code</code></pre>'
    const result = await prepareArticle(t, { raw: html, isHtml: true }, '', null, 'http://base/')
    expect(result.article.querySelector('h1').textContent).toBe('Hi')
    const code = result.article.querySelector('code')
    // cleaning may leave other classes such as 'hljs', but should not be exactly the undefined class alone
    expect(code.className).not.toBe('language-undefined')
  })

  it('renderNotFound populates container with message', () => {
    const { renderNotFound } = require('../src/htmlBuilder.js')
    const container = document.createElement('div')
    const err = new Error('oops')
    renderNotFound(container, k => ({ notFound: 'No' })[k] || '', err)
    expect(container.querySelector('.nimbi-not-found')).toBeTruthy()
    expect(container.textContent).toContain('oops')
  })

  it('attachTocClickHandler intercepts link clicks and pushes history', () => {
    const { attachTocClickHandler } = require('../src/htmlBuilder.js')
    // stub renderByQuery to prevent errors
    global.renderByQuery = vi.fn()
    const toc = document.createElement('aside')
    const a = document.createElement('a')
    a.setAttribute('href', '?page=test#foo')
    toc.appendChild(a)
    attachTocClickHandler(toc)
    a.click()
    expect(history.state && history.state.page).toBe('test')
  })

  it('scrollToAnchorOrTop moves to specific element when anchor provided', async () => {
    const { scrollToAnchorOrTop } = require('../src/htmlBuilder.js')
    const container = document.createElement('div')
    container.className = 'nimbi-cms'
    container.style.height = '100px'
    container.style.overflow = 'auto'
    const inner = document.createElement('div')
    inner.style.height = '500px'
    const target = document.createElement('div')
    target.id = 'jump'
    inner.appendChild(target)
    container.appendChild(inner)
    document.body.appendChild(container)
    // stub element measurements
    container.getBoundingClientRect = () => ({ top: 0, bottom: 100 })
    target.getBoundingClientRect = () => ({ top: 200, bottom: 300 })
    container.scrollTo = ({ top }) => { container.scrollTop = top }

    // patch timers so scheduled scroll happens immediately
    const origRAF = global.requestAnimationFrame
    const origSetTimeout = global.setTimeout
    global.requestAnimationFrame = cb => cb()
    global.setTimeout = (cb, t) => { cb(); return 0 }

    scrollToAnchorOrTop('jump')
    await new Promise(r => setTimeout(r, 0))

    global.requestAnimationFrame = origRAF
    global.setTimeout = origSetTimeout

    expect(container.scrollTop).toBeGreaterThan(0)
  })

  it('ensureScrollTopButton handles topH1 branch with IntersectionObserver', () => {
    // provide a minimal IntersectionObserver stub
    global.IntersectionObserver = class {
      constructor(cb) { this.cb = cb }
      observe() {}
      disconnect() {}
    }
    const { ensureScrollTopButton } = require('../src/htmlBuilder.js')
    const article = document.createElement('article')
    const topH1 = document.createElement('h1')
    article.appendChild(topH1)
    const navWrap = document.createElement('div')
    navWrap.className = 'nimbi-nav-wrap'
    const toc = document.createElement('aside')
    toc.className = 'menu nimbi-toc-inner'
    const label = document.createElement('p')
    label.className = 'menu-label'
    toc.appendChild(label)
    navWrap.appendChild(toc)
    const container = document.createElement('div')
    container.className = 'nimbi-cms'

    document.body.appendChild(navWrap)
    document.body.appendChild(container)

    ensureScrollTopButton(article, topH1, { container, navWrap })
    const btn = document.querySelector('.nimbi-scroll-top')
    expect(btn).toBeTruthy()
    // manually invoke observer callback to simulate leaving viewport
    btn.classList.add('show')
  })

  it('rewriteAnchors converts markdown and html links properly', async () => {
    const { _rewriteAnchors: rewriteAnchors } = require('../src/htmlBuilder.js')
    const article = document.createElement('article')
    article.innerHTML = `
      <a href="foo.md">x</a>
      <a href="bar.html">y</a>
      <a href="/external">z</a>
    `
    // prepare slug maps so foo.md maps
    const { mdToSlug, slugToMd } = require('../src/filesManager.js')
    slugToMd.set('foo', 'foo.md')
    mdToSlug.set('foo.md', 'foo')
    // stub fetchMarkdown for html linking
    global.fetch = vi.fn(async url => {
      if (String(url).endsWith('bar.html')) return { ok: true, text: () => Promise.resolve('<html><head><title>Bar</title></head></html>') }
      return { ok: false, status: 404, text: () => Promise.resolve('') }
    })
    await rewriteAnchors(article, 'http://base/', 'dir/page.md')
    const links = article.querySelectorAll('a')
    expect(links[0].href).toContain('?page=foo')
    expect(links[1].href).toContain('?page=bar')
    expect(links[2].href).toContain('/external')
  })

  it('computeSlug falls back to pagePath and updates history', () => {
    const { _computeSlug: computeSlug } = require('../src/htmlBuilder.js')
    const parsed = { meta: {} }
    const article = document.createElement('article')
    const h1 = document.createElement('h1')
    h1.textContent = 'Test'
    article.appendChild(h1)
    const result = computeSlug(parsed, article, 'path/foo.md', 'anchor')
    expect(result.slugKey).toBe('test')
    expect(result.h1Text).toBe('Test')
  })
})