import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as slugMgr from '../src/slugManager.js'
import { setLang, currentLang } from '../src/l10nManager.js'

// stub fetchMarkdown logic and global fetch when needed

describe('slugManager module', () => {
  beforeEach(() => {
    slugMgr.slugToMd.clear()
    slugMgr.mdToSlug.clear()
    slugMgr.searchIndex.splice(0)
    slugMgr.clearFetchCache()
    slugMgr.crawlCache && slugMgr.crawlCache.clear && slugMgr.crawlCache.clear()
    // ensure any previous language configuration is cleared
    slugMgr.setLanguages([])
    // reset UI language to default
    setLang('en')
    global.fetch = vi.fn()
  })

  it('slugify cleans text and strips md/html suffix', () => {
    expect(slugMgr.slugify('Hello World')).toBe('hello-world')
    expect(slugMgr.slugify('File.md')).toBe('file')
    expect(slugMgr.slugify('Example.HTML')).toBe('example')
  })

  it('supports language-aware slug mappings', () => {
    // configure two languages and populate manifest
    slugMgr.setLanguages(['en', 'fr'])
    slugMgr._setAllMd({
      '/content/en/foo.md': '# Foo',
      '/content/fr/foo.md': '# Foo',
      '/content/about.md': '# About'
    })
    slugMgr.setContentBase('/content/')
    // mapping object should have entries for both languages
    const entry = slugMgr.slugToMd.get('foo')
    // debug: inspect what paths were recorded for each language
    expect(entry).toBeTruthy()
    expect(entry.langs && entry.langs.en).toBe('en/foo.md')
    expect(entry.langs && entry.langs.fr).toBe('fr/foo.md')

    // default currentLang is 'en'
    expect(slugMgr.resolveSlugPath('foo')).toBe('en/foo.md')
    // switch language at runtime
    setLang('fr')
    expect(currentLang).toBe('fr')
    expect(slugMgr.resolveSlugPath('foo')).toBe('fr/foo.md')
    // slug with only default language available falls back
    expect(slugMgr.resolveSlugPath('about')).toBe('about.md')
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

  it('crawlForSlug aborts when queue exceeds provided maxQueue', async () => {
    const base = 'http://example.com/content/'
    let calls = 0
    global.fetch = vi.fn(async (url) => {
      calls++
      // always return a listing with two subdirectories so queue grows
      return { ok: true, text: () => Promise.resolve('<a href="a/"></a><a href="b/"></a>') }
    })

    const result = await slugMgr.crawlForSlug('no-match', base, 3)
    expect(result).toBe(null)
    // ensure we didn't spin forever; a handful of calls is enough
    expect(calls).toBeLessThanOrEqual(10)
  })

  it('defaultCrawlMaxQueue can be changed via setter', async () => {
    const base = 'http://example.com/content/'
    slugMgr.setDefaultCrawlMaxQueue(2)
    let calls = 0
    global.fetch = vi.fn(async (url) => {
      calls++
      return { ok: true, text: () => Promise.resolve('<a href="a/"></a><a href="b/"></a>') }
    })
    const result = await slugMgr.crawlForSlug('none', base)
    expect(result).toBe(null)
    expect(calls).toBeLessThanOrEqual(10)
    // restore default so other tests unaffected
    slugMgr.setDefaultCrawlMaxQueue(slugMgr.CRAWL_MAX_QUEUE)
  })

  it('buildSearchIndex gathers titles and slugs', async () => {
    const base = 'http://example.com/content/'
    slugMgr.allMarkdownPaths.splice(0, slugMgr.allMarkdownPaths.length, 'p1.md', 'sub/p2.md')
    // stub fetchMarkdown responses
    global.fetch = vi.fn(async (url) => {
      if (url.endsWith('p1.md')) return { ok: true, text: () => Promise.resolve('# First\n\nHello world') }
      if (url.endsWith('sub/p2.md')) return { ok: true, text: () => Promise.resolve('# Second\n\nMore text') }
      return { ok: false, status: 404, text: () => Promise.resolve('') }
    })
    const idx = await slugMgr.buildSearchIndex(base)
    expect(idx.length).toBe(2)
    const titles = idx.map(e => e.title)
    expect(titles).toContain('First')
    expect(titles).toContain('Second')
    expect(idx[0].slug).toBeDefined()
    expect(idx[0].excerpt).toBe('Hello world')
  })

  it('buildSearchIndex indexes HTML pages too', async () => {
    const base = 'http://example.com/content/'
    // clear caches so test starts fresh
    slugMgr.searchIndex.splice(0)
    slugMgr.clearFetchCache()
    slugMgr.allMarkdownPaths.splice(0, slugMgr.allMarkdownPaths.length, 'foo.html')
    global.fetch = vi.fn(async (url) => {
      if (url.endsWith('foo.html')) return { ok: true, text: () => Promise.resolve('<html><head><title>FooTitle</title></head><body><p>Excerpt</p></body></html>') }
      return { ok: false, status: 404, text: () => Promise.resolve('') }
    })
    const idx = await slugMgr.buildSearchIndex(base)
    expect(idx.length).toBe(1)
    expect(idx[0].title).toBe('FooTitle')
    expect(idx[0].excerpt).toBe('Excerpt')
  })

  it('buildSearchIndex crawls for unlinked pages', async () => {
    const base = 'http://example.com/content/'
    slugMgr.searchIndex.splice(0)
    slugMgr.allMarkdownPaths.splice(0)
    slugMgr.slugToMd.clear()
    // simulate crawler discovering a couple of files
    global.fetch = vi.fn(async (url) => {
      if (url === base) return { ok: true, text: () => Promise.resolve('<a href="a.md"></a>') }
      if (url === base + 'a.md') return { ok: true, text: () => Promise.resolve('# A\n\nBodyA') }
      return { ok: false, status: 404, text: () => Promise.resolve('') }
    })
    const idx = await slugMgr.buildSearchIndex(base)
    expect(idx.map(e => e.path)).toContain('a.md')
  })

  it('buildSearchIndex crawls entire content when nav is empty', async () => {
    const base = 'http://example.com/content/'
    slugMgr.searchIndex.splice(0)
    slugMgr.allMarkdownPaths.splice(0)
    slugMgr.slugToMd.clear()
    // simulate a directory listing with two markdown files
    global.fetch = vi.fn(async (url) => {
      if (url === base) return { ok: true, text: () => Promise.resolve('<a href="a.md"></a><a href="sub/"></a>') }
      if (url === base + 'sub/') return { ok: true, text: () => Promise.resolve('<a href="b.md"></a>') }
      if (url.endsWith('a.md')) return { ok: true, text: () => Promise.resolve('# A') }
      if (url.endsWith('sub/b.md')) return { ok: true, text: () => Promise.resolve('# B') }
      return { ok: false, status: 404, text: () => Promise.resolve('') }
    })
    const idx = await slugMgr.buildSearchIndex(base)
    expect(idx.map(e => e.path).sort()).toEqual(['a.md','sub/b.md'])
  })

  it('buildSearchIndex falls back to slugToMd entries when allMarkdownPaths is empty', async () => {
    const base = 'http://example.com/content/'
    // ensure index cache is cleared so we actually execute the logic
    slugMgr.searchIndex.splice(0)
    // clear any existing paths and map two files via slugToMd
    slugMgr.allMarkdownPaths.splice(0)
    slugMgr.slugToMd.clear()
    slugMgr.slugToMd.set('foo', 'foo.md')
    slugMgr.slugToMd.set('bar', 'sub/bar.md')
  })

  it('buildSearchIndex ignores non-md entries from allMarkdownPaths', async () => {
    const base = 'http://example.com/content/'
    // clear previous index cache to ensure only current paths are used
    slugMgr.searchIndex.splice(0)
    slugMgr.allMarkdownPaths.splice(0, slugMgr.allMarkdownPaths.length, 'good.md', 'bad.html', 'also.txt')
    global.fetch = vi.fn(async (url) => {
      if (url.endsWith('good.md')) return { ok: true, text: () => Promise.resolve('# Good') }
      return { ok: false, status: 404, text: () => Promise.resolve('') }
    })
    const idx = await slugMgr.buildSearchIndex(base)
    expect(idx.length).toBe(1)
    expect(idx[0].path).toBe('good.md')
  })



  it('buildSearchIndex ignores non-md paths from allMarkdownPaths', async () => {
    const base = 'http://example.com/content/'
    slugMgr.allMarkdownPaths.splice(0, slugMgr.allMarkdownPaths.length, 'x.md', 'y.html', 'z')
    global.fetch = vi.fn(async (url) => {
      if (url.endsWith('x.md')) return { ok: true, text: () => Promise.resolve('# X') }
      return { ok: false, status: 404, text: () => Promise.resolve('') }
    })
    const idx = await slugMgr.buildSearchIndex(base)
    expect(idx.length).toBe(1)
    expect(idx[0].path).toBe('x.md')
  })

  it('setContentBase picks up injected markdown list', () => {
    // simulate injected list
    slugMgr._setAllMd({
      '/foo.md': '# Foo',
      '/sub/bar.html': '<h1>Bar</h1>'
    })
    // clear any existing state
    slugMgr.slugToMd.clear(); slugMgr.mdToSlug.clear(); slugMgr.allMarkdownPaths.splice(0)
    slugMgr.setContentBase('/')
    expect(slugMgr.allMarkdownPaths).toEqual(expect.arrayContaining(['foo.md', 'sub/bar.html']))
  })

  it('buildSearchIndex follows links recursively up to crawlMaxQueue', async () => {
    const base = 'http://example.com/content/'
    slugMgr.searchIndex.splice(0)
    slugMgr.clearFetchCache()
    // start with navigation file only
    slugMgr.allMarkdownPaths.splice(0, slugMgr.allMarkdownPaths.length, 'nav.md')
    // stub fetchMarkdown to return content with a link chain
    global.fetch = vi.fn(async (url) => {
      if (url.endsWith('nav.md')) return { ok: true, text: () => Promise.resolve('# Nav\n\n[Next](a.md)') }
      if (url.endsWith('a.md')) return { ok: true, text: () => Promise.resolve('# A\n\n[More](b.md)') }
      if (url.endsWith('b.md')) return { ok: true, text: () => Promise.resolve('# B') }
      return { ok: false, status: 404, text: () => Promise.resolve('') }
    })
    const idx = await slugMgr.buildSearchIndex(base)
    const paths = idx.map(i => i.path).sort()
    expect(paths).toEqual(['a.md','b.md','nav.md'])
  })

})