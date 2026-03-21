import { describe, it, expect, beforeEach } from 'vitest'
import { renderNotFound } from '../src/htmlBuilder.js'

describe('SEO not-found regression', () => {
  beforeEach(() => {
    // clean head from any previous tests
    try {
      document.head.querySelectorAll('meta[name="robots"], meta[name="description"], link[rel="canonical"], script#nimbi-jsonld').forEach(el => el.remove())
    } catch (e) {}
  })

  it('renderNotFound sets noindex, description, canonical and JSON-LD', () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const t = (k) => ({ notFound: 'Reg-Test Not Found', notFoundDescription: 'Reg-Test: page missing' }[k] || '')
    renderNotFound(container, t, new Error('boom'))

    const robots = document.querySelector('meta[name="robots"]')
    expect(robots).toBeTruthy()
    expect(robots.getAttribute('content')).toBe('noindex,follow')

    const desc = document.querySelector('meta[name="description"]')
    expect(desc).toBeTruthy()
    expect(desc.getAttribute('content')).toBe('Reg-Test: page missing')

    const canonical = document.querySelector('link[rel="canonical"]')
    expect(canonical).toBeTruthy()
    const href = canonical.getAttribute('href') || ''
    expect(href).toContain('?page=')

    const jsonLd = document.getElementById('nimbi-jsonld')
    expect(jsonLd).toBeTruthy()
    const parsed = JSON.parse(jsonLd.textContent || '{}')
    expect(parsed.headline).toBe('Reg-Test Not Found')
  })
})
