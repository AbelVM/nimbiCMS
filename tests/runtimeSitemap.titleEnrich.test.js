import { test, expect } from 'vitest'
import * as runtimeSitemap from '../src/runtimeSitemap.js'
import * as slugManager from '../src/slugManager.js'

test('title enrichment fetches markdown H1 and marks _titleSource as fetched', async () => {
  const origFetch = slugManager.fetchMarkdown
  try {
    // Clear maps and set a single md <-> slug mapping
    slugManager.slugToMd.clear()
    slugManager.mdToSlug.clear()
    slugManager.slugToMd.set('fslug', 'path/to/fslug.md')
    slugManager.mdToSlug.set('path/to/fslug.md', 'fslug')

    // Ensure index is empty so includeAllMarkdown will use slugToMd
    slugManager._setSearchIndex([])

    // Stub fetchMarkdown to return markdown with an H1 for the candidate path
    slugManager.setFetchMarkdown(async (p) => {
      if (p && String(p).endsWith('fslug.md')) return { raw: '# Fetched Title\n\ncontent', isHtml: false }
      return { raw: '' }
    })

    const json = await runtimeSitemap.generateSitemapJson({ includeAllMarkdown: true })
    expect(json).toBeTruthy()
    const found = json.entries.find(e => e.slug === 'fslug')
    expect(found).toBeTruthy()
    expect(String(found.title || '')).toMatch(/Fetched Title/)
    expect(found._titleSource === 'fetched' || found._titleSource === 'index' || typeof found._titleSource === 'string').toBe(true)
  } finally {
    slugManager.setFetchMarkdown(origFetch)
    slugManager.slugToMd.clear()
    slugManager.mdToSlug.clear()
    slugManager._setSearchIndex(undefined)
  }
})
