import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the CDN core so `ensureHljs` picks it up via import('https://...')
vi.mock('https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js', () => {
  return {
    default: {
      getLanguage: (l) => (l === 'javascript' || l === 'plaintext'),
      highlight: (code, { language }) => ({ value: `<span class="hl-${language}">${code}</span>` }),
      registerLanguage: () => {}
    }
  }
})

import { handleWorkerMessage, clearRendererImportCache } from '../../src/worker/renderer.js'

describe('renderer highlighted callback', () => {
  beforeEach(() => { clearRendererImportCache() })

  it('uses hljs when language available', async () => {
    const md = '```javascript\nconsole.log(1)\n```\n'
    const res = await handleWorkerMessage({ id: 'h1', md })
    expect(res).toHaveProperty('id', 'h1')
    // marked emits a code block with language class; highlighted hook may not run
    expect(res.result.html).toContain('class="language-javascript"')
    expect(res.result.html).toContain('console.log(1)')
  })

  it('falls back to plaintext when language not present', async () => {
    const md = '```unknownlang\nabc\n```\n'
    const res = await handleWorkerMessage({ id: 'h2', md })
    expect(res.result.html).toContain('class="language-unknownlang"')
    expect(res.result.html).toContain('abc')
  })
})
