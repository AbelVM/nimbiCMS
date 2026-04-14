import { expect } from 'chai'
import * as runtimeSitemap from '../src/runtimeSitemap.js'
import * as slugManager from '../src/slugManager.js'

describe('runtimeSitemap RSS/Atom endpoints (extra branches)', () => {
  let origLocation
  let origDocOpen
  let origDocWrite
  let origDocClose

  beforeEach(() => {
    // clear slug maps
    slugManager.slugToMd.clear()
    slugManager.mdToSlug.clear()
    origLocation = globalThis.location
  })

  afterEach(() => {
    try { Object.defineProperty(globalThis, 'location', { value: origLocation, configurable: true }) } catch (e) {}
    if (origDocOpen !== undefined) document.open = origDocOpen
    if (origDocWrite !== undefined) document.write = origDocWrite
    if (origDocClose !== undefined) document.close = origDocClose
  })

  it('serves RSS when ?rss param present and entries available', async () => {
    slugManager.slugToMd.set('one', 'one.md')
    slugManager.slugToMd.set('two', 'dir/two.md')

    // provide a pre-built searchIndex so the handler's index build is fast in tests
    slugManager.searchIndex.length = 0
    slugManager.searchIndex.push({ slug: 'one', title: 'One Title', path: 'one.md' })
    slugManager.searchIndex.push({ slug: 'two', title: 'Two Title', path: 'dir/two.md' })

    // emulate location.search ?rss and capture document.write output
    Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/', search: '?rss' }, configurable: true })
    const writes = []
    origDocOpen = document.open
    origDocWrite = document.write
    origDocClose = document.close
    document.open = () => {}
    document.write = (s) => writes.push(String(s ?? ''))
    document.close = () => {}

    const handled = await runtimeSitemap.handleSitemapRequest({ includeAllMarkdown: true, index: slugManager.searchIndex, waitForIndexMs: 1000 })
    // wait for the scheduled write to flush
    await new Promise((r) => setTimeout(r, 60))
    expect(handled).to.equal(true)
    expect(writes.length).to.be.greaterThan(0)
    const out = writes.join('')
    expect(out).to.include('<rss')
    expect(out).to.include('?page=' + encodeURIComponent('one'))
  }, 20000)

  it('serves Atom when ?atom param present and entries available', async () => {
    slugManager.slugToMd.set('h', 'hello.md')
    slugManager.searchIndex.length = 0
    slugManager.searchIndex.push({ slug: 'h', title: 'Hello', path: 'hello.md' })
    Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/', search: '?atom' }, configurable: true })

    const writes = []
    origDocOpen = document.open
    origDocWrite = document.write
    origDocClose = document.close
    document.open = () => {}
    document.write = (s) => writes.push(String(s ?? ''))
    document.close = () => {}

    const handled = await runtimeSitemap.handleSitemapRequest({ includeAllMarkdown: true, index: slugManager.searchIndex, waitForIndexMs: 1000 })
    // wait for the scheduled write to flush
    await new Promise((r) => setTimeout(r, 60))
    expect(handled).to.equal(true)
    expect(writes.length).to.be.greaterThan(0)
    const out = writes.join('')
    expect(out).to.include('<feed')
    expect(out).to.include('?page=' + encodeURIComponent('h'))
  }, 20000)
})
