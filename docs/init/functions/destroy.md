[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [init](../README.md) / destroy

# Function: destroy()

> **destroy**(): `void`

Tear down the CMS runtime: abort pending fetches, terminate worker pools,
remove event listeners, and clear DOM elements created during `initCMS`.

Safe to call multiple times; subsequent calls are no-ops.

## Returns

`void`
