[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / utils/workerPoolDiagnostics

# utils/workerPoolDiagnostics

Worker-pool diagnostics.

Aggregates per-pool `getStats()` snapshots and worker-fallback counters into
a single object for host pages and debugging tools. Also subscribes to each
registered PowerPool's `pool:worker:exit` event so a worker dying mid-flight
is recorded as a fallback rather than staying silent.

## Event wiring

`PowerPool.addEventListener(type, cb)` proxies to the pool's internal
`PowerEventBus`. v2.1.0 emits `pool:worker:exit` from `_handleWorkerExit`
with `{ id, code, completedTask, remaining }`. We subscribe at
registration time and unsubscribe at teardown time, so a pool that is
discarded cannot leave a dangling listener behind.

The fallback counter is keyed by a stable reason string. The pool emits one
event per dead worker, so the counter is the number of workers that died
while the pool was live — which is what the diagnostics are for.

## Functions

- [getWorkerPoolDiagnostics](functions/getWorkerPoolDiagnostics.md)
- [recordWorkerFallback](functions/recordWorkerFallback.md)
- [registerWorkerPool](functions/registerWorkerPool.md)
- [unregisterWorkerPool](functions/unregisterWorkerPool.md)
