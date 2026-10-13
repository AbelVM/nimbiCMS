import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { preMapMdSlugs, preScanHtmlSlugs, rewriteAnchors } from '../src/htmlBuilder.js'
import { allMarkdownPaths, allMarkdownPathsSet, mdToSlug, setFetchMarkdown, setNotFoundPage, slugToMd } from '../src/slugManager.js'

function a(href) {
  const el = document.createElement('a')
  el.setAttribute('href', href)
  return el
}

describe('htmlBuilder probe branches', () => {
  let oldFetchMarkdown

  beforeEach(() => {
    try { slugToMd.clear() } catch (e) {}
    try { mdToSlug.clear() } catch (e) {}
    try { allMarkdownPathsSet.clear() } catch (e) {}
    try { allMarkdownPaths.splice(0, allMarkdownPaths.length) } catch (e) {}
    oldFetchMarkdown = null
  })

  afterEach(() => {
    try { if (oldFetchMarkdown) setFetchMarkdown(oldFetchMarkdown) } catch (e) {}
  })

  it('preScanHtmlSlugs creates basename mappings when probing is disabled', async () => {
    // Keep slug maps empty so _hbShouldProbe returns false.
    setNotFoundPage(null)
    await preScanHtmlSlugs([a('docs/guide'), a('deep/path/page.html')], 'http://example.com/content/')
    setNotFoundPage('_404.md')

    expect(slugToMd.get('guide')).toBe('docs/guide.html')
    expect(slugToMd.get('page')).toBe('deep/path/page.html')
    expect(mdToSlug.get('deep/path/page.html')).toBe('page')
  })

  it('preScanHtmlSlugs probes HTML titles/h1 when probing is enabled', async () => {
    slugToMd.set('seed', 'seed.md')
    const old = setFetchMarkdown(async (path) => {
      if (String(path).includes('alpha.html')) {
        return { raw: '<html><head><title>Alpha Title</title></head><body></body></html>' }
      }
      return { raw: '<html><body><h1>Beta Heading</h1></body></html>' }
    })
    oldFetchMarkdown = old

    await preScanHtmlSlugs([a('alpha.html'), a('nested/beta.html')], 'http://example.com/content/')

    expect(slugToMd.get('alpha-title')).toBe('alpha.html')
    expect(slugToMd.get('beta-heading')).toBe('nested/beta.html')
  })

  it('preMapMdSlugs maps title from fetched markdown heading', async () => {
    slugToMd.set('seed', 'seed.md')
    const old = setFetchMarkdown(async (path) => {
      if (String(path).includes('docs/one.md')) return { raw: '# One Title\ntext' }
      return { raw: '# Two Title\ntext' }
    })
    oldFetchMarkdown = old

    await preMapMdSlugs([a('docs/one.md#h'), a('docs/two.md')], 'http://example.com/content/')

    expect(slugToMd.get('one-title')).toBe('docs/one.md')
    expect(slugToMd.get('two-title')).toBe('docs/two.md')
  })

  it('preMapMdSlugs uses basename mapping branch when available', async () => {
    slugToMd.set('seed', 'seed.md')
    slugToMd.set('topic', 'docs/topic.md')

    await preMapMdSlugs([a('docs/topic.md')], 'http://example.com/content/')

    expect(mdToSlug.get('docs/topic.md')).toBe('topic')
    expect(allMarkdownPathsSet.has('docs/topic.md')).toBe(true)
  })

  it('rewriteAnchors handles mixed link styles and rewrites internal docs links', async () => {
    slugToMd.set('seed', 'seed.md')
    mdToSlug.set('docs/guide.md', 'guide-title')
    const old = setFetchMarkdown(async (path) => {
      if (String(path).includes('child.md')) return { raw: '# Child Heading\n' }
      if (String(path).includes('page.html')) return { raw: '<html><head><title>Up Page</title></head></html>' }
      return { raw: '# Guide Title\n' }
    })
    oldFetchMarkdown = old

    const article = document.createElement('article')
    article.innerHTML = [
      '<a id="a1" href="#local">local</a>',
      '<a id="a2" href="https://example.org">ext</a>',
      '<a id="a3" href="guide.md#sec">guide</a>',
      '<a id="a4" href="./child.md">child</a>',
      '<a id="a5" href="../up/page.html">up</a>'
    ].join('')

    await rewriteAnchors(article, 'http://example.com/content/', 'docs/current/page.md')

    expect(article.querySelector('#a1').getAttribute('href')).toBe('#local')
    expect(article.querySelector('#a2').getAttribute('href')).toContain('https://example.org')
    expect(article.querySelector('#a3').getAttribute('href')).toContain('page=guide-title')
    expect(article.querySelector('#a4').getAttribute('href')).toContain('page=child-heading')
    expect(article.querySelector('#a5').getAttribute('href')).toContain('page=up-page')
  })
})
