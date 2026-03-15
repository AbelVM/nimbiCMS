import { describe, it, expect, beforeEach } from 'vitest'
import * as nav from '../src/nav.js'

describe('search results outside-click behavior', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('closes results when clicking outside the input/results box', async () => {
    const navbarWrap = document.createElement('header')
    const container = document.createElement('main')
    document.body.appendChild(navbarWrap)
    document.body.appendChild(container)

    // build navbar with search enabled (lazy to avoid indexing work)
    await nav.buildNav(navbarWrap, container, '<a href="?page=home">Root</a>', '/', 'home', (s) => s, () => {}, true, 'lazy')

    const results = document.getElementById('nimbi-search-results')
    expect(results).toBeTruthy()

    // open the results as if showResults had been called
    results.style.display = 'block'
    results.classList.add('is-open')

    // clicking inside should NOT close
    const inside = document.createElement('div')
    results.appendChild(inside)
    inside.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await new Promise(r => setTimeout(r, 20))
    expect(results.style.display).toBe('block')
    expect(results.classList.contains('is-open')).toBe(true)

    // clicking outside should close
    const outside = document.createElement('div')
    document.body.appendChild(outside)
    outside.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await new Promise(r => setTimeout(r, 20))
    expect(results.style.display).not.toBe('block')
    expect(results.classList.contains('is-open')).toBe(false)
  })
})
