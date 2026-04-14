import { expect, it, vi } from 'vitest'

import { fetchPageData } from '../src/router.js'

it('explicit HTML homepage that returns directory listing should be treated as not found', async () => {
  const dirHtml = '<html><head><title>Index of /wrong/</title></head><body><h1>Index of /wrong/</h1><pre>Parent Directory</pre></body></html>'
  const origFetch = global.fetch
  // Stub fetch to return 404 for candidate contentBase URL and directory listing for absolute fallback
  vi.stubGlobal('fetch', async (url, opts) => {
    const s = String(url ?? '')
    if (s.includes('localhost:3000')) {
      return { ok: false, status: 404, statusText: 'Not Found', text: async () => '' }
    }
    // absolute fallback (different host) returns directory listing HTML
    return { ok: true, text: async () => dirHtml, headers: { get: (k) => (k && k.toLowerCase && k.toLowerCase() === 'content-type') ? 'text/html' : null } }
  })

  await expect(fetchPageData('wrong.html', 'http://localhost:3000/content/')).rejects.toThrow('no page data')

  if (origFetch) vi.stubGlobal('fetch', origFetch)
})
