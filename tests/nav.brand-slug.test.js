import { describe, it, expect, beforeEach } from 'vitest'
import * as nav from '../src/nav.js'
import { slugToMd, mdToSlug } from '../src/slugManager.js'

describe('navbar brand slug behavior', () => {
  let navbarWrap, container
  beforeEach(() => {
    document.body.innerHTML = ''
    navbarWrap = document.createElement('header')
    container = document.createElement('main')
    document.body.appendChild(navbarWrap)
    document.body.appendChild(container)
    // reset slug maps
    slugToMd.clear()
    mdToSlug.clear()
  })

  it('brand prefers slug when md->slug mapping exists', async () => {
    // Arrange: create a mapping for page.md -> my-slug
    mdToSlug.set('page.md', 'my-slug')
    slugToMd.set('my-slug', 'page.md')

    // brand logic inspects the `?page=` param on the first link, so use that form
    const navHtml = '<a href="?page=page.md">Home</a>'

    // Act
    const res = await nav.buildNav(navbarWrap, container, navHtml, '/content/', '_home.md', (s) => s, () => {}, false)

    // Assert
    const brand = res.navbar.querySelector('.navbar-brand .navbar-item')
    expect(brand).toBeTruthy()
    const href = brand.getAttribute('href') || ''
    expect(href.includes('page=my-slug') || href.includes('#/my-slug')).toBe(true)
  })
})
