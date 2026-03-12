import { describe, it, expect, beforeEach, vi } from 'vitest'

let handler

beforeEach(() => {
  // stub network and DOM APIs the worker may use
  global.fetch = vi.fn(async (url) => ({ ok: false, status: 404, text: () => Promise.resolve('') }))
  handler = null
  // import renderer worker script to set global.onmessage
  return import('../src/worker/renderer.js').then(() => {
    handler = global.onmessage
  })
})

describe('renderer worker API (direct invocation)', () => {
  it('renders markdown to html and returns meta/toc', async () => {
    expect(typeof handler).toBe('function')
    const promise = new Promise(r => { global.postMessage = (msg) => r(msg) })
    const md = '# Hi'
    handler({ data: { type: 'render', id: 'r1', md } })
    const res = await promise
    expect(res.id).toBe('r1')
    expect(res.result && res.result.html).toContain('<h1')
    expect(res.result && res.result.toc).toBeInstanceOf(Array)
  })

  it('registers a language module and responds with registered message', async () => {
    const promise = new Promise(r => { global.postMessage = (msg) => r(msg) })
    handler({ data: { type: 'register', name: 'test', url: 'https://example.com/lang.js' } })
    const res = await promise
    expect(res.type).toMatch(/registered|register-error/)
  })
})