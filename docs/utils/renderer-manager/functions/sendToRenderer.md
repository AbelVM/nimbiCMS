[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/renderer-manager](../README.md) / \_sendToRenderer

# Function: \_sendToRenderer()

> **\_sendToRenderer**(`msg`, `timeout?`): `Promise`\<`unknown`\>

Send a message to the renderer worker and await a response.

## Parameters

### msg

`Object`

Message payload to send to the renderer.

### timeout?

`number` = `3000`

Timeout in milliseconds (default: 3000).

## Returns

`Promise`\<`unknown`\>

Promise resolving with the worker's result.
