import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('worker anchorWorker protocol branches', () => {
  let handler

  beforeEach(async () => {
    vi.resetModules()
    handler = null
    await import('../../src/worker/anchorWorker.js')
    handler = globalThis.onmessage
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('supports PowerPool negotiated request/response with correlationId', async () => {
    const payload = {
      type: 'rewriteAnchors',
      correlationId: 'cid-1',
      html: '<a href="foo.md">x</a>',
      contentBase: 'http://example.com/content/',
      pagePath: '',
      snapshot: { allowProbe: false, homeSlug: '_home', pathToSlug: { 'foo.md': 'foo' } }
    }

    const promise = new Promise((resolve) => {
      globalThis.postMessage = (msg) => resolve(msg)
    })

    await handler({ data: payload })
    const sent = await promise
    expect(sent.correlationId).toBe('cid-1')
    expect(sent.response && sent.response.html).toContain('?page=foo')
  })

  it('returns legacy error object when rewrite throws', async () => {
    const originalParser = globalThis.DOMParser
    class ThrowingParser {
      parseFromString() {
        throw new Error('parser-fail')
      }
    }

    globalThis.DOMParser = ThrowingParser
    try {
      const promise = new Promise((resolve) => {
        globalThis.postMessage = (msg) => resolve(msg)
      })

      await handler({
        data: {
          type: 'rewriteAnchors',
          id: 'legacy-1',
          html: '<a href="foo.md">x</a>',
          contentBase: 'http://example.com/content/',
          pagePath: ''
        }
      })

      const sent = await promise
      expect(sent.id).toBe('legacy-1')
      expect(String(sent.error ?? '')).toContain('parser-fail')
    } finally {
      globalThis.DOMParser = originalParser
    }
  })
})
