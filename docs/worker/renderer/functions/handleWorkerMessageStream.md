[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [worker/renderer](../README.md) / handleWorkerMessageStream

# Function: handleWorkerMessageStream()

> **handleWorkerMessageStream**(`msg`, `onChunk`): `Promise`\<`Object`\>

Inline shim: stream handler that calls `onChunk` for each chunk and
returns a final response similar to `handleWorkerMessage`.

## Parameters

### msg

`Object`

### onChunk

(`arg0`) => `void`

## Returns

`Promise`\<`Object`\>
