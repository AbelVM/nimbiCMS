import { test, expect } from 'vitest'
import * as runtimeSitemap from '../src/runtimeSitemap.js'
import * as slugManager from '../src/slugManager.js'

test('crawl: page query param links produce entries', async () => {
  const origFetch = slugManager.fetchMarkdown
  try {
    // Prepare a minimal index with one source that links to ?page=target-slug
    const idx = [ { slug: 'source-slug', path: 'source.md', title: 'Source' } ]

    // Ensure slug/path maps so _isKnownPath allows fetching
    slugManager.slugToMd.clear()
    slugManager.mdToSlug.clear()
    slugManager.slugToMd.set('source-slug', 'source.md')
    slugManager.mdToSlug.set('source.md', 'source-slug')

    // Stub fetchMarkdown to return markdown containing a page query link
    slugManager.setFetchMarkdown(async (p) => {
      if (p && String(p).endsWith('source.md')) return { raw: '[link](?page=target-slug)' }
      return { raw: '' }
    })

    const json = await runtimeSitemap.generateSitemapJson({ index: idx })
    expect(json).toBeTruthy()
    expect(json.entries.some(e => e.slug === 'target-slug')).toBe(true)
  } finally {
    slugManager.setFetchMarkdown(origFetch)
    slugManager.slugToMd.clear()
    slugManager.mdToSlug.clear()
  }
})
