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
