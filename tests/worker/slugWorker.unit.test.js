import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/slugManager.js', () => ({
  buildSearchIndex: vi.fn(),
  crawlForSlug: vi.fn()
}))

vi.mock('../../src/slugSearchRuntime.js', () => ({
  buildSearchIndex: vi.fn(),
  crawlForSlug: vi.fn()
}))

import { handleSlugWorkerMessage } from '../../src/worker/slugWorker.js'
import { buildSearchIndex, crawlForSlug } from '../../src/slugSearchRuntime.js'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('handleSlugWorkerMessage', () => {
  it('returns result when buildSearchIndex resolves', async () => {
    buildSearchIndex.mockResolvedValue({ indexed: true })
    const res = await handleSlugWorkerMessage({ id: 1, type: 'buildSearchIndex', contentBase: '/c' })
    expect(res).toEqual({ id: 1, result: { indexed: true } })
    expect(buildSearchIndex).toHaveBeenCalledWith('/c', undefined, undefined)
  })

  it('returns error when buildSearchIndex rejects', async () => {
    buildSearchIndex.mockRejectedValue(new Error('boom'))
    const res = await handleSlugWorkerMessage({ id: 2, type: 'buildSearchIndex', contentBase: '/c' })
    expect(res).toEqual({ id: 2, error: 'Error: boom' })
  })

  it('returns null result when crawlForSlug resolves undefined', async () => {
    crawlForSlug.mockResolvedValue(undefined)
    const res = await handleSlugWorkerMessage({ id: 3, type: 'crawlForSlug', slug: 'x', base: '/b' })
    expect(res).toEqual({ id: 3, result: null })
  })

  it('returns error when crawlForSlug rejects', async () => {
    crawlForSlug.mockRejectedValue('nope')
    const res = await handleSlugWorkerMessage({ id: 4, type: 'crawlForSlug', slug: 'x', base: '/b' })
    expect(res).toEqual({ id: 4, error: 'nope' })
  })

  it('returns unsupported message for unknown types', async () => {
    const res = await handleSlugWorkerMessage({ id: 5, type: 'somethingElse' })
    expect(res).toEqual({ id: 5, error: 'unsupported message' })
  })
})

