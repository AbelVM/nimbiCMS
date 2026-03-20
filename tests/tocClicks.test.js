import { describe, it, expect, beforeEach, vi } from 'vitest'
import { attachTocClickHandler } from '../src/htmlBuilder.js'

describe('TOC click behavior', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    try { history.replaceState(null, '', '/') } catch (e) {}
    try { location.hash = '' } catch (e) {}
    vi.resetModules()
    // provide a harmless renderByQuery to avoid triggering full render
    window.renderByQuery = vi.fn()
  })

  it('clicking a cosmetic TOC link (#/slug#anchor?qs) pushes state and fragment', () => {
    const aside = document.createElement('aside')
    const a = document.createElement('a')
    a.href = '#/my-slug#section?lang=es'
    a.textContent = 'Section'
    aside.appendChild(a)
    document.body.appendChild(aside)

    attachTocClickHandler(aside)

    a.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(location.hash).toBe('#/my-slug#section?lang=es')
    expect(history.state && history.state.page).toBe('my-slug::section')
  })

  it('clicking a canonical TOC link (?page=foo#bar) pushes cosmetic fragment and stores canonical in state', () => {
    const aside = document.createElement('aside')
    const a = document.createElement('a')
    a.href = '?page=foo#bar'
    a.textContent = 'Foo'
    aside.appendChild(a)
    document.body.appendChild(aside)

    attachTocClickHandler(aside)

    a.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(location.hash).toBe('#/foo#bar')
    expect(history.state && history.state.page).toBe('foo::bar')
  })
})
