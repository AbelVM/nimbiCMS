[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/runtimeGlobals](../README.md) / setIfLive

# Function: setIfLive()

> **setIfLive**(`generation`, `key`, `value`): `boolean`

Write `value` to `window[key]` unless `generation` has been superseded.

The permissive counterpart to [setIfCurrent](setIfCurrent.md), for code paths that are
also driven by hosts and tests without a live `initCMS` runtime.

## Parameters

### generation

`number` \| `null`

Generation captured when the work started.

### key

`string`

Global property name.

### value

`any`

Value to publish.

## Returns

`boolean`

`true` when the write happened.
