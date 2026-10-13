[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [seoManager](../README.md) / setHreflangTags

# Function: setHreflangTags()

> **setHreflangTags**(`pageSlug?`): `void`

Emit hreflang `<link rel="alternate">` tags for every configured
available language plus an `x-default` fallback. Each tag points to
the current page URL with the appropriate `?lang=` query parameter.
Safe to call multiple times; existing tags are updated in place.

## Parameters

### pageSlug?

`string`

Optional page slug for the canonical URL.

## Returns

`void`
