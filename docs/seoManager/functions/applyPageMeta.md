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

`Object`

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

Optional anchor fragment to consider.

`string` | `null`

### topH1

Top H1 element for the page (if any).

`HTMLElement` | `null`

### h1Text

Text of the top H1.

`string` | `null`

### slugKey

Computed slug key for the page.

`string` | `null`

### data

[`PageData`](../interfaces/PageData.md)

Full page data, including raw markdown for reading time.

## Returns

`void`

- No return value.
