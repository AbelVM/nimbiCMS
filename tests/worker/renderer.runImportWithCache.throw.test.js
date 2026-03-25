import { describe, it, expect, vi, beforeEach } from 'vitest'

// Ensure static CDN import succeeds but the cache write operation throws
vi.mock('https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js', () => ({
  default: {
    registerLanguage: vi.fn(),
    getLanguage: (name) => (name === 'javascript' || name === 'plaintext'),
    highlight: (code, { language } = {}) => ({ value: `<i>HL:${language}:${code}</i>` })
  }
}), { virtual: true })

vi.mock('../../src/utils/importCache.js', () => ({
  importUrlWithCache: vi.fn(),
  runImportWithCache: vi.fn(async () => { throw new Error('cache write fail') }),
  clearImportCache: vi.fn(),
  setImportNegativeCacheTTL: vi.fn()
}), { virtual: true })

import { handleWorkerMessage, clearRendererImportCache } from '../../src/worker/renderer.js'

describe('renderer runImportWithCache error handling', () => {
  beforeEach(() => { clearRendererImportCache(); vi.resetAllMocks() })

  it('continues rendering when runImportWithCache throws', async () => {
    const md = '```javascript\nconsole.log("x")\n```\n'
    const res = await handleWorkerMessage({ id: 'runcache', md })
    expect(res).toHaveProperty('id', 'runcache')
    expect(res.result.html).toContain('language-javascript')
    // HTML escapes quotes, assert on code presence and escaped quotes
    expect(res.result.html).toContain('console.log')
    expect(res.result.html).toContain('&quot;x&quot;')
  })
})
