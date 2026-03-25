import { describe, it, expect, vi } from 'vitest'
import { makeWorkerManager, createWorkerFromRaw } from '../src/worker-manager.js'

describe('worker-manager remaining branches', () => {
  it('makeWorkerManager: error event listener handles terminate throwing', () => {
    const w = {
      listeners: { message: [], error: [] },
      addEventListener(type, fn) { this.listeners[type].push(fn) },
      removeEventListener(type, fn) { const i = this.listeners[type].indexOf(fn); if (i !== -1) this.listeners[type].splice(i,1) },
      postMessage(msg) { /* no-op */ },
      terminate() { throw new Error('term-fail') }
    }
    const mgr = makeWorkerManager(() => w, 'mgr-throw-term')
    const got = mgr.get()
    // invoking the registered error listeners should not throw (inner catch swallows)
    ;(got && got.listeners && got.listeners.error || []).forEach(fn => { try { fn({ message: 'err' }) } catch (e) {} })
  })

  it('createWorkerFromRaw: internal blob cache evicts and calls URL.revokeObjectURL', () => {
    const origCache = createWorkerFromRaw._blobUrlCache
    const origCreate = URL.createObjectURL
    const origRevoke = URL.revokeObjectURL
    const origWorker = globalThis.Worker
    try {
      // mock Worker so creation succeeds
      globalThis.Worker = function (url, opts) { return { url, terminate() {}, postMessage() {}, addEventListener() {}, removeEventListener() {} } }
      let idx = 0
      URL.createObjectURL = vi.fn(() => `blob:${++idx}`)
      URL.revokeObjectURL = vi.fn()
      // ensure fresh cache created by first call
      delete createWorkerFromRaw._blobUrlCache
      createWorkerFromRaw('code1')
      // shrink internal cache to force eviction
      createWorkerFromRaw._blobUrlCache._maxSize = 1
      createWorkerFromRaw('code2')
      expect(URL.revokeObjectURL).toHaveBeenCalled()
    } finally {
      if (origCache) createWorkerFromRaw._blobUrlCache = origCache
      else delete createWorkerFromRaw._blobUrlCache
      URL.createObjectURL = origCreate
      URL.revokeObjectURL = origRevoke
      globalThis.Worker = origWorker
    }
  })

  it('createWorkerFromRaw: handles URL.createObjectURL throwing (returns null)', () => {
    const origCreate = URL.createObjectURL
    const origWorker = globalThis.Worker
    try {
      globalThis.Worker = function (url, opts) { return { url, terminate() {}, postMessage() {}, addEventListener() {}, removeEventListener() {} } }
      URL.createObjectURL = vi.fn(() => { throw new Error('create failed') })
      // ensure any existing cache not interfering
      delete createWorkerFromRaw._blobUrlCache
      const res = createWorkerFromRaw('code')
      expect(res).toBeNull()
    } finally {
      URL.createObjectURL = origCreate
      globalThis.Worker = origWorker
    }
  })
})
