[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [seoManager](../README.md) / injectSeoForPage

# Function: injectSeoForPage()

> **injectSeoForPage**(`page`, `initialDocumentTitle?`): `void`

Inject minimal SEO metadata (title, description, canonical, JSON-LD)
for a given `page` token. Safe to call early during init to populate
head tags before heavier rendering runs.

## Parameters

### page

`string`

page token (slug or path)

### initialDocumentTitle?

`string` = `''`

optional fallback title

## Returns

`void`
