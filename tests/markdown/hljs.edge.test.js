import { describe, it, expect, vi } from 'vitest'

describe('parseMarkdownToHtml HLJS fallback', () => {
  it('uses highlightElement when hljs.highlight throws', async () => {
    vi.resetModules()
    vi.mock('highlight.js/lib/core', () => ({
      __esModule: true,
      default: {
        getLanguage: (n) => (n === 'plaintext' ? {} : undefined),
        highlight: () => { throw new Error('boom') },
        highlightElement: (el) => { el.innerHTML = '<span class="hl">H</span>' }
      }
    }))
    const mdModule = await import('../../src/markdown.js')
    // Ensure plugin path is disabled so HLJS branch is considered
    const saved = Array.isArray(mdModule.markdownPlugins) ? [...mdModule.markdownPlugins] : []
    mdModule.setMarkdownExtensions([])
    const md = '```\nconsole.log("hi")\n```'
    const res = await mdModule.parseMarkdownToHtml(md)
    expect(res.html).toContain('span class="hl"')
    expect(Array.isArray(res.toc)).toBe(true)
    mdModule.setMarkdownExtensions(saved)
  })
})
