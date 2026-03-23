[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [seoManager](../README.md) / setMetaTags

# Function: setMetaTags()

> **setMetaTags**(`data`, `titleOverride?`, `imageOverride?`, `descOverride?`, `_initialDocumentTitle?`): `void`

Populate standard meta tags (title, description, open-graph, twitter, etc.)

## Parameters

### data

[`PageData`](../interfaces/PageData.md)

Parsed page data including `meta` and `raw`.

### titleOverride?

`string`

Optional title to use instead of `meta.title`.

### imageOverride?

`string`

Optional image URL for Open Graph/Twitter.

### descOverride?

`string`

Optional description override.

### \_initialDocumentTitle?

`string` = `''`

## Returns

`void`
