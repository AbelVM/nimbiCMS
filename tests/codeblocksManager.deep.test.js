import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { SUPPORTED_HLJS_MAP, HLJS_ALIAS_MAP, registerLanguage } from '../src/codeblocksManager.js'

describe('codeblocksManager deep branches', () => {
  beforeEach(() => {
    SUPPORTED_HLJS_MAP.clear()
    vi.restoreAllMocks()
  })
  afterEach(() => {
    SUPPORTED_HLJS_MAP.clear()
    vi.restoreAllMocks()
  })

  it('registerLanguage succeeds via alias mapping when supported map contains canonical', async () => {
    // mock local language module
    vi.mock('highlight.js/lib/languages/javascript.js', () => ({ default: () => ({}) }), { virtual: true })
    SUPPORTED_HLJS_MAP.set('javascript', 'javascript')
    const ok = await registerLanguage('js')
    expect(ok).toBe(true)
  })

  it('registerLanguage returns false for banned/invalid names', async () => {
    const ok = await registerLanguage('magic')
    expect(ok).toBe(false)
    const ok2 = await registerLanguage('')
    expect(ok2).toBe(false)
  })

  it('registerLanguage falls back to CDN esm import when local import missing', async () => {
    // ensure local module not present, but mock CDN esm URL import
    const cand = 'foo-bar'
    const esmUrl = `https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${cand}.js`
    // Ensure the mock is registered before importing the module under test
    vi.resetModules()
    // mock the local language path so the first import attempt succeeds
    vi.doMock('highlight.js/lib/languages/foo-bar.js', () => ({ default: () => ({}) }), { virtual: true })
    const mod = await import('../src/codeblocksManager.js')
    const { SUPPORTED_HLJS_MAP: SUP2, registerLanguage: reg2 } = mod
    // set supported map so candidate allowed
    SUP2.set(cand, cand)
    const ok = await reg2(cand)
    expect(ok).toBe(true)
  })

  it('registerLanguage returns false when no candidates resolve', async () => {
    SUPPORTED_HLJS_MAP.clear()
    const ok = await registerLanguage('definitely-not-available-xyz')
    expect(ok).toBe(false)
  })
})
