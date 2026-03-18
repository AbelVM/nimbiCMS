[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [worker/anchorWorker](../README.md) / handleAnchorWorkerMessage

# Function: handleAnchorWorkerMessage()

> **handleAnchorWorkerMessage**(`msg`): `Promise`\<`Object`\>

Helper to process an anchor-worker style message outside of a Worker.

## Parameters

### msg

`Object`

Message object (expects `type === 'rewriteAnchors'` and fields `id`, `html`, `contentBase`, `pagePath`).

## Returns

`Promise`\<`Object`\>

Response shaped like the worker postMessage (contains `id` and `result` or `error`).
