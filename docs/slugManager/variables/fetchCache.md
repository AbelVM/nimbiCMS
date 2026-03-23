[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [slugManager](../README.md) / fetchCache

# Variable: fetchCache

> `const` **fetchCache**: `Map`\<`string`, `Promise`\<[`FetchResult`](../type-aliases/FetchResult.md)\>\>

Cache of ongoing or completed `fetchMarkdown` promises keyed by resolved URL.
Maps absolute URL string -> Promise<FetchResult>.
