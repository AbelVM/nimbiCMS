[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [worker-manager](../README.md) / createWorkerFromRaw

# Function: createWorkerFromRaw()

> **createWorkerFromRaw**(`code`): `Worker` \| `null`

Convenience helper that builds a `Blob` URL from a raw worker source string
and returns a newly constructed `Worker`. If the environment does not
support `Blob`/`URL.createObjectURL` this returns `null`.

## Parameters

### code

`string`

JavaScript source code for the worker as a string.

## Returns

`Worker` \| `null`

A Worker instance configured with `type: 'module'`, or `null` if creation failed.
