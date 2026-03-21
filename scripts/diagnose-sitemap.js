import path from 'path'
import url from 'url'

// Ensure ESM resolves relative imports correctly when run via `node` from project root
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
process.chdir(path.resolve(__dirname, '..'))

// Provide a minimal `location` so generators that read it don't throw
globalThis.location = { origin: 'http://example.test', pathname: '/', search: '', hash: '' }

// Load modules
import * as slugManager from '../src/slugManager.js'
import * as sitemap from '../src/runtimeSitemap.js'

async function run() {
  try {
    console.log('searchIndex.length =', Array.isArray(slugManager.searchIndex) ? slugManager.searchIndex.length : 'no searchIndex')
    console.log('slugToMd size =', slugManager.slugToMd ? slugManager.slugToMd.size : 'no slugToMd')
    console.log('allMarkdownPaths length =', Array.isArray(slugManager.allMarkdownPaths) ? slugManager.allMarkdownPaths.length : 'no allMarkdownPaths')

    // Try generating sitemap JSON using the live searchIndex
    const json = sitemap.generateSitemapJson({ index: slugManager.searchIndex })
    console.log('generateSitemapJson.entries.length =', Array.isArray(json && json.entries) ? json.entries.length : 'nil')
    console.log('First 20 sitemap entries (slug):')
    ;(json.entries || []).slice(0, 20).forEach((e, i) => console.log(i + 1, e.slug, e.path || ''))

    // Also try exposing globals (async) but pass the current index to avoid network rebuild
    const exposed = await sitemap.exposeSitemapGlobals({ index: slugManager.searchIndex })
    if (exposed && Array.isArray(exposed.deduped)) {
      console.log('exposeSitemapGlobals.deduped.length =', exposed.deduped.length)
      console.log('First 20 deduped entries:')
      exposed.deduped.slice(0, 20).forEach((e, i) => console.log(i + 1, e.slug, e.path || ''))
    } else {
      console.log('exposeSitemapGlobals returned null or no deduped')
    }
  } catch (err) {
    console.error('diagnostic failed', err)
    process.exitCode = 2
  }
}

run()
