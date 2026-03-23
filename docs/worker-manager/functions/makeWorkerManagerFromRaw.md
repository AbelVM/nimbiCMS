[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [worker-manager](../README.md) / makeWorkerManagerFromRaw

# Function: makeWorkerManagerFromRaw()

> **makeWorkerManagerFromRaw**(`code`, `handleFn`, `name?`): [`WorkerManager`](../type-aliases/WorkerManager.md)

Create a worker manager from raw worker source plus an optional inline
fallback handler. This wraps `createWorkerFromRaw` and, when workers are
unavailable or tests request an inline implementation, returns a shim that
forwards messages to `handleFn`.

## Parameters

### code

`string`

Raw worker source (string) used to create a Blob URL.

### handleFn

(`arg0`) => `Promise`\<`object`\>

Inline handler invoked when no Worker is available.

### name?

`string` = `'worker'`

Friendly name for logging.

## Returns

[`WorkerManager`](../type-aliases/WorkerManager.md)

- A worker manager instance.
