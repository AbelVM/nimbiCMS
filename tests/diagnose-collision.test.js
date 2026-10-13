import { test, expect } from 'vitest'
import { _setAllMd, setContentBase, slugToMd, mdToSlug, setFetchMarkdown, buildSearchIndex } from '../src/slugManager.js'

test('diagnose duplicate docs README slug mapping', async () => {
  // reset
  slugToMd.clear()
  mdToSlug.clear()
  _setAllMd({})

  const manifest = {
    '/docs/README.md': '# nimbi-cms\n\nRoot docs README',
    '/docs/nimbi-cms/README.md': '# nimbi-cms\n\nModule README'
  }
  _setAllMd(manifest)

  // shim fetchMarkdown to return manifest entries
  setFetchMarkdown(async (path, base) => {
    const rel = String(path ?? '').replace(/^\//, '')
    const baseClean = String(base ?? '').replace(/^\//, '').replace(/\/$/, '')
    const key = baseClean ? `/${baseClean}/${rel}` : `/${rel}`
    const raw = manifest[key]
    if (!raw) throw new Error('manifest missing: ' + key)
    return { raw }
  })

  // Apply content base (derive prefix)
  setContentBase()

  // Inspect mappings after setContentBase
  const before = Array.from(slugToMd.entries())
  console.log('slugToMd after setContentBase:', JSON.stringify(before, null, 2))
  const beforeMd = Array.from(mdToSlug.entries())
  console.log('mdToSlug after setContentBase:', JSON.stringify(beforeMd, null, 2))

  // Build search index which may derive unique slugs as well
  const idx = await buildSearchIndex(undefined, 1, undefined, undefined)
  console.log('index entries count', idx.length)
  const after = Array.from(slugToMd.entries())
  console.log('slugToMd after buildSearchIndex:', JSON.stringify(after, null, 2))
  const afterMd = Array.from(mdToSlug.entries())
  console.log('mdToSlug after buildSearchIndex:', JSON.stringify(afterMd, null, 2))

  // Ensure the two README paths map to distinct slugs
  const s1 = mdToSlug.get('README.md') || mdToSlug.get('docs/README.md')
  const s2 = mdToSlug.get('nimbi-cms/README.md') || mdToSlug.get('docs/nimbi-cms/README.md')
  // we don't assert exact slug names, but they must differ and map back
  expect(s1).not.toBeUndefined()
  expect(s2).not.toBeUndefined()
  expect(s1).not.toBe(s2)
}, 20000)
