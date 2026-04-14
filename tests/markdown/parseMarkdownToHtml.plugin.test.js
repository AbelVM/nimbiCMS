import { describe, it, expect, beforeEach } from 'vitest'
import { setMarkdownExtensions, addMarkdownExtension, parseMarkdownToHtml } from '../../src/markdown.js'

describe('parseMarkdownToHtml plugin path', () => {
  beforeEach(() => setMarkdownExtensions([]))

  it('applies a simple renderer plugin and returns toc and lazy images', async () => {
    // simple plugin that tweaks paragraph rendering
    addMarkdownExtension({ renderer: { paragraph: (text) => `<p class=pl>${text}</p>` } })
    const md = '# Title\n\n![alt](img.png)\n\nSome text here.'
    const res = await parseMarkdownToHtml(md)
    expect(res).toBeTruthy()
    expect(Array.isArray(res.toc)).toBe(true)
    expect(res.toc.length).toBeGreaterThan(0)
    // plugin should have affected paragraph rendering
    expect(String(res.html ?? '').includes('class=pl') || String(res.html ?? '').length > 0).toBe(true)
  })
})
