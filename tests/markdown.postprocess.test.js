import { it, expect } from 'vitest'
import { parseMarkdownToHtml } from '../src/markdown.js'

it('assigns ids to headings and returns toc entries', async () => {
  const res = await parseMarkdownToHtml('# Title\n\n## Subtitle')
  expect(res.toc.some(e => e.text === 'Title')).toBe(true)
  expect(res.html).toContain('id="title"')
  expect(res.toc.some(e => e.text === 'Subtitle' && e.level === 2)).toBe(true)
})

it('adds loading=lazy to images without attribute', async () => {
  const res = await parseMarkdownToHtml('![alt](img.png)')
  expect(res.html).toContain('loading="lazy"')
})

it('removes language-undefined class from code blocks', async () => {
  const res = await parseMarkdownToHtml('```undefined\ncode\n```')
  expect(res.html).not.toContain('language-undefined')
})

it('preserves frontmatter metadata in result.meta', async () => {
  const md = '---\ntitle: MyDoc\n---\n# MyDoc'
  const res = await parseMarkdownToHtml(md)
  expect(res.meta && res.meta.title).toBe('MyDoc')
})
