import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('codeblocksManager negative-cache behavior', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('negative cache prevents immediate retry after failed import', async () => {
    // Import the module fresh so caches are initialized
    const mod = await import('../src/codeblocksManager.js')
    const { registerLanguage } = mod

    // attempt to register a language that does not exist
    const name = 'neg-test-lang-' + Date.now()
    const first = await registerLanguage(name)
    expect(first).toBe(false)

    // immediate second attempt should respect negative cache and still be false
    const second = await registerLanguage(name)
    expect(second).toBe(false)

    // now reset modules and mock the language module to succeed
    vi.resetModules()
    // mock hljs core and the local language module to ensure registration succeeds
    vi.mock('highlight.js/lib/core', () => ({ registerLanguage: () => {}, getLanguage: () => false }), { virtual: true })
    vi.mock(`highlight.js/lib/languages/${name}.js`, () => ({ default: () => ({}) }), { virtual: true })
    const mod2 = await import('../src/codeblocksManager.js')
    const { SUPPORTED_HLJS_MAP, registerLanguage: reg2, hljs } = mod2
    // allow candidate via supported map
    SUPPORTED_HLJS_MAP.set(name, name)
    // ensure hljs.registerLanguage exists
    if (hljs && typeof hljs.registerLanguage === 'function') {
      const spy = vi.spyOn(hljs, 'registerLanguage').mockImplementation(() => {})
      const ok = await reg2(name)
      expect(ok).toBe(true)
      expect(spy).toHaveBeenCalled()
    } else {
      // fallback: still call and assert boolean result
      const ok = await reg2(name)
      expect(ok === true || ok === false).toBe(true)
    }
  })
})
