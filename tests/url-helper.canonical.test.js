import { describe, it, expect } from 'vitest'
import { parseHrefToRoute, toCanonicalHref, buildCosmeticUrl } from '../src/utils/urlHelper.js'

describe('urlHelper canonical/cosmetic parsing', () => {
  it('parses canonical ?page= slug', () => {
    const r = parseHrefToRoute('?page=brochure')
    expect(r.type).toBe('canonical')
    expect(r.page).toBe('brochure')
    expect(r.anchor).toBeNull()
    expect(r.params).toBe('')
  })

  it('parses cosmetic hash with anchor and params', () => {
    const r = parseHrefToRoute('http://example.com/#/slug#anchor?x=1')
    expect(r.type).toBe('cosmetic')
    expect(r.page).toBe('slug')
    expect(r.anchor).toBe('anchor')
    expect(r.params).toBe('x=1')
  })

  it('toCanonicalHref converts cosmetic to canonical', () => {
    const s = toCanonicalHref('http://example.com/#/slug#anchor?x=1')
    expect(s).toBe('?page=slug&x=1#anchor')
  })

  it('buildCosmeticUrl builds cosmetic urls and strips page param', () => {
    const out = buildCosmeticUrl('slug', 'anchor', '?foo=1&page=slug&bar=2')
    expect(out.startsWith('#/slug')).toBeTruthy()
    expect(out).toContain('foo=1')
    expect(out).toContain('bar=2')
  })
})
