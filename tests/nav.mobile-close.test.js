import { describe, it, expect, beforeEach } from 'vitest'
import { buildNav } from '../src/nav.js'
import { JSDOM } from 'jsdom'

// Minimal DOM setup helper used by other tests in the suite
function createContainer() {
  const dom = new JSDOM(`<!doctype html><html><body><div id="app"></div></body></html>`, { url: 'http://localhost/' })
  const prev = {
    window: global.window,
    document: global.document,
    HTMLElement: global.HTMLElement,
    Node: global.Node
  }
  global.__prevDomGlobals = prev
  global.window = dom.window
  global.document = dom.window.document
  global.HTMLElement = dom.window.HTMLElement
  global.Node = dom.window.Node
  return dom
}

describe('mobile menu behavior', () => {
  beforeEach(() => {
    // reset globals if previous tests modified them
    try {
      if (global.__prevDomGlobals) {
        const p = global.__prevDomGlobals
        global.window = p.window
        global.document = p.document
        global.HTMLElement = p.HTMLElement
        global.Node = p.Node
        delete global.__prevDomGlobals
      } else {
        delete global.window
        delete global.document
        delete global.HTMLElement
        delete global.Node
      }
    } catch (e) { /* ignore */ }
  })

  afterEach(() => {
    try {
      if (global.__prevDomGlobals) {
        const p = global.__prevDomGlobals
        global.window = p.window
        global.document = p.document
        global.HTMLElement = p.HTMLElement
        global.Node = p.Node
        delete global.__prevDomGlobals
      } else {
        delete global.window
        delete global.document
        delete global.HTMLElement
        delete global.Node
      }
    } catch (e) { /* ignore */ }
  })

  it('closes the hamburger/menu when clicking outside', async () => {
    const dom = createContainer()
    const navbarWrap = dom.window.document.createElement('header')
    const container = dom.window.document.createElement('main')

    // minimal navigation markup: one brand link and one nav link
    const navHtml = `<a href="?page=_home">Home</a><a href="?page=about.md">About</a>`

    const result = await buildNav(navbarWrap, container, navHtml, '/content/', '_home', (s)=>s, () => {}, true, 'lazy')
    const { navbar } = result
    dom.window.document.body.appendChild(navbar)

    const burger = dom.window.document.querySelector('.navbar-burger')
    const menu = dom.window.document.getElementById(burger.dataset.target)

    // Sanity: menu exists and burger starts inactive
    expect(burger).toBeTruthy()
    expect(menu).toBeTruthy()
    expect(burger.classList.contains('is-active')).toBe(false)

    // Simulate opening the burger
    burger.classList.add('is-active')
    menu.classList.add('is-active')
    burger.setAttribute('aria-expanded', 'true')
    expect(burger.classList.contains('is-active')).toBe(true)

    // Simulate clicking outside the navbar
    const outside = dom.window.document.createElement('div')
    dom.window.document.body.appendChild(outside)
    const ev = new dom.window.MouseEvent('click', { bubbles: true, cancelable: true })
    outside.dispatchEvent(ev)

    // After the outside click handler runs, the burger/menu should be closed
    expect(burger.classList.contains('is-active')).toBe(false)
    expect(menu.classList.contains('is-active')).toBe(false)
    expect(burger.getAttribute('aria-expanded')).toBe('false')
  })
})
