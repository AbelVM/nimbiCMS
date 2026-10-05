import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

function mkRes(ok, text) {
  return { ok, text: async () => text }
}

function asUrl(input) {
  try {
    return String(input && input.url ? input.url : input)
  } catch (_) {
    return String(input ?? '')
  }
}

describe('slugSearchRuntime direct branches', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('buildSearchIndex crawls directories, parses md/html and heading entries', async () => {
    global.fetch = vi.fn(async (url) => {
      const u = asUrl(url)
      if (/\/content\/$/.test(u)) {
        return mkRes(true, '<a href="a.md">A</a><a href="sub/">Sub</a><a href="http://localhost/content/c.md">C</a><a href="mailto:test@example.com">M</a>')
      }
      if (/\/content\/sub\/$/.test(u)) return mkRes(true, '<a href="b.html">B</a>')
      if (/\/content\/a\.md$/.test(u)) return mkRes(true, '# A Title\n\nIntro\n\n## A section')
      if (/\/content\/c\.md$/.test(u)) return mkRes(true, '# C Title\n\nC body\n\n## C section')
      if (/\/content\/sub\/b\.html$/.test(u)) return mkRes(true, '<html><head><title>B Title</title></head><body><p>B intro</p><h2>B section</h2></body></html>')
      return mkRes(false, '')
    })

    const runtime = await import('../src/slugSearchRuntime.js')
    const idx = await runtime.buildSearchIndex('/content/', 2)
    const slugs = idx.map((x) => x.slug)

    expect(slugs).toContain('a-title')
    expect(slugs).toContain('b-title')
    expect(slugs.some((s) => s.includes('::a-section'))).toBe(true)
    expect(slugs.some((s) => s.includes('::b-section'))).toBe(true)
  })

  it('buildSearchIndex discovers markdown links when raw markdown is fetched from seed paths', async () => {
    global.fetch = vi.fn(async (url) => {
      const u = asUrl(url)
      if (/\/content\/$/.test(u)) {
        return mkRes(true, '<html></html>')
      }
      if (/\/content\/navigation\.md$/.test(u)) {
        return mkRes(true, '[Docs](docs/README.md)\n[Home](index.md)')
      }
      if (/\/content\/docs\/README\.md$/.test(u)) {
        return mkRes(true, '# Docs Title\n\nDocs body')
      }
      if (/\/content\/index\.md$/.test(u)) {
        return mkRes(true, '# Index Title\n\nIndex body')
      }
      return mkRes(false, '')
    })

    const runtime = await import('../src/slugSearchRuntime.js')
    const idx = await runtime.buildSearchIndex('/content/', 1, undefined, [
      'navigation.md',
    ])
    const paths = idx.map((x) => x.path)
    const slugs = idx.map((x) => x.slug)

    expect(paths).toContain('docs/README.md')
    expect(slugs).toContain('docs-title')
    expect(slugs).toContain('index-title')
  })

  it('buildSearchIndex treats root-relative markdown links as content-root paths from a nested source page', async () => {
    global.fetch = vi.fn(async (url) => {
      const u = asUrl(url)
      if (/\/content\/$/.test(u)) return mkRes(true, '<html></html>')
      if (/\/content\/assets\/navigation\.md$/.test(u)) {
        return mkRes(
          true,
          '# Nav\n\n[Home](assets/brochure.md)\n[API](docs/README.md)',
        )
      }
      if (/\/content\/assets\/brochure\.md$/.test(u))
        return mkRes(true, '# Brochure\n\nContent')
      if (/\/content\/docs\/README\.md$/.test(u))
        return mkRes(true, '# Docs\n\nContent')
      return mkRes(false, '')
    })

    const runtime = await import('../src/slugSearchRuntime.js')
    const idx = await runtime.buildSearchIndex('/content/', 1, undefined, [
      'assets/navigation.md',
    ])
    const paths = idx.map((x) => x.path).sort()

    expect(paths).toEqual(
      expect.arrayContaining(['assets/navigation.md', 'assets/brochure.md', 'docs/README.md']),
    )
  })

  it('buildSearchIndex discovers extensionless links by probing likely .md/.html candidates', async () => {
    global.fetch = vi.fn(async (url) => {
      const u = asUrl(url)
      if (/\/content\/$/.test(u)) {
        return mkRes(
          true,
          '<a href="extensionless">Extensionless</a><a href="sub/">Subdir</a>',
        )
      }
      if (/\/content\/extensionless\.md$/.test(u))
        return mkRes(true, '# Extensionless Title\n\nBody')
      if (/\/content\/sub\/$/.test(u))
        return mkRes(true, '<a href="inner">Inner</a>')
      if (/\/content\/sub\/inner\.html$/.test(u))
        return mkRes(
          true,
          '<html><head><title>Inner Title</title></head><body><p>Body</p></body></html>',
        )
      return mkRes(false, '')
    })

    const runtime = await import('../src/slugSearchRuntime.js')
    const idx = await runtime.buildSearchIndex('/content/', 1)
    const slugs = idx.map((x) => x.slug)

    expect(slugs).toContain('extensionless-title')
    expect(slugs).toContain('inner-title')
  })

  it('ignores asset links when building search index', async () => {
    global.fetch = vi.fn(async (url) => {
      const u = asUrl(url)
      if (/\/content\/$/.test(u)) {
        return mkRes(true, '<a href="assets/lighthouse.png">Image</a><a href="about">About</a>')
      }
      if (/\/content\/about\.md$/.test(u)) return mkRes(true, '# About\n\nBody')
      return mkRes(false, '')
    })

    const runtime = await import('../src/slugSearchRuntime.js')
    const idx = await runtime.buildSearchIndex('/content/', 1)
    const urls = global.fetch.mock.calls.map((c) => asUrl(c[0]))

    expect(idx.map((x) => x.slug)).toContain('about')
    expect(urls.some((u) => /lighthouse\.png\.md$/.test(u))).toBe(false)
    expect(urls.some((u) => /lighthouse\.png\.html$/.test(u))).toBe(false)
    expect(urls.some((u) => /lighthouse\.png\/README\./.test(u))).toBe(false)
  })

  it('reuses in-flight index promise for concurrent buildSearchIndex calls', async () => {
    global.fetch = vi.fn(async (url) => {
      const u = asUrl(url)
      if (/\/content\/$/.test(u)) return mkRes(true, '<a href="a.md">A</a>')
      if (/\/content\/a\.md$/.test(u)) return mkRes(true, '# Shared\n\nBody')
      return mkRes(false, '')
    })

    const runtime = await import('../src/slugSearchRuntime.js')
    const [a, b] = await Promise.all([
      runtime.buildSearchIndex('/content/', 1),
      runtime.buildSearchIndex('/content/', 1)
    ])

    expect(a).toEqual(b)
    expect(global.fetch.mock.calls.filter((c) => /\/content\/$/.test(asUrl(c[0]))).length).toBe(1)
  })

  it('crawlForSlug falls back to candidate files and crawl discovery', async () => {
    global.fetch = vi.fn(async (url) => {
      const u = asUrl(url)
      if (/\/content\/$/.test(u)) return mkRes(true, '<a href="deep/my-page.md">P</a>')
      if (/\/content\/deep\/my-page\.md$/.test(u)) return mkRes(true, '# Different title')
      if (/\/content\/not-found\.html$/.test(u)) return mkRes(true, '<html>found</html>')
      if (/\/content\/not-found\.md$/.test(u)) return mkRes(false, '')
      return mkRes(false, '')
    })

    const runtime = await import('../src/slugSearchRuntime.js')
    const fromCandidate = await runtime.crawlForSlug('not-found', '/content/')
    const fromDiscovery = await runtime.crawlForSlug('my-page', '/content/')

    expect(fromCandidate).toBe('not-found.html')
    expect(fromDiscovery).toBe('deep/my-page.md')
  })

  it('delegates worker-oriented calls to slugManager runtime', async () => {
    const buildSearchIndexWorker = vi.fn(async () => ['ok'])
    const awaitSearchIndex = vi.fn(async () => ({ done: true }))
    vi.doMock('../src/slugManager.js', () => ({
      buildSearchIndexWorker,
      awaitSearchIndex
    }))

    const runtime = await import('../src/slugSearchRuntime.js')
    const a = await runtime.buildSearchIndexWorker('/content/', 2, ['skip'])
    const b = await runtime.awaitSearchIndex({ timeoutMs: 10 })

    expect(a).toEqual(['ok'])
    expect(b).toEqual({ done: true })
    expect(buildSearchIndexWorker).toHaveBeenCalledWith('/content/', 2, ['skip'], undefined)
    expect(awaitSearchIndex).toHaveBeenCalledWith({ timeoutMs: 10 })
  })

  it('forwards seedPaths through buildSearchIndexWorker', async () => {
    const buildSearchIndexWorker = vi.fn(async () => ['ok'])
    vi.doMock('../src/slugManager.js', () => ({
      buildSearchIndexWorker,
      awaitSearchIndex: vi.fn(async () => ({ done: true }))
    }))

    const runtime = await import('../src/slugSearchRuntime.js')
    const seeds = ['assets/brochure.md', 'assets/navigation.md']
    await runtime.buildSearchIndexWorker('/content/', 2, ['skip'], seeds)

    expect(buildSearchIndexWorker).toHaveBeenCalledWith(
      '/content/',
      2,
      ['skip'],
      seeds,
    )
  })
})
