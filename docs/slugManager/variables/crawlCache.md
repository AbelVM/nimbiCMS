[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [slugManager](../README.md) / crawlCache

# Variable: crawlCache

> `const` **crawlCache**: `Map`\<`string`, `string` \| `Promise`\<`string` \| `null`\> \| `null`\>

Cache used by crawlForSlug to memoize crawl results.
Values may be `string|null` or a `Promise<string|null>` when in-flight.
