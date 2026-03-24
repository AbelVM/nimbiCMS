[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [slugManager](../README.md) / setFetchCacheMaxSize

# Function: setFetchCacheMaxSize()

> **setFetchCacheMaxSize**(`n`): `void`

Adjust the fetch cache max size used by `fetchCache` (LRU entries).
Useful for tuning memory vs. hit-rate in constrained environments.

## Parameters

### n

`number`

Maximum number of entries to retain (>= 0)

## Returns

`void`
