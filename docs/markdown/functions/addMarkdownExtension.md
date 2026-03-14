[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [markdown](../README.md) / addMarkdownExtension

# Function: addMarkdownExtension()

> **addMarkdownExtension**(`plugin`): `void`

Register a new marked plugin.  The object is passed directly to
`marked.use()` which merges its fields into the global parser.

## Parameters

### plugin

[`MarkdownPlugin`](../interfaces/MarkdownPlugin.md)

Markdown plugin object to register with `marked`.

## Returns

`void`
