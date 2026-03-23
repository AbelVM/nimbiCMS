[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [slugManager](../README.md) / buildSearchIndex

# Function: buildSearchIndex()

> **buildSearchIndex**(`contentBase?`, `indexDepth?`, `noIndexing?`, `seedPaths?`): `Promise`\<`object`[]\>

Build the runtime search index by scanning known markdown/html paths
and crawling where necessary. The returned array is the authoritative
`searchIndex` used by runtime sitemap and search consumers.

## Parameters

### contentBase?

`string`

Base URL where content is hosted.

### indexDepth?

`number` = `1`

Depth of indexing (1=page, 2=include H2s, 3=include H3s).

### noIndexing?

`string`[] = `undefined`

Paths to exclude from indexing.

### seedPaths?

`string`[] = `undefined`

Optional seed paths to prioritize.

## Returns

`Promise`\<`object`[]\>

- Resolves to the authoritative search index.
