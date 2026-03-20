import { describe, it, expect, beforeEach, vi } from 'vitest'

import * as nav from '../src/nav.js'

describe('navigation click behavior', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    try { history.replaceState(null, '', '/') } catch (e) {}
    try { location.hash = '' } catch (e) {}
    vi.resetModules()
  })

  it('navbar item with ?page=slug#anchor pushes cosmetic fragment and state', async () => {
    const navHtml = `<a href="?page=foo#bar">Foo</a>`
    const wrap = document.createElement('div')
    const container = document.createElement('main')
    document.body.appendChild(wrap)
    document.body.appendChild(container)
    const renderByQuery = vi.fn()

    // buildNav will wire click handlers; use contentBase='/' and homePage='home'
    const result = await nav.buildNav(wrap, container, navHtml, '/', 'home', (k) => k, renderByQuery, false)

    // find the first navbar item and click it
    let a = wrap.querySelector('.navbar-start .navbar-item')
    if (!a) a = document.querySelector('.navbar-item')
    if (!a) a = document.querySelector('a[href*="page=foo"]')
    expect(a).toBeTruthy()

    a.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(location.hash).toBe('#/foo#bar')
    expect(history.state && history.state.page).toBe('foo::bar')
  })

  it('container in-page link with ?page=other#frag pushes cosmetic fragment and encodes anchor in state', async () => {
    const navHtml = `<a href="?page=home">Home</a>`
    const wrap = document.createElement('div')
    const container = document.createElement('main')
    document.body.appendChild(wrap)
    document.body.appendChild(container)
    const renderByQuery = vi.fn()
    await nav.buildNav(wrap, container, navHtml, '/', 'home', (k) => k, renderByQuery, false)

    const a = document.createElement('a')
    a.href = '?page=other#frag'
    a.textContent = 'inpage'
    container.appendChild(a)

    a.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(location.hash).toBe('#/other#frag')
    expect(history.state && history.state.page).toBe('other::frag')
  })

  it('clicking brand when already on cosmetic fragment does not duplicate fragment', async () => {
    const navHtml = `<a href="?page=dup">Home</a>`
    const wrap = document.createElement('div')
    const container = document.createElement('main')
    document.body.appendChild(wrap)
    document.body.appendChild(container)
    const renderByQuery = vi.fn()

    // simulate being already on the cosmetic fragment
    try { history.replaceState(null, '', '/') } catch (e) {}
    try { location.hash = '#/dup' } catch (e) {}

    await nav.buildNav(wrap, container, navHtml, '/', 'home', (k) => k, renderByQuery, false)

    const brand = document.querySelector('.navbar-brand .navbar-item')
    expect(brand).toBeTruthy()

    brand.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(location.hash).toBe('#/dup')
    const occurrences = (location.href.match(/#\//g) || []).length
    expect(occurrences).toBe(1)
  })
})

  it('clicking a direct cosmetic #/slug link does not append duplicate fragment', async () => {
    const navHtml = `<a href="?page=home">Home</a><a href="#/dup">Dup</a>`
    const wrap = document.createElement('div')
    const container = document.createElement('main')
    document.body.appendChild(wrap)
    document.body.appendChild(container)
    const renderByQuery = vi.fn()

    await nav.buildNav(wrap, container, navHtml, '/', 'home', (k) => k, renderByQuery, false)

    const allItems = Array.from(wrap.querySelectorAll('.navbar-item'))
    const a = allItems.find(el => String(el.textContent || '').trim() === 'Dup')
    expect(a).toBeTruthy()

    a.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(location.hash).toBe('#/dup')
    expect((location.href.match(/#\//g) || []).length).toBe(1)
  })

  it('brand link does not carry cosmetic hash path as anchor fragment', async () => {
    // This crown-journalizes the bug where firstLink hash path could create
    // URL `#/home#/slug` when location path is already `#/slug` (or similar).
    const navHtml = `<a href="?page=home#/slug">Home</a>`
    const wrap = document.createElement('div')
    const container = document.createElement('main')
    document.body.appendChild(wrap)
    document.body.appendChild(container)
    try { history.replaceState(null, '', '/#/slug') } catch (e) {}

    const renderByQuery = vi.fn()
    await nav.buildNav(wrap, container, navHtml, '/', 'home', (k) => k, renderByQuery, false)

    const brand = wrap.querySelector('.navbar-brand .navbar-item')
    expect(brand).toBeTruthy()
    const href = brand.getAttribute('href')
    expect(href).toBeTruthy()
    expect(href).not.toContain('#/slug')
    expect(href).not.toContain('%2Fslug')
    expect(href).toMatch(/^(?:\?page=home|#\/home)$/)
  })
