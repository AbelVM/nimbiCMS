[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [markdown](../README.md) / detectFenceLanguages

# Function: detectFenceLanguages()

> **detectFenceLanguages**(`md?`, `supportedMap?`): `Set`\<`string`\>

Detect fenced code block languages in a markdown string.
Kept immediately above the exported symbol for TypeDoc.

## Parameters

### md?

`string`

Markdown source string to scan for fenced code blocks.

### supportedMap?

`Map`\<`string`, `string`\>

Optional map of supported language alias -> canonical name.

## Returns

`Set`\<`string`\>

- Set of detected language identifiers (canonical or fallback names)
