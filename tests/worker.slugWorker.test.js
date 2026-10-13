import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handleSlugWorkerMessage } from '../src/worker/slugWorker.js'
import * as slugRuntime from '../src/slugSearchRuntime.js'

describe('slugWorker handler', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('handles buildSearchIndex success', async () => {
    const fake = [{ slug: 'a', title: 'A', path: 'a.md' }]
    vi.spyOn(slugRuntime, 'buildSearchIndex').mockResolvedValue(fake)
    const res = await handleSlugWorkerMessage({ type: 'buildSearchIndex', id: 42, contentBase: '/base/' })
    expect(res).toEqual({ id: 42, result: fake })
  })

  it('handles buildSearchIndex error', async () => {
    vi.spyOn(slugRuntime, 'buildSearchIndex').mockRejectedValue(new Error('boom'))
    const res = await handleSlugWorkerMessage({ type: 'buildSearchIndex', id: 7, contentBase: '/b/' })
    expect(res.id).toBe(7)
    expect(res.error).toMatch(/boom/)
  })

  it('handles crawlForSlug success and undefined -> null', async () => {
    vi.spyOn(slugRuntime, 'crawlForSlug').mockResolvedValue(undefined)
    const res = await handleSlugWorkerMessage({ type: 'crawlForSlug', id: 9, slug: 'x', base: '/b/' })
    expect(res).toEqual({ id: 9, result: null })
  })

  it('handles crawlForSlug found', async () => {
    vi.spyOn(slugRuntime, 'crawlForSlug').mockResolvedValue('path/to.md')
    const res = await handleSlugWorkerMessage({ type: 'crawlForSlug', id: 10, slug: 'y', base: '/b/' })
    expect(res).toEqual({ id: 10, result: 'path/to.md' })
  })

  it('handles crawlForSlug error', async () => {
    vi.spyOn(slugRuntime, 'crawlForSlug').mockRejectedValue(new Error('crawl fail'))
    const res = await handleSlugWorkerMessage({ type: 'crawlForSlug', id: 11, slug: 'z', base: '/b/' })
    expect(res.id).toBe(11)
    expect(res.error).toMatch(/crawl fail/)
  })

  it('returns unsupported message error', async () => {
    const res = await handleSlugWorkerMessage({ type: 'unknown', id: 99 })
    expect(res.id).toBe(99)
    expect(res.error).toBeDefined()
  })
})
