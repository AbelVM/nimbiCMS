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

  it('slugify removes invalid chars and strips .md/.html suffix', () => {
    expect(files.slugify('Hello World')).toBe('hello-world')
    expect(files.slugify('Some File.md')).toBe('some-file')
    expect(files.slugify('Example.HTML')).toBe('example')
    // ensure trailing words are preserved when not exactly md/html
    expect(files.slugify('readme-md')).toBe('readme')
    expect(files.slugify('index-html')).toBe('index')
  })

  it('fetchMarkdown rewrites slug filename based on slugToMd map', async () => {
    // mapping entry maps slug -> canonical file
    files.slugToMd.set('foo', 'subdir/foo.md')
    const dummy = { ok: true, text: () => Promise.resolve('# hi') }
    global.fetch.mockResolvedValue(dummy)

    await files.fetchMarkdown('foo.md', '/base/')
    // should rewrite to canonical path before fetching
    expect(global.fetch).toHaveBeenCalledWith('/base/subdir/foo.md')
  })
})