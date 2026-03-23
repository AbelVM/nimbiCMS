import { test, expect, vi } from 'vitest'

test('marked fallback when hljs.highlight throws', async () => {
  vi.resetModules()
  vi.mock('https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js', () => ({
    default: {
      registerLanguage: vi.fn(),
      getLanguage: (name) => (name === 'javascript' || name === 'plaintext'),
      highlight: () => { throw new Error('boom') }
    }
  }), { virtual: true })
  const { handleWorkerMessage } = await import('../../src/worker/renderer.js')
  const md = '```javascript\nconsole.log(1)\n```'
  const out = await handleWorkerMessage({ id: 'hb', md })
  expect(out).toHaveProperty('id', 'hb')
  // if highlighting throws, the code should remain (no highlighted wrapper)
  expect(out.result.html).toContain('console.log(1)')
})

test('heading levels 5 and 6 get normal weight classes', async () => {
  vi.resetModules()
  const { handleWorkerMessage } = await import('../../src/worker/renderer.js')
  const md = '<h5>Title5</h5>\n<h6>Title6</h6>'
  const out = await handleWorkerMessage({ id: 'h56', md })
  const html = out.result.html
  expect(html).toContain('has-text-weight-normal')
  expect(html).toContain('id="title5"')
})
