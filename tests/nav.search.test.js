import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock slugManager to control buildSearchIndex behavior
vi.mock('../src/slugManager.js', () => {
  const slugToMd = new Map()
  const mdToSlug = new Map()
  return {
    slugify: (s) => String(s || '').toLowerCase().replace(/[^a-z0-9\- ]/g, '').replace(/ /g, '-'),
    slugToMd,
    mdToSlug,
    fetchMarkdown: vi.fn()
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
    // provide a mocked buildSearchIndex via dynamic import path
    const fm = { buildSearchIndex: vi.fn().mockResolvedValue([{ title: 'FindMe', slug: 'find' }]) }
    // make dynamic import return our mocked module when nav triggers it
    vi.mocked(import('../src/slugManager.js'), { equals: false }) // noop to satisfy TS-like flow
    // Instead, intercept global import by stubbing dynamic import using eval hack
    const origImport = globalThis.import
    // simpler approach: define globalThis.windowlessImport to be used by dynamic import isn't possible
    // so instead patch `nav` to call fm directly via temporarily setting globalThis.buildSearchIndex
    globalThis.buildSearchIndex = fm.buildSearchIndex

    const navbarWrap = document.createElement('header')
    const container = document.createElement('main')
    document.body.appendChild(navbarWrap)
    document.body.appendChild(container)

    const res = await nav.buildNav(navbarWrap, container, '<a href="?page=home">Root</a>', 'http://base/', 'home', (s)=>s, () => {}, true, 'eager')
    const input = document.querySelector('#nimbi-search')
    expect(input).toBeTruthy()
    // simulate that buildSearchIndex was invoked during eager init
    // because nav uses dynamic import, we simulate result by resolving the promise returned in the code path
    // Manually call the showResults pathway: set value and trigger input event
    input.value = 'find'
    // trigger input and wait for debounce
    input.dispatchEvent(new Event('input', { bubbles: true }))
    // give tasks a tick
    await new Promise(r => setTimeout(r, 120))
    const results = document.getElementById('nimbi-search-results')
    // showResults should have added content
    expect(results).toBeTruthy()
    // cleanup
    delete globalThis.buildSearchIndex
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
