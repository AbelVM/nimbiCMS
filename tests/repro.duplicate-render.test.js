import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('repro: duplicate render', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.resetModules()
  })

  it('calls renderByQuery only once when clicking nav item', async () => {
    const navHtml = `<a href="/">Home</a><a href="?page=foo">Foo</a>`
    const wrap = document.createElement('div')
    const container = document.createElement('main')
    const renderByQuery = vi.fn(() => Promise.resolve())

    const nav = await import('../src/nav.js')
    await nav.buildNav(wrap, container, navHtml, 'http://base/', 'home', (k) => k, renderByQuery, false)

    const items = wrap.querySelectorAll('.navbar-start .navbar-item')
    let target = null
    for (const it of Array.from(items || [])) {
      const h = it.getAttribute('href') || ''
      if (h.indexOf('foo') !== -1) { target = it; break }
    }
    expect(target).toBeTruthy()

    target.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    // allow microtask/macrotask queue to settle
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(renderByQuery).toHaveBeenCalledTimes(1)
  })
})
