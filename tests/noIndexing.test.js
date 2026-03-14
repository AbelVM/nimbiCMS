import { describe, it, expect, beforeEach } from 'vitest'
import { buildSearchIndex, _setAllMd, setContentBase } from '../src/slugManager.js'

describe('slugManager noIndexing', () => {
  beforeEach(() => {
    // reset any internal manifest/state used by tests
    _setAllMd({})
  })

  it('respects noIndexing array and excludes specified paths from index', async () => {
    // stub global.fetch used by fetchMarkdown
    const store = {
      'a.md': '# A\n\nFirst paragraph',
      'b.md': '# B\n\nSecond paragraph',
      'secret/hidden.md': '# Hidden\n\nTop secret'
    }
    global.fetch = async (url) => {
      const s = String(url || '')
      for (const k of Object.keys(store)) {
        if (s.endsWith(k)) return { ok: true, status: 200, text: () => Promise.resolve(store[k]) }
      }
      return { ok: false, status: 404, text: () => Promise.resolve('') }
    }

    // register the manifest so the indexer can discover these files
    _setAllMd({
      '/content/a.md': store['a.md'],
      '/content/b.md': store['b.md'],
      '/content/secret/hidden.md': store['secret/hidden.md']
    })
    setContentBase('/content/')

    const idx = await buildSearchIndex('/content/', 1, ['secret/hidden.md'])
    const paths = idx.map(e => e.path)
    expect(paths).toContain('a.md')
    expect(paths).toContain('b.md')
    expect(paths).not.toContain('secret/hidden.md')
  })
})
