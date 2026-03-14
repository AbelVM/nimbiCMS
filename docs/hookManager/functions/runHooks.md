[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [hookManager](../README.md) / runHooks

# Function: runHooks()

> **runHooks**(`name`, `ctx`): `Promise`\<`void`\>

Invoke all registered hook callbacks for the given hook `name` with a
supplied context object. Errors from individual callbacks are swallowed.

## Parameters

### name

`string`

hook name

### ctx

`object`

context passed to callbacks

## Returns

`Promise`\<`void`\>
