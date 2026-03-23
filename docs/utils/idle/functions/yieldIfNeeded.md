[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/idle](../README.md) / yieldIfNeeded

# Function: yieldIfNeeded()

> **yieldIfNeeded**(`iteration`, `threshold?`): `Promise`\<`void`\>

Conditionally yield based on an iteration counter. Call this from tight
loops to periodically yield control and avoid blocking the main thread.

## Parameters

### iteration

`number`

Current loop iteration (1-based or 0-based ok).

### threshold?

`number` = `50`

Yield once every `threshold` iterations.

## Returns

`Promise`\<`void`\>
