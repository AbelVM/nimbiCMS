import { describe, it, expect, vi, afterEach } from 'vitest'
import * as htmlBuilder from '../src/htmlBuilder.js'
import * as sharedDomParser from '../src/utils/sharedDomParser.js'
import * as markdown from '../src/markdown.js'

describe('htmlBuilder fallback branches', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('createNavTree falls back when document fragment creation fails', () => {
    const orig = document.createDocumentFragment
    document.createDocumentFragment = () => {
      throw new Error('fragment fail')
    }
    try {
      const nav = htmlBuilder.createNavTree((k) => k, [
        { path: 'a', name: 'A', children: [{ path: 'b/c', name: 'C' }] }
      ])
      expect(nav.querySelectorAll('a').length).toBe(2)
    } finally {
      document.createDocumentFragment = orig
    }
  })

  it('parseHtml returns raw fallback when parser throws', () => {
    vi.spyOn(sharedDomParser, 'getSharedParser').mockImplementation(() => {
      throw new Error('parser fail')
    })
    const raw = '<h1>Hi</h1><p>x</p>'
    const parsed = htmlBuilder._parseHtml(raw)
    expect(parsed.html).toBe(raw)
    expect(parsed.toc).toEqual([])
  })

  it('parseMarkdown falls back when markdown parser returns invalid shape', async () => {
    vi.spyOn(markdown, 'parseMarkdownToHtml').mockResolvedValue(null)
    const parsed = await htmlBuilder._parseMarkdown('# X')
    expect(parsed).toEqual({ html: '# X', meta: {}, toc: [] })
  })

  it('ensureLanguages registers canonical and alias names', async () => {
    vi.spyOn(markdown, 'detectFenceLanguagesAsync').mockResolvedValue(new Set(['js']))
    const regSpy = vi.spyOn(await import('../src/codeblocksManager.js'), 'registerLanguage').mockResolvedValue(undefined)

    await htmlBuilder._ensureLanguages('```js\n1\n```')

    expect(regSpy).toHaveBeenCalled()
  })

  it('prepareArticle uses streaming path for large markdown content', async () => {
    const streamSpy = vi.spyOn(markdown, 'streamParseMarkdown').mockImplementation(async (_md, onChunk) => {
      onChunk('<h1>Stream A</h1><p>one</p>', { index: 0, isLast: false, meta: { title: 'T' }, toc: [{ level: 1, text: 'Stream A', id: 'stream-a' }] })
      onChunk('<h2>Stream B</h2><p>two</p>', { index: 1, isLast: true, meta: {}, toc: [{ level: 2, text: 'Stream B', id: 'stream-b' }] })
    })

    const raw = '# x\n\n' + 'a'.repeat(70 * 1024)
    const out = await htmlBuilder.prepareArticle((k) => k, { raw, isHtml: false }, 'docs/a.md', null, 'http://example.com/content/')

    expect(streamSpy).toHaveBeenCalled()
    expect(typeof out.parsed.html).toBe('string')
    expect(out.parsed.toc.length).toBeGreaterThan(0)
  })
})
