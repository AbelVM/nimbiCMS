[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [worker-manager](../README.md) / createWorkerFromRaw

# Function: createWorkerFromRaw()

> **createWorkerFromRaw**(`code`): `Worker` \| `null`

Build a Blob URL from raw worker source and return a Worker (module).
Returns null if the environment cannot create a Blob-based Worker.

## Parameters

### code

`string`

JavaScript source for the worker

## Returns

`Worker` \| `null`

- A Worker instance configured with `type: 'module'`, or `null` if creation failed.
