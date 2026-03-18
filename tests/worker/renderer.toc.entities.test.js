import { test, expect } from 'vitest'
import { handleWorkerMessage } from '../../src/worker/renderer.js'

test('worker decodes HTML entities in generated TOC', async () => {
  const md = '# AT&amp;T\n\n## He said &quot;Hello&quot; &amp; world\n'
  const out = await handleWorkerMessage({ id: 't-ent', md })
  expect(out).toHaveProperty('id', 't-ent')
  expect(out).toHaveProperty('result')
  const toc = out.result.toc
  expect(Array.isArray(toc)).toBe(true)
  expect(toc.length).toBeGreaterThanOrEqual(2)
  expect(toc[0].text).toBe('AT&T')
  expect(toc[1].text).toBe('He said "Hello" & world')
})
