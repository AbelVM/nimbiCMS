import { it, expect, vi } from 'vitest'

it('parseMarkdownToHtml falls back when worker emits error event', async () => {
  vi.resetModules()
  vi.mock('../src/worker/renderer.js?worker&inline', () => ({
    default: class FakeWorker {
      constructor() { this._listeners = { message: [], error: [] } }
      addEventListener(ev, h) { if (this._listeners[ev]) this._listeners[ev].push(h) }
      removeEventListener(ev, h) { if (this._listeners[ev]) this._listeners[ev] = this._listeners[ev].filter(x=>x!==h) }
      postMessage(msg) { setTimeout(() => { this._listeners.error.forEach(h => h({ message: 'boom' })) }, 0) }
      terminate() {}
    }
  }))
  const { parseMarkdownToHtml } = await import('../src/markdown.js')
  const res = await parseMarkdownToHtml('# ErrCase')
  expect(res.html).toContain('ErrCase')
})

it('parseMarkdownToHtml falls back when worker returns data.error', async () => {
  vi.resetModules()
  vi.mock('../src/worker/renderer.js?worker&inline', () => ({
    default: class FakeWorker {
      constructor() { this._listeners = { message: [], error: [] } }
      addEventListener(ev, h) { if (this._listeners[ev]) this._listeners[ev].push(h) }
      removeEventListener(ev, h) { if (this._listeners[ev]) this._listeners[ev] = this._listeners[ev].filter(x=>x!==h) }
      postMessage(msg) { setTimeout(() => { const data = { id: msg.id, error: 'boom' }; this._listeners.message.forEach(h => h({ data })) }, 0) }
      terminate() {}
    }
  }))
  const { parseMarkdownToHtml } = await import('../src/markdown.js')
  const res = await parseMarkdownToHtml('# DataErr')
  expect(res.html).toContain('DataErr')
})

it('parseMarkdownToHtml falls back on worker timeout', async () => {
  vi.resetModules()
  vi.mock('../src/worker/renderer.js?worker&inline', () => ({
    default: class FakeWorker {
      constructor() { this._listeners = { message: [], error: [] } }
      addEventListener(ev, h) { if (this._listeners[ev]) this._listeners[ev].push(h) }
      removeEventListener(ev, h) { if (this._listeners[ev]) this._listeners[ev] = this._listeners[ev].filter(x=>x!==h) }
      postMessage(msg) { /* never respond */ }
      terminate() {}
    }
  }))
  const { parseMarkdownToHtml } = await import('../src/markdown.js')
  const res = await parseMarkdownToHtml('# TimeoutCase')
  expect(res.html).toContain('TimeoutCase')
})
