[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [seoManager](../README.md) / setStructuredData

# Function: setStructuredData()

> **setStructuredData**(`data`, `pagePath`, `titleOverride?`, `imageOverride?`, `descOverride?`, `initialDocumentTitle?`): `void`

Inject JSON-LD structured data for the provided page metadata.

## Parameters

### data

[`PageData`](../interfaces/PageData.md)

Parsed page data used to build structured data.

### pagePath

`string`

Page path used to compute the canonical URL.

### titleOverride?

`string`

Optional override for the title.

### imageOverride?

`string`

Optional override for the image.

### descOverride?

`string`

Optional override for the description.

### initialDocumentTitle?

`string` = `''`

Fallback document title.

## Returns

`void`
