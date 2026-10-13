import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildNav } from '../../src/nav.js'
import * as slugMgr from '../../src/slugManager.js'

describe('buildNav branch-heavy interactions', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="nav-wrap"></div><main id="content"></main>'
    slugMgr.slugToMd.clear()
    slugMgr.mdToSlug.clear()
    slugMgr.allMarkdownPaths.length = 0
    slugMgr.allMarkdownPathsSet.clear()
    globalThis.buildSearchIndex = vi.fn(async () => ([
      { slug: 'alpha', title: 'Alpha title', excerpt: 'about alpha', path: 'docs/alpha.md' },
      { slug: 'beta::part', title: 'Beta title', excerpt: 'about beta', path: 'docs/beta.md', parentTitle: 'Beta parent' }
    ]))
  })

  afterEach(() => {
    delete globalThis.buildSearchIndex
    delete globalThis.buildSearchIndexWorker
    vi.restoreAllMocks()
  })

  it('builds menu/search UI and handles keyboard, burger and SPA clicks', async () => {
    const wrap = document.getElementById('nav-wrap')
    const container = document.getElementById('content')
    const renderByQuery = vi.fn()
    const pushSpy = vi.spyOn(history, 'pushState')

    const navHtml = [
      '<nav>',
      '  <a href="?page=home">Home</a>',
      '  <a href="docs/alpha.md">Alpha</a>',
      '  <a href="docs/page.html">Page Html</a>',
      '  <a href="#/beta#part">Beta Cosmetic</a>',
      '</nav>'
    ].join('')

    const out = await buildNav(
      wrap,
      container,
      navHtml,
      'http://example.com/content/',
      'home.md',
      (k) => k,
      renderByQuery,
      true,
      'eager',
      2,
      ['skip.md'],
      'none'
    )

    expect(out.navbar).toBeTruthy()
    const input = out.navbar.querySelector('#nimbi-search')
    expect(input).toBeTruthy()

    input.value = 'beta'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await new Promise((r) => setTimeout(r, 80))

    const results = out.navbar.querySelectorAll('.nimbi-search-result')
    expect(results.length).toBeGreaterThan(0)

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))

    const burger = out.navbar.querySelector('.navbar-burger')
    expect(burger).toBeTruthy()
    burger.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    const firstNavItem = out.navbar.querySelector('.navbar-start .navbar-item')
    firstNavItem.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

    const brand = out.navbar.querySelector('.navbar-brand .navbar-item')
    brand.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

    expect(pushSpy).toHaveBeenCalled()
  })
})
