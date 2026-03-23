[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/concurrency](../README.md) / runWithConcurrency

# Function: runWithConcurrency()

> **runWithConcurrency**\<`T`, `U`\>(`items`, `worker`, `concurrency?`): `Promise`\<`U`[]\>

Run items through an async worker function with limited concurrency.

## Type Parameters

### T

`T`

### U

`U`

## Parameters

### items

`T`[]

Array of items to process

### worker

(`item`, `index`) => `Promise`\<`U`\>

Async worker function

### concurrency?

`number` = `4`

Max concurrent workers

## Returns

`Promise`\<`U`[]\>
