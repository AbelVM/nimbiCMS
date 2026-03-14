[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [slugManager](../README.md) / ensureSlug

# Function: ensureSlug()

> **ensureSlug**(`decoded`, `contentBase`, `maxQueue?`): `Promise`\<`string` \| `null`\>

Ensure the given slug is mapped to a markdown path. Attempts manifest
lookup, search-index, crawling, and other fallbacks in order.

## Parameters

### decoded

`string`

### contentBase

`string`

### maxQueue?

`number`

## Returns

`Promise`\<`string` \| `null`\>
