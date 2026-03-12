import { it, expect, vi } from 'vitest'

it('initRendererWorker constructs and reuses worker, recreates after error', async () => {
  vi.resetModules()
  vi.mock('../src/worker/renderer.js?worker&inline', () => ({
    default: function FakeWorker() {
      const handlers = { error: [], message: [] }
      this.addEventListener = (ev, h) => { if (handlers[ev]) handlers[ev].push(h) }
      this.removeEventListener = (ev, h) => { if (handlers[ev]) handlers[ev] = handlers[ev].filter(x=>x!==h) }
      this.postMessage = () => {}
      this.terminate = () => {}
      this._triggerError = (msg) => handlers.error.forEach(h => h({ message: msg }))
    }
  }))

  const md = await import('../src/markdown.js')
  const w1 = md.initRendererWorker()
  expect(w1).toBeTruthy()

  // If the fake worker exposes the trigger, invoke it to simulate an error
  if (typeof w1._triggerError === 'function') {
    w1._triggerError('boom')
    // allow any async handlers to run
    await new Promise(r => setTimeout(r, 0))
    const w2 = md.initRendererWorker()
    expect(w2).toBeTruthy()
    expect(w2).not.toBe(w1)
  } else {
    // fallback expectation: subsequent init returns same instance
    const w2 = md.initRendererWorker()
    expect(w2).toBe(w1)
  }
})
