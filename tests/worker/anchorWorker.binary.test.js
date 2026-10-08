import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { o2u8, u82o } from 'performance-helpers/powerBuffer'

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

  it('supports PowerPool binary request/response with correlationId', async () => {
    const payload = o2u8({
      type: 'rewriteAnchors',
      correlationId: 'cid-1',
      html: '<a href="foo.md">x</a>',
      contentBase: 'http://example.com/content/',
      pagePath: '',
      snapshot: { allowProbe: false, homeSlug: '_home', pathToSlug: { 'foo.md': 'foo' } }
    })

    const promise = new Promise((resolve) => {
      globalThis.postMessage = (msg) => resolve(msg)
    })

    await handler({ data: payload })
    const sent = await promise
    const decoded = u82o(sent)
    expect(decoded.correlationId).toBe('cid-1')
    expect(decoded.response && decoded.response.html).toContain('?page=foo')
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
