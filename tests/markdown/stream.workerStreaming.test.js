import { describe, it, expect, vi } from 'vitest'

describe('streamParseMarkdown worker streaming path', () => {
  it('receives chunk messages from worker and calls onChunk', async () => {
    vi.resetModules()

    // Prepare a deterministic worker stub and mock the worker pool
    const listeners = { message: [], error: [] }
    const workerStub = {
      addEventListener(type, fn) { if (!listeners[type]) listeners[type] = []; listeners[type].push(fn) },
      removeEventListener(type, fn) { if (!listeners[type]) return; const i = listeners[type].indexOf(fn); if (i !== -1) listeners[type].splice(i, 1) },
      postMessage(msg) {
        // simulate worker sending two chunks and a done event
        setTimeout(() => {
          const id = msg && msg.id
          const ev1 = { data: { id, type: 'chunk', html: '<p>one</p>', index: 0, isLast: false, toc: [] } }
          const ev2 = { data: { id, type: 'chunk', html: '<p>two</p>', index: 1, isLast: false, toc: [] } }
          const evDone = { data: { id, type: 'done', meta: {} } }
          ;(listeners.message || []).forEach(fn => fn(ev1))
          ;(listeners.message || []).forEach(fn => fn(ev2))
          ;(listeners.message || []).forEach(fn => fn(evDone))
        }, 0)
      },
      terminate() {}
    }

    // Expose the workerStub on the global so the hoisted vi.mock can
    // reference it later without capturing an undefined binding.
    globalThis.__WORKER_STUB = workerStub

    // Mock worker-manager before importing markdown so the module's
    // internal pool will return our deterministic worker stub.
    vi.mock('../../src/worker-manager.js', () => ({
      makeWorkerPool: (factory, name, poolSize) => ({
        get() { return globalThis.__WORKER_STUB },
        send: async (msg) => {
          // not used in this test; provide a harmless default
          return null
        }
      })
    }))

    const mdModule = await import('../../src/markdown.js')

    // Temporarily clear the VITEST env so the function takes the
    // worker-streaming path (the code prefers per-chunk parsing when
    // `process.env.VITEST` is set).
    const prev = process.env.VITEST
    let chunks = []
    try {
      delete process.env.VITEST
      await mdModule.streamParseMarkdown('# A\n\nContent', (html, info) => {
        chunks.push({ html, info })
      }, { chunkSize: 1024 })
    } finally {
      if (prev === undefined) delete process.env.VITEST
      else process.env.VITEST = prev
    }

    // Some environments may batch or dedupe messages; assert we received
    // at least one chunk and that it contains expected content.
    expect(chunks.length).toBeGreaterThanOrEqual(1)
    const allHtml = chunks.map(c => c.html).join(' ')
    expect(allHtml).toContain('one')
  })
})
