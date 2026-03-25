import { describe, it, expect } from 'vitest'
import { buildNav } from '../../src/nav.js'

describe('buildNav simple', () => {
  it('builds a navbar element and returns linkEls', async () => {
    const navbarWrap = document.createElement('div')
    const container = document.createElement('main')
    const navHtml = '<nav><a href="page.md">Page</a></nav>'
    const res = await buildNav(navbarWrap, container, navHtml, 'https://example.com/content/', 'home', (k) => k, async () => {}, false)
    expect(res).toBeTruthy()
    expect(res.navbar).toBeTruthy()
    expect(res.linkEls).toBeTruthy()
  })
})
