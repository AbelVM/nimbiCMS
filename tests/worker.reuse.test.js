import { describe, it, expect, vi, beforeEach } from 'vitest'

let lastPool = null
vi.mock('../src/worker-manager.js', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    makeWorkerPool(createWorker, name, size) {
      let creationCount = 0
      const wrappedCreate = () => {
        creationCount += 1
        return createWorker()
      }
      // Force pool size to 1 for deterministic reuse verification in tests
      const mgr = actual.makeWorkerPool(wrappedCreate, name, 1)
      mgr._creationCount = () => creationCount
      lastPool = mgr
      return mgr
    },
    _getLastPool() { return lastPool }
  }
})

describe('renderer worker reuse', () => {
  beforeEach(() => {
    vi.resetModules()
    lastPool = null
  })

  it('creates a single worker for multiple renders', async () => {
    const md = await import('../src/markdown.js')
    await md.parseMarkdownToHtml('Simple content with no codeblocks or frontmatter')
    await md.parseMarkdownToHtml('Second render without codeblocks')

    const wm = await import('../src/worker-manager.js')
    const pool = wm._getLastPool && wm._getLastPool()
    expect(pool).toBeTruthy()
    expect(pool._creationCount()).toBe(1)
  })
})
