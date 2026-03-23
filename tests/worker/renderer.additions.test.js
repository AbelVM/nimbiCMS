import { test, expect } from 'vitest'
import { handleWorkerMessage } from '../../src/worker/renderer.js'

test('respects existing id/class attributes, dedupes and fallback slug "heading"', async () => {
  const md = '<h1 id="foo" class="bar">Header</h1>\n<h1 id="foo" class="bar">Header</h1>\n<h2><em>Nested</em></h2>\n<h4>!!</h4>\n<img src="a.jpg" data-want-lazy="1">\n<img src="b.jpg" loading="eager">\n'
  const res = await handleWorkerMessage({ id: 't1', md })
  expect(res).toHaveProperty('id', 't1')
  const html = res.result.html
  expect(html).toContain('id="foo"')
  expect(html).toContain('id="foo-2"')
  expect(html).toContain('id="nested"')
  expect(html).toContain('id="heading"')
  // data-want-lazy should remain and not get loading="lazy"
  expect(html).toContain('data-want-lazy')
  expect(html).not.toContain('data-want-lazy loading="lazy"')
  // image with explicit loading attr should remain untouched
  expect(html).toContain('loading="eager"')
})

test('duplication numbering increases for repeated headings', async () => {
  const md = '# Dup\n# Dup\n# Dup\n'
  const res = await handleWorkerMessage({ id: 't2', md })
  const ids = res.result.toc.map(h => h.id)
  expect(ids).toEqual(expect.arrayContaining(['dup','dup-2','dup-3']))
})

test('detects fenced language names case-insensitively', async () => {
  const md = '```MyLang\ncode\n```'
  const res = await handleWorkerMessage({ type: 'detect', id: 'd1', md })
  expect(res).toHaveProperty('id', 'd1')
  expect(Array.isArray(res.result)).toBe(true)
  expect(res.result).toContain('mylang')
})
