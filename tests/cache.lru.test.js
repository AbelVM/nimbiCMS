import { LRUCache } from '../src/utils/cache.js'
import { vi, describe, it, expect } from 'vitest'

describe('LRUCache basic behavior', () => {
  it('evicts oldest entries when maxSize exceeded', () => {
    const onEvict = vi.fn()
    const c = new LRUCache({ maxSize: 2, onEvict })
    c.set('a', 1)
    c.set('b', 2)
    expect(c.size).toBe(2)
    c.set('c', 3)
    expect(onEvict).toHaveBeenCalledTimes(1)
    expect(onEvict).toHaveBeenCalledWith('a', 1)
    expect(c.get('a')).toBeUndefined()
    expect(c.get('b')).toBe(2)
    expect(c.get('c')).toBe(3)
  })

  it('triggers onEvict when TTL expires on access', async () => {
    const onEvict = vi.fn()
    const c = new LRUCache({ maxSize: 10, ttlMs: 30, onEvict })
    c.set('x', 'X')
    await new Promise(r => setTimeout(r, 40))
    expect(c.get('x')).toBeUndefined()
    expect(onEvict).toHaveBeenCalledTimes(1)
  })
})
