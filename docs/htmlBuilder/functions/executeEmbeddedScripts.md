[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [htmlBuilder](../README.md) / executeEmbeddedScripts

# Function: executeEmbeddedScripts()

> **executeEmbeddedScripts**(`article`): `void`

Execute any script tags contained within an `article` element.
This should be called after the `article` is appended to the document
so that scripts which query the DOM find their target elements.

## Parameters

### article

`HTMLElement`

Article element containing script tags.

## Returns

`void`
