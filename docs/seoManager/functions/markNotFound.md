[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [seoManager](../README.md) / markNotFound

# Function: markNotFound()

> **markNotFound**(`meta?`, `pagePath?`, `titleOverride?`, `descOverride?`): `void`

Mark the current document as a not-found (404) page and apply
appropriate SEO metadata (robots, description, canonical, JSON-LD).
Safe to call at runtime; no-op when DOM is unavailable.

## Parameters

### meta?

`Object` = `{}`

optional meta object containing title/description/image

### pagePath?

`string` = `''`

optional page path used for canonical URL generation

### titleOverride?

`string` = `undefined`

optional title override

### descOverride?

`string` = `undefined`

optional description override

## Returns

`void`
