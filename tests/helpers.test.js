import { describe, it, expect } from 'vitest'
import {
  isExternalLink,
  normalizePath,
  setLazyload,
  joinPaths,
  encodeURL,
  safe,
  setEagerForAboveFoldImages,
  buildPageUrl,
} from '../src/utils/helpers.js'

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

  it('setEagerForAboveFoldImages marks visible images and preloads them', () => {
    const container = document.createElement('div')
    const img = document.createElement('img')
    img.src = 'https://example.com/foo.png'
    img.getBoundingClientRect = () => ({ top: 0, height: 100, bottom: 100 })
    container.appendChild(img)

    expect(document.head.querySelector('link[rel="preload"][as="image"][href="https://example.com/foo.png"]')).toBeNull()

    setEagerForAboveFoldImages(container)

    expect(img.getAttribute('loading')).toBe('eager')
    expect(img.getAttribute('fetchpriority')).toBe('high')
    expect(img.getAttribute('data-eager-by-nimbi')).toBe('1')
    const preloadLink = document.head.querySelector('link[rel="preload"]')
    expect(preloadLink).toBeTruthy()
    expect(preloadLink.href).toContain('example.com/foo.png')
  })

  it('setEagerForAboveFoldImages handles getComputedStyle throwing', () => {
    const original = window.getComputedStyle
    window.getComputedStyle = () => { throw new Error('boom') }
    try {
      const container = document.createElement('div')
      const img = document.createElement('img')
      img.src = 'https://example.com/bar.png'
      img.getBoundingClientRect = () => ({ top: 0, height: 100, bottom: 100 })
      container.appendChild(img)

      setEagerForAboveFoldImages(container)
      expect(img.getAttribute('loading')).toBe('eager')
    } finally {
      window.getComputedStyle = original
    }
  })

  it('safe swallows errors and returns result (sync and async)', async () => {
    let called = false
    const result = safe(() => { called = true; return 42 })
    expect(called).toBe(true)
    expect(result).toBe(42)

    const bad = safe(() => { throw new Error('boom') })
    expect(bad).toBeUndefined()

    const p = safe(() => Promise.reject(new Error('boom')))
    await expect(p).resolves.toBeUndefined()
  })

  it('buildPageUrl preserves existing query params and hash', () => {
    expect(buildPageUrl('home', 'section', '?lang=en&foo=bar')).toBe('?page=home&lang=en&foo=bar#section')
    expect(buildPageUrl('home', null, '?bar=baz')).toBe('?page=home&bar=baz')
  })

  it('buildPageUrl falls back when URLSearchParams is unavailable', () => {
    const orig = global.URLSearchParams
    // eslint-disable-next-line no-global-assign
    global.URLSearchParams = class { constructor () { throw new Error('boom') } }
    try {
      expect(buildPageUrl('test', 'h')).toBe('?page=test#h')
    } finally {
      // eslint-disable-next-line no-global-assign
      global.URLSearchParams = orig
    }
  })

  it('encodeURL falls back when encodeURI throws', () => {
    const orig = global.encodeURI
    // eslint-disable-next-line no-global-assign
    global.encodeURI = () => { throw new Error('boom') }
    try {
      expect(encodeURL('foo')).toBe('foo')
    } finally {
      // eslint-disable-next-line no-global-assign
      global.encodeURI = orig
    }
  })

  it('encodeURL safely encodes or returns original', () => {
    expect(encodeURL('http://example.com/foo bar')).toContain('%20')
    // invalid input should not throw
    expect(encodeURL('%%%')).toBe('%%%')
  })
})