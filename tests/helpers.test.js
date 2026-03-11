import { describe, it, expect } from 'vitest'
import { isExternalLink, normalizePath, setLazyload, joinPaths, encodeURL } from '../src/utils/helpers.js'

describe('utils helpers', () => {
  it('identifies external links correctly', () => {
    expect(isExternalLink('http://example.com')).toBe(true)
    expect(isExternalLink('https://foo')).toBe(true)
    expect(isExternalLink('//cdn')).toBe(true)
    expect(isExternalLink('mailto:test@example.com')).toBe(true)
    expect(isExternalLink('tel:123')).toBe(true)
    expect(isExternalLink('/local/path')).toBe(false)
    expect(isExternalLink('foo.md')).toBe(false)
  })

  it('normalizePath strips leading dots/slashes', () => {
    expect(normalizePath('./foo')).toBe('foo')
    expect(normalizePath('../bar')).toBe('bar')
    expect(normalizePath('/baz')).toBe('baz')
    expect(normalizePath('qux')).toBe('qux')
  })

  it('setLazyload adds loading attr', () => {
    const img = document.createElement('img')
    setLazyload(img)
    expect(img.getAttribute('loading')).toBe('lazy')
    // second call should be no-op
    img.setAttribute('loading', 'eager')
    setLazyload(img)
    expect(img.getAttribute('loading')).toBe('eager')
  })

  it('safe swallows errors and returns result', () => {
    let called = false
    const result = safe(() => { called = true; return 42 })
    expect(called).toBe(true)
    expect(result).toBe(42)
    const bad = safe(() => { throw new Error('boom') })
    expect(bad).toBeUndefined()
  })

  it('joinPaths concatenates segments cleanly', () => {
    // relative
    expect(joinPaths('a', 'b', 'c')).toBe('a/b/c')
    expect(joinPaths('a/', '/b/', '/c/')).toBe('a/b/c')
    expect(joinPaths('/a', 'b', 'c')).toBe('/a/b/c')
    expect(joinPaths('', 'x')).toBe('x')
    expect(joinPaths('/')).toBe('/')
  })

  it('encodeURL safely encodes or returns original', () => {
    expect(encodeURL('http://example.com/foo bar')).toContain('%20')
    // invalid input should not throw
    expect(encodeURL('%%%')).toBe('%%%')
  })
})