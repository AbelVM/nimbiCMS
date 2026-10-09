[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/stripContentBasePrefix](../README.md) / stripContentBasePrefix

# Function: stripContentBasePrefix()

> **stripContentBasePrefix**(`rel`, `contentBasePath`): `string`

Remove leading slash(es) and any repeated content-base segments from `rel`.

## Parameters

### rel

`string`

Relative path, possibly prefixed with the content base.

### contentBasePath

`string`

Content base path (e.g. `/content/`).

## Returns

`string`

The path relative to the content base, or `""` when the
  path is exactly the content base.
