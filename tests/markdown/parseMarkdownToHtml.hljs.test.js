import { describe, it, expect, vi } from 'vitest'

// Ensure HLJS functions available for the highlight branch
vi.mock('highlight.js/lib/core', () => {
  return {
    default: {
      getLanguage: (name) => name === 'plaintext' || name === 'js',
      highlight: (code, opts) => ({ value: `<em>${String(code)}</em>` }),
      highlightElement: (el) => { el.innerHTML = el.innerHTML.replace(/</g, '&lt;') }
    }
  }
})

import { parseMarkdownToHtml } from '../../src/markdown.js'

describe('parseMarkdownToHtml hljs branch', () => {
  it('highlights fenced code blocks when hljs is available', async () => {
    const md = '```js\nconsole.log("hi")\n```'
    const res = await parseMarkdownToHtml(md)
    expect(res).toBeTruthy()
    expect(String(res.html || '').toLowerCase()).toContain('<pre')
  })
})
