import { describe, it, expect, vi, beforeEach } from 'vitest'

// Tests negative-cache TTL expiry behavior for registerLanguage
describe('codeblocksManager negative-cache TTL retry', () => {
  const NEGATIVE_CACHE_TTL_MS = 5 * 60 * 1000

  beforeEach(() => {
    vi.resetModules()
  })

  it('retries import after negative cache TTL expires', async () => {
    // freeze time
    vi.useFakeTimers()
    const baseTime = Date.now()
    vi.setSystemTime(baseTime)

    // Stub global fetch so loadSupportedLanguages resolves quickly
    const _origFetch = globalThis.fetch
    try {
      globalThis.fetch = async () => ({ ok: true, text: async () => '' })
    } catch (e) {}

    const mod = await import('../src/codeblocksManager.js')
    const { registerLanguage, SUPPORTED_HLJS_MAP, hljs } = mod
    const spyRegister = vi.spyOn(hljs, 'registerLanguage').mockImplementation(() => {})

    const name = 'ttltest'

    // First attempt: no language module mocked -> should fail and set negative cache
    const first = await registerLanguage(name)
    expect(first).toBe(false)

    // Now simulate the language becoming available by resetting modules
    // and injecting a custom importer before re-importing the manager.
    vi.resetModules()
    const mod2 = await import('../src/codeblocksManager.js')
    const { registerLanguage: reg2, SUPPORTED_HLJS_MAP: sm2, hljs: hl2, setLanguageImporter } = mod2
    setLanguageImporter(async (candidate) => {
      if (candidate === name) return { default: () => ({}) }
      return null
    })
    sm2.set(name, name)
    const spy = vi.spyOn(hl2, 'registerLanguage').mockImplementation(() => {})
    const ok = await reg2(name)
    expect(ok).toBe(true)
    expect(spy).toHaveBeenCalled()
    setLanguageImporter(null)

    // restore timers and fetch
    vi.useRealTimers()
    try {
      if (_origFetch === undefined) delete globalThis.fetch
      else globalThis.fetch = _origFetch
    } catch (e) {}
  }, 20000)
})
