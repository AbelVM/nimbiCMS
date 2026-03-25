import { describe, it, expect, afterEach, vi } from 'vitest'

// Force shared parser to be unavailable so the plugin branch falls back
vi.mock('../../src/utils/sharedDomParser.js', () => ({ getSharedParser: () => null }))

import { parseMarkdownToHtml, setMarkdownExtensions } from '../../src/markdown.js'

describe('parseMarkdownToHtml plugin branch without DOM parser', () => {
  afterEach(() => {
    try { setMarkdownExtensions([]) } catch (_) {}
  })

  it('returns empty toc when parser unavailable', async () => {
    // ensure plugin branch is taken, but parser is mocked as unavailable
    setMarkdownExtensions([{}])
    const md = '# Title\n\n# Title\n\nSome content'
    const res = await parseMarkdownToHtml(md)
    expect(res && Array.isArray(res.toc)).toBeTruthy()
    expect(res.toc.length).toBe(0)
    expect(typeof res.html === 'string').toBeTruthy()
    expect(res.html).toContain('<h1')
  })
})
