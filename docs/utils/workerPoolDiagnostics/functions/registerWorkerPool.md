[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/workerPoolDiagnostics](../README.md) / registerWorkerPool

# Function: registerWorkerPool()

> **registerWorkerPool**(`name`, `pool`): `any`

Register a pool for diagnostics and subscribe to its worker-exit events.

Accepts any object that exposes `addEventListener(type, cb)` (a PowerPool)
as well as the legacy stub pools used when construction fails — those have
no `addEventListener`, which is handled gracefully.

## Parameters

### name

`string`

Stable pool name (e.g. "slug", "renderer", "anchor").

### pool

`any`

Pool instance or stub.

## Returns

`any`

The registered pool, for chaining.
