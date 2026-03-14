[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [slugManager](../README.md) / crawlForSlugWorker

# Function: crawlForSlugWorker()

> **crawlForSlugWorker**(`slug`, `base`, `maxQueue`): `Promise`\<`string` \| `null`\>

Attempt to resolve a slug via the worker when available, otherwise fallback
to the main-thread `crawlForSlug` implementation.

## Parameters

### slug

`string`

slug to resolve

### base

`string`

base content URL used for discovery

### maxQueue

`number`

maximum concurrency/queue length for worker

## Returns

`Promise`\<`string` \| `null`\>

- resolved markdown path or null if not found
