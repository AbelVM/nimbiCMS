import { describe, it, expect, vi } from 'vitest'

describe('markdown additional branches', () => {
  it('maps HLJS alias names via supportedMap', async () => {
    vi.resetModules()
    const md = await import('../src/markdown.js')
    const supported = new Map([['bash', 'bash']])
    const res = md.detectFenceLanguages('```sh\nls\n```', supported)
    expect(res.has('bash')).toBe(true)
  })

  it('removes moved logo image by absolute matching', async () => {
    vi.resetModules()
    const md = await import('../src/markdown.js')
    // ensure plugin path is not used
    md.setMarkdownExtensions([])
    const moved = new URL('/logo.png', location.href).toString()
    document.documentElement.setAttribute('data-nimbi-logo-moved', moved)
    try {
      const res = await md.parseMarkdownToHtml('# Title\n\n![alt](/logo.png)')
      expect(res.html).not.toContain('/logo.png')
    } finally {
      document.documentElement.removeAttribute('data-nimbi-logo-moved')
    }
  })

  it('worker path deduplicates headings', async () => {
    vi.resetModules()
    const md = await import('../src/markdown.js')
    md.setMarkdownExtensions([])
    const out = await md.parseMarkdownToHtml('## Heading\n\n## Heading')
    expect(out.toc.length).toBe(2)
    expect(out.toc[0].id).toBe('heading')
    expect(out.toc[1].id).toBe('heading-2')
  })
})
import { describe, it, expect, beforeEach } from 'vitest'
import { parseMarkdownToHtml, setMarkdownExtensions } from '../src/markdown.js'

describe('markdown additional branch coverage', () => {
  beforeEach(() => {
    // ensure a clean plugin list before each test
    setMarkdownExtensions([])
  })

  it('deduplicates heading ids and lazy-loads images when plugins present', async () => {
    // trigger the plugin-based parsing path without modifying output
    setMarkdownExtensions([{}])

    const md = '# Hello\n\n# Hello\n\n![alt](img.png)'
    const res = await parseMarkdownToHtml(md)

    const ids = (res.toc || []).map(e => e.id)
    expect(ids).toContain('hello')
    expect(ids).toContain('hello-2')
    expect(res.html).toContain('loading="lazy"')
  })
})
