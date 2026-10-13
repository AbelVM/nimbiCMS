[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/splitIntoSections](../README.md) / splitIntoSections

# Function: splitIntoSections()

> **splitIntoSections**(`content`, `chunkSize`): `string`[]

Split a markdown `content` string into logical sections suitable for
incremental parsing.

Sections are cut at ATX heading boundaries so a chunk never starts in the
middle of a section. Adjacent short sections are merged up to `chunkSize`
to avoid emitting a flood of tiny chunks. When the document has fewer than
two headings there is nothing meaningful to align to, so it falls back to
fixed-size slices.

## Parameters

### content

`string`

Markdown source.

### chunkSize

`number`

Target maximum section size in characters.

## Returns

`string`[]

Sections in document order.
