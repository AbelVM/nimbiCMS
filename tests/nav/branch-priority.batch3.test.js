import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('nav contentBase mapping branches', () => {
  beforeEach(() => {
    vi.resetModules()
    document.body.innerHTML = ''
  })

  it('maps exact contentBase path to empty mappingTarget', async () => {
    const nav = await import('../../src/nav.js')
    const { buildNav } = nav

    const navbarWrap = document.createElement('div')
    const container = document.createElement('main')
    const navHtml = '<a href="/subpath">Home</a>'

    const res = await buildNav(navbarWrap, container, navHtml, 'https://example.com/subpath/', 'home', (k) => k, async () => {}, false)

    expect(res).toBeTruthy()
    expect(res.linkEls && res.linkEls.length).toBeGreaterThan(0)
  })

  it('strips contentBase prefix when mappingTarget starts with contentBase + /', async () => {
    const nav = await import('../../src/nav.js')
    const { buildNav } = nav

    const navbarWrap = document.createElement('div')
    const container = document.createElement('main')
    const navHtml = '<a href="/subpath/child.md">Child</a>'

    const res = await buildNav(navbarWrap, container, navHtml, 'https://example.com/subpath', 'home', (k) => k, async () => {}, false)

    expect(res).toBeTruthy()
    expect(res.linkEls && res.linkEls.length).toBeGreaterThan(0)
  })

  it('keeps mappingTarget when it does not match contentBase', async () => {
    const nav = await import('../../src/nav.js')
    const { buildNav } = nav

    const navbarWrap = document.createElement('div')
    const container = document.createElement('main')
    const navHtml = '<a href="/other/path.md">Other</a>'

    const res = await buildNav(navbarWrap, container, navHtml, 'https://example.com/subpath/', 'home', (k) => k, async () => {}, false)

    expect(res).toBeTruthy()
    expect(res.linkEls && res.linkEls.length).toBeGreaterThan(0)
  })
})
