import { describe, it, expect, vi } from 'vitest'

// Ensure HLJS branch is disabled so parseMarkdownToHtml falls back to
// using the renderer worker path.
vi.mock('highlight.js/lib/core', () => ({ __esModule: true, default: { getLanguage: () => undefined } }))

// Force worker response to be invalid (missing `html`) by mocking PowerPool.
vi.mock('performance-helpers/powerPool', () => ({
  PowerPool: class {
    constructor(source, opts) {
      this.workers = [{ worker: { _underlying: {} } }]
    }
    postMessage() {
      return Promise.resolve({})
    }
  }
}))

describe('parseMarkdownToHtml worker invalid response', () => {
  it('throws when renderer worker returns invalid response', async () => {
    vi.resetModules()
    const mdModule = await import('../../src/markdown.js')
    await expect(mdModule.parseMarkdownToHtml('simple text')).rejects.toThrow('renderer worker returned invalid response')
  })
})
