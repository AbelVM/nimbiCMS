[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [version](../README.md) / getVersion

# Function: getVersion()

> **getVersion**(): `Promise`\<`string`\>

Return the package version string.

This helper attempts to read the project's `package.json` at runtime so
consumers of the bundle can display the released version. The function
always resolves to a string and never throws — when JSON imports are not
available in the runtime or bundler, it falls back to the stable default
`'0.0.0'`.

## Returns

`Promise`\<`string`\>

Resolves to the package `version` value or `'0.0.0'`.
