import { describe, it, expect, beforeEach, vi } from 'vitest'
import { preScanHtmlSlugs, preMapMdSlugs, _parseHtml, _parseMarkdown } from '../src/htmlBuilder.js'
import { slugify, slugToMd, mdToSlug } from '../src/filesManager.js'
import * as fm from '../src/filesManager.js'
import initCMS from '../src/nimbi-cms.js'

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

  it('preScanHtmlSlugs normalizes extension-less hrefs and maps them with .html', async () => {
    const anchors = [makeAnchor('foo')] // no .html suffix
    const spy = vi.spyOn(fm, 'fetchMarkdown').mockResolvedValue({ raw: '<html><head><title>Foo</title></head></html>' })
    await preScanHtmlSlugs(anchors, '/base/')
    spy.mockRestore()
    expect(slugToMd.has('foo')).toBe(true)
    expect(slugToMd.get('foo')).toBe('foo.html')
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

  it('scrollToAnchorOrTop moves to a specific anchor within the container', async () => {
    const container = document.createElement('div')
    container.className = 'nimbi-cms'
    container.style.height = '50px'
    container.style.overflow = 'auto'
    const inner = document.createElement('div')
    inner.style.height = '1000px'
    const target = document.createElement('div')
    target.id = 'foo'
    target.style.marginTop = '300px'
    inner.appendChild(target)
    container.appendChild(inner)
    document.body.appendChild(container)

    // spy on scrollTo to ensure it gets called with some value
    const scrollSpy = vi.fn()
    container.scrollTo = scrollSpy

    // sanity check: target offset is greater than initial scrollTop
    expect(container.contains(target)).toBe(true)
    container.scrollTop = 0
    const { scrollToAnchorOrTop } = require('../src/htmlBuilder.js')
    expect(document.querySelector('.nimbi-cms')).toBe(container)
    // patch timers so the deferred doScroll runs immediately
    const origRAF = global.requestAnimationFrame
    const origSetTimeout = global.setTimeout
    global.requestAnimationFrame = cb => cb()
    global.setTimeout = (cb, t) => { cb(); return 0 }

    scrollToAnchorOrTop('foo')

    // restore originals
    global.requestAnimationFrame = origRAF
    global.setTimeout = origSetTimeout

    // now the spy should have been called synchronously
    expect(scrollSpy).toHaveBeenCalled()
  })
})