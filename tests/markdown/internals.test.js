import { describe, it, expect } from 'vitest'
import { _splitIntoSections, _slugifyLocal } from '../../src/markdown.js'

describe('markdown internals', () => {
  it('splitIntoSections splits by headings and merges small sections', () => {
    const md = `Intro paragraph

# H1

Some text under h1 that is verbose enough to form a chunk.

## H2

Small

# H3

Another chunk of content with more words to force a larger chunk.`
    const sections = _splitIntoSections(md, 40)
    expect(Array.isArray(sections)).toBeTruthy()
    expect(sections.length).toBeGreaterThan(1)
  })

  it('slugifyLocal produces sane slugs for headings', () => {
    expect(_slugifyLocal('Hello World')).toBe('hello-world')
    expect(_slugifyLocal('   Trim ME  ')).toBe('trim-me')
  })
})
