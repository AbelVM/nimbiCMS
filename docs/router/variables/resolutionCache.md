[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [router](../README.md) / resolutionCache

# Variable: resolutionCache

> `const` **resolutionCache**: [`PowerCache`](../../lib/performance-helpers/powerCache/classes/PowerCache.md)

Runtime cache for recent page-resolution results.
Stores the resolved value directly and relies on PowerCache for TTL/LRU.
Also accepts legacy `{ value, ts }` records written by older tests/helpers.
