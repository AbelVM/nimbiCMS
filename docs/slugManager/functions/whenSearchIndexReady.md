[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [slugManager](../README.md) / whenSearchIndexReady

# Function: whenSearchIndexReady()

> **whenSearchIndexReady**(`opts?`): `Promise`\<`any`[]\>

Wait for the runtime `searchIndex` to be populated. If an index build is
already in progress this will await it; otherwise it will optionally kick
off a build (worker-first) and await completion. Returns the live
`searchIndex` array (possibly empty on timeout).

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
