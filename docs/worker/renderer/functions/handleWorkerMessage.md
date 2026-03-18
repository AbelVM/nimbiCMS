[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [worker/renderer](../README.md) / handleWorkerMessage

# Function: handleWorkerMessage()

> **handleWorkerMessage**(`msg`): `Promise`\<`Object`\>

Helper to process renderer worker messages outside of a Worker.

## Parameters

### msg

`Object`

Message object sent to the renderer (see worker accepted messages above).

## Returns

`Promise`\<`Object`\>

Response shaped like worker replies: `{id, result}` or `{id, error}`.
