import { describe, it, expect, vi } from 'vitest'
import * as md from '../src/markdown.js'

describe('markdown worker branches', () => {
  it('builds toc from markdown and deduplicates heading ids', async () => {
    // ensure plugin path runs (parseMarkdownToHtml checks markdownPlugins length)
    md.markdownPlugins.length = 0
    md.markdownPlugins.push({})

    const mdText = '## Heading\n\n## Heading'
    const out = await md.parseMarkdownToHtml(mdText)
    expect(out.toc.length).toBe(2)
    expect(out.toc[0].id).toBe('heading')
    expect(out.toc[1].id).toBe('heading-2')

    // cleanup
    md.markdownPlugins.length = 0
  })

  it('detectFenceLanguages identifies languages and ignores stop words', () => {
    const input = '```js\nconsole.log(1)\n```\n```then\nfoo\n```\n```python\nprint(1)\n```'
    const res = md.detectFenceLanguages(input)
    expect(res.has('js')).toBe(true)
    expect(res.has('python')).toBe(true)
    expect(res.has('then')).toBe(false)
  })
})
