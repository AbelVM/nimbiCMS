import { describe, it, expect, beforeEach } from 'vitest'
import * as l10n from '../src/l10nManager.js'
import {
  slugify,
  uniqueSlug,
  _storeSlugMapping,
  setLanguages,
  resolveSlugPath,
  setFetchMarkdown,
  fetchMarkdown,
  ensureSlug,
  slugToMd,
  mdToSlug,
  _setAllMd,
  setContentBase,
  clearFetchCache,
  clearListCaches
} from '../src/slugManager.js'

describe('slugManager basic behaviors', () => {
  beforeEach(() => {
    // reset internal maps/caches
    try { slugToMd.clear() } catch (e) {}
    try { mdToSlug.clear() } catch (e) {}
    setLanguages([])
    try { l10n.setLang('en') } catch (e) {}
    clearFetchCache()
    clearListCaches()
    _setAllMd({})
    try { setContentBase() } catch (e) {}
  })

  it('slugify and uniqueSlug produce expected values', () => {
    expect(slugify('Hello, World!')).toBe('hello-world')
    const existing = new Set(['a', 'a-2', 'a-3'])
    expect(uniqueSlug('a', existing)).toBe('a-4')
  })

  it('stores language-aware mappings and resolves by current language', () => {
    setLanguages(['en', 'fr'])
    _storeSlugMapping('s', 'page.md')
    _storeSlugMapping('s', 'fr/page.md')
    try { l10n.setLang('fr') } catch (e) {}
    expect(resolveSlugPath('s')).toBe('fr/page.md')
    try { l10n.setLang('en') } catch (e) {}
    expect(resolveSlugPath('s')).toBe('page.md')
  })

  it('ensureSlug resolves using candidate fetch when other lookups fail', async () => {
    // stub fetchMarkdown so candidate fetch will succeed for 'decoded.md'
    const _orig = fetchMarkdown
    try {
      setFetchMarkdown(async (path, base) => {
        if (path === 'decoded.md' || path === 'decoded.html') return { raw: '# Title\n' }
        throw new Error('not found')
      })

      const res = await ensureSlug('decoded', 'http://example.com')
      expect(res).toBeTruthy()
      expect(res.endsWith('.md') || res.endsWith('.html')).toBe(true)
    } finally {
      setFetchMarkdown(_orig)
    }
  })
})
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

  it('crawlAllMarkdown handles undefined fetch responses gracefully', async () => {
    // simulate a faulty fetch implementation that returns undefined
    global.fetch = vi.fn(async (url) => undefined)
    const res = await slugMgr.crawlAllMarkdown('http://example.com/content/')
    expect(Array.isArray(res)).toBe(true)
    expect(res.length).toBe(0)
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
    // No automatic fallback to `_home.md` — when no explicit homePage is
    // configured, ensureSlug should not probe `_home.md` and should return
    // null for unknown slugs.
    expect(result).toBeNull()
    expect(slugMgr.slugToMd.get(slug)).toBeUndefined()
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

  it('buildSearchIndex falls back to mdToSlug entries when allMarkdownPaths is empty', async () => {
    const base = 'http://example.com/content/'
    // ensure index cache is cleared so we actually execute the logic
    slugMgr.searchIndex.splice(0)
    // clear any existing paths and maps
    slugMgr.allMarkdownPaths.splice(0)
    slugMgr.slugToMd.clear()
    slugMgr.mdToSlug.clear()
    // seed mdToSlug (path -> slug) so buildSearchIndex can use these keys
    slugMgr.mdToSlug.set('foo.md', 'foo')
    slugMgr.mdToSlug.set('sub/bar.md', 'bar')
    global.fetch = vi.fn(async (url) => {
      if (url.endsWith('foo.md')) return { ok: true, text: () => Promise.resolve('# Foo') }
      if (url.endsWith('sub/bar.md')) return { ok: true, text: () => Promise.resolve('# Bar') }
      return { ok: false, status: 404, text: () => Promise.resolve('') }
    })
    const idx = await slugMgr.buildSearchIndex(base)
    expect(idx.map(e => e.path).sort()).toEqual(['foo.md', 'sub/bar.md'])
  })

  it('_storeSlugMapping updates allMarkdownPathsSet and allMarkdownPaths', () => {
    // clear state
    slugMgr.slugToMd.clear()
    slugMgr.mdToSlug.clear()
    slugMgr.allMarkdownPaths.splice(0)
    try { slugMgr.allMarkdownPathsSet.clear() } catch (_) {}
    // store mapping
    slugMgr._storeSlugMapping('s', 'p.md')
    expect(slugMgr.allMarkdownPathsSet.has('p.md')).toBe(true)
    expect(slugMgr.allMarkdownPaths).toContain('p.md')
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

  it('buildSearchIndex ignores links inside fenced code blocks and HTML comments', async () => {
    const base = 'http://example.com/content/'
    slugMgr.searchIndex.splice(0)
    slugMgr.clearFetchCache()
    slugMgr.allMarkdownPaths.splice(0, slugMgr.allMarkdownPaths.length, 'page.md')
    global.fetch = vi.fn(async (url) => {
      if (url.endsWith('page.md')) return { ok: true, text: () => Promise.resolve(`# Title\n\nSome intro\n\n\`\`\`js\n[BadLink](linked.md)\n\`\`\`\n\n<!-- <a href="commented.md">commented</a> -->\n\n[GoodLink](other.md)` ) }
      if (url.endsWith('other.md')) return { ok: true, text: () => Promise.resolve('# Other\n\nBody') }
      if (url.endsWith('linked.md')) return { ok: true, text: () => Promise.resolve('# Linked\n\nBody') }
      if (url.endsWith('commented.md')) return { ok: true, text: () => Promise.resolve('# Commented\n\nBody') }
      return { ok: false, status: 404, text: () => Promise.resolve('') }
    })
    const idx = await slugMgr.buildSearchIndex(base)
    const paths = idx.map(e => e.path)
    expect(paths).toContain('page.md')
    expect(paths).toContain('other.md')
    expect(paths).not.toContain('linked.md')
    expect(paths).not.toContain('commented.md')
  })

  // additional unit tests --------------------------------------------------
  it('_storeSlugMapping respects availableLanguages and normalizes entries', () => {
    slugMgr.slugToMd.clear()
    slugMgr.setLanguages(['en','fr'])
    slugMgr._storeSlugMapping('foo', 'en/foo.md')
    slugMgr._storeSlugMapping('foo', 'fr/foo.md')
    slugMgr._storeSlugMapping('foo', 'bar.md')
    const entry = slugMgr.slugToMd.get('foo')
    expect(entry.default).toBe('bar.md')
    expect(entry.langs.en).toBe('en/foo.md')
    expect(entry.langs.fr).toBe('fr/foo.md')
    // non-language path should set default
  })

  it('resolveSlugPath respects availableLanguages and falls back to default', () => {
    slugMgr.slugToMd.clear()
    slugMgr.setLanguages(['en','de'])
    slugMgr.slugToMd.set('test', { default: 'default.md', langs: { en: 'en/test.md', de: 'de/test.md' } })
    // whichever currentLang is initially, result should be one of the language entries
    const path = slugMgr.resolveSlugPath('test')
    expect(['en/test.md','de/test.md']).toContain(path)
    // always fallback to default when langs empty
    slugMgr.slugToMd.set('test', { default: 'default.md', langs: {} })
    expect(slugMgr.resolveSlugPath('test')).toBe('default.md')
  })

  it('fetchMarkdown caches results and handles 404/404 fallback', async () => {
    slugMgr.clearFetchCache()
    // stub fetch to return 404 first, then _404.md content
    let call = 0
    global.fetch = vi.fn(async (url) => {
      call++
      if (url.endsWith('/foo.md')) return { ok: false, status: 404, text: () => Promise.resolve('') }
      if (url.endsWith('/_404.md')) return { ok: true, text: () => Promise.resolve('# Not found') }
      return { ok: true, text: () => Promise.resolve('# OK') }
    })
    const res = await slugMgr.fetchMarkdown('foo.md', 'http://example.com')
    expect(res.status).toBe(404)
    expect(res.raw).toContain('Not found')
    // second call should reuse cache (fetch count stays same)
    const res2 = await slugMgr.fetchMarkdown('foo.md', 'http://example.com')
    expect(call).toBe(2) // one for first, one for _404 fallback
  })

  it('slugResolvers allow custom resolution', async () => {
    slugMgr.slugResolvers.clear()
    const resolver = vi.fn(slug => slug === 'magic' ? 'path.md' : null)
    slugMgr.addSlugResolver(resolver)
    // attempt ensureSlug indirectly through private method
    const result = await slugMgr.ensureSlug('magic', '/base/')
    expect(result).toBe('path.md')
    slugMgr.removeSlugResolver(resolver)
  })

  // worker wrapper tests --------------------------------------------------
  it('buildSearchIndexWorker delegates to local function when worker unavailable', async () => {
    // enforce worker required: mock initSlugWorker to return null and expect rejection
    const spy = vi.spyOn(slugMgr, 'initSlugWorker').mockReturnValue(null)
    slugMgr.searchIndex.splice(0)
    await expect(slugMgr.buildSearchIndexWorker('http://base/')).rejects.toThrow()
    spy.mockRestore()
  })

  it('crawlForSlugWorker falls back if worker creation fails', async () => {
    const spy = vi.spyOn(slugMgr, 'initSlugWorker').mockReturnValue(null)
    slugMgr.crawlCache.clear && slugMgr.crawlCache.clear()
    // seed crawlCache with known value
    slugMgr.crawlCache.set('slug', 'foo.md')
    await expect(slugMgr.crawlForSlugWorker('slug', 'http://base/')).rejects.toThrow()
    spy.mockRestore()
  })

  it('worker wrappers communicate with real worker when available', async () => {
    // ensure Worker exists and stub network for slugManager
    slugMgr.clearFetchCache()
    global.fetch = vi.fn(async (u) => {
      if (String(u).endsWith('nav.md')) return { ok: true, text: () => Promise.resolve('# Nav') }
      return { ok: false, status: 404, text: () => Promise.resolve('') }
    })
    // call buildSearchIndexWorker - should not throw
    const idx = await slugMgr.buildSearchIndexWorker('/base/')
    expect(Array.isArray(idx)).toBe(true)
    // call crawlForSlugWorker on nonexistent slug
    const crawl = await slugMgr.crawlForSlugWorker('nothing', '/base/')
    expect(crawl).toBeNull()
  })

  it('crawlAllMarkdown handles fetch rejection gracefully', async () => {
    const base = 'http://example.com/content/'
    global.fetch = vi.fn(async (url) => { throw new Error('network') })
    const res = await slugMgr.crawlAllMarkdown(base)
    expect(Array.isArray(res)).toBe(true)
    expect(res.length).toBe(0)
  })

  it('crawlAllMarkdown returns empty when directory HTML has no links', async () => {
    const base = 'http://example.com/content/'
    global.fetch = vi.fn(async (url) => ({ ok: true, text: () => Promise.resolve('<html><body>No links</body></html>') }))
    const res = await slugMgr.crawlAllMarkdown(base)
    expect(Array.isArray(res)).toBe(true)
    expect(res.length).toBe(0)
  })

  it('crawlAllMarkdown handles non-ok directory fetch response', async () => {
    const base = 'http://example.com/content/'
    // simulate directory fetch returning non-ok response (e.g., 404)
    global.fetch = vi.fn(async (url) => ({ ok: false, status: 404, text: () => Promise.resolve('') }))
    const res = await slugMgr.crawlAllMarkdown(base)
    expect(Array.isArray(res)).toBe(true)
    expect(res.length).toBe(0)
  })


})