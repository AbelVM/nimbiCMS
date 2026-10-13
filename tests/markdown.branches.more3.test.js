import { describe, it, expect, vi, afterEach } from 'vitest'
import * as markdown from '../src/markdown.js'
import * as sharedDomParser from '../src/utils/sharedDomParser.js'

describe('markdown branch extras', () => {
  afterEach(() => {
    markdown.setMarkdownExtensions([])
    vi.restoreAllMocks()
  })

  it('plugin mode returns raw html when DOM parser is unavailable', async () => {
    markdown.setMarkdownExtensions([{}])
    vi.spyOn(sharedDomParser, 'getSharedParser').mockReturnValue(null)

    const res = await markdown.parseMarkdownToHtml('# Heading')

    expect(typeof res.html).toBe('string')
    expect(Array.isArray(res.toc)).toBe(true)
    expect(res.toc.length).toBe(0)
  })

  it('plugin mode serializes without XMLSerializer', async () => {
    markdown.setMarkdownExtensions([{}])
    const oldXmlSerializer = global.XMLSerializer
    try {
      // Force the non-XMLSerializer branch.
      // @ts-ignore
      delete global.XMLSerializer
      const res = await markdown.parseMarkdownToHtml('# A\n\n## B')
      expect(res.toc.length).toBeGreaterThan(0)
      expect(res.html).toContain('id="a"')
    } finally {
      // @ts-ignore
      global.XMLSerializer = oldXmlSerializer
    }
  })

  it('detectFenceLanguagesAsync falls back when worker detect fails', async () => {
    const oldVitest = process.env.VITEST
    try {
      process.env.VITEST = ''
      vi.spyOn(markdown, 'initRendererWorker').mockReturnValue({})
      vi.spyOn(markdown, '_sendToRenderer').mockRejectedValue(new Error('worker down'))

      const res = await markdown.detectFenceLanguagesAsync('```rust\nfn main(){}\n```')
      expect(res.has('rust')).toBe(true)
    } finally {
      process.env.VITEST = oldVitest
    }
  })

  it('streamParseMarkdown accepts non-function callback safely', async () => {
    await expect(markdown.streamParseMarkdown('# Title', null, { chunkSize: 4 })).resolves.toBeUndefined()
  })

  it('detectFenceLanguagesAsync short-circuits to sync detection when plugins exist', async () => {
    markdown.setMarkdownExtensions([{}])
    const sendSpy = vi.spyOn(markdown, '_sendToRenderer')

    const out = await markdown.detectFenceLanguagesAsync('```js\n1+1\n```')

    expect(out.has('js')).toBe(true)
    expect(sendSpy).not.toHaveBeenCalled()
  })

  it('parseMarkdownToHtml uses non-vitest fast path for small markdown without fences', async () => {
    const oldVitest = process.env.VITEST
    try {
      process.env.VITEST = ''
      const out = await markdown.parseMarkdownToHtml('# Fast\n\n![x](a.png)')
      expect(out.toc.length).toBeGreaterThan(0)
      expect(out.html).toContain('loading="lazy"')
    } finally {
      process.env.VITEST = oldVitest
    }
  })

  it('detectFenceLanguages handles aliases and rejects unsupported short names', () => {
    const supported = new Map([
      ['javascript', 'javascript']
    ])

    const out = markdown.detectFenceLanguages('```js\n1\n```\n```rb\n2\n```', supported)

    expect(out.has('javascript')).toBe(true)
    expect(out.has('rb')).toBe(false)
  })

  it('extension management handles non-plugin and non-array inputs', () => {
    const before = markdown.markdownPlugins.length
    expect(() => markdown.addMarkdownExtension(null)).not.toThrow()
    expect(markdown.markdownPlugins.length).toBe(before)

    expect(() => markdown.setMarkdownExtensions(null)).not.toThrow()
    expect(Array.isArray(markdown.markdownPlugins)).toBe(true)
  })

  it('splitIntoSections falls back to fixed-size slices when no headings exist', () => {
    const sections = markdown._splitIntoSections('x'.repeat(55), 10)
    expect(sections.length).toBeGreaterThan(1)
    expect(sections.join('')).toBe('x'.repeat(55))
  })

  it('fast path preserves existing loading/data-want-lazy image attrs', async () => {
    const oldVitest = process.env.VITEST
    try {
      process.env.VITEST = ''
      const out = await markdown.parseMarkdownToHtml([
        '# Img',
        '<img src="a.png" loading="eager">',
        '<img src="b.png" data-want-lazy="1">'
      ].join('\n'))

      expect(out.html).toContain('loading="eager"')
      expect(out.html).toContain('data-want-lazy="1"')
    } finally {
      process.env.VITEST = oldVitest
    }
  })
})
