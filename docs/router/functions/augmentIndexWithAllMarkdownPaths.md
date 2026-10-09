[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [router](../README.md) / augmentIndexWithAllMarkdownPaths

# Function: augmentIndexWithAllMarkdownPaths()

> **augmentIndexWithAllMarkdownPaths**(`arrOrMap`): `void`

Add every value from an array or Map-like object to the internal `indexSet`.
Used by refreshIndexPaths and map-tracking helpers.

## Parameters

### arrOrMap

`any`[] \| `string`[] \| \{ `values`: () => `Iterable`\<`any`\>; \}

array or object providing a `values()` iterator.

## Returns

`void`
