import { beforeEach, test, expect, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  if (typeof document !== 'undefined') document.body.innerHTML = ''
})

test('site-shell heuristics: regex-only token triggers last OR operand', async () => {
  const router = await import('../../src/router.js')
  const slugMgr = await import('../../src/slugManager.js')

  const origFetch = global.fetch
  const origFetchMd = slugMgr.fetchMarkdown
  const origNotFound = slugMgr.notFoundPage
  try {
    // ensure index/slug mappings don't short-circuit probe gate
    try { router._clearIndexCache && router._clearIndexCache() } catch (_) {}
    // disable notFoundPage so the earlier probe gate doesn't short-circuit
    try { slugMgr.setNotFoundPage && slugMgr.setNotFoundPage(null) } catch (_) {}
    // make md probes return null so HTML probe path proceeds
    slugMgr.setFetchMarkdown(async () => null)

    const html = '<!doctype html><html><body> nimbi </body></html>'

    vi.stubGlobal('fetch', async (url, opts) => {
      return {
        ok: true,
        status: 200,
        text: async () => html,
        headers: { get: (k) => (k && k.toLowerCase && k.toLowerCase() === 'content-type') ? 'text/html' : null },
        clone: () => ({ ok: true, text: async () => html, headers: { get: (k) => (k && k.toLowerCase && k.toLowerCase() === 'content-type') ? 'text/html' : null } })
      }
    })

    const res = await router.fetchPageData('http://example.com/shell.html', 'http://example.com/content/')
    expect(res).toBeTruthy()
  } finally {
    try { if (origFetch) vi.stubGlobal('fetch', origFetch) } catch (_) {}
    try { slugMgr.setFetchMarkdown && slugMgr.setFetchMarkdown(origFetchMd) } catch (_) {}
    try { slugMgr.setNotFoundPage && slugMgr.setNotFoundPage(origNotFound) } catch (_) {}
  }
})
