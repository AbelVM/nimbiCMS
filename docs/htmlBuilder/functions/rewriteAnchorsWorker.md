[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [htmlBuilder](../README.md) / rewriteAnchorsWorker

# Function: rewriteAnchorsWorker()

> **rewriteAnchorsWorker**(`article`, `contentBase`, `pagePath?`): `Promise`\<`void`\>

Try to rewrite anchors using a dedicated worker. If the worker is not
available this is a thin wrapper that falls back to the in-thread
`rewriteAnchors` implementation.

## Parameters

### article

`HTMLElement`

Article element to process.

### contentBase

`string`

Base URL or path for site content.

### pagePath?

`string`

Optional page path for relative resolution.

## Returns

`Promise`\<`void`\>

- Resolves when anchor rewriting completes (or falls back to sync implementation).
