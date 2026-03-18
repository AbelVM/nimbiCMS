import { test, expect } from 'vitest'
import { handleWorkerMessage } from '../../src/worker/renderer.js'

test('detects fenced languages including supported fallback', async () => {
  const md = '```javascript\nconsole.log(1)\n```\n```myLang\ncode\n```'
  const out = await handleWorkerMessage({ id: 't1', type: 'detect', md, supported: ['mylang'] })
  expect(out).toHaveProperty('id', 't1')
  expect(Array.isArray(out.result)).toBe(true)
  const res = out.result
  // should include known fallback and supported name (lowercased)
  expect(res).toContain('javascript')
  expect(res).toContain('mylang')
})

test('renders headings with unique ids and builds toc', async () => {
  const md = '# Hello\n\n# Hello\n\n## Sub\n'
  const out = await handleWorkerMessage({ id: 't2', md })
  expect(out).toHaveProperty('id', 't2')
  expect(out.result).toHaveProperty('toc')
  const toc = out.result.toc
  expect(toc[0].id).toBe('hello')
  expect(toc[1].id).toBe('hello-2')
  expect(toc[2].level).toBe(2)
  // html should contain id attributes
  expect(out.result.html).toContain('id="hello"')
  expect(out.result.html).toContain('id="hello-2"')
})

test('adds loading="lazy" to img tags unless already present', async () => {
  const md = '<img src="a.jpg">\n<img src="b.jpg" loading="eager">\n'
  const out = await handleWorkerMessage({ id: 't3', md })
  const html = out.result.html
  expect(html).toContain('loading="lazy"')
  expect(html).toContain('loading="eager"')
})
