import { afterEach, describe, expect, it, vi } from 'vitest'
import { rewriteAnchorsHtml } from '../../src/worker/anchorRuntime.js'

describe('worker anchorRuntime rewriteAnchorsHtml', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns original html when DOMParser is unavailable', async () => {
    const originalParser = globalThis.DOMParser
    try {
      delete globalThis.DOMParser
      const res = await rewriteAnchorsHtml('<a href="foo.md">x</a>', 'http://example.com/content/', '')
      expect(res).toEqual({ html: '<a href="foo.md">x</a>', mappings: [] })
    } finally {
      globalThis.DOMParser = originalParser
    }
  })

  it('rewrites markdown and html-like anchors and skips heading/external links', async () => {
    const html = [
      '<h2><a href="skip.md">Skip</a></h2>',
      '<a href="foo.md#part">Foo</a>',
      '<a href="guide">Guide</a>',
      '<a href="mailto:test@example.com">Mail</a>',
      '<a href="/absolute/page">Absolute</a>'
    ].join('')

    const res = await rewriteAnchorsHtml(html, 'http://example.com/content/', 'docs/current.md', {
      allowProbe: false,
      homeSlug: '_home',
      pathToSlug: {
        'docs/foo.md': 'mapped-foo',
        'docs/guide': 'fallback-guide'
      }
    })

    expect(res.html).toContain('?page=mapped-foo#part')
    expect(res.html).toContain('?page=fallback-guide')
    expect(res.html).toContain('mailto:test@example.com')
    expect(res.html).toContain('href="skip.md"')
  })

  it('rewrites ?page links relative to current page directory', async () => {
    const res = await rewriteAnchorsHtml(
      '<a href="?page=other#frag">Query</a>',
      'http://example.com/content/',
      'docs/current.md',
      { allowProbe: false, homeSlug: '_home', pathToSlug: {} }
    )

    expect(res.html).toContain('?page=docs%2Fother#frag')
  })

  it('probes markdown and html files when allowProbe=true and stores learned mappings', async () => {
    global.fetch = vi.fn(async (url) => {
      const value = String(url)
      if (value.endsWith('/content/docs/probe.md')) {
        return { ok: true, text: async () => '# Probe Title\n\nBody' }
      }
      if (value.endsWith('/content/docs/probe.html')) {
        return { ok: true, text: async () => '<html><head><title>Probe Html</title></head><body></body></html>' }
      }
      return { ok: false, text: async () => '' }
    })

    const html = '<a href="probe.md">M</a><a href="probe">H</a>'
    const res = await rewriteAnchorsHtml(html, 'http://example.com/content/', 'docs/current.md', {
      allowProbe: true,
      homeSlug: '_home',
      pathToSlug: {}
    })

    expect(res.html).toContain('?page=probe-title')
    expect(res.html).toContain('?page=probe-html')
    expect(Array.isArray(res.mappings)).toBe(true)
    expect(res.mappings.length).toBeGreaterThan(0)
  })
})
