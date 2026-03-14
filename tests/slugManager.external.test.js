import { describe, it, expect } from 'vitest'
import { isExternalLink, isExternalLinkWithBase, unescapeMarkdown } from '../src/slugManager.js'

describe('slugManager external link detection', () => {
  it('returns true for protocol absolute URLs', () => {
    expect(isExternalLink('http://example.com/foo')).toBe(true)
    expect(isExternalLink('https://example.com')).toBe(true)
    expect(isExternalLink('mailto:me@example.com')).toBe(true)
  })

  it('returns true for protocol-relative URLs', () => {
    expect(isExternalLink('//cdn.example.com/lib.js')).toBe(true)
  })

  it('treats same-origin absolute paths under contentBase as internal', () => {
    const base = 'https://example.com/content/'
    expect(isExternalLinkWithBase('/content/foo.md', base)).toBe(false)
    expect(isExternalLinkWithBase('https://example.com/content/foo.md', base)).toBe(false)
  })

  it('treats absolute paths outside contentBase as external', () => {
    const base = 'https://example.com/content/'
    expect(isExternalLinkWithBase('/other/foo.md', base)).toBe(true)
    expect(isExternalLinkWithBase('https://example.com/other/foo.md', base)).toBe(true)
  })

  it('treats different-origin absolute URLs as external', () => {
    const base = 'https://example.com/content/'
    expect(isExternalLinkWithBase('https://cdn.example.org/content/foo.md', base)).toBe(true)
  })

  it('falls back to conservative checks when base not provided', () => {
    expect(isExternalLinkWithBase('http://example.com', undefined)).toBe(true)
    expect(isExternalLinkWithBase('/content/foo.md', undefined)).toBe(false)
  })
})

describe('markdown unescape', () => {
  it('removes backslash escapes for common markdown characters', () => {
    expect(unescapeMarkdown('\\_clearHooks')).toBe('_clearHooks')
    expect(unescapeMarkdown('foo\\*bar')).toBe('foo*bar')
    expect(unescapeMarkdown('a\\[b\\]')).toBe('a[b]')
  })

  it('returns input unchanged when no escapes', () => {
    expect(unescapeMarkdown('plain text')).toBe('plain text')
  })

  it('handles null/undefined gracefully', () => {
    expect(unescapeMarkdown(null)).toBe(null)
    expect(unescapeMarkdown(undefined)).toBe(undefined)
  })
})
