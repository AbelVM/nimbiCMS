[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/runtimeGlobals](../README.md) / setIfCurrent

# Function: setIfCurrent()

> **setIfCurrent**(`generation`, `key`, `value`): `boolean`

Write `value` to `window[key]` only if `generation` is the live one.

The strict counterpart to [setIfLive](setIfLive.md): a `null` generation is
rejected, so callers must have claimed one.

## Parameters

### generation

`number` \| `null`

Generation captured when the work started.

### key

`string`

Global property name (without the `window.` prefix).

### value

`any`

Value to publish.

## Returns

`boolean`

`true` when the write happened.
