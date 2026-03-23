[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [worker-manager](../README.md) / makeWorkerManager

# Function: makeWorkerManager()

> **makeWorkerManager**(`createWorker`, `name?`): [`WorkerManager`](../type-aliases/WorkerManager.md)

Create a worker manager that lazily instantiates a Worker and provides
request/response semantics with timeout and automatic cleanup on errors.

## Parameters

### createWorker

() => `Worker` \| `null`

Function that returns a new Worker instance when called.

### name?

`string` = `'worker'`

Friendly name used in console warnings.

## Returns

[`WorkerManager`](../type-aliases/WorkerManager.md)

- The worker manager API with `get`, `send`, and `terminate` methods.
