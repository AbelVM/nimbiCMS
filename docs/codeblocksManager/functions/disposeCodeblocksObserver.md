[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [codeblocksManager](../README.md) / disposeCodeblocksObserver

# Function: disposeCodeblocksObserver()

> **disposeCodeblocksObserver**(): `void`

Disconnect the shared IntersectionObserver and drop its reference.

The observer unobserves each block as soon as it intersects, but a block
that is never scrolled into view before teardown stays observed, keeping a
detached DOM node alive. `destroy()` calls this so a torn-down runtime
retains nothing.

## Returns

`void`
