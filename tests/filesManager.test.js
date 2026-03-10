import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as files from '../src/filesManager.js'

// we'll stub global fetch so fetchMarkdown can operate normally

beforeEach(() => {
  files.fetchCache.clear()
  global.fetch = vi.fn()
})

describe('filesManager module', () => {
  it('fetchMarkdown stores results in cache', async () => {
    const dummy = { ok: true, text: () => Promise.resolve('# hi') }
    global.fetch.mockResolvedValue(dummy)

    const first = await files.fetchMarkdown('foo.md', '/content/')
    expect(global.fetch).toHaveBeenCalledOnce()
    const second = await files.fetchMarkdown('foo.md', '/content/')
    expect(global.fetch).toHaveBeenCalledOnce()
    expect(second).toEqual(first)
  })

  it('clearCache removes entries', async () => {
    const dummy = { ok: true, text: () => Promise.resolve('# hi') }
    global.fetch.mockResolvedValue(dummy)
    await files.fetchMarkdown('a.md', '/c/')
    expect(files.fetchCache.size).toBe(1)
    files.clearFetchCache()
    expect(files.fetchCache.size).toBe(0)
  })
})