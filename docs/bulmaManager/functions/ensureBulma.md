[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [bulmaManager](../README.md) / ensureBulma

# Function: ensureBulma()

> **ensureBulma**(`bulmaCustomize?`, `pageDir?`): `Promise`\<`void`\>

Ensure that Bulma or a Bulmaswatch theme is loaded.  Supports local
overrides or named themes fetched from unpkg.

## Parameters

### bulmaCustomize?

`string` = `'none'`

'none' | 'local' | theme name to load from unpkg

### pageDir?

`string` = `'/'`

directory to probe for a local `bulma.css` when using 'local'

## Returns

`Promise`\<`void`\>

- return value
