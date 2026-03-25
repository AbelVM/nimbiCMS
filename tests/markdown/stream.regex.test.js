import { describe, it, expect, vi } from 'vitest'
vi.mock('../../src/utils/sharedDomParser.js', () => ({ getSharedParser: () => null }))
import { streamParseMarkdown } from '../../src/markdown.js'

describe('streamParseMarkdown regex fallback', () => {
  it('generates incremental ids when no DOM parser available', async () => {
    const md = '# Dup\n\nfirst\n\n# Dup\n\nsecond\n\n# Dup\n\nthird'
    const ids = []
    await streamParseMarkdown(md, (html, info) => {
      if (info && Array.isArray(info.toc) && info.toc.length) ids.push(...info.toc.map(t => t.id))
    }, { chunkSize: 20 })
    expect(ids).toEqual(['dup','dup-2','dup-3'])
  })
})
