[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [markdown](../README.md) / \_sendToRenderer

# Function: \_sendToRenderer()

> **\_sendToRenderer**(`msg`, `timeout?`): `Promise`\<[`RendererResult`](../type-aliases/RendererResult.md)\>

Send a message to the renderer worker and await a response.

## Parameters

### msg

`Object`

Message payload to send to the renderer.

### timeout?

`number` = `3000`

Timeout in milliseconds.

## Returns

`Promise`\<[`RendererResult`](../type-aliases/RendererResult.md)\>

Promise resolving with the renderer result.
