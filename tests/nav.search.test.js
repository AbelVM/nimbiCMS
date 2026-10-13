import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock slugManager to control buildSearchIndex behavior
vi.mock('../src/slugManager.js', () => {
  const slugToMd = new Map()
  const mdToSlug = new Map()
  return {
    slugify: (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9\- ]/g, '').replace(/ /g, '-'),
    slugToMd,
    mdToSlug,
    searchIndex: [],
    fetchMarkdown: vi.fn(),
    buildSearchIndex: vi.fn().mockResolvedValue([])
  }
})

import * as nav from '../src/nav.js'
import * as slugMgr from '../src/slugManager.js'

describe('nav search and interaction branches', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  it('eager search loads index and shows results on input', async () => {
    slugMgr.buildSearchIndex.mockResolvedValue([{ title: 'FindMe', slug: 'find' }])

    const navbarWrap = document.createElement('header')
    const container = document.createElement('main')
    document.body.appendChild(navbarWrap)
    document.body.appendChild(container)

    const res = await nav.buildNav(navbarWrap, container, '<a href="?page=home">Root</a>', 'http://base/', 'home', (s)=>s, () => {}, true, 'eager')
    const input = document.querySelector('#nimbi-search')
    expect(input).toBeTruthy()
    input.value = 'find'
    // trigger input and wait for debounce
    input.dispatchEvent(new Event('input', { bubbles: true }))
    // give tasks a tick
    await new Promise(r => setTimeout(r, 120))
    const results = document.getElementById('nimbi-search-results')
    // showResults should have added content
    expect(results).toBeTruthy()
    expect(results.getAttribute('aria-busy')).toBe('false')
    // ensure search result anchors use canonical `?page=` hrefs
    const firstAnchor = results.querySelector('a[href]')
    expect(firstAnchor).toBeTruthy()
    expect(firstAnchor.getAttribute('href')).toContain('?page=find')
  })

  it('exposes eager index loading state to assistive technology', async () => {
    let resolveIndex
    slugMgr.buildSearchIndex.mockReturnValue(new Promise((resolve) => {
      resolveIndex = resolve
    }))
    const navbarWrap = document.createElement('header')
    const container = document.createElement('main')
    document.body.append(navbarWrap, container)

    await nav.buildNav(navbarWrap, container, '<a href="?page=home">Root</a>', 'http://base/', 'home', (s) => s, () => {}, true, 'eager')
    const control = document.querySelector('#nimbi-search').parentElement
    const results = document.getElementById('nimbi-search-results')
    expect(control.getAttribute('aria-busy')).toBe('true')
    expect(results.getAttribute('aria-busy')).toBe('true')

    resolveIndex([])
    await Promise.resolve()
    await Promise.resolve()
    expect(control.getAttribute('aria-busy')).toBe('false')
    expect(results.getAttribute('aria-busy')).toBe('false')
  })

  it('menu click navigates and closes burger', async () => {
    const navbarWrap = document.createElement('header')
    const container = document.createElement('main')
    document.body.appendChild(navbarWrap)
    document.body.appendChild(container)
    const renderSpy = vi.fn()
    const navHtml = '<a href="?page=home">Root</a><a href="?page=target">Target</a>'
    const res = await nav.buildNav(navbarWrap, container, navHtml, '/content/', 'home', (s)=>s, renderSpy, false)
    const burger = res.navbar.querySelector('.navbar-burger')
    const menu = res.navbar.querySelector('#nimbi-navbar-menu')
    // activate burger
    burger.click()
    expect(burger.classList.contains('is-active')).toBe(true)
    // find target link in menu and click it
    const link = res.navbar.querySelector('.navbar-start .navbar-item[href*="target"]')
    expect(link).toBeTruthy()
    // simulate click event originating from menu
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    // renderByQuery should have been called
    expect(renderSpy).toHaveBeenCalled()
    // burger menu should be closed
    expect(burger.classList.contains('is-active')).toBe(false)
  })
})
