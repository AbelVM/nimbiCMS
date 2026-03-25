import { beforeEach, test, expect, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  if (typeof document !== 'undefined') document.body.innerHTML = ''
})

test('resolutionCache purge early-return when TTL non-positive', async () => {
  const { setResolutionCacheTtl, resolutionCache, resolutionCacheSet, resolutionCacheGet } = await import('../../src/router.js')
  // ensure cache is clean
  try { resolutionCache.clear() } catch (_) {}

  // set TTL to 0 so `_purgeExpiredEntries` returns early (hits the missing branch)
  setResolutionCacheTtl(0)

  // calling resolutionCacheSet will call _purgeExpiredEntries internally
  resolutionCacheSet('test-key', { resolved: 'some', anchor: null })

  const got = resolutionCache.get('test-key') || (typeof resolutionCacheGet === 'function' ? resolutionCacheGet('test-key') : null)
  expect(got).toBeTruthy()
})
