[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [router](../README.md) / setResolutionCacheTtl

# Function: setResolutionCacheTtl()

> **setResolutionCacheTtl**(`ms`): `void`

Modify the resolution cache time‑to‑live at runtime.
Accepts a value in milliseconds; passing a non‑positive value disables
expiration.  This is the recommended API for external code rather than
mutating the namespace object directly (which is read‑only in ESM).

## Parameters

### ms

`number`

Time-to-live (milliseconds) for cached resolution entries.

## Returns

`void`
