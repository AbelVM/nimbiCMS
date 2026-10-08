import { describe, it, expect, vi, afterEach } from 'vitest'
import { buildNav } from '../src/nav.js'

describe('nav search branches', () => {
  afterEach(() => {
    delete globalThis.buildSearchIndex
    delete globalThis.buildSearchIndexWorker
    delete window.__nimbiResolvedIndex
    delete window.__nimbiSearchIndex
    delete window.__nimbiLiveSearchIndex
    document.body.innerHTML = ''
  })

  it('renders search results and handles result click navigation', async () => {
    const navbarWrap = document.createElement('header')
    const container = document.createElement('main')
    document.body.appendChild(navbarWrap)
    document.body.appendChild(container)

    const renderByQuery = vi.fn()
    globalThis.buildSearchIndex = vi.fn(async () => ([
      { slug: 'docs/page.md::intro', path: 'docs/page.md', title: 'Doc Page', excerpt: 'hello' }
    ]))
    globalThis.buildSearchIndexWorker = vi.fn(async () => ([]))

    const { navbar } = await buildNav(
      navbarWrap,
      container,
      '<a href="?page=home">Home</a><a href="docs/page.md">Doc</a>',
      'http://example.com/content/',
      'home',
      (k) => k,
      renderByQuery,
      true
    )

    const input = navbar.querySelector('#nimbi-search')
    expect(input).toBeTruthy()
    input.value = 'doc'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    await new Promise((r) => setTimeout(r, 250))

    const result = document.querySelector('.nimbi-search-result')
    expect(result).toBeTruthy()
    result.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(renderByQuery).toHaveBeenCalled()
  })

  it('shows the no-results state when query has no matches', async () => {
    const navbarWrap = document.createElement('header')
    const container = document.createElement('main')
    document.body.appendChild(navbarWrap)
    document.body.appendChild(container)

    globalThis.buildSearchIndex = vi.fn(async () => ([
      { slug: 'alpha', path: 'alpha.md', title: 'Alpha', excerpt: 'A' }
    ]))
    globalThis.buildSearchIndexWorker = vi.fn(async () => ([]))

    const { navbar } = await buildNav(
      navbarWrap,
      container,
      '<a href="?page=home">Home</a>',
      'http://example.com/content/',
      'home',
      (k) => k,
      () => {},
      true
    )

    const input = navbar.querySelector('#nimbi-search')
    input.value = 'zzzz-not-found'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    await new Promise((r) => setTimeout(r, 250))

    expect(document.querySelector('.nimbi-search-no-results')).toBeTruthy()
  })

  it('uses the worker index without rebuilding it on the main thread', async () => {
    const navbarWrap = document.createElement('header')
    const container = document.createElement('main')
    document.body.appendChild(navbarWrap)
    document.body.appendChild(container)

    globalThis.buildSearchIndexWorker = vi.fn(async () => ([
      { slug: 'function-addhook', path: 'docs/hookManager/functions/addHook.md', title: 'addHook' },
      { slug: 'hook-manager', path: 'docs/hookManager/README.md', title: 'Hook Manager' }
    ]))
    globalThis.buildSearchIndex = vi.fn(async () => ([
      { slug: 'function-addhook', path: 'docs/hookManager/functions/addHook.md', title: 'addHook' },
      { slug: 'hook-manager', path: 'docs/hookManager/README.md', title: 'Hook Manager' }
    ]))

    const { navbar } = await buildNav(
      navbarWrap,
      container,
      '<a href="?page=home">Home</a>',
      'http://example.com/content/',
      'home',
      (k) => k,
      () => {},
      true,
      'lazy',
      3
    )

    const input = navbar.querySelector('#nimbi-search')
    input.value = 'hook'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await new Promise((r) => setTimeout(r, 250))

    expect(globalThis.buildSearchIndex).not.toHaveBeenCalled()
    expect(document.querySelectorAll('.nimbi-search-result').length).toBeGreaterThanOrEqual(2)
    expect(document.body.textContent).toContain('addHook')
  })

  it('ranks exact and title-prefix matches before excerpt matches', async () => {
    const navbarWrap = document.createElement('header')
    const container = document.createElement('main')
    document.body.appendChild(navbarWrap)
    document.body.appendChild(container)

    globalThis.buildSearchIndexWorker = vi.fn(async () => ([
      { slug: 'excerpt', title: 'Reference', excerpt: 'Hook details' },
      { slug: 'prefix', title: 'Hook guide', excerpt: '' },
      { slug: 'exact', title: 'Hook', excerpt: '' }
    ]))

    const { navbar } = await buildNav(
      navbarWrap,
      container,
      '<a href="?page=home">Home</a>',
      'http://example.com/content/',
      'home',
      (k) => k,
      () => {},
      true,
      'lazy',
      3
    )

    const input = navbar.querySelector('#nimbi-search')
    input.value = 'hook'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await new Promise((r) => setTimeout(r, 250))

    const titles = [...document.querySelectorAll('.nimbi-search-result div')]
      .map((element) => element.textContent)
    expect(titles.slice(0, 3)).toEqual(['Hook', 'Hook guide', 'Reference'])
  })
})
