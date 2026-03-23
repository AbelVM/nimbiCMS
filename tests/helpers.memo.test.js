import { describe, it, expect } from 'vitest'
import { normalizePath } from '../src/utils/helpers.js'

describe('helpers memoization', () => {
  it('normalizePath is memoized and returns consistent values', () => {
    if (normalizePath && typeof normalizePath._reset === 'function') normalizePath._reset()
    const v1 = normalizePath('../some/path')
    const v2 = normalizePath('../some/path')
    expect(v1).toBe('some/path')
    expect(v2).toBe('some/path')
    expect(normalizePath._cache).toBeDefined()
    expect(normalizePath._cache.has('../some/path')).toBe(true)
  })
})
