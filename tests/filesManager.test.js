import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as slugMgr from '../src/slugManager.js'

// we'll stub global fetch so fetchMarkdown can operate normally

beforeEach(() => {
  slugMgr.fetchCache.clear()
  global.fetch = vi.fn()
})

describe('slugManager module', () => {
  it('fetchMarkdown stores results in cache', async () => {
    const dummy = { ok: true, text: () => Promise.resolve('# hi') }
    global.fetch.mockResolvedValue(dummy)

    const first = await slugMgr.fetchMarkdown('foo.md', '/content/')
    expect(global.fetch).toHaveBeenCalledOnce()
    const second = await slugMgr.fetchMarkdown('foo.md', '/content/')
    expect(global.fetch).toHaveBeenCalledOnce()
    expect(second).toEqual(first)
  })

  it('clearCache removes entries', async () => {
    const dummy = { ok: true, text: () => Promise.resolve('# hi') }
    global.fetch.mockResolvedValue(dummy)
    await slugMgr.fetchMarkdown('a.md', '/c/')
    expect(slugMgr.fetchCache.size).toBe(1)
    slugMgr.clearFetchCache()
    expect(slugMgr.fetchCache.size).toBe(0)
  })

  it('slugify removes invalid chars and strips .md/.html suffix', () => {
    expect(slugMgr.slugify('Hello World')).toBe('hello-world')
    expect(slugMgr.slugify('Some File.md')).toBe('some-file')
    expect(slugMgr.slugify('Example.HTML')).toBe('example')
    // ensure trailing words are preserved when not exactly md/html
    expect(slugMgr.slugify('readme-md')).toBe('readme')
    expect(slugMgr.slugify('index-html')).toBe('index')
  })

  it('fetchMarkdown rewrites slug filename based on slugToMd map', async () => {
    // mapping entry maps slug -> canonical file
    slugMgr.slugToMd.set('foo', 'subdir/foo.md')
    const dummy = { ok: true, text: () => Promise.resolve('# hi') }
    global.fetch.mockResolvedValue(dummy)

    await slugMgr.fetchMarkdown('foo.md', '/base/')
    // should rewrite to canonical path before fetching; accept absolute or relative URL
    expect(global.fetch).toHaveBeenCalled()
    const calledArg = String(global.fetch.mock.calls[0][0] || '')
    expect(calledArg).toContain('/base/subdir/foo.md')
  })
})