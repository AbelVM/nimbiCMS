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

### base

`string`

### maxQueue

`number`

## Returns

`Promise`\<`string` \| `null`\>
