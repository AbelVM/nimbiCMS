import { describe, it, expect } from 'vitest'
import { makeWorkerManager } from '../src/worker-manager.js'

describe('worker-manager behaviors', () => {
  it('send rejects when worker unavailable', async () => {
    const mgr = makeWorkerManager(() => null, 'test')
    await expect(mgr.send({ type: 'x' }, 10)).rejects.toThrow(/worker unavailable/)
  })

  it('send resolves when worker replies with result', async () => {
    const fake = (() => {
      const listeners = { message: [], error: [] }
      return {
        addEventListener(type, fn) { if (!listeners[type]) listeners[type] = []; listeners[type].push(fn) },
        removeEventListener(type, fn) { if (!listeners[type]) return; const i = listeners[type].indexOf(fn); if (i !== -1) listeners[type].splice(i,1) },
        postMessage(msg) {
          setTimeout(() => {
            const data = { id: msg.id, result: 'ok' }
            ;(listeners.message || []).forEach(fn => fn({ data }))
          }, 0)
        },
        terminate() {}
      }
    })()

    const mgr = makeWorkerManager(() => fake, 'test')
    const res = await mgr.send({ type: 'ping' }, 1000)
    expect(res).toBe('ok')
  })

  it('send rejects on worker error event', async () => {
    const bad = (() => {
      const listeners = { message: [], error: [] }
      return {
        addEventListener(type, fn) { if (!listeners[type]) listeners[type] = []; listeners[type].push(fn) },
        removeEventListener(type, fn) { if (!listeners[type]) return; const i = listeners[type].indexOf(fn); if (i !== -1) listeners[type].splice(i,1) },
        postMessage(msg) {
          setTimeout(() => {
            ;(listeners.error || []).forEach(fn => fn({ message: 'fail' }))
          }, 0)
        },
        terminate() {}
      }
    })()
    const mgr = makeWorkerManager(() => bad, 'test')
    await expect(mgr.send({ type: 'x' }, 1000)).rejects.toThrow(/fail|worker error/)
  })
})
import { describe, it, expect } from 'vitest'
import { makeWorkerPool } from '../src/worker-manager.js'

function makeMockWorkerFactory(opts = {}) {
  const created = []
  return {
    factory: () => {
      const w = {
        calls: [],
        listeners: { message: [], error: [] },
        postMessage(msg) {
          this.calls.push(msg)
          if (opts.reply === false) return
          // reply asynchronously to simulate real Worker
          setTimeout(() => {
            const ev = { data: { id: msg.id, result: { ok: true, type: msg.type || null } } }
            this.listeners.message.forEach((fn) => fn(ev))
          }, opts.replyDelay || 10)
        },
        addEventListener(type, fn) {
          this.listeners[type].push(fn)
        },
        removeEventListener(type, fn) {
          const idx = this.listeners[type].indexOf(fn)
          if (idx !== -1) this.listeners[type].splice(idx, 1)
        },
        terminate() { this.terminated = true },
      }
      created.push(w)
      return w
    },
    created,
  }
}

describe('makeWorkerPool', () => {
  it('sends and receives responses', async () => {
    const { factory } = makeMockWorkerFactory()
    const pool = makeWorkerPool(factory, 'test-pool', 2)
    const res = await pool.send({ type: 'x' }, 1000)
    expect(res).toEqual({ ok: true, type: 'x' })
    pool.terminate()
  })

  it('round-robins across workers', async () => {
    const { factory, created } = makeMockWorkerFactory()
    const pool = makeWorkerPool(factory, 'test-pool', 2)
    const p1 = pool.send({ type: 'a' }, 1000)
    const p2 = pool.send({ type: 'b' }, 1000)
    const [r1, r2] = await Promise.all([p1, p2])
    expect(r1).toEqual({ ok: true, type: 'a' })
    expect(r2).toEqual({ ok: true, type: 'b' })
    expect(created.length).toBe(2)
    expect(created[0].calls.length + created[1].calls.length).toBe(2)
    pool.terminate()
  })

  it('rejects on timeout when worker does not reply', async () => {
    const { factory } = makeMockWorkerFactory({ reply: false })
    const pool = makeWorkerPool(factory, 'test-pool', 1)
    await expect(pool.send({ type: 'slow' }, 50)).rejects.toThrow('worker timeout')
    pool.terminate()
  })
})
