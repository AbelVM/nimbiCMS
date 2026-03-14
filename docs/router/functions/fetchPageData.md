[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [router](../README.md) / fetchPageData

# Function: fetchPageData()

> **fetchPageData**(`raw`, `contentBase`): `Promise`\<\{ `anchor`: `string` \| `null`; `data`: `object`; `pagePath`: `string`; \}\>

Resolve a raw `page` query value, fetch the corresponding markdown/html,
and return the normalized content data.

This encapsulates slug lookup, nav/index discovery, candidate building and
caching of previous results.  It does **not** perform any DOM mutations; the
caller (usually `nimbi-cms.js`) handles rendering the returned `data`.

## Parameters

### raw

`string`

raw page string (e.g. from URLSearchParams)

### contentBase

`string`

base URL to pass to fetchMarkdown

## Returns

`Promise`\<\{ `anchor`: `string` \| `null`; `data`: `object`; `pagePath`: `string`; \}\>
