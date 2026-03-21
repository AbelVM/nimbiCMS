import { describe, it, expect } from 'vitest'
import { buildCosmeticUrl, parseHrefToRoute, toCanonicalHref } from '../src/utils/urlHelper.js'

describe('URL helper schema and conversions', () => {
  it('parses canonical href with page, anchor and params', () => {
    const parsed = parseHrefToRoute('http://example.com/?page=foo&x=1#bar')
    expect(parsed.type).toBe('canonical')
    expect(parsed.page).toBe('foo')
    expect(parsed.anchor).toBe('bar')
    expect(parsed.params).toBe('x=1')
  })

  it('parses cosmetic href and extracts page, anchor and params', () => {
    const parsed = parseHrefToRoute('http://example.com/#/foo#bar?x=1')
    expect(parsed.type).toBe('cosmetic')
    expect(parsed.page).toBe('foo')
    expect(parsed.anchor).toBe('bar')
    expect(parsed.params).toBe('x=1')
  })

  it('converts cosmetic href to canonical form preserving params and anchor', () => {
    const canon = toCanonicalHref('http://example.com/#/foo#bar?x=1')
    expect(canon).toBe('?page=foo&x=1#bar')
  })

  it('treats legacy fragment-only `#slug` as a path/anchor and leaves it unchanged by toCanonicalHref', () => {
    const parsed = parseHrefToRoute('#slug')
    expect(parsed.type).toBe('path')
    expect(parsed.anchor).toBe('slug')
    expect(toCanonicalHref('#slug')).toBe('#slug')
  })

  it('builds cosmetic url and strips any existing `page` param', () => {
    const out = buildCosmeticUrl('foo', 'bar', '?page=baz&x=1')
    expect(out).toBe('#/foo#bar?x=1')
  })

  it('encodes path segments and anchors when building cosmetic urls', () => {
    const out = buildCosmeticUrl('a b/c d', 'anch or', '?x=1')
    expect(out).toBe('#/a%20b/c%20d#anch%20or?x=1')
  })

  it('parses absolute file paths as type `path` with page set to the pathname', () => {
    const res = parseHrefToRoute('http://example.com/docs/index.html')
    expect(res.type).toBe('path')
    expect(res.page).toBe('docs/index.html')
  })
})
