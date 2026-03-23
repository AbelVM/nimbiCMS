import { test, expect } from 'vitest'
import * as runtimeSitemap from '../src/runtimeSitemap.js'
import * as slugManager from '../src/slugManager.js'

test('generateRssXml escapes special XML characters and includes excerpt', () => {
  const origLocation = globalThis.location
  try { Object.defineProperty(globalThis, 'location', { value: undefined, configurable: true }) } catch (e) {}

  const json = {
    generatedAt: '2020-01-01T00:00:00Z',
    entries: [
      { loc: 'http://localhost/?page=s', slug: 's', title: 'A & < > " \'' , excerpt: 'Ex & < > " \'' }
    ]
  }

  const out = runtimeSitemap.generateRssXml(json)
  // escaped forms must appear
  expect(out).toContain('&amp;')
  expect(out).toContain('&lt;')
  expect(out).toContain('&gt;')
  expect(out).toContain('&quot;')
  expect(out).toContain('&apos;')
  // excerpt should be present and escaped
  expect(out).toContain('<description>')

  try { Object.defineProperty(globalThis, 'location', { value: origLocation, configurable: true }) } catch (e) {}
})

test('generateAtomXml uses entry.lastmod when present', () => {
  const origLocation = globalThis.location
  try { Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/' }, configurable: true }) } catch (e) {}

  const json = { generatedAt: '2021-05-05T00:00:00Z', entries: [ { loc: 'http://example.test/?page=a', slug: 'a', title: 'A', lastmod: '2020-02-03' } ] }
  const out = runtimeSitemap.generateAtomXml(json)
  // lastmod should be reflected in the produced <updated> element for the entry
  expect(out).toContain('2020-02-03')

  try { Object.defineProperty(globalThis, 'location', { value: origLocation, configurable: true }) } catch (e) {}
})

test('generateSitemapJson adds humanized page entry for anchor-only slugs', async () => {
  const origLocation = globalThis.location
  try { Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/' }, configurable: true }) } catch (e) {}

  // Ensure live searchIndex doesn't override provided index
  slugManager.searchIndex.length = 0

  const providedIndex = [ { slug: 'foo::bar' } ]
  const json = await runtimeSitemap.generateSitemapJson({ index: providedIndex, includeAllMarkdown: false })
  expect(json).toBeTruthy()
  expect(Array.isArray(json.entries)).toBe(true)
  // final entries should include the page-level base slug 'foo'
  expect(json.entries.some(e => e.slug === 'foo')).toBe(true)
  const ent = json.entries.find(e => e.slug === 'foo')
  expect(ent).toBeTruthy()
  expect(ent._titleSource).toBe('humanize')
  expect(ent.title).toBe('Foo')

  try { Object.defineProperty(globalThis, 'location', { value: origLocation, configurable: true }) } catch (e) {}
})

test('generateSitemapXml handles empty entries array gracefully', () => {
  const xml = runtimeSitemap.generateSitemapXml([])
  expect(xml).toContain('<?xml')
  expect(xml).toContain('<urlset')
})

test('notFoundPage mapped via mdToSlug excludes matched slug from results', async () => {
  // ensure clean state
  slugManager.mdToSlug.clear()
  slugManager.searchIndex.length = 0
  const origLocation = globalThis.location
  try { Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/' }, configurable: true }) } catch (e) {}

  // map notFoundPage path to a slug
  slugManager.mdToSlug.set('404.md', 'notfound')

  const providedIndex = [ { slug: 'notfound' }, { slug: 'keepme' } ]
  const json = await runtimeSitemap.generateSitemapJson({ index: providedIndex, notFoundPage: '404.md' })
  expect(json).toBeTruthy()
  expect(Array.isArray(json.entries)).toBe(true)
  expect(json.entries.some(e => e.slug === 'notfound')).toBe(false)
  expect(json.entries.some(e => e.slug === 'keepme')).toBe(true)

  try { Object.defineProperty(globalThis, 'location', { value: origLocation, configurable: true }) } catch (e) {}
})

test('notFoundPage fetched and slugified excludes matching slug', async () => {
  // ensure clean state
  slugManager.mdToSlug.clear()
  slugManager.searchIndex.length = 0
  const origFetch = slugManager.fetchMarkdown
  const origLocation = globalThis.location
  try { Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/' }, configurable: true }) } catch (e) {}

  // mock fetchMarkdown to return a markdown H1 (use setFetchMarkdown helper)
  try { slugManager.setFetchMarkdown(async () => ({ raw: '# Not Found Title', isHtml: false })) } catch (e) {}
  const expected = slugManager.slugify('Not Found Title')

  const providedIndex = [ { slug: expected }, { slug: 'ok' } ]
  const json = await runtimeSitemap.generateSitemapJson({ index: providedIndex, notFoundPage: '404.md' })
  expect(json).toBeTruthy()
  expect(json.entries.some(e => e.slug === expected)).toBe(false)
  expect(json.entries.some(e => e.slug === 'ok')).toBe(true)

  // restore original fetch implementation
  try { slugManager.setFetchMarkdown(origFetch) } catch (e) {}
  try { Object.defineProperty(globalThis, 'location', { value: origLocation, configurable: true }) } catch (e) {}
})
