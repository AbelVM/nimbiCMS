import { describe, it, expect, beforeEach } from 'vitest'
import { getReadingTime, getTextMetrics, clearTextMetricsCache } from '../src/utils/textMetrics.js'

describe('textMetrics cache', () => {
  beforeEach(() => {
    clearTextMetricsCache()
  })

  it('returns same readingTime object for repeated calls', () => {
    const txt = 'Hello world, this is a test.'
    const rt1 = getReadingTime(txt)
    const rt2 = getReadingTime(txt)
    expect(rt1).toBe(rt2)
  })

  it('getTextMetrics returns object with readingTime equal to getReadingTime', () => {
    const txt = 'Hello again. Testing reading-time wrapper.'
    const rt = getReadingTime(txt)
    const metrics = getTextMetrics(txt)
    expect(metrics).toHaveProperty('readingTime')
    expect(metrics.readingTime).toBe(rt)
    expect(metrics).toHaveProperty('wordCount')
    expect(typeof metrics.wordCount).toBe('number')
  })

  it('clearTextMetricsCache invalidates cached entries', () => {
    const txt = 'Seed text for eviction check'
    const rt1 = getReadingTime(txt)
    clearTextMetricsCache()
    const rt2 = getReadingTime(txt)
    expect(rt1).not.toBe(rt2)
  })

  it('consistent metrics values across calls', () => {
    const txt = 'One two three four five six seven eight nine ten'
    const m1 = getTextMetrics(txt)
    const m2 = getTextMetrics(txt)
    expect(m1.wordCount).toBe(m2.wordCount)
    expect(m1.readingTime.minutes).toBeCloseTo(m2.readingTime.minutes, 5)
  })
})
