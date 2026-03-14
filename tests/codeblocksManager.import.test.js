import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

// Mock the local language module before importing the module under test
vi.mock('highlight.js/lib/languages/javascript.js', () => ({
  default: () => ({})
}), { virtual: true })

import { registerLanguage, hljs, SUPPORTED_HLJS_MAP } from '../src/codeblocksManager.js'

describe('codeblocksManager dynamic import branches', () => {
  beforeEach(() => {
    SUPPORTED_HLJS_MAP.clear()
    vi.restoreAllMocks()
  })
  afterEach(() => {
    SUPPORTED_HLJS_MAP.clear()
  })

  it('registerLanguage succeeds when local language module is available', async () => {
    SUPPORTED_HLJS_MAP.set('javascript', 'javascript')
    const spy = vi.spyOn(hljs, 'registerLanguage').mockImplementation(() => {})
    const ok = await registerLanguage('javascript')
    expect(ok).toBe(true)
    expect(spy).toHaveBeenCalled()
  })

  it('registerLanguage returns false for a non-existent language import', async () => {
    // Ensure nothing in supported map to force import attempts
    SUPPORTED_HLJS_MAP.clear()
    const ok = await registerLanguage('no-such-language-xyz')
    expect(ok).toBe(false)
  })
})
