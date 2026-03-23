import { test, expect } from 'vitest'
import * as runtimeSitemap from '../src/runtimeSitemap.js'
import * as slugManager from '../src/slugManager.js'

test('generateSitemapJson merges provided index preferring live searchIndex', async () => {
  const origSearchIndex = Array.from(slugManager.searchIndex)
  try { slugManager._setSearchIndex([{ slug: 'shared', title: 'live-title' }]) } catch (e) {}

  const providedIndex = [{ slug: 'shared', title: 'provided-title' }, { slug: 'only', title: 'only-title' }]
  const json = await runtimeSitemap.generateSitemapJson({ index: providedIndex, includeAllMarkdown: false })

  const sharedEntry = json.entries.find(e => e.slug === 'shared')
  expect(sharedEntry).toBeTruthy()
  expect(sharedEntry.title).toBe('live-title')
  expect(json.entries.some(e => e.slug === 'only')).toBe(true)

  try { slugManager._setSearchIndex(origSearchIndex) } catch (e) {}
})

test('generateSitemapJson crawls source markdown links including ?page and md mappings', async () => {
  const origMdToSlugEntries = Array.from(slugManager.mdToSlug.entries())
  const origFetch = slugManager.fetchMarkdown

  try { slugManager.mdToSlug.clear() } catch (e) {}
  try { slugManager.mdToSlug.set('source.md', 'source') } catch (e) {}
  try { slugManager.mdToSlug.set('other.md', 'otherSlug') } catch (e) {}

  try {
    slugManager.setFetchMarkdown(async (path) => {
      if (path === 'source.md') return { raw: '[link](?page=found)\n[link](other.md)' }
      if (path === 'other.md') return { raw: '# Other' }
      return { raw: '' }
    })
  } catch (e) {}

  const providedIndex = [{ slug: 'source', path: 'source.md' }]
  const json = await runtimeSitemap.generateSitemapJson({ index: providedIndex, includeAllMarkdown: false })

  expect(json.entries.some(e => e.slug === 'found')).toBe(true)
  expect(json.entries.some(e => e.slug === 'otherSlug')).toBe(true)

  try { slugManager.setFetchMarkdown(origFetch) } catch (e) {}
  slugManager.mdToSlug.clear()
  for (const [k, v] of origMdToSlugEntries) slugManager.mdToSlug.set(k, v)
})

test('generateSitemapJson fetches H1 titles and marks _titleSource as fetched', async () => {
  const origFetch = slugManager.fetchMarkdown
  const origSlugToMd = Array.from(slugManager.slugToMd.entries())
  const origSearch = Array.from(slugManager.searchIndex)

  try { slugManager._setSearchIndex([]) } catch (e) {}
  try { slugManager.slugToMd.set('fslug', 'fpage.md') } catch (e) {}

  try {
    slugManager.setFetchMarkdown(async (path) => {
      if (path === 'fpage.md') return { raw: '# Fetched Title' }
      return { raw: '' }
    })
  } catch (e) {}

  const json = await runtimeSitemap.generateSitemapJson({ index: [{ slug: 'fslug' }], includeAllMarkdown: false })
  const e = json.entries.find(x => x.slug === 'fslug')
  expect(e).toBeTruthy()
  expect(e.title).toBe('Fetched Title')
  expect(e._titleSource).toBe('fetched')

  try { slugManager.setFetchMarkdown(origFetch) } catch (e) {}
  slugManager.slugToMd.clear()
  for (const [k, v] of origSlugToMd) slugManager.slugToMd.set(k, v)
  try { slugManager._setSearchIndex(origSearch) } catch (e) {}
})
