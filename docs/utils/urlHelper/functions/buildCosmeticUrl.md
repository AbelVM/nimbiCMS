[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/urlHelper](../README.md) / buildCosmeticUrl

# Function: buildCosmeticUrl()

> **buildCosmeticUrl**(`page`, `anchor?`, `baseSearch?`): `string`

Build a cosmetic (visible) URL of the form `#/slug[#anchor][?params]`.
`page` may be a slug or a relative path. `baseSearch` may be a query
string (including leading `?`) or omitted (defaults to current location.search).

## Parameters

### page

`string`

slug or relative path to include in the cosmetic hash

### anchor?

optional anchor (without `#`)

`string` | `null`

### baseSearch?

optional query string (including leading `?`)

`string` | `null`

## Returns

`string`

cosmetic URL string
