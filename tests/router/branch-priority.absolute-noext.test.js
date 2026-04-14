import { beforeEach, test, expect, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  if (typeof document !== 'undefined') document.body.innerHTML = ''
})

test('absolute URL without .html probes alt .md and prefers it', async () => {
  const router = await import('../../src/router.js')
  const slugMgr = await import('../../src/slugManager.js')

  const origFetch = global.fetch
  const origFetchMd = slugMgr.fetchMarkdown
  try {
    try { router._clearIndexCache && router._clearIndexCache() } catch (_) {}

    const mdContent = '# Shell MD\n\nalt'
    const html = '<!doctype html><html><body>site shell</body></html>'

    // stub global fetch to return HTML for the absolute URL
    vi.stubGlobal('fetch', async (url, opts) => ({
      ok: true,
      status: 200,
      text: async () => html,
      headers: { get: (k) => (k && k.toLowerCase && k.toLowerCase() === 'content-type') ? 'text/html' : null },
      clone: () => ({ ok: true, text: async () => html, headers: { get: (k) => (k && k.toLowerCase && k.toLowerCase() === 'content-type') ? 'text/html' : null } })
    }))

    const calls = []
    slugMgr.setFetchMarkdown(async (path, base) => {
      calls.push(path)
      if (String(path ?? '').toLowerCase().endsWith('.md')) return { raw: mdContent }
      return null
    })

    const res = await router.fetchPageData('http://example.com/shell', 'http://example.com/content/')
    expect(res).toBeTruthy()
    // ensure the alt md probe happened and was accepted
    expect(calls.some(p => String(p ?? '').toLowerCase().endsWith('.md'))).toBe(true)
    expect(res.data && res.data.raw).toContain('# Shell MD')
  } finally {
    try { if (origFetch) vi.stubGlobal('fetch', origFetch) } catch (_) {}
    try { slugMgr.setFetchMarkdown && slugMgr.setFetchMarkdown(origFetchMd) } catch (_) {}
  }
})
