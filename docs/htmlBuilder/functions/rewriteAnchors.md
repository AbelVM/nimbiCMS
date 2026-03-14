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

Article element containing page HTML and anchors.

### contentBase

`string`

Base URL or path for site content.

### pagePath?

`string`

Optional page path used for relative link resolution.

## Returns

`Promise`\<`void`\>

- Resolves when anchor rewriting and any async title fetches complete.
