import { describe, it, expect } from 'vitest'
import { memoize } from '../src/utils/memoize.js'

describe('memoize LRU', () => {
  it('caches results and evicts least-recently-used key', () => {
    let calls = 0
    const f = memoize((s) => { calls += 1; return s + '-X' }, 3)

    expect(f('a')).toBe('a-X')
    expect(calls).toBe(1)

    // repeated access hits cache
    expect(f('a')).toBe('a-X')
    expect(calls).toBe(1)

    expect(f('b')).toBe('b-X')
    expect(f('c')).toBe('c-X')
    expect(f._cache.size).toBe(3)

    // touch 'b' to make it recently used
    expect(f('b')).toBe('b-X')
    expect(calls).toBe(3)

    // adding a new key evicts the least-recently-used ('a')
    expect(f('d')).toBe('d-X')
    expect(calls).toBe(4)
    expect(f._cache.size).toBe(3)
    expect(f._cache.has('a')).toBe(false)
    expect(f._cache.has('b')).toBe(true)
    expect(f._cache.has('c')).toBe(true)
    expect(f._cache.has('d')).toBe(true)
  })
})
