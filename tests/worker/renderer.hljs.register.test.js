import { describe, it, expect, vi } from 'vitest'

// Top-level mocks so dynamic `import()` in the module under test is intercepted
vi.mock('https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js', () => {
  const hljs = {
    default: {
      registerLanguage: vi.fn(),
      getLanguage: (name) => (name === 'javascript' || name === 'plaintext'),
      highlight: (code, opts) => ({ value: `HL:${(opts && opts.language) || 'unknown'}:${code}` })
    }
  }
  return hljs
})

vi.mock('http://example.com/lang.js', () => ({
  default: () => ({})
}))

import { handleWorkerMessage } from '../../src/worker/renderer.js'

describe('renderer hljs register and highlight branches', () => {
  it('registers language and returns registered', async () => {
    const res = await handleWorkerMessage({ type: 'register', name: 'javascript', url: 'http://example.com/lang.js' })
    expect(res).toHaveProperty('type', 'registered')
    expect(res).toHaveProperty('name', 'javascript')
  })

  it('parses code blocks and assigns language class when hljs present', async () => {
    const md = '```javascript\nconsole.log(1)\n```'
    const out = await handleWorkerMessage({ id: 'h1', md })
    expect(out).toHaveProperty('id', 'h1')
    const html = out.result.html
    // marked should at least set the language class on the code element
    expect(html).toContain('class="language-javascript"')
  })
})
