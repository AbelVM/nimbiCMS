import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as slugMgr from '../src/slugManager.js'

// stub fetchMarkdown logic and global fetch when needed

describe('slugManager module', () => {
  beforeEach(() => {
    slugMgr.slugToMd.clear()
    slugMgr.mdToSlug.clear()
    slugMgr.clearFetchCache()
    slugMgr.crawlCache && slugMgr.crawlCache.clear && slugMgr.crawlCache.clear()
    global.fetch = vi.fn()
  })

  it('slugify cleans text and strips md/html suffix', () => {
    expect(slugMgr.slugify('Hello World')).toBe('hello-world')
    expect(slugMgr.slugify('File.md')).toBe('file')
    expect(slugMgr.slugify('Example.HTML')).toBe('example')
  })

  it('ensureSlug returns path for home slug when nothing else known', async () => {
    const base = '/content/'
    const slug = 'welcome'
    global.fetch = vi.fn((url) => {
      if (url.endsWith('_home.md')) return Promise.resolve({ ok: true, text: () => Promise.resolve('# Welcome') })
      return Promise.resolve({ ok: false, status: 404, text: () => Promise.resolve('') })
    })
    const result = await slugMgr.ensureSlug(slug, base)
    expect(result).toBe('_home.md')
    expect(slugMgr.slugToMd.get(slug)).toBe('_home.md')
  })

  it('crawlForSlug traverses directory listings to locate slug', async () => {
    const base = 'http://example.com/content/'
    // simulate directory HTML: root contains foo.md and link to subdir/
    const rootHtml = '<a href="foo.md">foo.md</a><a href="subdir/">subdir/</a>'
    const subHtml = '<a href="bar.md">bar.md</a>'
    // respond to fetch for directory and markdowns
    global.fetch = vi.fn(async (url) => {
      if (url === base) return { ok: true, text: () => Promise.resolve(rootHtml) }
      if (url === base + 'subdir/') return { ok: true, text: () => Promise.resolve(subHtml) }
      if (url === base + 'foo.md') return { ok: true, text: () => Promise.resolve('# Foo') }
      if (url === base + 'subdir/bar.md') return { ok: true, text: () => Promise.resolve('# Bar Title') }
      return { ok: false, status: 404, text: () => Promise.resolve('') }
    })

    const found = await slugMgr.crawlForSlug('bar-title', base)
    expect(found).toBe('subdir/bar.md')

    // slug that doesn't exist should return null and be cached
    const notFound = await slugMgr.crawlForSlug('nope', base)
    expect(notFound).toBe(null)
    expect(slugMgr.crawlCache.get('nope')).toBe(null)
  })

  it('ensureSlug uses crawlCache result before home fallback', async () => {
    const base = 'http://example.com/content/'
    const slug = 'bar-title'
    slugMgr.crawlCache.set(slug, 'subdir/bar.md')
    const result = await slugMgr.ensureSlug(slug, base)
    expect(result).toBe('subdir/bar.md')
  })

  it('crawlForSlug skips files already mapped via mdToSlug', async () => {
    const base = 'http://example.com/content/'
    const slug = 'needle'
    // pretend quadgrid already mapped
    slugMgr.mdToSlug.set('blog/2017-12-12-quadgrid.md', 'quadgrid')
    // simulate listing with only that file, but fetchMarkdown should NOT be called
    const rootHtml = '<a href="blog/2017-12-12-quadgrid.md">quadgrid</a>'
    global.fetch = vi.fn(async (url) => {
      if (url === base) return { ok: true, text: () => Promise.resolve(rootHtml) }
      // any other fetch should not happen
      return { ok: false, status: 404, text: () => Promise.resolve('') }
    })
    // spy fetchMarkdown to ensure it's not called
    const spy = vi.spyOn(slugMgr, 'fetchMarkdown')
    const found = await slugMgr.crawlForSlug(slug, base)
    expect(found).toBe(null)
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})