[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [worker-manager](../README.md) / makeWorkerPool

# Function: makeWorkerPool()

> **makeWorkerPool**(`createWorker`, `name?`, `size?`): [`WorkerManager`](../type-aliases/WorkerManager.md)

Create a simple pool of workers to allow parallel work.

## Parameters

### createWorker

() => `Worker` \| `null`

factory for a single Worker instance

### name?

`string` = `'worker-pool'`

friendly name

### size?

`number` = `2`

number of workers in the pool

## Returns

[`WorkerManager`](../type-aliases/WorkerManager.md)

- manager with `get`, `send`, and `terminate`
