import { afterEach, describe, expect, it, vi } from 'vitest'
import { addMarkdownExtension, parseMarkdownToHtml, setMarkdownExtensions, streamParseMarkdown } from '../src/markdown.js'

describe('markdown additional branch paths', () => {
  const originalParser = globalThis.DOMParser

  afterEach(() => {
    globalThis.DOMParser = originalParser
    vi.restoreAllMocks()
  })

  it('accepts object/function extensions and ignores invalid entries', async () => {
    setMarkdownExtensions([{}, null, { walkTokens() {} }])
    addMarkdownExtension({ renderer: {} })
    addMarkdownExtension(() => ({}))
    addMarkdownExtension(0)

    const out = await parseMarkdownToHtml('# Title\n\nBody')
    expect(String(out.html)).toContain('<h1')
  })

  it('streamParseMarkdown uses regex heading fallback when parser is unavailable', async () => {
    delete globalThis.DOMParser
    const chunks = []
    await streamParseMarkdown('# A\n\n## B\n\ntext', (html, info) => {
      chunks.push({ html, info })
    }, { chunkSize: 8 })

    expect(chunks.length).toBeGreaterThan(0)
    const withToc = chunks.find((c) => c.info && Array.isArray(c.info.toc) && c.info.toc.length)
    expect(withToc).toBeTruthy()
  })
})
