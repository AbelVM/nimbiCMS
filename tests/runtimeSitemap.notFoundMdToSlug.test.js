import { test, expect } from 'vitest'
import * as runtimeSitemap from '../src/runtimeSitemap.js'
import * as slugManager from '../src/slugManager.js'

test('notFoundPage mapped in mdToSlug excludes matching slug', async () => {
  const origMapEntries = Array.from(slugManager.mdToSlug.entries())
  try {
    const nf = '404.md'
    slugManager.mdToSlug.clear()
    slugManager.mdToSlug.set(nf, 'nf-slug')
    const providedIndex = [ { slug: 'nf-slug' }, { slug: 'keepme' } ]
    const json = await runtimeSitemap.generateSitemapJson({ index: providedIndex, notFoundPage: nf })
    expect(json).toBeTruthy()
    expect(json.entries.some(e => e.slug === 'nf-slug')).toBe(false)
    expect(json.entries.some(e => e.slug === 'keepme')).toBe(true)
  } finally {
    slugManager.mdToSlug.clear()
    for (const [k, v] of origMapEntries) slugManager.mdToSlug.set(k, v)
  }
})
