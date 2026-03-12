import { it, expect } from 'vitest'
import { parseMarkdownToHtml } from '../src/markdown.js'
import hljs from 'highlight.js/lib/core'

it('uses hljs.highlight for plaintext when available', async () => {
  const origGet = hljs.getLanguage
  const origHighlight = hljs.highlight
  try {
    hljs.getLanguage = (n) => n === 'plaintext'
    hljs.highlight = (code, { language }) => ({ value: 'PLAIN_HIGHLIGHT' })
    const res = await parseMarkdownToHtml('```\ncode\n```')
    expect(res.html).toContain('PLAIN_HIGHLIGHT')
  } finally {
    hljs.getLanguage = origGet
    hljs.highlight = origHighlight
  }
})

it('preserves explicit language class for fenced code', async () => {
  const res = await parseMarkdownToHtml('```js\nconsole.log("x")\n```')
  expect(res.html).toContain('language-js')
})
