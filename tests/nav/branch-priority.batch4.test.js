import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('seedNavSlugMappings contentBase branch coverage', () => {
  beforeEach(() => {
    vi.resetModules()
    document.body.innerHTML = ''
  })

  it('handles mappingTarget equal to contentBase pathname (mt === cbPath)', async () => {
    const nav = await import('../../src/nav.js')
    const { buildNav } = nav

    const navbarWrap = document.createElement('div')
    const container = document.createElement('main')
    const navHtml = '<a href="/subpath">Home</a>'

    const res = await buildNav(navbarWrap, container, navHtml, 'https://example.com/subpath', 'home', (k) => k, async () => {}, false)
    expect(res).toBeTruthy()
  })

  it('strips contentBase prefix when mappingTarget starts with contentBase + /', async () => {
    const nav = await import('../../src/nav.js')
    const { buildNav } = nav

    const navbarWrap = document.createElement('div')
    const container = document.createElement('main')
    const navHtml = '<a href="/subpath/child.md">Child</a>'

    const res = await buildNav(navbarWrap, container, navHtml, 'https://example.com/subpath', 'home', (k) => k, async () => {}, false)
    expect(res).toBeTruthy()
  })

  it('no-op when contentBase pathname is empty', async () => {
    const nav = await import('../../src/nav.js')
    const { buildNav } = nav

    const navbarWrap = document.createElement('div')
    const container = document.createElement('main')
    const navHtml = '<a href="/other/path.md">Other</a>'

    const res = await buildNav(navbarWrap, container, navHtml, 'https://example.com/', 'home', (k) => k, async () => {}, false)
    expect(res).toBeTruthy()
  })
})
