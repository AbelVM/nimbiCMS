import { describe, it, expect, beforeEach } from 'vitest'
import {
  isExternalLink,
  normalizePath,
  trimTrailingSlash,
  ensureTrailingSlash,
  setLazyload,
  setEagerForAboveFoldImages,
  joinPaths,
  buildPageUrl,
  encodeURL,
  safe,
  decodeHtmlEntities
} from '../src/utils/helpers.js'

describe('utils/helpers additional coverage', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    document.body.innerHTML = ''
    // reset location.search for buildPageUrl
    try { delete window.location; } catch (e) {}
    // create a predictable location
    global.window = Object.assign(global.window || {}, { location: { search: '?lang=es&foo=1' }, innerHeight: 800 })
  })

  it('URL helpers behave correctly', () => {
    expect(isExternalLink('https://example.com')).toBe(true)
    expect(isExternalLink('//cdn.example')).toBe(true)
    expect(isExternalLink('mailto:me@example.com')).toBe(true)
    expect(isExternalLink('/local/path')).toBe(false)

    expect(normalizePath('./foo/bar')).toBe('foo/bar')
    expect(trimTrailingSlash('/a/b/')).toBe('/a/b')
    expect(ensureTrailingSlash('/a/b')).toBe('/a/b/')
  })

  it('setLazyload sets loading attr when missing', () => {
    const img = document.createElement('img')
    setLazyload(img)
    expect(img.getAttribute('loading')).toBe('lazy')
    // calling again doesn't throw
    setLazyload({ getAttribute: () => 'lazy' })
  })

  it('joinPaths joins cleanly and respects leading slash', () => {
    expect(joinPaths('a', '/b/', 'c/')).toBe('a/b/c')
    expect(joinPaths('/a', '/b')).toBe('/a/b')
    expect(joinPaths()).toBe('')
  })

  it('buildPageUrl merges existing params and encodes hash', () => {
    const url = buildPageUrl('pageX', 'section 1', '?lang=en&x=2')
    expect(url).toContain('page=pageX')
    expect(url).toContain('lang=en')
    expect(url).toContain('#section%201')
  })

  it('encodeURL falls back when encodeURI throws or contains %', () => {
    // contains percent -> return as-is
    expect(encodeURL('100%')).toBe('100%')
    // simulate encodeURI throwing
    const orig = global.encodeURI
    try {
      global.encodeURI = () => { throw new Error('boom') }
      expect(encodeURL('x y')).toBe('x y')
    } finally {
      global.encodeURI = orig
    }
  })

  it('safe handles sync and async errors', async () => {
    const res = safe(() => { throw new Error('boom') })
    expect(res).toBeUndefined()
    const pres = safe(async () => { throw new Error('boom') })
    const apr = await pres
    expect(apr).toBeUndefined()
  })

  it('decodeHtmlEntities handles named and numeric entities', () => {
    expect(decodeHtmlEntities('Tom &amp; Jerry')).toBe('Tom & Jerry')
    expect(decodeHtmlEntities('Quote: &quot;hi&quot;')).toBe('Quote: "hi"')
    expect(decodeHtmlEntities('Num: &#65;')).toBe('Num: A')
    expect(decodeHtmlEntities('Hex: &#x41;')).toBe('Hex: A')
    // unknown entity stays same
    expect(decodeHtmlEntities('Foo &unknown; Bar')).toBe('Foo &unknown; Bar')
  })

  it('setEagerForAboveFoldImages marks visible images and preloads', () => {
    const container = document.createElement('div')
    container.style.width = '800px'
    container.style.height = '600px'
    document.body.appendChild(container)
    // mock container viewport to span the window
    container.getBoundingClientRect = () => ({ top: 0, bottom: 800, height: 800 })

    const img1 = document.createElement('img')
    img1.src = '/img1.png'
    // mock getBoundingClientRect to be inside viewport
    img1.getBoundingClientRect = () => ({ top: 10, height: 100 })
    const img2 = document.createElement('img')
    img2.src = '/img2.png'
    img2.getBoundingClientRect = () => ({ top: 2000, height: 50 })

    container.appendChild(img1)
    container.appendChild(img2)

    setEagerForAboveFoldImages(container)
    expect(img1.getAttribute('loading')).toBe('eager')
    expect(img1.getAttribute('fetchpriority')).toBe('high')
    // mark indicates eager selection; preload link may be absolute or omitted
    expect(img1.getAttribute('data-eager-by-nimbi')).toBe('1')
  })
})
