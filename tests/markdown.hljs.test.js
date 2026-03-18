import { describe, it, expect, vi } from 'vitest'

describe('markdown hljs fenced-code paths', () => {
  it('uses hljs.highlight output when available', async () => {
    vi.resetModules()
    vi.doMock('highlight.js/lib/core', () => ({ default: {
      getLanguage: (name) => name === 'plaintext',
      highlight: (code, { language }) => ({ value: `<pre-highlight lang="${language}">${code}</pre-highlight>` }),
      highlightElement: (el) => { el.innerHTML = `<el-highlight>${el.innerHTML}</el-highlight>` }
    } }), { virtual: false })

    const md = await import('../src/markdown.js')
    md.markdownPlugins.length = 0

    const input = '```\nconsole.log(1)\n```'
    const out = await md.parseMarkdownToHtml(input)
    expect(out.html).toContain('pre-highlight')
    expect(out.toc).toBeDefined()
  })

  it('falls back to highlightElement when highlight throws', async () => {
    vi.resetModules()
    vi.doMock('highlight.js/lib/core', () => ({ default: {
      getLanguage: (n) => n === 'plaintext',
      highlight: () => { throw new Error('boom') },
      highlightElement: (el) => { el.innerHTML = `<el-highlight>${el.innerHTML}</el-highlight>` }
    } }), { virtual: false })

    const md = await import('../src/markdown.js')
    md.markdownPlugins.length = 0

    const input = '```\nconsole.log(2)\n```'
    const out = await md.parseMarkdownToHtml(input)
    expect(out.html).toContain('el-highlight')
  })
})
