import { describe, it, expect, beforeEach } from 'vitest'
import { createNavTree, rewriteAnchors } from '../src/htmlBuilder.js'
import { buildNav } from '../src/nav.js'
import { mdToSlug, slugToMd } from '../src/slugManager.js'

describe('canonical links regression', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    // clear slug maps to avoid cross-test pollution
    try {
      mdToSlug.clear()
      slugToMd.clear()
    } catch (e) {
      // ignore if not present
    }
  })

  it('createNavTree emits canonical ?page= hrefs', () => {
    const t = k => (k === 'navigation' ? 'Nav' : k)
    const tree = [
      { path: 'home', name: 'Home' },
      { path: 'about', name: 'About' }
    ]

    const nav = createNavTree(t, tree)
    const anchors = nav.querySelectorAll('a')
    expect(anchors.length).toBe(2)
    expect(anchors[0].getAttribute('href')).toBe('?page=home')
    expect(anchors[1].getAttribute('href')).toBe('?page=about')
  })

  it('rewriteAnchors converts internal markdown links to canonical ?page=', async () => {
    // ensure mapping exists so rewriteAnchors doesn't fetch
    mdToSlug.set('foo.md', 'foo-slug')

    const article = document.createElement('div')
    const a = document.createElement('a')
    a.setAttribute('href', 'foo.md#section')
    article.appendChild(a)

    await rewriteAnchors(article, 'http://localhost/content/', '')

    expect(a.getAttribute('href')).toBe('?page=foo-slug#section')
  })

  it('buildNav search results produce canonical hrefs', async () => {
    // stub global builder to avoid dynamic import
    globalThis.buildSearchIndex = async () => [
      { title: 'FindMe', slug: 'find' }
    ]

    const navbarWrap = document.createElement('header')
    const container = document.createElement('main')
    document.body.appendChild(navbarWrap)
    document.body.appendChild(container)

    await buildNav(
      navbarWrap,
      container,
      '<a href="?page=home">Root</a>',
      'http://localhost/content/',
      'home',
      s => s,
      () => {},
      true,
      'eager'
    )

    const input = document.querySelector('#nimbi-search')
    expect(input).toBeTruthy()
    input.value = 'find'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    // wait briefly for search debounce/processing
    await new Promise(r => setTimeout(r, 150))

    const results = document.getElementById('nimbi-search-results')
    expect(results).toBeTruthy()
    // Find any anchor rendered inside the results panel
    const first = results.querySelector('a.nimbi-search-result, a.panel-block, a')
    expect(first).toBeTruthy()
    expect(first.getAttribute('href')).toContain('?page=find')

    delete globalThis.buildSearchIndex
  })
})
