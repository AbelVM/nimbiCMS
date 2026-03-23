[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [hookManager](../README.md) / runHooks

# Function: runHooks()

> **runHooks**(`name`, `ctx`): `Promise`\<`void`\>

Invoke all registered hook callbacks for the given hook `name` with a
supplied context object. Errors from individual callbacks are swallowed.

## Parameters

### name

[`HookName`](../type-aliases/HookName.md)

Hook name to invoke (e.g. 'onPageLoad').

### ctx

`Record`\<`string`, `unknown`\>

Context object passed to each callback.

## Returns

`Promise`\<`void`\>

- Resolves once all registered callbacks have completed.
