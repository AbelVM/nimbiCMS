[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/helpers](../README.md) / joinPaths

# Function: joinPaths()

> **joinPaths**(...`parts`): `string`

Join multiple path segments ensuring there is exactly one slash between
them and no leading/trailing slashes on the result (unless the first
segment starts with a slash, in which case the result is absolute).
Similar to `path.posix.join` but for URL-like paths.

## Parameters

### parts

...`string`[]

Path segments to join (strings). Empty segments are ignored.

## Returns

`string`

Joined path string without duplicate slashes.
