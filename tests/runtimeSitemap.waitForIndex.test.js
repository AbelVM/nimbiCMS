import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as runtimeSitemap from '../src/runtimeSitemap.js'
import * as slugManager from '../src/slugManager.js'

describe('runtimeSitemap waits for index completion', () => {
  let origLocation
  let origDocOpen
  let origDocWrite
  let origDocClose
  let origWhen
  let origFetch

  beforeEach(() => {
    origLocation = globalThis.location
    Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/', search: '?sitemap' }, configurable: true })
    // clear slug maps
    slugManager.slugToMd.clear()
    origFetch = globalThis.fetch
    globalThis.fetch = async () => ({ ok: false, status: 404, text: async () => '' })
    // backup whenSearchIndexReady
    origWhen = slugManager.whenSearchIndexReady
  })

  afterEach(() => {
    try { Object.defineProperty(globalThis, 'location', { value: origLocation, configurable: true }) } catch (e) {}
    try { globalThis.fetch = origFetch } catch (_) {}
    if (origDocOpen !== undefined) document.open = origDocOpen
    if (origDocWrite !== undefined) document.write = origDocWrite
    if (origDocClose !== undefined) document.close = origDocClose
    // restore original whenSearchIndexReady
    try { slugManager.whenSearchIndexReady = origWhen } catch (_) {}
    slugManager.searchIndex.length = 0
  })

  it('waits for whenSearchIndexReady to resolve the full index', async () => {
    // simulate a partially-populated module searchIndex (6 items)
    slugManager.searchIndex.length = 0
    for (let i = 1; i <= 6; i++) slugManager.searchIndex.push({ slug: 'p' + i, title: 'P' + i, path: 'p' + i + '.md' })

    // provide a final authoritative index via opts (avoid reassigning read-only export)
    const finalIndex = []
    for (let i = 1; i <= 20; i++) finalIndex.push({ slug: 'p' + i, title: 'P' + i, path: 'p' + i + '.md' })

    // intercept document writes
    const writes = []
    origDocOpen = document.open
    origDocWrite = document.write
    origDocClose = document.close
    document.open = () => {}
    document.write = (s) => writes.push(String(s ?? ''))
    document.close = () => {}

    const handled = await runtimeSitemap.handleSitemapRequest({ includeAllMarkdown: true, index: finalIndex, waitForIndexMs: 1000 })
    // wait for scheduled sitemap write to flush
    await new Promise(r => setTimeout(r, 80))
    expect(handled).toBe(true)
    const written = writes.join('')
    // ensure an entry from the tail of the final index is present
    expect(written).toContain('?page=' + encodeURIComponent('p20'))
  }, 60000)
})
