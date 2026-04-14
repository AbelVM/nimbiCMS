import { describe, it, expect, vi, afterEach } from 'vitest'
import { buildNav } from '../src/nav.js'

describe('nav search branches', () => {
  afterEach(() => {
    delete globalThis.buildSearchIndex
    delete globalThis.buildSearchIndexWorker
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
})
