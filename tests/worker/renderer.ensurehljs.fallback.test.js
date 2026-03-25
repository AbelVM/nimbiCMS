import { describe, it, expect, vi, beforeEach } from 'vitest'

// Simulate static CDN import throwing so ensureHljs falls back to importCache
vi.mock('https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js', () => { throw new Error('no static core') }, { virtual: true })

vi.mock('../../src/utils/importCache.js', () => ({
  importUrlWithCache: vi.fn(async () => ({ default: {
    getLanguage: (name) => (name === 'javascript' || name === 'plaintext'),
    highlight: (code, { language } = {}) => ({ value: `<em>HL:${language||'unknown'}:${code}</em>` }),
    registerLanguage: vi.fn()
  } })),
  runImportWithCache: vi.fn(async (url, fn) => (fn ? fn() : null)),
  clearImportCache: vi.fn(),
  setImportNegativeCacheTTL: vi.fn()
}), { virtual: true })

import { handleWorkerMessage, clearRendererImportCache } from '../../src/worker/renderer.js'

describe('renderer ensureHljs import-cache fallback', () => {
  beforeEach(() => { clearRendererImportCache(); vi.resetAllMocks() })

  it('falls back to importUrlWithCache when static import throws', async () => {
    const md = '```javascript\nconsole.log(42)\n```\n'
    const res = await handleWorkerMessage({ id: 'f1', md })
    expect(res).toHaveProperty('id', 'f1')
    // marked should include the language class and original code text
    expect(res.result.html).toContain('language-javascript')
    expect(res.result.html).toContain('console.log(42)')
  })
})
