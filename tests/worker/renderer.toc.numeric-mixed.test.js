import { test, expect } from 'vitest'
import { handleWorkerMessage } from '../../src/worker/renderer.js'

test('worker handles numeric entities and inline tags in headings', async () => {
  const md = "# It&#39;s fine\n\n# <em>Tag</em> &amp; More\n"
  const out = await handleWorkerMessage({ id: 't-nm', md })
  expect(out).toHaveProperty('id', 't-nm')
  expect(out).toHaveProperty('result')
  const toc = out.result.toc
  expect(Array.isArray(toc)).toBe(true)
  expect(toc.length).toBeGreaterThanOrEqual(2)
  expect(toc[0].text).toBe("It's fine")
  expect(toc[1].text).toBe('Tag & More')
})
