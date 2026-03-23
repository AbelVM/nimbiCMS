[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [slugManager](../README.md) / \_setSearchIndex

# Function: \_setSearchIndex()

> **\_setSearchIndex**(`arr`): `void`

Replace the runtime `searchIndex` from an external caller.
Useful when a worker returns a prebuilt index and we want the
module export to reflect that value for diagnostics and consumers.

## Parameters

### arr

`any`[]

Array of search index entries

## Returns

`void`
