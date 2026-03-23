[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [slugManager](../README.md) / awaitSearchIndex

# Function: awaitSearchIndex()

> **awaitSearchIndex**(`opts?`): `Promise`\<`any`[]\>

Await the runtime `searchIndex` without a timeout. This wrapper ensures
the canonical index is built (worker-first) and will wait indefinitely
until the index is available or a build completes. Callers that must
not use timeouts should use this API instead of `whenSearchIndexReady`.

## Parameters

### opts?

#### contentBase?

`string`

#### indexDepth?

`number`

#### noIndexing?

`string`[]

#### seedPaths?

`string`[]

#### startBuild?

`boolean`

#### timeoutMs?

`number`

## Returns

`Promise`\<`any`[]\>

resolves to the live `searchIndex` array
