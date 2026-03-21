import { it, expect, vi } from 'vitest'

import * as router from '../src/router.js'
import * as slugMgr from '../src/slugManager.js'

it('prefers sibling .md when .html result looks like site index', async () => {
  const origFetchMarkdown = slugMgr.fetchMarkdown
  try {
    // Ensure router caches are clear so resolution logic runs fresh
    router.resolutionCache.clear()
    if (typeof router._clearIndexCache === 'function') router._clearIndexCache()

    const htmlIndex = '<!doctype html><html><head><title>Index of /bare/</title></head><body><h1>Index of /bare/</h1><pre>Parent Directory</pre></body></html>'
    const mdContent = '# Bare page\n\nContent here.'

    // Stub fetchMarkdown so .html returns HTML-ish content and .md returns real markdown
    slugMgr.setFetchMarkdown(vi.fn().mockImplementation((path, base) => {
      if (path === 'bare.html') return Promise.resolve({ raw: htmlIndex, isHtml: true })
      if (path === 'bare.md') return Promise.resolve({ raw: mdContent })
      return Promise.reject(new Error('not found'))
    }))

    const res = await router.fetchPageData('bare', '/content/')
    expect(res.pagePath).toBe('bare.md')
    expect(res.data && res.data.raw).toBe(mdContent)
    // ensure both candidates were attempted
    expect(slugMgr.fetchMarkdown).toHaveBeenCalledWith('bare.html', '/content/')
    expect(slugMgr.fetchMarkdown).toHaveBeenCalledWith('bare.md', '/content/')
  } finally {
    // restore original implementation for other tests
    slugMgr.setFetchMarkdown(origFetchMarkdown)
  }
})
