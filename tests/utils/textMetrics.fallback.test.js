import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock reading-time to simulate absence of `words` property so fallback runs
vi.mock('reading-time/lib/reading-time', () => {
  return { default: (text) => ({ text: '1 min read', minutes: 1, time: 60000 }) }
})

import { getTextMetrics, clearTextMetricsCache } from '../../src/utils/textMetrics.js'

describe('textMetrics fallback behavior', () => {
  beforeEach(() => clearTextMetricsCache())

  it('falls back to computeWordCount when reading-time lacks words', () => {
    const res = getTextMetrics('one two three four')
    expect(res.wordCount).toBe(4)
  })
})
