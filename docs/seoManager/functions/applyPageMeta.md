[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [seoManager](../README.md) / applyPageMeta

# Function: applyPageMeta()

> **applyPageMeta**(`t`, `initialDocumentTitle`, `parsed`, `toc`, `article`, `pagePath`, `anchor`, `topH1`, `h1Text`, `slugKey`, `data`): `void`

Apply page-level SEO metadata: meta tags, structured data, and document title.

## Parameters

### t

`Function`

Localization function used for labels.

### initialDocumentTitle

`string`

Fallback title when none present.

### parsed

`Record`\<`string`, `unknown`\>

Parsed page object with `meta` and other fields.

### toc

`HTMLElement`

Table-of-contents element for the page.

### article

`HTMLElement`

Article element containing the page HTML.

### pagePath

`string`

The path of the page being rendered.

### anchor

`string` \| `null`

Optional anchor fragment to consider.

### topH1

`HTMLElement` \| `null`

Top H1 element for the page (if any).

### h1Text

`string` \| `null`

Text of the top H1.

### slugKey

`string` \| `null`

Computed slug key for the page.

### data

[`PageData`](../interfaces/PageData.md)

Full page data, including raw markdown for reading time.

## Returns

`void`
