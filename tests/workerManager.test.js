import { describe, it, expect, vi } from 'vitest'
import { makeWorkerManager } from '../src/worker-manager.js'

// Minimal MockWorker implementing addEventListener/removeEventListener/postMessage/terminate
class MockWorker {
  constructor(delay = 5, fail = false) {
    this._listeners = { message: [], error: [] }
    this._delay = delay
    this._fail = fail
  }
  addEventListener(evt, cb) {
    if (!this._listeners[evt]) this._listeners[evt] = []
    this._listeners[evt].push(cb)
  }
  removeEventListener(evt, cb) {
    if (!this._listeners[evt]) return
    const i = this._listeners[evt].indexOf(cb)
    if (i !== -1) this._listeners[evt].splice(i, 1)
  }
  postMessage(msg) {
    // simulate async reply or error
    setTimeout(() => {
      if (this._fail) {
        const ev = { message: 'boom' }
        for (const cb of this._listeners.error.slice()) cb(ev)
      } else {
        const ev = { data: { id: msg.id, result: { ok: true, echo: msg } } }
        for (const cb of this._listeners.message.slice()) cb(ev)
      }
    }, this._delay)
  }
  terminate() { }
}

describe('worker-manager', () => {
  it('sends and receives normal messages', async () => {
    const mgr = makeWorkerManager(() => new MockWorker(5, false), 'test')
    const res = await mgr.send({ type: 'ping' }, 1000)
    expect(res).toBeDefined()
    expect(res.ok).toBe(true)
    expect(res.echo.type).toBe('ping')
  })

  it('times out if worker does not respond in time', async () => {
    const mgr = makeWorkerManager(() => new MockWorker(100, false), 'test')
    await expect(mgr.send({ type: 'slow' }, 10)).rejects.toThrow('worker timeout')
  })

  it('rejects when worker emits error', async () => {
    const mgr = makeWorkerManager(() => new MockWorker(5, true), 'test')
    await expect(mgr.send({ type: 'fail' }, 1000)).rejects.toThrow()
  })
})
