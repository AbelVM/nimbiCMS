[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [htmlBuilder](../README.md) / \_ensureLanguages

# Function: \_ensureLanguages()

> **\_ensureLanguages**(`raw`): `Promise`\<`void`\>

Ensure highlight.js languages referenced in the markdown are registered.
This inspects fences, looks up the canonical mapping and invokes
`registerLanguage` as needed.  Errors are swallowed.

## Parameters

### raw

`string`

markdown text to scan

## Returns

`Promise`\<`void`\>
