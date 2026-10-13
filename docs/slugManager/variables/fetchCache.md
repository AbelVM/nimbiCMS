[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [slugManager](../README.md) / fetchCache

# Variable: fetchCache

> `const` **fetchCache**: `Map`\<`string`, `Promise`\<`FetchResult`\>\>

Cache of ongoing or completed `fetchMarkdown` promises keyed by resolved URL.
Maps absolute URL string -> Promise<FetchResult>.
Bounded to 500 entries (was 2000): each entry retains a full page body
once its fetch resolves, and PowerCache expiry (default 60s TTL) is
enforced lazily on read, so `maxEntries` is the hard retention bound.
500 still covers concurrent-fetch dedupe and the 60s revisit window with
wide margin; crawl passes keep bodies in their own maps, so eviction
never forces a re-fetch during indexing.
