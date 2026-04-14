import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createWorkerFromRaw } from '../src/worker-manager.js'

describe('worker-manager additional branches', () => {
  let origWorker
  let origBlob
  let origUrl
  let origCache

  beforeEach(() => {
    origWorker = globalThis.Worker
    origBlob = globalThis.Blob
    origUrl = globalThis.URL
    origCache = createWorkerFromRaw._blobUrlCache
    delete createWorkerFromRaw._blobUrlCache
  })

  afterEach(() => {
    globalThis.Worker = origWorker
    globalThis.Blob = origBlob
    globalThis.URL = origUrl
    if (origCache) createWorkerFromRaw._blobUrlCache = origCache
    else delete createWorkerFromRaw._blobUrlCache
    vi.restoreAllMocks()
  })

  it('returns null when code is empty or required APIs are missing', () => {
    expect(createWorkerFromRaw('')).toBeNull()

    delete globalThis.Blob
    expect(createWorkerFromRaw('self.onmessage=()=>{}')).toBeNull()
  })

  it('returns null when Worker construction throws', () => {
    globalThis.Worker = class {
      constructor() {
        throw new Error('worker-fail')
      }
    }
    globalThis.Blob = class {
      constructor(parts, options) {
        this.parts = parts
        this.options = options
      }
    }
    const createObjectURL = vi.fn(() => 'blob:test')
    const revokeObjectURL = vi.fn()
    globalThis.URL = { createObjectURL, revokeObjectURL }

    const worker = createWorkerFromRaw('self.onmessage=()=>{}')
    expect(worker).toBeNull()
    expect(createObjectURL).toHaveBeenCalled()
  })

  it('reuses blob URL from cache for identical source strings', () => {
    const createObjectURL = vi.fn(() => 'blob:cached')
    const revokeObjectURL = vi.fn()
    globalThis.URL = { createObjectURL, revokeObjectURL }
    globalThis.Blob = class {
      constructor(parts, options) {
        this.parts = parts
        this.options = options
      }
    }
    globalThis.Worker = class {
      constructor(url) {
        this.url = url
      }
    }

    const a = createWorkerFromRaw('self.onmessage=()=>{}')
    const b = createWorkerFromRaw('self.onmessage=()=>{}')

    expect(a).toBeTruthy()
    expect(b).toBeTruthy()
    expect(createObjectURL).toHaveBeenCalledTimes(1)
  })
})
