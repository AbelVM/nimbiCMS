import { it, expect, vi } from 'vitest'

vi.mock('../src/worker/renderer.entry.js?worker&inline', () => ({
  default: function FakeWorker() {
    const handlers = { error: [], message: [] }
    this.addEventListener = (ev, h) => { if (handlers[ev]) handlers[ev].push(h) }
    this.removeEventListener = (ev, h) => { if (handlers[ev]) handlers[ev] = handlers[ev].filter(x=>x!==h) }
    this.postMessage = () => {}
    this.terminate = () => {}
  }
}))

it('initRendererWorker returns a worker instance from the pool', async () => {
  vi.resetModules()

  const md = await import('../src/markdown.js')
  const w1 = md.initRendererWorker()
  expect(w1).toBeTruthy()

  // subsequent calls return the same instance (pool reuse)
  const w2 = md.initRendererWorker()
  expect(w2).toBeTruthy()
  expect(w2).toBe(w1)
})
