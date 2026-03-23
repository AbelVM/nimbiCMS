import { test, expect } from 'vitest'
import * as runtimeSitemap from '../src/runtimeSitemap.js'
import * as slugManager from '../src/slugManager.js'

test('crawl: md/html link fetch fallback derives slug from H1', async () => {
  const origFetch = slugManager.fetchMarkdown
  try {
    slugManager.slugToMd.clear()
    slugManager.mdToSlug.clear()
    // make target path known via slugToMd values so _isKnownPath passes
    slugManager.slugToMd.set('existing', 'target.md')
    // source mapping
    slugManager.slugToMd.set('source', 's.md')

    const idx = [ { slug: 'source', path: 's.md', title: 'Source' } ]

    slugManager.setFetchMarkdown(async (p) => {
      const s = String(p || '')
      if (s.endsWith('s.md')) return { raw: '[link](target.md)' }
      if (s.endsWith('target.md')) return { raw: '# Target Title' }
      return { raw: '' }
    })

    const json = await runtimeSitemap.generateSitemapJson({ index: idx })
    expect(json).toBeTruthy()
    const expected = slugManager.slugify('Target Title')
    expect(json.entries.some(e => e.slug === expected)).toBe(true)
  } finally {
    slugManager.setFetchMarkdown(origFetch)
    slugManager.slugToMd.clear()
    slugManager.mdToSlug.clear()
  }
})
