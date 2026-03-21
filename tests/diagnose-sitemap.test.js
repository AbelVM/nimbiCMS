import { it } from 'vitest'
import * as slugManager from '../src/slugManager.js'
import * as sitemap from '../src/runtimeSitemap.js'

it('diagnose sitemap (prints counts)', async () => {
  console.log('searchIndex.length =', Array.isArray(slugManager.searchIndex) ? slugManager.searchIndex.length : 'no searchIndex')
  console.log('slugToMd size =', slugManager.slugToMd ? slugManager.slugToMd.size : 'no slugToMd')
  console.log('allMarkdownPaths length =', Array.isArray(slugManager.allMarkdownPaths) ? slugManager.allMarkdownPaths.length : 'no allMarkdownPaths')

  const json = sitemap.generateSitemapJson({ index: slugManager.searchIndex })
  console.log('generateSitemapJson.entries.length =', Array.isArray(json && json.entries) ? json.entries.length : 'nil')
  console.log('First 50 sitemap entries (slug):')
  ;(json.entries || []).slice(0, 50).forEach((e, i) => console.log(i + 1, e.slug, e.path || ''))

  const exposed = await sitemap.exposeSitemapGlobals({ index: slugManager.searchIndex })
  if (exposed && Array.isArray(exposed.deduped)) {
    console.log('exposeSitemapGlobals.deduped.length =', exposed.deduped.length)
    console.log('First 50 deduped entries:')
    exposed.deduped.slice(0, 50).forEach((e, i) => console.log(i + 1, e.slug, e.path || ''))
  } else {
    console.log('exposeSitemapGlobals returned null or no deduped')
  }
})
