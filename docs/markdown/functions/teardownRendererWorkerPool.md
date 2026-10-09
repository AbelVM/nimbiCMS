[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [markdown](../README.md) / teardownRendererWorkerPool

# Function: teardownRendererWorkerPool()

> **teardownRendererWorkerPool**(): `Promise`\<`void`\>

Explicitly terminate and clear the renderer worker pool.
Uses the pool's own drain/terminate logic so in-flight tasks get a
chance to complete before workers are torn down.

## Returns

`Promise`\<`void`\>
