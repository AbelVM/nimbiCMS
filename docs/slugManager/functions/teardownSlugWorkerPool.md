[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [slugManager](../README.md) / teardownSlugWorkerPool

# Function: teardownSlugWorkerPool()

> **teardownSlugWorkerPool**(): `void`

Explicitly terminate and clear the slug worker pool.
Uses the pool's own drain/terminate logic so in-flight tasks get a
chance to complete before workers are torn down.

## Returns

`void`
