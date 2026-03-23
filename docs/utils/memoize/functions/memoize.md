[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/memoize](../README.md) / memoize

# Function: memoize()

> **memoize**(`fn`, `maxSize?`): `Function`

Tiny LRU memoize helper for single-argument transforms.
Keeps a small Map and evicts the least-recently-used entry when the
cache exceeds `maxSize`.

## Parameters

### fn

`Function`

Function to memoize; receives a single argument.

### maxSize?

`number` = `1000`

Maximum number of entries to keep.

## Returns

`Function`

Memoized wrapper. The returned function exposes a `._cache` Map and a `._reset()` method.
