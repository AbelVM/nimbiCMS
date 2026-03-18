[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [slugManager](../README.md) / \_setAllMd

# Function: \_setAllMd()

> **\_setAllMd**(`mdMap`): `void`

Internal helper to replace the in-memory mapping of slug -> markdown.
Intended for bulk updates from an indexer or worker.

## Parameters

### mdMap

`Record`\<`string`, `string`\>

Mapping of slug (string) to markdown source.

## Returns

`void`
