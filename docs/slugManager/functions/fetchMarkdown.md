[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [slugManager](../README.md) / fetchMarkdown

# Function: fetchMarkdown()

> **fetchMarkdown**(`path`, `base?`, `opts?`): `Promise`\<[`FetchResult`](../type-aliases/FetchResult.md)\>

Fetch markdown content by path.
Accepts cosmetic or canonical hrefs and extracts page token for internal fetches.

## Parameters

### path

`string`

Path or cosmetic/canonical href (may contain query/hash).

### base?

`string`

Optional base content URL (relative or absolute).

### opts?

Options object ({force:true} bypasses guard).

#### force?

`boolean`

## Returns

`Promise`\<[`FetchResult`](../type-aliases/FetchResult.md)\>

Resolves with the fetched content or rejects on failure.
