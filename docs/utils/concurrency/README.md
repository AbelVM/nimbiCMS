[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / utils/concurrency

# utils/concurrency

Bounded-concurrency map helper.

Several modules need to run an async worker over a list of items while
capping how many are in flight at once (crawling, anchor rewriting, slug
probing). This is the single implementation; it is backed by
`PowerSemaphore` so the concurrency limit and abort handling behave
identically everywhere.

## Functions

- [runWithConcurrency](functions/runWithConcurrency.md)
