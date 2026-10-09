[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [htmlBuilder](../README.md) / executeEmbeddedScripts

# Function: executeEmbeddedScripts()

> **executeEmbeddedScripts**(`article`, `allowEmbeddedScripts?`, `embeddedScriptOrigins?`): `void`

Execute any script tags contained within an `article` element.
This should be called after the `article` is appended to the document
so that scripts which query the DOM find their target elements.

## Parameters

### article

`HTMLElement`

Article element containing script tags.

### allowEmbeddedScripts?

`boolean` = `false`

When true, execute inline scripts via `new Function` and inject allowlisted external scripts. When false, strip all script tags.

### embeddedScriptOrigins?

`string`[] = `[]`

Additional origins allowed for external scripts. Same-origin scripts are always allowed.

## Returns

`void`
