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

Decoded slug value to resolve (string without encoding).

### contentBase

`string`

Base URL used for discovery and fetching.

### maxQueue?

`number`

Optional maximum queue size for crawling.

## Returns

`Promise`\<`string` \| `null`\>

- Promise resolving to the markdown path or `null` if not found.
