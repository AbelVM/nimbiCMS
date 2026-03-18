[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [router](../README.md) / resolutionCacheSet

# Function: resolutionCacheSet()

> **resolutionCacheSet**(`key`, `value`): `void`

Store a resolution result in the runtime resolution cache and evict the
oldest entries when the cache exceeds `RESOLUTION_CACHE_MAX`.

## Parameters

### key

`string`

Cache key string.

### value

Resolution record to store.

#### anchor

`string` \| `null`

#### resolved

`string`

## Returns

`void`
