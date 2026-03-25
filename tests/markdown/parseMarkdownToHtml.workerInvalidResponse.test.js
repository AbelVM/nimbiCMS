import { describe, it, expect, vi } from 'vitest'

// Ensure HLJS branch is disabled so parseMarkdownToHtml falls back to
// using the renderer worker path.
vi.mock('highlight.js/lib/core', () => ({ __esModule: true, default: { getLanguage: () => undefined } }))

// Mock worker-manager to return a pool whose `send` yields an invalid
// response object (missing `html`) to exercise the error branch.
vi.mock('../../src/worker-manager.js', () => ({
  __esModule: true,
  makeWorkerPool: (factory, name, size) => ({
    get: () => ({}),
    send: async () => ({})
  })
}))

import { parseMarkdownToHtml } from '../../src/markdown.js'

describe('parseMarkdownToHtml worker invalid response', () => {
  it('throws when renderer worker returns invalid response', async () => {
    await expect(parseMarkdownToHtml('simple text')).rejects.toThrow('renderer worker returned invalid response')
  })
})
