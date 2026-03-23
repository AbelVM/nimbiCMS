[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [slugManager](../README.md) / crawlCache

# Variable: crawlCache

> `const` **crawlCache**: `Map`\<`string`, `string` \| `null`\>

Cache used by `crawlForSlug` to memoize results keyed by decoded slug.
Values are the resolved path string or `null` when not found.
