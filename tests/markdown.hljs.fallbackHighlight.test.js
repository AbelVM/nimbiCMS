import { test, expect, vi } from 'vitest'

vi.mock('highlight.js/lib/core', () => ({
  default: {
    getLanguage: () => true,
    highlight: () => { throw new Error('simulate failure') },
    highlightElement: (el) => { el.innerHTML = 'FALLBACK-HIGHLIGHT' }
  }
}))

test('parseMarkdownToHtml falls back to hljs.highlightElement when highlight throws', async () => {
  vi.resetModules()
  const mdModule = await import('../src/markdown.js')
  mdModule.setMarkdownExtensions([])
  const md = '```\nconsole.log("x")\n```'
  const res = await mdModule.parseMarkdownToHtml(md)
  expect(res).toBeTruthy()
  expect(res.html).toMatch(/FALLBACK-HIGHLIGHT/)
})
