import { describe, it, expect, vi } from 'vitest'

vi.mock('highlight.js/lib/core', () => ({ __esModule: true, default: { getLanguage: () => undefined } }))

describe('parseMarkdownToHtml \u2014 worker path', () => {
  it('returns valid result via worker when HLJS language detection returns undefined', async () => {
    const { parseMarkdownToHtml, setMarkdownExtensions, markdownPlugins } = await import('../../src/markdown.js')
    const saved = Array.isArray(markdownPlugins) ? [...markdownPlugins] : []
    setMarkdownExtensions([])

    const res = await parseMarkdownToHtml('plain text without codeblocks')
    expect(res).toBeTruthy()
    expect(typeof res.html).toBe('string')
    expect(res.html.length).toBeGreaterThan(0)

    setMarkdownExtensions(saved)
  })
})
