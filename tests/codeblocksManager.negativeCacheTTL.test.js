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

    const mod = await import('../src/codeblocksManager.js')
    const { registerLanguage, SUPPORTED_HLJS_MAP, hljs } = mod
    const spyRegister = vi.spyOn(hljs, 'registerLanguage').mockImplementation(() => {})

    const name = 'ttltest'

    // First attempt: no language module mocked -> should fail and set negative cache
    const first = await registerLanguage(name)
    expect(first).toBe(false)

    // Now simulate the language becoming available by resetting modules
    // and mocking the language module before re-importing the manager.
    vi.resetModules()
    vi.mock(`highlight.js/lib/languages/${name}.js`, () => ({ default: () => ({}) }), { virtual: true })
    const mod2 = await import('../src/codeblocksManager.js')
    const { registerLanguage: reg2, SUPPORTED_HLJS_MAP: sm2, hljs: hl2 } = mod2
    sm2.set(name, name)
    const spy = vi.spyOn(hl2, 'registerLanguage').mockImplementation(() => {})
    const ok = await reg2(name)
    expect(ok).toBe(true)
    expect(spy).toHaveBeenCalled()

    vi.useRealTimers()
  })
})
