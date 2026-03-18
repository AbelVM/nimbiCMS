[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/helpers](../README.md) / safe

# Function: safe()

> **safe**(`fn`): `any`

Execute the given function and silently ignore any exceptions. Returns
the result of `fn` or `undefined` if an error occurred. If `fn` returns
a Promise, the returned Promise will resolve to `undefined` on rejection.
Useful for replacing frequent `try { ... } catch (_) {}` patterns.

## Parameters

### fn

() => `any`

## Returns

`any`
