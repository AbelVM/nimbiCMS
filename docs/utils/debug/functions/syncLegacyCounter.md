[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/debug](../README.md) / syncLegacyCounter

# Function: syncLegacyCounter()

> **syncLegacyCounter**(`name`): `void`

Compatibility helper: increment legacy global counters on `globalThis.__nimbiCMSDebug`
when present. This centralizes the remaining legacy-global touchpoints so
callers don't need to reference `__nimbiCMSDebug` directly.

## Parameters

### name

`string`

## Returns

`void`
