[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / utils/idle

# utils/idle

Utilities to yield to the event loop / scheduler to keep the UI responsive
during long-running synchronous loops. Uses `requestIdleCallback` when
available, falling back to `setTimeout(..., 0)`.

## Functions

- [yieldIfNeeded](functions/yieldIfNeeded.md)
- [yieldToEventLoop](functions/yieldToEventLoop.md)
