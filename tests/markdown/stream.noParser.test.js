import { describe, it, expect, vi } from 'vitest'

// Force shared parser to be unavailable so the regex fallback path runs
vi.mock('../../src/utils/sharedDomParser.js', () => ({ getSharedParser: () => null }))

import { streamParseMarkdown } from '../../src/markdown.js'

describe('streamParseMarkdown without DOM parser', () => {
  it('uses regex fallback to assign heading ids and emit toc entries', async () => {
    const md = '# One\n\n## Two\n\nSome text\n'
    const chunks = []
    await streamParseMarkdown(md, (html, info) => {
      chunks.push({ html, info })
    }, { chunkSize: 16 })
    const tocs = chunks.map(c => (c.info && c.info.toc) || []).flat()
    expect(tocs.length).toBeGreaterThan(0)
  })
})
