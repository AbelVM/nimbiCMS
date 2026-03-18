[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [slugManager](../README.md) / uniqueSlug

# Function: uniqueSlug()

> **uniqueSlug**(`base`, `existing`): `string`

Ensure a candidate slug is unique against an existing set.
If `base` collides, a numeric suffix is appended ("-2", "-3", ...).

## Parameters

### base

`string`

Candidate slug.

### existing

`Set`\<`string`\>

Set of already-used slugs.

## Returns

`string`

- A slug that does not appear in `existing`.
