import { describe, it, expect, beforeEach } from 'vitest'
import { setMarkdownExtensions, addMarkdownExtension, parseMarkdownToHtml } from '../../src/markdown.js'

describe('parseMarkdownToHtml duplicate headings', () => {
  beforeEach(() => setMarkdownExtensions([]))

  it('creates unique ids for duplicate headings', async () => {
    // add a simple renderer plugin so the plugin path is exercised
    addMarkdownExtension({ renderer: { paragraph: (text) => `<p>${text}</p>` } })
    const md = '# Title\n\n# Title\n\n# Title\n'
    const res = await parseMarkdownToHtml(md)
    expect(Array.isArray(res.toc)).toBe(true)
    expect(res.toc.length).toBe(3)
    const ids = res.toc.map(t => t.id)
    expect(ids[0]).toBe('title')
    expect(ids[1]).toBe('title-2')
    expect(ids[2]).toBe('title-3')
    expect(res.html).toContain('id="title"')
    expect(res.html).toContain('id="title-2"')
    expect(res.html).toContain('id="title-3"')
  })
})
