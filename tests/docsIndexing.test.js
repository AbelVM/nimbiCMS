import { describe, it, expect, beforeEach } from 'vitest'
import { buildSearchIndex, setFetchMarkdown, setContentBase, _setAllMd, slugToMd, mdToSlug } from '../src/slugManager.js'
import { readFile } from 'fs/promises'
import { join } from 'path'

describe('docs indexing', () => {
  beforeEach(() => {
    // Reset slug maps and caches to avoid interference from other tests
    slugToMd.clear()
    mdToSlug.clear()
    _setAllMd({})
  })

  it('crawls docs/index/README.md and indexes functions/clearHooks', async () => {
    // Register docs files in the internal manifest so the indexer will
    // discover them without relying on directory HTML listings.
    const baseDir = join(process.cwd(), 'docs')
    const files = [
      'hookManager/README.md',
      'hookManager/functions/clearHooks.md'
    ]
    const manifest = {}
    for (const f of files) {
      const full = join(baseDir, f)
      const raw = await readFile(full, 'utf8')
      manifest['/docs/' + f] = raw
    }
    _setAllMd(manifest)
    // Provide fetchMarkdown that reads from the local docs tree during indexing
    setFetchMarkdown(async (path, base) => {
      const rel = String(path || '').replace(/^\//, '')
      const full = join(baseDir, rel)
      const raw = await readFile(full, 'utf8')
      return { raw }
    })
    setContentBase('/docs/')
    const idx = await buildSearchIndex('/docs/', 3)
    const paths = idx.map(e => e.path)
    expect(paths).toContain('hookManager/functions/clearHooks.md')
  })

  it('generates unique slugs when multiple files have identical H1 titles', async () => {
    // Two markdown files with the same top-level heading
    const baseDir = join(process.cwd(), 'docs')
    const manifest = {
      '/docs/a.md': '# Same title\n\nContent A',
      '/docs/b.md': '# Same title\n\nContent B'
    }
    _setAllMd(manifest)
    setContentBase('/docs/')

    // The slug map should contain both `same-title` and `same-title-2`
    const keys = Array.from(slugToMd.keys())
    expect(keys).toContain('same-title')
    expect(keys).toContain('same-title-2')
    // The slug map stores paths relative to the configured content base.
    expect(slugToMd.get('same-title')).toBe('a.md')
    expect(slugToMd.get('same-title-2')).toBe('b.md')
  })
})
