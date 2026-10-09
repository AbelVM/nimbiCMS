[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/slugify](../README.md) / slugify

# Function: slugify()

> **slugify**(`s`): `string`

Generate a URL-friendly slug from arbitrary text.

Normalization rules, in order:
1. lowercase
2. drop every character outside `[a-z0-9\- ]`
3. spaces become `-`
4. a trailing `.md` / `.html` extension is removed
5. runs of `-` collapse to one
6. leading/trailing `-` are trimmed
7. the result is capped at [MAX\_SLUG\_LENGTH](../variables/MAX_SLUG_LENGTH.md) characters

## Parameters

### s

`string`

Text to slugify.

## Returns

`string`

The slug, possibly an empty string.
