import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

let mdResponse = { raw: '<html><body></body></html>' }

vi.mock('../src/htmlBuilder.js', () => ({
  preScanHtmlSlugs: () => {},
  preMapMdSlugs: () => {},
  createNavTree: (t, arr) => arr
}))

vi.mock('../src/slugManager.js', () => ({
  slugify: (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  slugToMd: new Map(),
  mdToSlug: new Map(),
  fetchMarkdown: async (p, base) => mdResponse
}))

import { buildNav } from '../src/nav.js'

describe('navbar logo option', () => {
  let root, container
  beforeEach(() => {
    document.body.innerHTML = ''
    root = document.createElement('header')
    container = document.createElement('main')
    document.body.appendChild(root)
    document.body.appendChild(container)
    // clear head
    document.head.innerHTML = ''
  })
  afterEach(() => {
    vi.restoreAllMocks()
    mdResponse = { raw: '<html><body></body></html>' }
  })

  it('uses provided image path', async () => {
    const navHtml = `<nav><a href="?page=home">Home</a></nav>`
    const res = await buildNav(root, container, navHtml, 'http://example.com/', 'home', (k)=>k, () => {}, false, 'eager', 1, undefined, '/assets/logo.png')
    const img = res.navbar.querySelector('img.nimbi-navbar-logo')
    expect(img).toBeTruthy()
    expect(img.getAttribute('src')).toMatch(/\/assets\/logo.png$/)
    expect(img.getAttribute('title')).toBe('home')
  })

  it('falls back to favicon when requested', async () => {
    document.head.innerHTML = '<link rel="icon" href="/assets/favicon.png">'
    const navHtml = `<nav><a href="?page=home">Home</a></nav>`
    const res = await buildNav(root, container, navHtml, 'http://example.com/', 'home', (k)=>k, () => {}, false, 'eager', 1, undefined, 'favicon')
    const img = res.navbar.querySelector('img.nimbi-navbar-logo')
    expect(img).toBeTruthy()
    expect(img.getAttribute('src')).toMatch(/\/assets\/favicon.png$/)
    expect(img.getAttribute('title')).toBe('home')
  })

  it('copy-first extracts first image from home page', async () => {
    mdResponse = { raw: '<html><body><img src="images/first.png"/></body></html>' }
    const navHtml = `<nav><a href="?page=home">Home</a></nav>`
    const res = await buildNav(root, container, navHtml, 'http://example.com/', 'home', (k)=>k, () => {}, false, 'eager', 1, undefined, 'copy-first')
    const img = res.navbar.querySelector('img.nimbi-navbar-logo')
    expect(img).toBeTruthy()
    expect(img.getAttribute('src')).toMatch(/images\/first.png$/)
    expect(img.getAttribute('title')).toBe('home')
  })

  it('move-first sets data-nimbi-logo-moved attribute', async () => {
    mdResponse = { raw: '<html><body><img src="images/first.png"/></body></html>' }
    const navHtml = `<nav><a href="?page=home">Home</a></nav>`
    const res = await buildNav(root, container, navHtml, 'http://example.com/', 'home', (k)=>k, () => {}, false, 'eager', 1, undefined, 'move-first')
    const img = res.navbar.querySelector('img.nimbi-navbar-logo')
    expect(img).toBeTruthy()
    expect(document.documentElement.getAttribute('data-nimbi-logo-moved')).toBeTruthy()
    expect(document.documentElement.getAttribute('data-nimbi-logo-moved')).toMatch(/images\/first.png$/)
    expect(img.getAttribute('title')).toBe('home')
  })
})
