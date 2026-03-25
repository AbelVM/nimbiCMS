import { describe, it, expect, vi } from 'vitest'

// Provide a basic HLJS implementation so the HLJS-specific branch runs.
vi.mock('highlight.js/lib/core', () => ({
  __esModule: true,
  default: {
    getLanguage: (n) => (n === 'plaintext' || n === 'js'),
    highlight: (code, opts) => ({ value: `<em>${String(code)}</em>` }),
    highlightElement: (el) => { el.innerHTML = el.innerHTML.replace(/</g, '&lt;') }
  }
}))

import { parseMarkdownToHtml } from '../../src/markdown.js'

describe('parseMarkdownToHtml images and heading classes (HLJS branch)', () => {
  it('adds lazy loading to images and assigns unique heading ids/classes', async () => {
    const md = [
      '```\nconsole.log(1)\n```',
      '',
      '<img src="/a.png">',
      '',
      '<img src="/b.png" loading="eager">',
      '',
      '![mdimg](/c.png)',
      '',
      '# Title',
      '',
      '# Title'
    ].join('\n')

    const res = await parseMarkdownToHtml(md)
    const html = String(res && res.html || '')

    expect(html).toContain('src="/a.png"')
    expect(html).toContain('loading="lazy"')
    expect(html).toContain('src="/b.png"')
    expect(html).toContain('loading="eager"')
    // markdown image should also get lazy loading
    expect(html).toContain('src="/c.png"')

    // headings should have ids and classes applied and be unique
    expect(html).toMatch(/<h1 [^>]*id="title"/i)
    expect(html).toMatch(/<h1 [^>]*id="title-2"/i)
  })
})
