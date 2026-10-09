[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/concurrency](../README.md) / runWithConcurrency

# Function: runWithConcurrency()

> **runWithConcurrency**\<`T`, `R`\>(`items`, `worker`, `concurrency?`, `signal?`): `Promise`\<`R`[]\>

Run `worker` over every item with at most `concurrency` in flight.

Results are returned in input order. An aborted `signal` rejects the
pending work rather than leaving promises dangling.

## Type Parameters

### T

`T`

### R

`R`

## Parameters

### items

readonly `T`[]

Items to process.

### worker

(`item`, `index`) => `R` \| `Promise`\<`R`\>

Async worker.

### concurrency?

`number` = `4`

Maximum simultaneous workers.

### signal?

`AbortSignal`

Optional abort signal.

## Returns

`Promise`\<`R`[]\>

Results in input order.
