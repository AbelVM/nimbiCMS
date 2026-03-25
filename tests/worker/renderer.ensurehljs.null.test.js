import { describe, it, expect, vi, beforeEach } from 'vitest'

// Simulate static import failure and importCache returning null (hljs unavailable)
vi.mock('https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js', () => { throw new Error('no static') }, { virtual: true })

vi.mock('../../src/utils/importCache.js', () => ({
  importUrlWithCache: vi.fn(async () => null),
  runImportWithCache: vi.fn(),
  clearImportCache: vi.fn(),
  setImportNegativeCacheTTL: vi.fn()
}), { virtual: true })

import { handleWorkerMessage, clearRendererImportCache } from '../../src/worker/renderer.js'

describe('renderer ensureHljs null fallback', () => {
  beforeEach(() => { clearRendererImportCache(); vi.resetAllMocks() })

  it('renders code blocks even when hljs is unavailable', async () => {
    const md = '```javascript\nconsole.log(9)\n```\n'
    const res = await handleWorkerMessage({ id: 'nohljs', md })
    expect(res).toHaveProperty('id', 'nohljs')
    expect(res.result.html).toContain('language-javascript')
    expect(res.result.html).toContain('console.log(9)')
  })
})
