[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [worker/slugWorker](../README.md) / handleSlugWorkerMessage

# Function: handleSlugWorkerMessage()

> **handleSlugWorkerMessage**(`msg`): `Promise`\<`Object`\>

Helper to process slug-worker messages outside of a Worker.

## Parameters

### msg

`Object`

Message object for slug worker (see onmessage shapes above).

## Returns

`Promise`\<`Object`\>

Response object matching worker posts (`{id, result}` or `{id, error}`).
