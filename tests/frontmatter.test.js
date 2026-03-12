import { describe, it, expect } from 'vitest'
import { parseFrontmatter } from '../src/utils/frontmatter.js'

describe('frontmatter parser', () => {
  it('extracts data and content when frontmatter is present', () => {
    const md = `---
key1: value1
key2: value2
---
# Heading\nBody text`
    const result = parseFrontmatter(md)
    expect(result.data).toEqual({ key1: 'value1', key2: 'value2' })
    expect(result.content).toContain('# Heading')
  })

  it('ignores malformed lines and trims values', () => {
    const md = `---
foo: bar
badline
baz:   qux   
---
rest`
    const result = parseFrontmatter(md)
    expect(result.data).toEqual({ foo: 'bar', baz: 'qux' })
    expect(result.content).toBe('rest')
  })

  it('returns original text when no frontmatter separator exists', () => {
    const raw = 'no yaml here'
    const result = parseFrontmatter(raw)
    expect(result.data).toEqual({})
    expect(result.content).toBe(raw)
  })

  it('returns original when frontmatter start but no closing delimiter', () => {
    const raw = '---\nunterminated'
    const result = parseFrontmatter(raw)
    expect(result.data).toEqual({})
    expect(result.content).toBe(raw)
  })
})