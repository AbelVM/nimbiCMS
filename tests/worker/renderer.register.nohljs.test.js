import { describe, it, expect, vi } from 'vitest'

// force static import to throw and importCache to return null so hljs is unavailable
vi.mock('https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js', () => { throw new Error('no static') }, { virtual: true })
vi.mock('../../src/utils/importCache.js', () => ({ importUrlWithCache: vi.fn(async () => null), runImportWithCache: vi.fn(), clearImportCache: vi.fn(), setImportNegativeCacheTTL: vi.fn() }), { virtual: true })

import { handleWorkerMessage, clearRendererImportCache } from '../../src/worker/renderer.js'

describe('renderer register when hljs unavailable', () => {
  beforeEach(() => { clearRendererImportCache(); vi.resetAllMocks() })

  it('returns register-error when hljs cannot be loaded', async () => {
    const res = await handleWorkerMessage({ type: 'register', name: 'x', url: 'http://example.com/x.js' })
    expect(res).toHaveProperty('type', 'register-error')
    expect(res).toHaveProperty('name', 'x')
    expect(typeof res.error).toBe('string')
  })
})
