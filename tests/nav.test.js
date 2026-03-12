import { describe, it, expect, vi, beforeEach } from 'vitest'


import { buildNav } from '../src/nav.js'

function makeContainer() {
  const div = document.createElement('div')
  document.body.appendChild(div)
  return div
}

describe('nav module', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('constructs navbar DOM and wires click callback', async () => {
    const navWrap = makeContainer()
    const container = makeContainer()
    const navHtml = '<a href="?page=foo.md">Foo</a><a href="?page=bar.md">Bar</a>'
    const renderSpy = vi.fn()
    // use absolute URL for contentBase to avoid URL parsing errors
    const { navbar, linkEls } = await buildNav(navWrap, container, navHtml, 'http://example.com/base/', '_home.md', s => s, renderSpy, false, 'eager')

    expect(navbar).toBeInstanceOf(HTMLElement)
    expect(linkEls.length).toBe(2)

    const secondLink = navbar.querySelector('a[href*="bar.md"]')
    expect(secondLink).toBeTruthy()
    secondLink.click()
    expect(renderSpy).toHaveBeenCalled()
  })

  it('does not render search input when searchIndexMode is off', async () => {
    const navWrap = makeContainer();
    const container = makeContainer();
    const navHtml = '<a href="?page=foo.md">Foo</a>';
    const renderSpy = vi.fn();
    const { navbar } = await buildNav(navWrap, container, navHtml, 'http://example.com/base/', '_home.md', s => s, renderSpy, true, 'off');
    const search = navbar.querySelector('input#nimbi-search');
    expect(search).toBeNull();
  });

  it('does not render search input when effectiveSearchEnabled is false', async () => {
    const navWrap = makeContainer();
    const container = makeContainer();
    const navHtml = '<a href="?page=foo.md">Foo</a>';
    const renderSpy = vi.fn();
    const { navbar } = await buildNav(navWrap, container, navHtml, 'http://example.com/base/', '_home.md', s => s, renderSpy, false, 'eager');
    const search = navbar.querySelector('input#nimbi-search');
    expect(search).toBeNull();
  });

  it('search input is enabled once eager index resolves', async () => {
    // stub fetch so buildSearchIndex can complete without network
    global.fetch = vi.fn(async url => {
      return { ok: true, text: () => Promise.resolve('') }
    })
    const navWrap = makeContainer()
    const container = makeContainer()
    const navHtml = '<a href="?page=foo.md">Foo</a>'
    const renderSpy = vi.fn()
    const { navbar } = await buildNav(navWrap, container, navHtml, 'http://example.com/base/', '_home.md', s => s, renderSpy, true, 'eager')
    const search = navbar.querySelector('input#nimbi-search')
    expect(search).toBeInstanceOf(HTMLInputElement)
    // initially disabled while index runs
    expect(search.disabled).toBe(true)
    // allow searchIndexPromise to settle (may involve async IO)
    await new Promise(r => setTimeout(r, 50))
    // after promise finally-handler, it should be enabled
    expect(search.disabled).toBe(false)
  })

  it('brand defaults to home when no first link provided', async () => {
    const navWrap = makeContainer()
    const container = makeContainer()
    const renderSpy = vi.fn()
    const { navbar } = await buildNav(navWrap, container, '', 'http://example.com/base/', 'home.md', s => s, renderSpy, false, 'eager')
    const brand = navbar.querySelector('.navbar-brand .navbar-item')
    expect(brand).toBeTruthy()
    expect(brand.getAttribute('href')).toContain('home.md')
  })
})