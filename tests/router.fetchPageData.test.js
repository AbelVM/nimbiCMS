import { test, expect, vi } from 'vitest'
import { fetchPageData } from '../src/router.js'
import * as slug from '../src/slugManager.js'

test('fetchPageData detects site-shell HTML and prefers markdown sibling', async () => {
  const origFetch = globalThis.fetch
  const origSet = slug.setFetchMarkdown
  try {
    // stub fetch to return an HTML site shell for the absolute URL
    globalThis.fetch = vi.fn(async (url) => {
      const s = String(url ?? '')
      if (s.endsWith('/foo.html') || s.endsWith('/foo.html')) {
        return {
          ok: true,
          text: async () => '<html><body>nimbi-cms site shell</body></html>',
          headers: { get: () => 'text/html' }
        }
      }
      // fallback
      return { ok: false }
    })

    // stub fetchMarkdown to return a markdown page for the sibling .md
    slug.setFetchMarkdown(async (path, base) => {
      if (String(path ?? '').endsWith('foo.md')) return { raw: '# Found Title' }
      return null
    })

    const result = await fetchPageData('/foo.html', 'https://example.com/content/')
    expect(result).toBeTruthy()
    expect(result.pagePath).toContain('foo.md')
    expect(result.data && result.data.raw).toMatch(/^# Found Title/)
  } finally {
    globalThis.fetch = origFetch
    slug.setFetchMarkdown(origSet)
  }
})
