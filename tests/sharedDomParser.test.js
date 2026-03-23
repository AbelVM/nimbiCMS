import { describe, it, expect, vi } from 'vitest'

describe('sharedDomParser', () => {
  it('returns null when DOMParser is not available', async () => {
    vi.resetModules()
    const orig = global.DOMParser
    try {
      delete global.DOMParser
      const { getSharedParser } = await import('../src/utils/sharedDomParser.js')
      expect(getSharedParser()).toBeNull()
    } finally {
      global.DOMParser = orig
    }
  })

  it('reuses the same parser instance when DOMParser is present', async () => {
    vi.resetModules()
    let constructed = 0
    global.DOMParser = class {
      constructor() { constructed += 1 }
      parseFromString() { return {} }
    }
    const { getSharedParser } = await import('../src/utils/sharedDomParser.js')
    const a = getSharedParser()
    const b = getSharedParser()
    expect(a).toBe(b)
    expect(constructed).toBe(1)
    delete global.DOMParser
  })
})
