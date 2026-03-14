[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [htmlBuilder](../README.md) / preScanHtmlSlugs

# Function: preScanHtmlSlugs()

> **preScanHtmlSlugs**(`linkEls`, `base`): `Promise`\<`void`\>

Given a collection of anchor elements pointing at HTML files, fetch each
document and extract a title or first H1.  This allows us to create
slug-to-path mappings up front so clicks on HTML links behave like
Markdown URLs.

## Parameters

### linkEls

`NodeListOf`\<`HTMLAnchorElement`\>

### base

`string`

base URL for fetchMarkdown

## Returns

`Promise`\<`void`\>
