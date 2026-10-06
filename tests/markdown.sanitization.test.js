import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('markdown sanitization with DOMPurify', () => {
  let md

  beforeEach(async () => {
    vi.resetModules()
    md = await import('../src/markdown.js')
  })

  afterEach(() => {
    vi.resetModules()
  })

  it('strips <script> tags from markdown output', async () => {
    const malicious = '# Hello\n<script>alert("xss")</script>\nSafe text'
    const result = await md.parseMarkdownToHtml(malicious)
    expect(result.html).not.toContain('<script>')
    expect(result.html).not.toContain('alert')
    expect(result.html).toContain('Safe text')
  })

  it('removes onerror and other event handler attributes', async () => {
    const malicious = '<img src="x" onerror="alert(1)">'
    const result = await md.parseMarkdownToHtml(malicious)
    expect(result.html).not.toContain('onerror')
    expect(result.html).not.toContain('alert')
  })

  it('blocks javascript: URIs in links and images', async () => {
    const malicious = '[click me](javascript:alert(1))'
    const result = await md.parseMarkdownToHtml(malicious)
    expect(result.html).not.toContain('javascript:')
    expect(result.html).not.toContain('alert')
  })

  it('preserves safe HTML like <strong>, <em>, <code>', async () => {
    const safe = '# Title\n**bold** *italic* `code`'
    const result = await md.parseMarkdownToHtml(safe)
    expect(result.html).toContain('<strong>bold</strong>')
    expect(result.html).toContain('<em>italic</em>')
    expect(result.html).toContain('<code>code</code>')
  })

  it('sanitizes code blocks - script tags in code are escaped', async () => {
    const withCode = '```js\nconst x = "<script>alert(1)</script>";\n```'
    const result = await md.parseMarkdownToHtml(withCode)
    // hljs escapes HTML in code blocks, DOMPurify should not double-escape
    expect(result.html).not.toContain('<script>')
    expect(result.html).toContain('&lt;script&gt;')
  })
})
