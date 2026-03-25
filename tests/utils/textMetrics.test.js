import { describe, it, expect, beforeEach } from 'vitest'
import { getTextMetrics, getReadingTime, clearTextMetricsCache } from '../../src/utils/textMetrics.js'

describe('textMetrics utilities', () => {
  beforeEach(() => clearTextMetricsCache())

  it('computes word count and readingTime', () => {
    const res = getTextMetrics('one two three')
    expect(res).toHaveProperty('wordCount')
    expect(res.wordCount).toBe(3)
    expect(res).toHaveProperty('readingTime')
  })

  it('getReadingTime returns an object with text property', () => {
    const rt = getReadingTime('hello world')
    expect(rt).toHaveProperty('text')
  })
})
