import { createWorkerFromRaw } from '../src/worker-manager.js'
import { PowerCache } from 'performance-helpers/powerCache'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('createWorkerFromRaw blob URL cache eviction', () => {
  let origCache
  let createSpy
  let revokeSpy

  beforeEach(() => {
    origCache = createWorkerFromRaw._blobUrlCache
    createSpy = vi.spyOn(URL, 'createObjectURL').mockImplementation(() => `blob:${Math.random().toString(36).slice(2)}`)
    revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  })

  afterEach(() => {
    if (origCache) createWorkerFromRaw._blobUrlCache = origCache
    else delete createWorkerFromRaw._blobUrlCache
    createSpy.mockRestore()
    revokeSpy.mockRestore()
  })

  it('revokes the oldest blob URL when cache evicts', () => {
    // Use a tiny cache and ensure eviction calls URL.revokeObjectURL
    createWorkerFromRaw._blobUrlCache = new PowerCache({ maxEntries: 1, onEvict: (k, v) => URL.revokeObjectURL(v) })

    createWorkerFromRaw('code1')
    createWorkerFromRaw('code2')

    expect(revokeSpy).toHaveBeenCalledTimes(1)
    const arg = revokeSpy.mock.calls[0][0]
    expect(typeof arg).toBe('string')
    expect(arg.startsWith('blob:')).toBeTruthy()
  })
})
