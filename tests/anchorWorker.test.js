import { describe, it, expect, beforeEach, vi } from 'vitest'

let handler

beforeEach(() => {
  // stub fetchMarkdown and other network activity
  global.fetch = vi.fn(async () => ({ ok: false, status: 404, text: () => Promise.resolve('') }))
  handler = null
  return import('../src/worker/anchorWorker.js').then(() => {
    handler = global.onmessage
  })
})

describe('anchor worker API (direct invocation)', () => {
  it('responds to rewriteAnchors messages by returning modified HTML', async () => {
    expect(typeof handler).toBe('function')
    const promise = new Promise(r => { global.postMessage = (msg) => r(msg) })
    // simple HTML with one markdown link that should be rewritten to ?page=foo
    const html = '<a href="foo.md">x</a>'
    // ensure slug maps so rewriteAnchors can act
    const { slugToMd, mdToSlug } = await import('../src/filesManager.js')
    slugToMd.set('foo', 'foo.md')
    mdToSlug.set('foo.md', 'foo')
    handler({ data: { type: 'rewriteAnchors', id: '1', html, contentBase: 'http://base/', pagePath: '' } })
    const res = await promise
    expect(res.id).toBe('1')
    // worker should not return an error
    expect(res.error).toBeUndefined()
    expect(typeof res.result).toBe('string')
    expect(res.result).toContain('?page=foo')
  })
})
