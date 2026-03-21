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

    // clear any pending sitemap globals/timers from other tests
    try {
      if (typeof window !== 'undefined') {
        window.__nimbiSitemapPendingWrite = null
        if (window.__nimbiSitemapWriteTimer) { clearTimeout(window.__nimbiSitemapWriteTimer); window.__nimbiSitemapWriteTimer = null }
        window.__nimbiSitemapRenderedAt = undefined
        window.__nimbiSitemapJson = undefined
        window.__nimbiSitemapFinal = undefined
      }
    } catch (e) {}
  })

  afterEach(() => {
    slugManager.slugToMd.clear()
    for (const [k, v] of origSlugEntries) slugManager.slugToMd.set(k, v)
    try { Object.defineProperty(globalThis, 'location', { value: origLocation, configurable: true }) } catch (e) {}
    if (origDocOpen !== undefined) document.open = origDocOpen
    if (origDocWrite !== undefined) document.write = origDocWrite
    if (origDocClose !== undefined) document.close = origDocClose

    // clear any pending sitemap globals/timers
    try {
      if (typeof window !== 'undefined') {
        if (window.__nimbiSitemapWriteTimer) { clearTimeout(window.__nimbiSitemapWriteTimer); window.__nimbiSitemapWriteTimer = null }
        window.__nimbiSitemapPendingWrite = null
        window.__nimbiSitemapRenderedAt = undefined
        window.__nimbiSitemapJson = undefined
        window.__nimbiSitemapFinal = undefined
      }
    } catch (e) {}
  })

  it('handleSitemapRequest serves RSS when search contains ?rss and no other params', async () => {
    // populate a slug so generator will emit entries
    slugManager.slugToMd.set('one', 'one.md')
    slugManager.searchIndex.length = 0
    slugManager.searchIndex.push({ slug: 'one', title: 'One Title', path: 'one.md' })

    const writes = []
    origDocOpen = document.open
    origDocWrite = document.write
    origDocClose = document.close
    document.open = () => {}
    document.write = (s) => writes.push(String(s || ''))
    document.close = () => {}

    const handled = await runtimeSitemap.handleSitemapRequest({ includeAllMarkdown: true })
    // wait for the scheduled write to flush
    await new Promise((r) => setTimeout(r, 60))
    expect(handled).toBe(true)
    expect(writes.length).toBeGreaterThan(0)
    const out = writes.join('')
    expect(out).toContain('<rss')
    expect(out).toContain('?page=' + encodeURIComponent('one'))
  })

  it('handleSitemapRequest serves Atom when search contains ?atom and no other params', async () => {
    // switch location to atom
    Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/', search: '?atom' }, configurable: true })
    slugManager.slugToMd.clear()
    slugManager.slugToMd.set('two', 'two.md')
    slugManager.searchIndex.length = 0
    slugManager.searchIndex.push({ slug: 'two', title: 'Two Title', path: 'two.md' })

    const writes = []
    origDocOpen = document.open
    origDocWrite = document.write
    origDocClose = document.close
    document.open = () => {}
    document.write = (s) => writes.push(String(s || ''))
    document.close = () => {}

    const handled = await runtimeSitemap.handleSitemapRequest({ includeAllMarkdown: true })
    // wait for the scheduled write to flush
    await new Promise((r) => setTimeout(r, 60))
    expect(handled).toBe(true)
    expect(writes.length).toBeGreaterThan(0)
    const out = writes.join('')
    expect(out).toContain('<feed')
    expect(out).toContain('?page=' + encodeURIComponent('two'))
  })
})
