[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [markdown](../README.md) / \_splitIntoSections

# Function: \_splitIntoSections()

> **\_splitIntoSections**(`content`, `chunkSize`): `string`[]

Split a markdown `content` string into logical sections suitable for
incremental parsing. Prefer splitting at heading boundaries, and fall
back to fixed-size slices when headings are scarce.

## Parameters

### content

`string`

### chunkSize

`number`

## Returns

`string`[]
