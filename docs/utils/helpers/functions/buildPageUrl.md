[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/helpers](../README.md) / buildPageUrl

# Function: buildPageUrl()

> **buildPageUrl**(`page`, `hash?`, `baseSearch?`): `string`

Build a URL that uses the site’s `?page=` query parameter while preserving
any other query parameters currently present in the location search.

This is useful for ensuring that options passed via URL (e.g. `lang`,
`defaultStyle`, etc.) remain present as the user navigates around the site.

## Parameters

### page

`string`

The target page slug or path.

### hash?

Optional hash fragment (without the leading '#').

`string` | `null`

### baseSearch?

`string`

Optional base query string (defaults to current location.search).

## Returns

`string`

URL string (e.g. "?page=foo&lang=es#bar").
