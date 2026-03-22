import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as htmlBuilder from '../src/htmlBuilder.js'
import * as slugManager from '../src/slugManager.js'
import { buildPageUrl } from '../src/utils/helpers.js'

describe('htmlBuilder inline not-found fallback', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    // Disable file-based notFound fallback
    slugManager.setNotFoundPage(null)
    // Ensure a known homePage value for link generation
    slugManager.setHomePage('home.md')
  })
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renderNotFound shows a link to the home page when notFoundPage is disabled', () => {
    const container = document.createElement('div')
    const t = (k) => ({ home: 'Home', notFound: 'Not Found' }[k] || '')
    htmlBuilder.renderNotFound(container, t, new Error('boom'))
    const a = container.querySelector('a')
    expect(a).toBeTruthy()
    expect(a.getAttribute('href')).toBe(buildPageUrl('home.md'))
  })
})
