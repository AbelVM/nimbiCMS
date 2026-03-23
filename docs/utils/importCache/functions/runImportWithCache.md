[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/importCache](../README.md) / runImportWithCache

# Function: runImportWithCache()

> **runImportWithCache**(`key`, `loader`): `Promise`\<`any`\>

Run a loader function with single-flight dedupe and negative-caching.

## Parameters

### key

`string`

Cache key identifying the resource.

### loader

() => `Promise`\<`any`\>

Async loader returning the module or null.

## Returns

`Promise`\<`any`\>

The loaded module or null on failure.
