[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/workerPoolDiagnostics](../README.md) / getWorkerPoolDiagnostics

# Function: getWorkerPoolDiagnostics()

> **getWorkerPoolDiagnostics**(): `Object`

Return a snapshot of per-pool stats and accumulated fallback counters.

## Returns

`Object`

Diagnostics object keyed by pool name, plus `_fallbacks`
  and `_fallbackDurationMs` maps when any fallback has been recorded.
