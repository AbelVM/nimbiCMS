[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [slugManager](../README.md) / setFetchMarkdown

# Function: setFetchMarkdown()

> **setFetchMarkdown**(`fn`): `void`

Override the internal fetchMarkdown implementation. Useful for tests
or when consumers want to provide a bespoke fetch strategy.

## Parameters

### fn

(`path`, `base?`) => `Promise`\<[`FetchResult`](../type-aliases/FetchResult.md)\>

Custom fetch function used to load markdown. Receives `(path, base)` and must return a `FetchResult` promise.

## Returns

`void`
