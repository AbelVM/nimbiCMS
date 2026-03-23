import { describe, it, expect, vi } from 'vitest'

describe('codeblocksManager dynamic import negative cache', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('dedupes concurrent import attempts (single importer call)', async () => {
    const fetchMock = vi.fn(async (url) => ({ ok: true, text: async () => '' }))
    vi.stubGlobal('fetch', fetchMock)

    const s = await import('../src/codeblocksManager.js')
    s.clearLanguageImportCache()

    let calls = 0
    s.setLanguageImporter(async (candidate) => {
      calls += 1
      // simulate async import latency
      await new Promise(r => setTimeout(r, 20))
      return null
    })

    const p1 = s.registerLanguage('xlangtest')
    const p2 = s.registerLanguage('xlangtest')
    await Promise.all([p1, p2])
    expect(calls).toBe(1)
  })

  it('negative cache prevents reattempts until TTL expires', async () => {
    const fetchMock = vi.fn(async (url) => ({ ok: true, text: async () => '' }))
    vi.stubGlobal('fetch', fetchMock)

    const s = await import('../src/codeblocksManager.js')
    s.clearLanguageImportCache()
    s.setLanguageImportNegativeCacheTTL(50)

    let calls = 0
    s.setLanguageImporter(async (candidate) => { calls += 1; return null })

    // first attempt -> importer called
    await s.registerLanguage('xlangneg')
    expect(calls).toBe(1)

    // immediate retry -> should not re-call importer because negative cache is present
    await s.registerLanguage('xlangneg')
    expect(calls).toBe(1)

    // after TTL expires, importer should be invoked again
    await new Promise(r => setTimeout(r, 80))
    await s.registerLanguage('xlangneg')
    expect(calls).toBe(2)
  })
})
