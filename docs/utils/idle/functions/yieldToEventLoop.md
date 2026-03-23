[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/idle](../README.md) / yieldToEventLoop

# Function: yieldToEventLoop()

> **yieldToEventLoop**(): `Promise`\<`void`\>

Yield once to the event loop. Uses `requestIdleCallback` if present,
otherwise falls back to a microtask via `setTimeout(..., 0)`.

## Returns

`Promise`\<`void`\>
