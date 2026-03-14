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

### contentBase

`string`

### pagePath?

`string`

## Returns

`Promise`\<`void`\>
