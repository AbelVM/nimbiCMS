import { it, expect } from 'vitest'
import { parseMarkdownToHtml } from '../src/markdown.js'
import hljs from 'highlight.js/lib/core'

it('falls back to hljs.highlightElement when highlight throws', async () => {
  const origGet = hljs.getLanguage
  const origHighlight = hljs.highlight
  const origHighlightElement = hljs.highlightElement
  try {
    // simulate plaintext support present but highlight throws so the
    // inner catch path triggers and `highlightElement` is used
    hljs.getLanguage = (n) => n === 'plaintext'
    hljs.highlight = () => { throw new Error('boom') }
    hljs.highlightElement = (el) => { el.innerHTML = 'ELEMENT_HL' }

    const res = await parseMarkdownToHtml('```\ncode\n```')
    expect(res.html).toContain('ELEMENT_HL')
  } finally {
    hljs.getLanguage = origGet
    hljs.highlight = origHighlight
    hljs.highlightElement = origHighlightElement
  }
})

it('leaves code unchanged if both hljs.highlight and highlightElement fail', async () => {
  const origGet = hljs.getLanguage
  const origHighlight = hljs.highlight
  const origHighlightElement = hljs.highlightElement
  try {
    hljs.getLanguage = () => false
    hljs.highlight = () => { throw new Error('boom') }
    hljs.highlightElement = () => { throw new Error('also boom') }
    const res = await parseMarkdownToHtml('```\nplaincode\n```')
    expect(res.html).toContain('plaincode')
  } finally {
    hljs.getLanguage = origGet
    hljs.highlight = origHighlight
    hljs.highlightElement = origHighlightElement
  }
})
