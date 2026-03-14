[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [htmlBuilder](../README.md) / rewriteAnchors

# Function: rewriteAnchors()

> **rewriteAnchors**(`article`, `contentBase`, `pagePath?`): `Promise`\<`void`\>

Rewrite anchor hrefs in an article element to SPA `?page=` links where
applicable. Performs slug lookups and may fetch markdown titles.

## Parameters

### article

`HTMLElement`

### contentBase

`string`

### pagePath?

`string`

## Returns

`Promise`\<`void`\>
