import { describe, it, expect, vi } from 'vitest'
import { buildNav } from '../../src/nav.js'

describe('buildNav click handling', () => {
  it('handles menu anchor clicks with ?page= param and calls history.pushState', async () => {
    const navbarWrap = document.createElement('div')
    const container = document.createElement('main')
    const navHtml = '<nav><a href="?page=testpage">Test</a></nav>'
    const pushSpy = vi.spyOn(history, 'pushState')
    const res = await buildNav(navbarWrap, container, navHtml, 'https://example.com/', 'home', (k) => k, async () => {}, false)
    const a = res.navbar.querySelector('a')
    expect(a).toBeTruthy()
    a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    expect(pushSpy).toHaveBeenCalled()
    pushSpy.mockRestore()
  })
})
