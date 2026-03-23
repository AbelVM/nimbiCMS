/**
 * Tiny LRU memoize helper for string transforms.
 * Keeps a small Map and evicts the least-recently-used entry when the
 * cache exceeds `maxSize`.
 */
export function memoize(fn, maxSize = 1000) {
  const cache = new Map()
  function wrapped(arg) {
    const key = arg === undefined ? '__undefined' : String(arg)
    if (cache.has(key)) {
      const v = cache.get(key)
      // refresh LRU position
      cache.delete(key)
      cache.set(key, v)
      return v
    }
    const res = fn(arg)
    try {
      cache.set(key, res)
      if (cache.size > maxSize) {
        const firstKey = cache.keys().next().value
        cache.delete(firstKey)
      }
    } catch (_e) {
      // ignore cache failures; still return computed result
    }
    return res
  }
  // Expose internals for tests and optional reset.
  wrapped._cache = cache
  wrapped._reset = () => cache.clear()
  return wrapped
}
