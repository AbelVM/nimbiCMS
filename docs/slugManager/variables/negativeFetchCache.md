[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [slugManager](../README.md) / negativeFetchCache

# Variable: negativeFetchCache

> `const` **negativeFetchCache**: `Map`\<`string`, `number`\>

Short-term negative cache for failed fetches. Maps absolute URL -> expiresAt (ms).
When a URL is present and not expired, `fetchMarkdown` will reject immediately
without issuing a network request. Bounded to 500 entries (was 2000) to cap
retained URL keys; entries also expire via NEGATIVE_CACHE_TTL_MS, so earlier
eviction only means a failed URL may be retried sooner, never served stale.
