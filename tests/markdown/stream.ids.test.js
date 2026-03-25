import { describe, it, expect } from 'vitest'
import { streamParseMarkdown } from '../../src/markdown.js'

describe('streamParseMarkdown id deduplication', () => {
  it('assigns unique incremental ids across chunks for duplicate headings', async () => {
    const md = `# Dup

first

# Dup

second

# Dup

third`
    const tocs = []
    await streamParseMarkdown(md, (html, info) => {
      if (info && Array.isArray(info.toc)) tocs.push(...info.toc.map(t => t.id))
    }, { chunkSize: 20 })
    expect(tocs.length).toBeGreaterThanOrEqual(3)
    expect(tocs[0]).toBe('dup')
    expect(tocs[1]).toBe('dup-2')
    expect(tocs[2]).toBe('dup-3')
  })
})
