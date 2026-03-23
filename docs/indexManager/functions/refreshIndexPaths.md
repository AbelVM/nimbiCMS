[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [indexManager](../README.md) / refreshIndexPaths

# Function: refreshIndexPaths()

> **refreshIndexPaths**(`contentBase`): `void`

Refresh the internal `indexSet` from available markdown paths and slug maps.
Useful when the content base or path list changes at runtime (tests/plugins).
This clears and repopulates `indexSet` and augments it with values
discovered in slug maps.

## Parameters

### contentBase

Base path or URL for content used by the indexer.

`string` | `URL`

## Returns

`void`
