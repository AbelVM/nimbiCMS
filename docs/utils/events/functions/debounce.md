[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/events](../README.md) / debounce

# Function: debounce()

> **debounce**(`fn`, `wait?`, `options?`): \{(...`args`): `void`; `cancel`: `void`; \}

DOM / event utilities: debounce, rafThrottle, and a small RAF batcher
These helpers coalesce rapid events and batch DOM writes using requestAnimationFrame.

## Parameters

### fn

`any`

### wait?

`number` = `150`

### options?

## Returns

\{(...`args`): `void`; `cancel`: `void`; \}

### cancel()

> **cancel**(): `void`

#### Returns

`void`
