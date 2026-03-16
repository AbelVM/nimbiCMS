[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [version](../README.md) / getVersion

# Function: getVersion()

> **getVersion**(): `Promise`\<`string`\>

Return the package version string.

This value is injected at build time via Vite's `define` configuration.
The runtime should not attempt to read `package.json` directly because the
file will not be available to end-users.

## Returns

`Promise`\<`string`\>

Resolves to the injected version or `'0.0.0'`.
