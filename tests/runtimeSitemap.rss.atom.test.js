import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as runtimeSitemap from '../src/runtimeSitemap.js'
import * as slugManager from '../src/slugManager.js'

describe('runtimeSitemap RSS/Atom', () => {
  let origSlugEntries
  let origLocation
  let origDocOpen
  let origDocWrite
  let origDocClose

  beforeEach(() => {
    origSlugEntries = Array.from(slugManager.slugToMd.entries())
    origLocation = globalThis.location
    slugManager.slugToMd.clear()
    Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/', search: '?rss' }, configurable: true })
  })

  afterEach(() => {
    slugManager.slugToMd.clear()
    for (const [k, v] of origSlugEntries) slugManager.slugToMd.set(k, v)
    try { Object.defineProperty(globalThis, 'location', { value: origLocation, configurable: true }) } catch (e) {}
    if (origDocOpen !== undefined) document.open = origDocOpen
    if (origDocWrite !== undefined) document.write = origDocWrite
    if (origDocClose !== undefined) document.close = origDocClose
  })

  it('handleSitemapRequest serves RSS when search contains ?rss and no other params', () => {
    // populate a slug so generator will emit entries
    slugManager.slugToMd.set('one', 'one.md')

    const writes = []
    origDocOpen = document.open
    origDocWrite = document.write
    origDocClose = document.close
    document.open = () => {}
    document.write = (s) => writes.push(String(s || ''))
    document.close = () => {}

    const handled = runtimeSitemap.handleSitemapRequest({ includeAllMarkdown: true })
    expect(handled).toBe(true)
    expect(writes.length).toBeGreaterThan(0)
    const out = writes.join('')
    expect(out).toContain('<rss')
    expect(out).toContain('?page=' + encodeURIComponent('one.md'))
  })

  it('handleSitemapRequest serves Atom when search contains ?atom and no other params', () => {
    // switch location to atom
    Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/', search: '?atom' }, configurable: true })
    slugManager.slugToMd.clear()
    slugManager.slugToMd.set('two', 'two.md')

    const writes = []
    origDocOpen = document.open
    origDocWrite = document.write
    origDocClose = document.close
    document.open = () => {}
    document.write = (s) => writes.push(String(s || ''))
    document.close = () => {}

    const handled = runtimeSitemap.handleSitemapRequest({ includeAllMarkdown: true })
    expect(handled).toBe(true)
    expect(writes.length).toBeGreaterThan(0)
    const out = writes.join('')
    expect(out).toContain('<feed')
    expect(out).toContain('?page=' + encodeURIComponent('two.md'))
  })
})
