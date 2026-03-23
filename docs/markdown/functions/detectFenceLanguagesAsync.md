[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [markdown](../README.md) / detectFenceLanguagesAsync

# Function: detectFenceLanguagesAsync()

> **detectFenceLanguagesAsync**(`mdText?`, `supportedMap?`): `Promise`\<`Set`\<`string`\>\>

Asynchronous detection that attempts to use the renderer worker if available.

## Parameters

### mdText?

`string`

Markdown source string to scan for fenced code blocks.

### supportedMap?

`Map`\<`string`, `string`\>

Optional map of supported language alias -> canonical name.

## Returns

`Promise`\<`Set`\<`string`\>\>

Promise resolving to a set of detected language identifiers.
