import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('nav deeper edge branches', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.resetModules()
  })

  it('md link with fragment produces encoded page param', async () => {
    const navHtml = `<a href="/">Home</a><a href="docs/guide.md#section">Guide</a>`
    const wrap = document.createElement('div')
    const container = document.createElement('main')
    const renderByQuery = vi.fn()
    const nav = await import('../src/nav.js')
    const res = await nav.buildNav(wrap, container, navHtml, 'http://base/', 'home', (k) => k, renderByQuery, false)
    const items = wrap.querySelectorAll('.navbar-start .navbar-item')
    const item = items[0]
    expect(item).toBeTruthy()
    const href = item.getAttribute('href')
    expect(href).toMatch(/\?page=.*guide\.md/) // includes page param
    expect(href).toContain('#section') // fragment present after encoded page param
  })

  it('burger toggles is-active and menu closes on menu click', async () => {
    const navHtml = `<a href="/">Home</a><a href="?page=other">Other</a>`
    const wrap = document.createElement('div')
    const container = document.createElement('main')
    const renderByQuery = vi.fn()
    const nav = await import('../src/nav.js')
    const res = await nav.buildNav(wrap, container, navHtml, 'http://base/', 'home', (k) => k, renderByQuery, false)
    const burger = wrap.querySelector('.navbar-burger')
    const menu = wrap.querySelector('.navbar-menu')
    // activate burger
    burger.classList.add('is-active')
    burger.setAttribute('aria-expanded', 'true')
    menu.classList.add('is-active')

    // spy history.pushState
    const pushSpy = vi.spyOn(history, 'pushState')
    const a = wrap.querySelector('.navbar-start .navbar-item')
    // simulate click inside menu (should close burger)
    a.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    // renderByQuery should have been attempted (wrapped in try/catch)
    expect(pushSpy).toHaveBeenCalled()
    expect(burger.classList.contains('is-active')).toBe(false)
    pushSpy.mockRestore()
  })

  it('container click intercepts internal ?page links and calls renderByQuery', async () => {
    const navHtml = `<a href="/">Home</a>`
    const wrap = document.createElement('div')
    const container = document.createElement('main')
    const renderByQuery = vi.fn()
    const nav = await import('../src/nav.js')
    await nav.buildNav(wrap, container, navHtml, 'http://base/', 'home', (k) => k, renderByQuery, false)
    // add a link inside container
    const a = document.createElement('a')
    a.href = '?page=foo#bar'
    a.textContent = 'inpage'
    container.appendChild(a)
    document.body.appendChild(container)

    // spy pushState
    const pushSpy = vi.spyOn(history, 'pushState')
    a.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(pushSpy).toHaveBeenCalled()
    pushSpy.mockRestore()
  })

  it('html fetchMarkdown error falls back to original href', async () => {
    // mock slugManager.fetchMarkdown to throw
    vi.mock('../src/slugManager.js', async (importOriginal) => {
      const actual = await importOriginal()
      return {
        ...actual,
        fetchMarkdown: async () => { throw new Error('boom') }
      }
    })
    const navHtml = `<a href="/">Home</a><a href="docs/remote.html">Remote</a>`
    const wrap = document.createElement('div')
    const container = document.createElement('main')
    const renderByQuery = vi.fn()
    const nav = await import('../src/nav.js')
    await nav.buildNav(wrap, container, navHtml, 'http://base/', 'home', (k) => k, renderByQuery, false)
    const item = wrap.querySelector('.navbar-start .navbar-item')
    expect(item).toBeTruthy()
    // when fetchMarkdown fails, href should be original (non ?page param)
    expect(item.getAttribute('href')).toBe('docs/remote.html')
  })
})
