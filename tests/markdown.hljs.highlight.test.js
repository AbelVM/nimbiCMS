import { describe, it, expect, vi } from 'vitest'

vi.mock('highlight.js/lib/core', () => ({ default: { getLanguage: (n) => true, highlight: (code, opts) => ({ value: `HL(${opts.language})` }) } }))

describe('parseMarkdownToHtml hljs highlight success', () => {
  it('uses hljs.highlight output when available', async () => {
    vi.resetModules()
    const md = await import('../src/markdown.js')
    const input = '```\nconsole.log(1)\n```\n'
    const res = await md.parseMarkdownToHtml(input)
    expect(res).toBeTruthy()
    // replacement uses plaintext highlighting for the captured blocks
    expect(res.html).toContain('HL(plaintext)')
  })
})
