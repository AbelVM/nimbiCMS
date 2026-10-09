[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/concurrency](../README.md) / runWithConcurrency

# Function: runWithConcurrency()

> **runWithConcurrency**(`items`, `worker`, `concurrency?`, `signal?`): `Promise`\<`any`[]\>

Run `worker` over every item with at most `concurrency` in flight.

Results are returned in input order. An aborted `signal` rejects the
pending work rather than leaving promises dangling.

## Parameters

### items

`Iterable`\<`any`, `any`, `any`\>

Items to process (Array, Set, or any iterable).

### worker

(`item`, `index`) => `any`

Async worker.

### concurrency?

`number` = `4`

Maximum simultaneous workers.

### signal?

`AbortSignal`

Optional abort signal.

## Returns

`Promise`\<`any`[]\>

Results in input order.
