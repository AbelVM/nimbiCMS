[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / utils/workQueue

# utils/workQueue

A FIFO work queue with amortised-O(1) `shift()`.

`Array.prototype.shift()` is O(n): it re-indexes every remaining element.
The crawl and fetch queues in this codebase are drained by several
concurrent workers and can hold up to `crawlMaxQueue` entries (1000+), so a
naive `shift()` makes queue draining O(n²) overall.

This helper keeps a `head` cursor into the backing array and only compacts
once the consumed prefix reaches half the array, which makes each `shift()`
amortised O(1). Compaction also releases the references of consumed items,
so drained entries can be garbage-collected instead of being retained by
the array's tail.

## Functions

- [createWorkQueue](functions/createWorkQueue.md)

## References

### default

Renames and re-exports [createWorkQueue](functions/createWorkQueue.md)
