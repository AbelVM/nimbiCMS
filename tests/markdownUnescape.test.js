import { describe, it, expect } from 'vitest'
import { unescapeMarkdown } from '../src/slugManager.js'

describe('unescapeMarkdown', () => {
  it('unescapes all CommonMark escapable characters', () => {
    const escapable = "\\`*_{}[]()#+-.!"
    // build string like "\\` \\* \\_ ..."
    const parts = Array.from(escapable).map(ch => `\\${ch}`)
    const input = parts.join(' ')
    const out = unescapeMarkdown(input)
    const expected = Array.from(escapable).join(' ')
    expect(out).toBe(expected)
  })

  it('leaves other backslashes intact', () => {
    expect(unescapeMarkdown('\\x')).toBe('\\x')
    expect(unescapeMarkdown('foo \\bar')).toBe('foo \\bar')
  })

  it('handles double backslashes correctly', () => {
    // "\\\\_" -> first replace removes one backslash if next is escapable
    expect(unescapeMarkdown('\\\\_clear')).toBe('\\_clear')
    // single-escaped underscore becomes plain
    expect(unescapeMarkdown('\\_clear')).toBe('_clear')
  })

  it('returns non-string/null values unchanged (null/undefined)', () => {
    expect(unescapeMarkdown(null)).toBeNull()
    expect(unescapeMarkdown(undefined)).toBeUndefined()
  })
})
