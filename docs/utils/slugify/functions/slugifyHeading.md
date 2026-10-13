[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/slugify](../README.md) / slugifyHeading

# Function: slugifyHeading()

> **slugifyHeading**(`s`): `string`

Slugify a heading for use as a DOM id / anchor target.

Historically the worker used a laxer variant that skipped extension
stripping and length capping, which produced ids that did not match the
slugs the main thread derived from the same heading text. This now
delegates to [slugify](slugify.md) so both sides agree.

## Parameters

### s

`string`

Heading text.

## Returns

`string`

The slug, or `"heading"` when the input yields nothing.
