import { describe, it, expect, vi } from 'vitest'
import {
  makeWorkerManager,
  makeWorkerPool,
  makeWorkerManagerFromRaw,
} from '../src/worker-manager.js'

describe('worker-manager additional branches', () => {
  it('makeWorkerManager: handles createWorker throwing', async () => {
    const factory = () => { throw new Error('init-err') }
    const mgr = makeWorkerManager(factory, 'throw-manager')
    await expect(mgr.send({ type: 'x' }, 50)).rejects.toThrow(/worker unavailable/)
  })

  it('makeWorkerManager: rejects when postMessage throws synchronously', async () => {
    const w = {
      listeners: { message: [], error: [] },
      addEventListener(type, fn) { this.listeners[type].push(fn) },
      removeEventListener(type, fn) { const i = this.listeners[type].indexOf(fn); if (i !== -1) this.listeners[type].splice(i,1) },
      postMessage(msg) { throw new Error('postMessage failed') },
      terminate() {},
    }
    const mgr = makeWorkerManager(() => w, 'pm-throw')
    await expect(mgr.send({ type: 'x' }, 50)).rejects.toThrow(/postMessage failed/)
  })

  it('makeWorkerPool: recovers when createWorker throws initially', async () => {
    let callCount = 0
    const factory = () => {
      callCount++
      if (callCount === 1) throw new Error('boom')
      return {
        listeners: { message: [], error: [] },
        addEventListener(type, fn) { this.listeners[type].push(fn) },
        removeEventListener(type, fn) { const i = this.listeners[type].indexOf(fn); if (i !== -1) this.listeners[type].splice(i,1) },
        postMessage(msg) {
          setTimeout(() => {
            const ev = { data: { id: msg.id, result: 'ok' } }
            this.listeners.message.forEach(fn => fn(ev))
          }, 0)
        },
        terminate() { this.terminated = true },
      }
    }
    const pool = makeWorkerPool(factory, 'pool-throw', 2)
    const res = await pool.send({ type: 'x' }, 1000)
    expect(res).toBe('ok')
    pool.terminate()
  })

  it('makeWorkerManagerFromRaw: inline handler used and errors propagate', async () => {
    const okHandler = async (msg) => ({ id: msg && msg.id, result: 'raw-ok' })
    const mgr = makeWorkerManagerFromRaw('', okHandler, 'raw-test')
    const res = await mgr.send({ type: 'a' }, 1000)
    expect(res).toBe('raw-ok')
    mgr.terminate()

    const badHandler = async (msg) => { throw new Error('fn-bad') }
    const mgr2 = makeWorkerManagerFromRaw('', badHandler, 'raw-test2')
    await expect(mgr2.send({ type: 'a' }, 1000)).rejects.toThrow(/fn-bad/)
    mgr2.terminate()
  })

  it('makeWorkerPool: idle timers terminate workers after IDLE_MS', async () => {
    vi.useFakeTimers()
    try {
      const created = []
      const factory = () => {
        const w = {
          terminated: false,
          listeners: { message: [], error: [] },
          addEventListener(type, fn) { this.listeners[type].push(fn) },
          removeEventListener(type, fn) { const idx = this.listeners[type].indexOf(fn); if (idx !== -1) this.listeners[type].splice(idx,1) },
          postMessage(msg) {
            setTimeout(() => {
              const ev = { data: { id: msg.id, result: { ok: true } } }
              this.listeners.message.forEach(fn => fn(ev))
            }, 10)
          },
          terminate() { this.terminated = true }
        }
        created.push(w)
        return w
      }
      const pool = makeWorkerPool(factory, 'idle-pool', 1)
      const p = pool.send({ type: 'x' }, 1000)
      vi.advanceTimersByTime(10)
      const res = await p
      expect(res).toEqual({ ok: true })

      const IDLE_MS = 30 * 1000
      vi.advanceTimersByTime(IDLE_MS + 10)
      // allow any pending microtasks to run
      await Promise.resolve()
      expect(created[0].terminated).toBeTruthy()
      pool.terminate()
    } finally {
      vi.useRealTimers()
    }
  })

  it('makeWorkerManager: rejects on timeout when worker does not reply', async () => {
    const silent = {
      listeners: { message: [], error: [] },
      addEventListener(type, fn) { this.listeners[type].push(fn) },
      removeEventListener(type, fn) { const i = this.listeners[type].indexOf(fn); if (i !== -1) this.listeners[type].splice(i,1) },
      postMessage(msg) { /* no reply */ },
      terminate() { this.terminated = true },
    }
    const mgr = makeWorkerManager(() => silent, 'silent-mgr')
    await expect(mgr.send({ type: 'x' }, 20)).rejects.toThrow(/worker timeout/)
  })
})
