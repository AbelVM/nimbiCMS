[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [worker-manager](../README.md) / makeWorkerPoolFromRaw

# Function: makeWorkerPoolFromRaw()

> **makeWorkerPoolFromRaw**(`code`, `handleFn`, `name?`, `size?`): [`WorkerManager`](../type-aliases/WorkerManager.md)

Create a worker pool from raw worker source plus an optional inline
fallback handler. This mirrors `makeWorkerManagerFromRaw` but returns a
pooled manager created by `makeWorkerPool`.

## Parameters

### code

`string`

Raw worker source string.

### handleFn

(`arg0`) => `Promise`\<`object`\>

Inline handler when no Worker available.

### name?

`string` = `'worker-pool'`

Friendly name.

### size?

`number` = `2`

Pool size.

## Returns

[`WorkerManager`](../type-aliases/WorkerManager.md)

- Worker pool manager.
