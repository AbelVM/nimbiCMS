import { test, expect } from 'vitest'
import * as runtimeSitemap from '../src/runtimeSitemap.js'
import * as slugManager from '../src/slugManager.js'

test('notFoundPage HTML fetched via DOMParser excludes matching slug', async () => {
  const origLocation = globalThis.location
  const origDOMParser = globalThis.DOMParser
  const origFetch = slugManager.fetchMarkdown
  try { Object.defineProperty(globalThis, 'location', { value: { origin: 'http://example.test', pathname: '/' }, configurable: true }) } catch (e) {}

  // mock DOMParser to return an element with textContent
  globalThis.DOMParser = class {
    parseFromString(_s, _t) {
      return { querySelector: () => ({ textContent: 'Not Found HTML Title' }) }
    }
  }

  // mock fetchMarkdown to return an HTML string
  slugManager.setFetchMarkdown(async () => ({ raw: '<h1>Not Found HTML Title</h1>', isHtml: true }))

  const expected = slugManager.slugify('Not Found HTML Title')
  const providedIndex = [ { slug: expected }, { slug: 'keepme' } ]
  const json = await runtimeSitemap.generateSitemapJson({ index: providedIndex, notFoundPage: '404.md' })
  expect(json).toBeTruthy()
  expect(json.entries.some(e => e.slug === expected)).toBe(false)
  expect(json.entries.some(e => e.slug === 'keepme')).toBe(true)

  try { Object.defineProperty(globalThis, 'location', { value: origLocation, configurable: true }) } catch (e) {}
  globalThis.DOMParser = origDOMParser
  slugManager.setFetchMarkdown(origFetch)
})
