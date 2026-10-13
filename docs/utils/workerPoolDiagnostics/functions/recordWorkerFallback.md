[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/workerPoolDiagnostics](../README.md) / recordWorkerFallback

# Function: recordWorkerFallback()

> **recordWorkerFallback**(`reason?`, `durationMs?`): `void`

Record a worker-fallback event.

## Parameters

### reason?

`string` = `"unknown"`

Stable reason key (e.g. "worker-exit").

### durationMs?

`number` = `0`

Optional duration in ms; only counted when finite and > 0.

## Returns

`void`
